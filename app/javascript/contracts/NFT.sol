// SDPX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address payable owner;

  address contractAddress;
  mapping(uint256 => string) private idToMeta;

  constructor(address marketplaceAddress) ERC721("Sportex Tokens", "NFTX") {
    contractAddress = marketplaceAddress;
    owner = payable(msg.sender);
  }

  function createToken(string memory tokenURI, string memory meta) public returns (uint){
    require(owner == msg.sender, "Only marketplace owner can update Create game NFTs");

    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    idToMeta[newItemId] = meta;
    setApprovalForAll(contractAddress, true);
    return newItemId;
  }

  function updateMarketplace(address newMarketplaceAddress) public payable {
    require(owner == msg.sender, "Only marketplace owner can update NFT marketplace.");
    contractAddress = newMarketplaceAddress;
  }

  function updateMeta(uint256 tokenId, string memory meta) public payable {
        require(owner == msg.sender, "Only marketplace owner can update NFT metadata.");

    idToMeta[tokenId] = meta;
  }

  /* Returns the meta of the NFT */
  function getNFTmeta(uint256 tokenId) public view returns (string memory) {
    return idToMeta[tokenId];
  }
}
