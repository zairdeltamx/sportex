import React from 'react'
import buyNFT from '../../helpers/buyNft'
export const buttonDeleteNft = ({tokenID}) => {
  return (
    <button onClick={() => buyNFT(tokenId)}>BUY IT</button>
    )
}
