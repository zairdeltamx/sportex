import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { MARK_AS_SOLD } from './graphql-mutations';
import { GET_NFTS } from './graphql-queries';

export const useGetNfts = (variables) => {
  // console.log('ENTRA AQUI----------------------------');
  const result = useQuery(GET_NFTS, {
    variables: variables,
  });
  return result;
};

export const useMarkAsSold = () => {
  const result = useMutation(MARK_AS_SOLD);
  return result;
};
