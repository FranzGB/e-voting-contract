const assert = require("assert");
const BallotContract = artifacts.require('BallotContract');

contract("Ballot Contract", async accounts => {
  let ballotContract;
  let proposalCount;
  beforeEach(async () => {
    ballotContract = await BallotContract.deployed();
    // Add a proposal to the contract
    await ballotContract.createProposal("Proposal Title", "Proposal Description", { from: accounts[0] });
    proposalCount = await ballotContract.proposalCounter();
  });
  describe("Delete Proposal", () => {
    it("should delete a proposal", async () => {

      // Call the deleteProposal function
      await ballotContract.deleteProposal(proposalCount, { from: accounts[0] });
      let proposal = await ballotContract.proposals(proposalCount);
      // Check if the proposal has been deleted
      assert.strictEqual(proposal.proposalId.toNumber(), 0);
      assert.strictEqual(proposal.officialName, "");
      assert.strictEqual(proposal.description, "");
      assert.strictEqual(proposal.status.toNumber(), 0);
    });

    it("should fail if the proposal is not in the created state", async () => {
      // Start the voting on the proposal
      await ballotContract.startVote(proposalCount, { from: accounts[0] });

      // Call the deleteProposal function and expect it to throw an error
      try {
        await ballotContract.deleteProposal(proposalCount, { from: accounts[0] });
        assert.fail("Expected deleteProposal to throw an error");
      } catch (error) {
        assert.strictEqual(error.message.includes("Error: The proposal is not in the state required to perform this action"), true);
      }
    });

    it("should fail if the caller is not an official", async () => {
      // Add a proposal to the contract
      await ballotContract.createProposal("Proposal Title", "Proposal Description", { from: accounts[0] });

      // Call the deleteProposal function from an account that is not an official and expect it to throw an error
      try {
        await ballotContract.deleteProposal(proposalCount, { from: accounts[1] });
        assert.fail("Expected deleteProposal to throw an error");
      } catch (error) {
        assert.strictEqual(error.message.includes("Error: You are not the official who created this proposal. Only the official can call this function"), true);
      }
    });
  });
});
