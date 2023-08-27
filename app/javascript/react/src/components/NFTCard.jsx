import React, { useState } from 'react';
// import Modal from 'react-modal';
import styles from './NFTCard.module.css';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useMetamask } from '../useContext/MetamaskContext';
const NFTCard = ({
  context,
  image = 'https://sportex-staging.infura-ipfs.io/ipfs/Qmazprg4puRaFd9gosz8bojCcqgFog1BZGMf8L8auGyXSm',
  name = 'Nombre de la carta',
  price = '20',
  priceCrypto = '2',
  nft,
  isApproved = false,
  token_id = '',
  onBuy,
  onDelist,
  onChangePrice,
  onApprove,
  onResell,
  onTransfer,
}) => {
  const { addressMetamask } = useMetamask();

  if (!addressMetamask) {
    return null;
  }
  const isOwnedByCurrentUser =
    nft.owner?.toLowerCase() === addressMetamask.toLowerCase();

  return (
    <div className={styles.nftCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
      </div>
      <Popover>
        <PopoverTrigger>
          <Text
            as="span"
            width="100%"
            fontWeight="bold"
            fontSize="20px"
            textAlign="center"
            display="inline-block"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            cursor="pointer"
            // _hover={{ textDecoration: 'underline' }}
          >
            {name + '#' + token_id}
          </Text>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody> {name + ' #' + token_id}</PopoverBody>
        </PopoverContent>
      </Popover>
      <p>
        <span>Current Price</span>
        <span>
          {price}USD ({priceCrypto} PLS)
        </span>
      </p>

      {context === 'marketplace' && (
        <>
          {isOwnedByCurrentUser ? (
            <div className={styles.ownerButtons}>
              <button onClick={onDelist}>Delist</button>
              <button onClick={onChangePrice}>Change Price</button>
            </div>
          ) : (
            <button onClick={handleBuyClick} className={styles.fullWidthButton}>
              BUY IT
            </button>
          )}
        </>
      )}

      {context === 'userAssets' && (
        <>
          {!isApproved ? (
            <button onClick={onApprove} className={styles.fullWidthButton}>
              Approve NFT
            </button>
          ) : (
            <div className={styles.ownerButtons}>
              <button onClick={onResell}>Resell</button>
              <button onClick={onTransfer}>Transfer</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NFTCard;
