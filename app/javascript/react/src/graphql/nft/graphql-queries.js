import { gql } from '@apollo/client';

export const GET_NFTS = gql`
  query allNfts(
    $currentPage: Int
    $name: String
    $orderBy: String
    $perPage: Int
    $order: String
    $teamName: String
    $seller: String
  ) {
    allNFTs(
      currentPage: $currentPage
      perPage: $perPage
      seller: $seller
      teamName: $teamName
      name: $name
      orderBy: $orderBy
      order: $order
    ) {
      nfts {
        id
        name
        price
        defense
        attack
        status
        teamName
        seller
        owner
        image
        description
        tokenId
        strength
      }
      totalPages
    }
  }
`;

export const GET_NFT = gql`
  query getNft($id: Int!) {
    getNFT(id: $id) {
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
