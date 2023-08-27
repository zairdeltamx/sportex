import React from 'react';
import { Grid, Box, SimpleGrid, GridItem, Flex } from '@chakra-ui/react';
import NFTCard from './NFTCard';
import styles from './ListNfts.module.css';
import { useMetamask } from '../useContext/MetamaskContext';
const NFTList = ({ nfts, context }) => {
  const { addressMetamask } = useMetamask();
  return (
    <Flex
      marginTop={20}
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      gap={10}
    >
      {nfts.map((nft) => (
        <div key={nft.id}>
          <NFTCard
            name={nft.name}
            token_id={nft.tokenId}
            context={context}
            nft={nft}
          />
        </div>
      ))}
    </Flex>
  );
};
export default NFTList;
