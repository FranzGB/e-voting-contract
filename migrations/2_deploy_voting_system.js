const BallotContract = artifacts.require('BallotContract');

module.exports = async function (deployer) {
  await deployer.deploy(BallotContract);
};
