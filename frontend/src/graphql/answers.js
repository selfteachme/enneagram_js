import { gql } from "@apollo/client";

export const MUTATION_ADD_ANSWER = gql`
  mutation MUTATION_ADD_ANSWER($answer: Int!, $userId: ID!, $questionId: ID!) {
    createAnswer(
      data: {
        answer: $answer
        user: { connect: { id: $userId } }
        question: { connect: { id: $questionId } }
      }
    ) {
      id
      answer
    }
  }
`;

export const QUERY_GET_USERS_ANSWERS = gql`
  query QUERY_GET_USERS_ANSWERS($userId: ID!) {
    allAnswers(where: { user: { id: $userId } }) {
      id
      answer
      question {
        type
      }
    }
  }
`;

export const MUTATION_REMOVE_ALL_ANSWERS = gql`
  mutation MUTATION_REMOVE_ALL_ANSWERS($ids: [ID!]) {
    deleteAnswers(ids: $ids) {
      user {
        remainingQuestions {
          question
        }
      }
    }
  }
`;
