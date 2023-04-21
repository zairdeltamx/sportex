import { useLazyQuery } from "@apollo/client";
import { GET_TEAMS } from "../querys/getTeams";
import { useEffect } from "react";

export const useGetTeams = () => {
  const [getTeams, { data, loading, error }] = useLazyQuery(GET_TEAMS);

  useEffect(() => {
    getTeams();
    console.log(data, "DATA");
  }, [getTeams]);

  return { teams: data ? data.teams : null, loading, error };
};
