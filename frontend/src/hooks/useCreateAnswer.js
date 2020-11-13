import { MUTATION_ADD_ANSWER } from "../graphql/answers";

const useCreateAnswer = () =>
  useMutation(MUTATION_ADD_ANSWER);

export { useCreateAnswer };
