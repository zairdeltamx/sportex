// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 3;
    address payable owner;
    bool presaleEnabled = true;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool presale;
    }

    event MarketItemCreated(
        uint256 itemId,
        address nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        bool presale
    );

    constructor() {
        owner = payable(msg.sender);
    }

    function setPresaleEnabled(bool _presaleEnabled) public {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        presaleEnabled = _presaleEnabled;
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function listMarketItemToOwner(
        address nftContract,
        address nftOwner,
        uint256 tokenId
    ) public payable nonReentrant {
        require(
            owner == msg.sender,
            "Only marketplace owner can create new NFT market association"
        );

        _itemsSold.increment();
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[tokenId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(nftOwner),
            payable(nftOwner),
            1,
            true,
            presaleEnabled
        );

        IERC721(nftContract).transferFrom(msg.sender, nftOwner, tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            payable(nftOwner),
            payable(nftOwner),
            1,
            true,
            presaleEnabled
        );
    }

    function listMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(
            owner == msg.sender,
            "Only marketplace owner can create new NFT market association"
        );
        require(price > 0, "Price must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[tokenId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            presaleEnabled
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(this),
            price,
            false,
            presaleEnabled
        );
    }

    /* Creates the sale of a marketplace item */
    /* This is the PURCHASE action on the marketplace
  /* Transfers ownership of the item, as well as funds between parties */
    function purchaseItem(uint256 tokenId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        require(
            idToMarketItem[tokenId].owner == payable(address(this)),
            "The item needs to be listed to be sold"
        );

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _itemsSold.increment();

        IERC721(
          idToMarketItem[tokenId].nftContract
        ).transferFrom(address(this), msg.sender, tokenId);

        uint256 ownerFee = price.mul(listingPrice).div(100); // Calculate the 2% fee for the owner
        uint256 sellerAmount = price.sub(ownerFee); // Calculate the amount for the seller after deducting the owner's fee

        payable(owner).transfer(ownerFee);
        payable(seller).transfer(sellerAmount);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchAllMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchNFTsByUserAddress(address userAddress)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == payable(userAddress)) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == payable(userAddress)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(
        uint256 tokenId,
        uint256 price
    )
    public
    payable
    nonReentrant
    {
        require(
          tokenId > 0 && tokenId <= _itemIds.current(),
          "Token ID invalid"
        );
        require(
          price > 0,
          "Price must be at least 1 wei"
        );
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        IERC721(
          idToMarketItem[tokenId].nftContract
        ).transferFrom(msg.sender, address(this), tokenId);
    }

    function transferTo(address toAddress, uint256 tokenId)
      public
      payable
      nonReentrant
    {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        idToMarketItem[tokenId].owner = payable(toAddress);

        IERC721(idToMarketItem[tokenId].nftContract).transferFrom(
          address(msg.sender),
          toAddress,
          tokenId
        );
    }

    function delistNFT(uint256 tokenId)
       public
       payable
       nonReentrant
       {
       require(
            idToMarketItem[tokenId].seller == msg.sender,
            "Only item owner can perform this operation"
        );
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(msg.sender);
        _itemsSold.increment();

        IERC721(
          idToMarketItem[tokenId].nftContract
        ).transferFrom(address(this), msg.sender, tokenId);
    }

    function increaseItemsSold()
      public
    {
        require(
            owner == msg.sender,
            "Only marketplace owner can perform this operation"
        );
        _itemsSold.increment();
    }

    function decreaseItemsSold()
      public
    {
        require(
            owner == msg.sender,
            "Only marketplace owner can perform this operation"
        );
        _itemsSold.decrement();
    }

    function increaseItemIds()
      public
    {
        require(
            owner == msg.sender,
            "Only marketplace owner can perform this operation"
        );
        _itemIds.increment();
    }

    function decreaseItemIds()
      public
    {
        require(
            owner == msg.sender,
            "Only marketplace owner can perform this operation"
        );
        _itemIds.decrement();
    }

    function changePrice(uint256 tokenId, uint256 price)
        public
        nonReentrant
    {
        require(
            idToMarketItem[tokenId].seller == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
          price > 0,
          "Price must be at least 1 wei"
        );
        idToMarketItem[tokenId].price = price;
    }
}
