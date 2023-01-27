import { gql } from "@apollo/client";

export const GET_NFT = gql`
  query getAllNfts(
    $page: Int
    $limit: Int
    $name: String
    $orderBy: String
    $order: String
  ) {
    getAllNfts(
      page: $page
      limit: $limit
      name: $name
      orderBy: $orderBy
      order: $order
    ) {
      collection {
        id
        name
        price
        defense
        attack
        image
        description
        tokenId
        strength
      }
      metadata {
        totalPages
        totalCount
      }
    }
  }
`;
