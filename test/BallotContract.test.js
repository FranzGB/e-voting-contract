
const BallotContract = artifacts.require('BallotContract');
const truffleAssert = require('truffle-assertions');

contract('BallotContract', function (accounts) {
  before(async () => {
    ballotContract = await BallotContract.deployed();
  });

  describe('Deployment', () => {
    it('migrate deployed successfully', async () => {
      const address = ballotContract.address;
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, '0x0');
      assert.notEqual(address, '');
    });
  });
  describe('Functionality', () => {
    let proposalCounter;
    let proposal;

    beforeEach(async () => {
      proposalCounter = await ballotContract.proposalCounter();
      proposalCounter = proposalCounter.toNumber();
      proposal = await ballotContract.proposals(proposalCounter);
    });
    it('get proposals List', async () => {
      assert.equal(proposal.proposalId, proposalCounter);
      assert.equal(proposal.officialName, 'My first proposal');
      assert.equal(proposal.description, 'For testing purposes');
      assert.equal(proposal.status, BallotContract.State.Created);
    });
    it('successfully creates a proposal', async () => {
      const tx = await ballotContract.createProposal(
        'My second proposal',
        'For testing purposes'
      );
      const newProposalCounter = await ballotContract.proposalCounter();
      const newProposal = await ballotContract.proposals(newProposalCounter);
      assert.equal(tx.receipt.status, true);
      assert.equal(newProposal.proposalId.toNumber(), newProposalCounter);
      assert.equal(newProposal.officialName, 'My second proposal');
      assert.equal(newProposal.description, 'For testing purposes');
      assert.equal(newProposal.status, BallotContract.State.Created);
    });
    it('adds a voter to a proposal', async () => {
      const tx = await ballotContract.addVoter(
        proposalCounter,
        accounts[0],
        'John Doe'
      );
      assert.equal(tx.receipt.status, true);
      truffleAssert.eventEmitted(tx, 'VoterAdded', (ev) => {
        return (
          ev.proposalId.toNumber() === proposalCounter &&
          ev.voterAddress === accounts[0] &&
          ev.voterName === 'John Doe'
        );
      });
      const voterName = await ballotContract.voterNames(accounts[0]);
      const voterRegistered = await ballotContract.voterRegistry(
        accounts[0],
        proposalCounter
      );
      const registerSomeVoter = await ballotContract.addVoter(
        proposalCounter,
        accounts[1],
        'John Snow'
      );
      assert.equal(registerSomeVoter.receipt.status, true);
      assert.equal(voterRegistered, false);
      assert.equal(voterName, 'John Doe');
    });
    it('change the status of the proposal when the vote starts', async () => {
      const tx = await ballotContract.startVote(proposalCounter);
      const newProposal = await ballotContract.proposals(proposalCounter);
      assert.equal(tx.receipt.status, true);
      assert.equal(newProposal.status, BallotContract.State.Voting);
    });
    it('creates a vote in the proposal', async () => {
      const exerciseVote = await ballotContract.doVote(
        proposalCounter,
        true,
        { from: accounts[1] }
      );
      assert.equal(exerciseVote.receipt.status, true);
    });
    it('ends the voting on the proposal and returns the number of votes', async () => {
      const tx = await ballotContract.endVote(proposalCounter);
      const newProposal = await ballotContract.proposals(proposalCounter);
      const counters = await ballotContract.helperCounters(
        proposalCounter
      );
      assert.equal(tx.receipt.status, true);
      assert.equal(newProposal.status, BallotContract.State.Ended);
      assert.notEqual(counters.finalResult.toNumber(), 5);
      assert.equal(counters.finalResult.toNumber(), 1);
    });
  });
});
