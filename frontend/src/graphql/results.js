import { gql } from "@apollo/client";

/** -------------------------------------------------
* QUERIES
---------------------------------------------------- */
export const QUERY_GET_RESULTS = gql`
  query queryGetResults($type: Int) {
    allResults(where: { type: $type }, first: 1) {
      id
      name
      subheading
      description {
        id
        document
      }
      type
    }
  }
`;
