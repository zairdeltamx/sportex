const hre = require('hardhat');
async function main() {
	const NFTMarket = await hre.ethers.getContractFactory('NFTMarketplace');
	const nftMarket = await NFTMarket.deploy();

	console.log('START DEPLOY');
	await nftMarket.deployed();
	console.log('NFTMARKET DEPLOYED TO:', nftMarket.address);

	const NFT = await hre.ethers.getContractFactory('NFT');
	const nft = await NFT.deploy(nftMarket.address);
	console.log('START DEPLOY NFT');
	await nft.deployed();
	console.log('NFT DEPLOYED TO:', nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
