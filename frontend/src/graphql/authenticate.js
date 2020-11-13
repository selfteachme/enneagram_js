import { gql } from "@apollo/client";

/** -------------------------------------------------
* MUTATIONS
---------------------------------------------------- */
export const MUTATION_AUTHENTICATE_USER = gql`
  mutation MUTATION_AUTHENTICATE_USER($email: String, $password: String) {
    authenticateUserWithPassword(email: $email, password: $password) {
      token
      item {
        id
        email
      }
    }
  }
`;

/** -------------------------------------------------
* QUERIES
---------------------------------------------------- */
export const QUERY_AUTH_USER = gql`
  query queryAuthUser {
    authenticatedUser {
      id
    }
  }
`;

export const QUERY_USER_EXIST = gql`
  query queryUserExist($email: String) {
    allUsers(where: { email: $email }) {
      id
      name
    }
  }
`;
