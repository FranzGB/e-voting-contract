
const BallotContract = artifacts.require('BallotContract');

contract('BallotContract', function (accounts) {
  before(async () => {
    this.ballotContract = await BallotContract.deployed();
  });

  describe('Deployment', () => {
    it('migrate deployed successfully', async () => {
      const address = this.ballotContract.address;
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
      proposalCounter = await this.ballotContract.proposalCounter();
      proposal = await this.ballotContract.proposals(proposalCounter);
    });
    it('get Proposals List', async () => {
      assert.equal(proposal.proposalId.toNumber(), proposalCounter);
      assert.equal(proposal.officialName, 'My first proposal');
      assert.equal(proposal.description, 'For testing purposes');
      assert.equal(proposal.status, BallotContract.State.Created);
    });
    it('successfully creates a proposal', async () => {
      const functionCall = await this.ballotContract.createProposal(
        'My second proposal',
        'For testing purposes'
      );
      const newProposalCounter = await this.ballotContract.proposalCounter();
      const newProposal = await this.ballotContract.proposals(newProposalCounter);
      assert.equal(functionCall.receipt.status, true);
      assert.equal(newProposal.proposalId.toNumber(), newProposalCounter);
      assert.equal(newProposal.officialName, 'My second proposal');
      assert.equal(newProposal.description, 'For testing purposes');
      assert.equal(newProposal.status, BallotContract.State.Created);
    });
    it('adds a voter to a proposal', async () => {
      const functionCall = await this.ballotContract.addVoter(
        proposalCounter,
        accounts[0],
        'John Doe'
      );
      assert.equal(functionCall.receipt.status, true);
      const voterName = await this.ballotContract.voterNames(accounts[0]);
      const voterRegistered = await this.ballotContract.voterRegister(
        accounts[0],
        proposalCounter
      );
      const registerSomeVoter = await this.ballotContract.addVoter(
        proposalCounter,
        accounts[1],
        'John Snow'
      );
      assert.equal(registerSomeVoter.receipt.status, true);
      assert.equal(voterRegistered, false);
      assert.equal(voterName, 'John Doe');
    });
    it('change the status of the proposal when the vote starts', async () => {
      const functionCall = await this.ballotContract.startVote(proposalCounter);
      const newProposal = await this.ballotContract.proposals(proposalCounter);
      assert.equal(functionCall.receipt.status, true);
      assert.equal(newProposal.status, BallotContract.State.Voting);
    });
    it('creates a vote in the proposal', async () => {
      const exerciseVote = await this.ballotContract.doVote(
        proposalCounter,
        true,
        { from: accounts[1] }
      );
      assert.equal(exerciseVote.receipt.status, true);
    });
    it('ends the voting on the proposal and returns the number of votes', async () => {
      const functionCall = await this.ballotContract.endVote(proposalCounter);
      const newProposal = await this.ballotContract.proposals(proposalCounter);
      const counters = await this.ballotContract.helperCounters(
        proposalCounter
      );
      assert.equal(functionCall.receipt.status, true);
      assert.equal(newProposal.status, BallotContract.State.Ended);
      assert.notEqual(counters.finalResult.toNumber(), 5);
      assert.equal(counters.finalResult.toNumber(), 1);
    });
  });
});
