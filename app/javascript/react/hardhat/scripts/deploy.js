const hre = require('hardhat');

async function main() {
	const NFTMarket = await hre.ethers.getContractFactory("NFTMarketplace");
	const nftMarket = await NFTMarket.deploy();

	console.log("Starting deployment of NFTMarketplace contract...");
	await nftMarket.deployed({ gasPrice: 275785320 });

	console.log("nftMarket deployed to:", nftMarket.address);

	const NFT = await hre.ethers.getContractFactory("NFT");
	const nft = await NFT.deploy(nftMarket.address);
	await nft.deployed({ gasPrice: 275785320 });
	console.log("nft deployed to:", nft.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
