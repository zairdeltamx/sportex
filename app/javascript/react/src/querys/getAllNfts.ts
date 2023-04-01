import { gql } from "@apollo/client";

export const GET_NFTS = gql`
  query getAllNfts(
    $page: Int
    $limit: Int
    $name: String
    $orderBy: String
    $order: String
    $teamName: String
  ) {
    getAllNfts(
      page: $page
      teamName: $teamName
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
        teamName
        image
        description
        tokenId
        strength
        meta
      }
      metadata {
        totalPages
        totalCount
      }
    }
  }
`;
