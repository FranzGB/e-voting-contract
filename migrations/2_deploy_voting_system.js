const BallotContract = artifacts.require('BallotContract');

module.exports = function (deployer) {
  deployer.deploy(BallotContract);
};
