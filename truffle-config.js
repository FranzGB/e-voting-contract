module.exports = {
  networks: {
    local_development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1",
    },
    development: {
      host: "ganache-cli",
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
  },

  compilers: {
    solc: {
      version: "0.8.9",
    },
  },
};
