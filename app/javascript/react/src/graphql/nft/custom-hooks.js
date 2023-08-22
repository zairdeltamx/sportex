import { useLazyQuery, useMutation } from '@apollo/client';
import { MARK_AS_SOLD } from './graphql-mutations';
import { GET_NFTS } from './graphql-queries';

export const useGetNfts = () => {
  console.log('ENTRA AQUI----------------------------');
  const result = useLazyQuery(GET_NFTS);
  return result;
};

export const useMarkAsSold = () => {
  const result = useMutation(MARK_AS_SOLD);
  return result;
};
