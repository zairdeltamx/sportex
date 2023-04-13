import { gql } from "@apollo/client";

export const GET_NFTS = gql`
  query nfts(
    $page: Int
    $limit: Int
    $name: String
    $orderBy: String
    $order: String
    $teamName: String
  ) {
    nfts(
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
        seller
        owner
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
