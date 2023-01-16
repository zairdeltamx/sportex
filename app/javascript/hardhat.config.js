require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-toolbox");

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().slice(0, -1);

module.exports = {
  networks:{
    binance_smart_chain: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [privateKey]
    },
    pulsechain_testnet: {
      url: "https://rpc.v2b.testnet.pulsechain.com",
      chainId: 941,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.17",
};
