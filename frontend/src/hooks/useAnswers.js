import React, { useState } from "react";
import { useAuthState } from "../state";
import { useMutation, useQuery } from "@apollo/client";

// graphQL
import {
  QUERY_GET_USERS_ANSWERS,
  MUTATION_REMOVE_ALL_ANSWERS,
} from "../graphql/answers";

/** -------------------------------------------------
* HOOK
* ---
* When implementing this hook, your code will probably look
* something like this:
*
*     const [numCompletedAnswers, removeAnswers] = useAnswers();
*
* numCompletedAnswers is an integer that tells you the number
* of answers the user has provided
*
* removeAnswers is a function that will remove all the answers
* a user has provided
*
---------------------------------------------------- */
function useAnswers() {
  const { userIdCookie } = useAuthState();
  const [numCompletedAnswers, setNumCompletedAnswers] = useState();
  const [answers, setAnswers] = useState();
  const [mutationRemoveAllAnswers] = useMutation(MUTATION_REMOVE_ALL_ANSWERS);

  // get all the answers the user has entered
  const {
    data: remainingAnswers,
    loading: loadingRemainingAnswers,
    error: errorRemainingAnswers,
  } = useQuery(QUERY_GET_USERS_ANSWERS, {
    variables: {
      userId: userIdCookie,
    },
    skip: !userIdCookie,
    onCompleted: () => {
      setAnswers(remainingAnswers.allAnswers);
      setNumCompletedAnswers(remainingAnswers.allAnswers.length);
    },
  });

  /**
   * Get Answer IDs
   * ---
   * Builds an array of answer IDS
   */
  const getAnswerIds = () => {
    const answersToDelete = [];
    let answer;

    for (answer of answers) {
      answersToDelete.push(answer.id);
    }

    return answersToDelete;
  };

  /**
   * Remove Answers
   * ---
   * Takes an array of answer IDS and deletes them
   */
  const removeAnswers = () => {
    const deleteThese = getAnswerIds();

    mutationRemoveAllAnswers({
      variables: {
        ids: deleteThese,
      },
    });
  };

  return [numCompletedAnswers, removeAnswers];
}

export { useAnswers };
