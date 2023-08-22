import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_TEAMS } from './graphql-queries';

export const useGetTeams = () => {
  const [getTeams, { data, loading, error }] = useLazyQuery(GET_TEAMS);

  useEffect(() => {
    getTeams();
    console.log(data, 'DATA');
  }, [getTeams]);

  return { teams: data ? data.teams : null, loading, error };
};
