import { gql } from "@apollo/client";

/** -------------------------------------------------
* QUERIES
---------------------------------------------------- */
export const QUERY_GET_QUESTIONS = gql`
  query queryGetQuestions {
    allQuestions(first: 1) {
      id
      question
    }
  }
`;
