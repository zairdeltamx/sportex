import { gql } from "@apollo/client";

export const GET_NFT = gql`
  query getNft($tokenId: Int!) {
    nft(tokenId: $tokenId) {
      id
      name
      price
      defense
      attack
      image
      seller
      owner
      teamName
      description
      tokenId
      strength
    }
  }
`;
