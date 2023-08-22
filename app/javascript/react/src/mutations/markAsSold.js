import { gql } from "@apollo/client";

export const MARK_AS_SOLD = gql`
  mutation markAsSold($tokenId: Int!) {
    markAsSold(tokenId: $tokenId) {
      id
      name
    }
  }
`;
