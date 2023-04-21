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

  constructor(address marketplaceAddress) ERC721("Sportx Tokens", "NFTX") {
    contractAddress = marketplaceAddress;
    owner = payable(msg.sender);
  }

  function batchCreateTokens(string[] memory tokenURIs, string[] memory metas) public returns (uint[] memory) {
    require(owner == msg.sender, "Only contract owner can update Create game NFTs");

    uint[] memory tokenIds = new uint[](tokenURIs.length);

    for (uint i = 0; i < tokenURIs.length; i++) {
      _tokenIds.increment();
      uint256 newItemId = _tokenIds.current();

      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, tokenURIs[i]);
      idToMeta[newItemId] = metas[i];
      setApprovalForAll(contractAddress, true);
      tokenIds[i] = newItemId;
    }
    return tokenIds;
  }

  function createToken(string memory tokenURI, string memory meta) public returns (uint){
    require(owner == msg.sender, "Only contract owner can update Create game NFTs");

    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    idToMeta[newItemId] = meta;
    setApprovalForAll(contractAddress, true);
    return newItemId;
  }

  function updateMarketplace(address newMarketplaceAddress) public payable {
    require(owner == msg.sender, "Only contract owner can update NFT marketplace contract.");
    contractAddress = newMarketplaceAddress;
  }

  function updateMeta(uint256 tokenId, string memory meta) public payable {
    require(owner == msg.sender, "Only contract owner can update NFT metadata.");

    idToMeta[tokenId] = meta;
  }

  /* Returns the meta of the NFT */
  function getNFTmeta(uint256 tokenId) public view returns (string memory) {
    return idToMeta[tokenId];
  }
}
