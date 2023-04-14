import { gql } from "@apollo/client";

export const GET_NFT = gql`
query getNft($id: Int!) {
  nft(id: $id) {
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
