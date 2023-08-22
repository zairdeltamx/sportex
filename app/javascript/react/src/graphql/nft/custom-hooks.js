import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { MARK_AS_SOLD } from './graphql-mutations';
import { GET_NFTS } from './graphql-queries';

export const useGetNfts = () => {
  console.log('ENTRA AQUI----------------------------');
  const result = useQuery(GET_NFTS);
  return result;
};

export const useMarkAsSold = () => {
  const [markAsSoldMutation, { loading, error, data }] = useMutation(
    MARK_AS_SOLD,
    {
      refetchQueries: [{ query: GET_NFTS }],
      onError: (err) => {
        console.log(err, 'ERROR ACA');
      },
    }
  );

  return {
    markNftAsSold: markAsSoldMutation,
    loading,
    error,
    data,
  };
};
