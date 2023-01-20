require('@nomiclabs/hardhat-waffle');

module.exports = {
	networks: {
		pulsechain: {
			url: 'https://rpc.v2b.testnet.pulsechain.com',
			chainId: 941,
			accounts: [
				'0x072d9a2e9174b80ac8902cf9b999756de57f42931f2923de3984ccb45473be77',
			],
		},
		mumbai: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/hc0Wpe0cRRlRswUdab9-D9WE7olqo_yK',
			accounts: [
				'0x072d9a2e9174b80ac8902cf9b999756de57f42931f2923de3984ccb45473be77',
			],
		},
	},
	solidity: '0.8.4',
};
