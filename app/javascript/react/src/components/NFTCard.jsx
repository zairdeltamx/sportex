import React, { useState } from 'react';
// import Modal from 'react-modal';
import styles from './NFTCard.module.css';
import { Tooltip } from '@chakra-ui/react';

const NFTCard = ({
  context = 'marketplace',
  image = 'https://sportex-staging.infura-ipfs.io/ipfs/Qmazprg4puRaFd9gosz8bojCcqgFog1BZGMf8L8auGyXSm',
  name = 'Nombre de la carta',
  price = '20',
  priceCrypto = '2',
  isOwnedByCurrentUser = false,
  isApproved = false,
  token_id = '',
  onBuy,
  onDelist,
  onChangePrice,
  onApprove,
  onResell,
  onTransfer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.nftCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
      </div>
      <h3 className={styles.cardTitle} title={name}>
        {/* <Tooltip
          label="I am open by default"
          placement="left"
          // defaultIsOpen
        ></Tooltip> */}
      </h3>
      <p>
        <span>Current Price</span>
        <span>
          {price} USD ({priceCrypto} PLS)
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
              Buy NFT
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
