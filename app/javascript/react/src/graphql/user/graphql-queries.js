import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser {
    currentUser {
      username
      id
      avatarUrl
      email
      token
    }
  }
`;
