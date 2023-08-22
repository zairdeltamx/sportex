import React, { Fragment, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { useMetamask } from '../useContext/MetamaskContext';

import { useLoadingContext } from '../useContext/LoaderContext';
import { Modal } from './Modal';
import { useModal } from '../hooks/useModal';
import styles from './Item.module.css';
import { PurchaseButton } from './PurchaseButton';
import { ButtonDelistNft } from './ButtonDelistNft';
import { Box, Button, Input, InputLabel } from '@mui/material';
import changePriceProxy from '../helpers/changePrice';
import { allowance } from '../helpers/allowanceNft';
import { approve } from '../helpers/approveNft';
import { resellToken } from '../helpers/resellToken';
import { transferToken } from '../helpers/transferToken';
import { ModalChangePriceNft } from './modalChangePriceNft/ModalChangePriceNft';
export const ItemNFT = ({ nft, isMarketplace }) => {
  const [nftIsApproved, setnftIsApproval] = useState(false);
  const [askingPrice, setAskingPrice] = useState(0);
  const [transferAddress, setTransferAddress] = useState('');
  const { addressMetamask } = useMetamask();
  const [isOpenModalResell, openModalResell, closeModalResell] = useModal();
  const [isOpenModalTransfer, openModalTransfer, closeModalTransfer] =
    useModal();
  const [isOpenModalChangePrice, openModalChangePrice, closeModalChangePrice] =
    useModal();
  const { setTransactionIsLoading } = useLoadingContext();

  useEffect(() => {
    const getApprove = async () => {
      const approved = await allowance({ tokenId: nft.tokenId });
      console.log(approved, 'APROEDASOPDI');
      setnftIsApproval(approved);
    };
    console.log(window.location.pathname);
    if (window.location.pathname === '/myassets') {
      getApprove();
    }
  }, []);
  const handleResellToken = async () => {
    try {
      setTransactionIsLoading(true);
      await resellToken({ askingPrice, nft });
    } finally {
      setTransactionIsLoading(false);
    }
  };

  const handleTransferToken = async () => {
    try {
      setTransactionIsLoading(true);
      await transferToken({ nft, transferAddress });
    } finally {
      setTransactionIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setTransactionIsLoading(true);
      const approved = await approve({ tokenId: nft.tokenId });
      setnftIsApproval(approved);
    } finally {
      setTransactionIsLoading(false);
    }
  };

  handleChangePrice = async () => {
    try {
      setTransactionIsLoading(true);
      await changePriceProxy({ nft, price: askingPrice });
    } finally {
      setTransactionIsLoading(false);
    }
  };
  const renderButtons = () => {
    if (isMarketplace) {
      if (nft.seller.toLowerCase() === addressMetamask) {
        return (
          <Fragment>
            {/* <button
              className={styles.changePriceNft}
              onClick={openModalChangePrice}
            >
              Change price
            </button> */}
            <ModalChangePriceNft
              onConfirm={handleChangePrice}
              title="Enter asking price for NFT"
              buttonLabel="Change Price"
              askingPrice={askingPrice}
            >
              <form>
                <label>Asking Price:</label>
                <input
                  type="number"
                  placeholder="2 PLS"
                  onChange={(e) => setAskingPrice(e.target.value)}
                  autoFocus
                />
              </form>
            </ModalChangePriceNft>
            <ButtonDelistNft nft={nft} />
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <PurchaseButton nft={nft} className="buttonIndex" />
          </Fragment>
        );
      }
    } else {
      if (!nftIsApproved) {
        return (
          <button className={styles.approveNft} onClick={() => handleApprove()}>
            Approve NFT
          </button>
        );
      } else {
        return (
          <Fragment>
            <button className={styles.resell} onClick={openModalResell}>
              Resell
            </button>
            <Modal isOpen={isOpenModalResell} onClose={closeModalResell}>
              <Box>
                <Box>
                  <h1>Resell NFT</h1>
                  <InputLabel htmlFor="input-resell">Asking Price:</InputLabel>
                  <Input
                    type="number"
                    id="input-resell"
                    placeholder="2 PLS"
                    onChange={(e) => setAskingPrice(e.target.value)}
                    autoFocus
                  />
                </Box>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleResellToken()}
                  >
                    Confirm Resell
                  </Button>
                </Box>
              </Box>
            </Modal>
            <button className={styles.transfer} onClick={openModalTransfer}>
              Transfer
            </button>
            <Modal isOpen={isOpenModalTransfer} onClose={closeModalTransfer}>
              <Box>
                <Box>
                  <h1>Transfer NFT</h1>
                  <InputLabel htmlFor="input-transfer">
                    Address to transfer:
                  </InputLabel>
                  <Input
                    type="text"
                    id="input-transfer"
                    placeholder="ERC-20 Address to transfer"
                    onChange={(e) => setTransferAddress(e.target.value)}
                    autoFocus
                  />
                </Box>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleTransferToken()}
                  >
                    Confirm Transfer
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Fragment>
        );
      }
    }
  };
  return (
    <div className={styles.containerCard}>
      <Fragment>
        <div className={styles.containerImageCard}>
          <Link to={`/nftdetail/${nft.tokenId}`}>
            <img src={nft.image} alt="" />
          </Link>
        </div>
        <div className={styles.containerNameCard}>
          <h1>
            {nft.name} #{nft.tokenId}
          </h1>
          <p>Soccer player</p>
        </div>
        <hr />
        <div className={styles.containerPriceCard}>
          <p>Current Price</p>
          <div>
            <span className={styles.unitDolar} style={{ textAlign: 'center' }}>
              {nft.priceInUSD}USD
            </span>{' '}
            <span className={styles.unitPLS}>{nft.price} PLS</span>
          </div>
        </div>
        <div className={styles.buttonsNftItem}>{renderButtons()}</div>
      </Fragment>
    </div>
  );
};
