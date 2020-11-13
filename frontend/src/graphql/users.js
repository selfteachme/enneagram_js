import { gql } from "@apollo/client";

export const MUTATION_ADD_USER = gql`
  mutation MUTATION_ADD_USER(
    $name: String
    $email: String
    $password: String
    $zip: String
  ) {
    createUser(
      data: { name: $name, email: $email, password: $password, zip: $zip }
    ) {
      id
    }
  }
`;

export const MUTATION_SET_EXPIRY = gql`
  mutation MUTATION_SET_EXPIRY(
    $id: ID!
    $passcode: Int
    $password: String
    $passwordExpires: DateTime
  ) {
    updateUser(
      id: $id
      data: {
        passcode: $passcode
        password: $password
        passwordExpires: $passwordExpires
      }
    ) {
      passwordExpires
      id
      name
      email
    }
  }
`;

export const QUERY_REMAINING_QUESTIONS = gql`
  query QUERY_REMAINING_QUESTIONS($id: ID!) {
    User(where: { id: $id }) {
      remainingQuestions {
        id
        question
      }
    }
  }
`;

export const QUERY_EXPIRY_PAST = gql`
  query QUERY_EXPIRY_PAST($email: String) {
    allUsers(where: { email: $email }) {
      id
      passwordExpires
      passcode
      email
    }
  }
`;

export const QUERY_GET_USERS_TYPE = gql`
  query QUERY_GET_TYPE($userId: ID!) {
    User(where: { id: $userId }) {
      name
      answersByType
      remainingQuestions {
        question
      }
    }
  }
`;
