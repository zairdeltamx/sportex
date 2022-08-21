require("@nomiclabs/hardhat-waffle");

const fs = require('fs');
const privateKey = fs.readFileSync("../../.secret").toString();

const projectId = "5be09a3fce5049e0b9d7517b475fc10b"

console.log(privateKey)

module.exports = {
  networks: {
    pulsechain: {
      url: "https://rpc.v2b.testnet.pulsechain.com",
      chainId: 941,
      accounts: ['072d9a2e9174b80ac8902cf9b999756de57f42931f2923de3984ccb45473be77']
    }
  },
  solidity: "0.8.4"
};
