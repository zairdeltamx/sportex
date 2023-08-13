require('@nomiclabs/hardhat-waffle');

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
	networks: {
    pulsechain_testnet: {
			url: 'https://rpc.v4.testnet.pulsechain.com',
			chainId: 943,
			accounts: [privateKey],
		},
    mumbai: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/hc0Wpe0cRRlRswUdab9-D9WE7olqo_yK',
			accounts: [privateKey],
		},
		binance_smart_chain: {
			url: "https://bsc-dataseed.binance.org/",
			chainId: 56,
			accounts: [privateKey],
		},
	},
	solidity: '0.8.4',
};
