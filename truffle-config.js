const PrivateKeyProvider = require("@truffle/hdwallet-provider");
const privateKey = [
  process.env.BESU_NODE_PRIVATE_KEY_1,
  process.env.BESU_NODE_PRIVATE_KEY_2,
  process.env.BESU_NODE_PRIVATE_KEY_3,
];
let privateKeyProvider;
if (privateKey) {
  privateKeyProvider = new PrivateKeyProvider(
    privateKey,
    "http://127.0.0.1:8546/",
    0,
    3
  );
}

module.exports = {
  networks: {
    local_development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1",
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1",
    },
    testing: {
      host: "127.0.0.1",
      port: 8546,
      network_id: "2",
    },
    production: {
      host: "0.0.0.0",
      port: 8548,
      network_id: "100",
    },
    besuNetwork: {
      provider: privateKeyProvider,
      network_id: "*",
    },
  },

  compilers: {
    solc: {
      version: "0.8.9",
    },
  },
};
