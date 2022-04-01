const BallotContract = artifacts.require('BallotContract');

contract('BallotContract', () => {
  before(async () => {
    this.ballotContract = await BallotContract.deployed();
  });
  describe('Deployment', () => {
    it('migrate deployed succesully', async () => {
      const address = this.ballotContract.address;
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
    });
  });
  describe('Functionality', () => {
    it('get Proposals List', async () => {
      const proposalCounter = await this.ballotContract.proposalCounter();
      const proposal = await this.ballotContract.proposals(proposalCounter);
      assert.equal(proposal.proposalId.toNumber(), proposalCounter);
      assert.equal(proposal.officialName, 'My first proposal');
      assert.equal(proposal.description, 'For testing purposes');
      assert.equal(proposal.status, BallotContract.State.Created);
    });
    it('successfully creates a proposal', async () => {
      const functionCall = await this.ballotContract.createProposal('My second proposal', 'For testing purposes');
      const proposalCounter = await this.ballotContract.proposalCounter();
      const proposal = await this.ballotContract.proposals(proposalCounter);
      assert.equal(functionCall.receipt.status, true);
      assert.equal(proposal.proposalId.toNumber(), proposalCounter);
      assert.equal(proposal.officialName, 'My second proposal');
      assert.equal(proposal.description, 'For testing purposes');
      assert.equal(proposal.status, BallotContract.State.Created);
    });
    it('adds a voter to a proposal', async () => {
      const proposalCounter = await this.ballotContract.proposalCounter();
      const functionCall = await this.ballotContract.addVoter(proposalCounter, '0x281d7c11C615C331312459458f7928A8303e9a6B', 'John Doe');
      assert.equal(functionCall.receipt.status, true);
      const voterName = await this.ballotContract.voterNames('0x281d7c11C615C331312459458f7928A8303e9a6B');
      const voterRegistered = await this.ballotContract.voterRegister('0x281d7c11C615C331312459458f7928A8303e9a6B', proposalCounter);
      const addVoterToRegister = await this.ballotContract.addVoter(proposalCounter, '0x3fcdf9781B69C7f8123519047BA3300e81E63F47', 'Testing Tester');
      assert.equal(addVoterToRegister.receipt.status, true);
      assert.equal(voterRegistered, false);
      assert.equal(voterName, 'John Doe');
    });
    it('change the status of the proposal when the vote starts', async () => {
      const proposalCounter = await this.ballotContract.proposalCounter();
      const functionCall = await this.ballotContract.startVote(proposalCounter);
      const proposal = await this.ballotContract.proposals(proposalCounter);
      assert.equal(functionCall.receipt.status, true);
      assert.equal(proposal.status, BallotContract.State.Voting);
    });
    it('creates a vote in the proposal', async () => {
      const proposalCounter = await this.ballotContract.proposalCounter();
      const exerciseVote = await this.ballotContract.doVote(proposalCounter, true);
      assert.equal(exerciseVote.receipt.status, true);
    });
    it('ends the voting on the proposal and returns the number of votes', async () => {
      const proposalCounter = await this.ballotContract.proposalCounter();
      const functionCall = await this.ballotContract.endVote(proposalCounter);
      const proposal = await this.ballotContract.proposals(proposalCounter);
      const counters = await this.ballotContract.helperCounters(proposalCounter);
      assert.equal(functionCall.receipt.status, true);
      assert.equal(proposal.status, BallotContract.State.Ended);
      assert.notEqual(counters.finalResult.toNumber(), 5);
      assert.equal(counters.finalResult.toNumber(), 1);
    });
  });
});
