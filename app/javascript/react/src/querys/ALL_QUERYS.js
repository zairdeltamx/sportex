import { gql } from '@apollo/client';

export const GET_NFTS = gql`
	query getNft($pageSearch: Int!) {
		getAllNfts(page: $pageSearch, limit: 10) {
			collection {
				id
				name
				price
				meta
				tokenId
				description
				image
			}
			metadata {
				totalPages
				limitValue
			}
		}
	}
`;
