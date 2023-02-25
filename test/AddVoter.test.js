const assert = require("assert");
const BallotContract = artifacts.require("BallotContract");

contract("Ballot Contract", async (accounts) => {
  let ballotContract;
  let proposalCount;
  beforeEach(async () => {
    ballotContract = await BallotContract.deployed();
    // Add a proposal to the contract
    await ballotContract.createProposal(
      "Proposal Title",
      "Proposal Description",
      { from: accounts[0] }
    );
    proposalCount = await ballotContract.proposalCounter();
  });
  describe("Add Voters", () => {
    it("adds voters to the proposal", async () => {
      // Add a voter to the proposal
      await ballotContract.addVoter(proposalCount, "Voter 1", {
        from: accounts[1],
      });
      // Check if the voter has been added
      let voter = await ballotContract.voterRegistry(
        accounts[1],
        proposalCount
      );
      assert.strictEqual(voter.voterAddress, accounts[1]);
      assert.strictEqual(voter.voterName, "Voter 1");
      assert.strictEqual(voter.hasVoted, false);
    });

    it("should fail if the proposal is not in the created state", async () => {
      // Start the voting on the proposal
      await ballotContract.startVote(proposalCount, { from: accounts[0] });

      // Try to add a voter to the proposal
      try {
        await ballotContract.addVoter(proposalCount, "Voter 1", {
          from: accounts[1],
        });
      } catch (error) {
        assert.strictEqual(
          error.message.includes(
            "Error: The proposal is not in the state required to perform this action"
          ),
          true
        );
      }
    });
    it("should fail if the voter has already been registered", async () => {
      // Add a voter to the proposal
      await ballotContract.addVoter(proposalCount, "John Doe", {
        from: accounts[2],
      });
      // Try to add the same voter again
      try {
        await ballotContract.addVoter(proposalCount, "John Doe", {
          from: accounts[2],
        });
      } catch (error) {
        assert.strictEqual(
          error.message.includes(
            "Error: You are already registered as a voter for this proposal"
          ),
          true
        );
      }
    });
  });
});
