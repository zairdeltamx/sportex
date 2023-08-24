import { gql } from '@apollo/client';

export const MARK_AS_SOLD = gql`
  mutation markNftAsSold($id: Int!) {
    markNftAsSold(id: $id) {
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
  }
`;
