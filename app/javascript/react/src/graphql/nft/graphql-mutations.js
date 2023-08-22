import { gql } from '@apollo/client';

export const MARK_AS_SOLD = gql`
  mutation markAsSold($token_id: Int!) {
    markAsSold(tokenId: $token_id) {
      id
      name
    }
  }
`;
