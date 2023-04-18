const BallotContract = artifacts.require("BallotContract");
const assert = require("assert");

contract("BallotContract", function (accounts) {
  let ballotContract;
  let proposalCount;
  const officialAddress = accounts[0];
  const voterAddress = accounts[1];
  before(async () => {
    ballotContract = await BallotContract.deployed();
    // Add a proposal to the contract
    await ballotContract.createProposal(
      "Proposal Title",
      "Proposal Description",
      { from: officialAddress }
    );
    proposalCount = await ballotContract.proposalCounter();
    // Add a voter to the proposal
    await ballotContract.addVoter(proposalCount, "Voter 1", {
      from: voterAddress,
    });
    // Start the vote
    await ballotContract.startVote(proposalCount, {
      from: officialAddress,
    });
    // Cast a vote for the proposal
    await ballotContract.doVote(proposalCount, true, {
      from: voterAddress,
    });
  });
});
