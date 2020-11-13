import { useQuery } from "@apollo/client";
import { QUERY_REMAINING_QUESTIONS } from "../graphql/users";
import { useAuthState } from "../state";

const useRemainingQuestions = () => {
  const { userIdCookie } = useAuthState();

  const { data, ...rest } = useQuery(QUERY_REMAINING_QUESTIONS, {
    variables: {
      id: userIdCookie,
    },
    skip: !userIdCookie,
  });

  const { loading } = rest;

  if (loading || !data) return { loading: true, rest };

  const { remainingQuestions } = data.User;

  return { remainingQuestions, ...rest };
};

export { useRemainingQuestions };
