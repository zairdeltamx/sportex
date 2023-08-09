require('@nomiclabs/hardhat-waffle');

const fs = require('fs');
const privateKey = '072d9a2e9174b80ac8902cf9b999756de57f42931f2923de3984ccb45473be77'

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
