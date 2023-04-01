import { gql } from "@apollo/client";

export const GET_NFT = gql`
  query getNft($id: ID!) {
    getOneNft(id: $id) {
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
