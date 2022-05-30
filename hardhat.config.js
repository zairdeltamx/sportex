require("@nomiclabs/hardhat-waffle");

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString();

const projectId = "5be09a3fce5049e0b9d7517b475fc10b"

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    }
  },
  solidity: "0.8.4"
};
