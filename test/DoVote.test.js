const BallotContract = artifacts.require("BallotContract");
const assert = require("assert");

contract("BallotContract", function (accounts) {
  describe("doVote function", () => {
    let ballotContract;
    let proposalCount;
    let voterAddress;

    before(async () => {
      ballotContract = await BallotContract.deployed();
      voterAddress = accounts[1];
      // Add a proposal to the contract
      await ballotContract.createProposal(
        "Proposal Title",
        "Proposal Description",
        { from: accounts[0] }
      );
      proposalCount = await ballotContract.proposalCounter();
      await ballotContract.addVoter(proposalCount, "Voter 1", {
        from: accounts[1],
      });
      await ballotContract.startVote(proposalCount, { from: accounts[0] });
    });
    beforeEach(async () => {
      ballotContract = await BallotContract.deployed();
      voterAddress = accounts[1];
    });
    it("should allow a registered voter to cast a vote", async () => {
      // Cast a vote for the proposal
      const choice = true;
      await ballotContract.doVote(proposalCount, choice, {
        from: accounts[1],
      });

      // Check that the vote has been recorded
      const counters = await ballotContract.helperCounters(proposalCount);
      assert.equal(counters.totalVotesCast, 1, "Total votes cast is incorrect");
    });

    it("should not allow a voter to cast multiple votes for the same proposal", async () => {
      // Try to cast another vote for the same proposal
      const choice = false;
      try {
        await ballotContract.doVote(proposalCount, choice, {
          from: accounts[1],
        });
        assert.fail("Expected doVote to throw an error");
      } catch (error) {
        assert.strictEqual(
          error.message.includes(
            "Error: You have already cast your vote on this proposal or you are not registered as a voter"
          ),
          true
        );
      }
      const counters = await ballotContract.helperCounters(proposalCount);
      assert.equal(counters.totalVotesCast, 1, "Total votes cast is incorrect");
    });
  });
});
