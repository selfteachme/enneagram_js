import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { withApollo } from "../lib/apollo";
import { useAuthState } from "../state";

// Components
import { Page } from "../components/Page";
import { Answers } from "../components/Answers";
import { ProgressBar } from "../components/ProgressBar";

// GraphQL
import { MUTATION_ADD_ANSWER } from "../graphql/answers";
import { QUERY_REMAINING_QUESTIONS } from "../graphql/users";

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function Question() {
  const router = useRouter();
  const { isAuthenticated, userIdCookie } = useAuthState();

  // state
  const [isDirty, setIsDirty] = useState(true);
  const totalQuestions = 45;
  const [questions, setQuestions] = useState();
  const [numQuestionsRemaining, setNumQuestionsRemaining] = useState(
    totalQuestions
  );
  const [curQuestionNumber, setCurQuestionNumber] = useState();

  // graphQL
  const [createAnswer] = useMutation(MUTATION_ADD_ANSWER);

  /**
   * Add the answer
   */
  const handleClick = (value) => {
    // save the answer to the database
    createAnswer({
      variables: {
        answer: value,
        userId: userIdCookie,
        questionId: questions[numQuestionsRemaining - 1].id,
      },
    });

    // update the content
    if (curQuestionNumber + 1 < totalQuestions) {
      setCurQuestionNumber(curQuestionNumber + 1);
      setNumQuestionsRemaining(numQuestionsRemaining - 1);
    } // the user is finished
    else {
      gotoResults();
    }
  };

  /**
   * Warn the user, if they try to leave the quiz early
   */
  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  });

  const handleWindowClose = (e) => {
    if (isDirty) {
      e.preventDefault();
      return (e.returnValue =
        "You're not done taking the quiz - are you sure you wish to go?");
    }
  };

  // Get the data
  const { data, loading, error } = useQuery(QUERY_REMAINING_QUESTIONS, {
    variables: {
      id: userIdCookie,
    },
    skip: !userIdCookie,
    onCompleted: () => {
      const { remainingQuestions } = data.User;
      if (remainingQuestions && remainingQuestions.length > 0) {
        setQuestions(remainingQuestions);
        setCurQuestionNumber(totalQuestions - remainingQuestions.length);
        setNumQuestionsRemaining(remainingQuestions.length);
      } else {
        gotoResults();
      }
    },
  });

  const gotoResults = () => {
    setIsDirty(false); // disable warning for exiting the page
    router.push("/result");
  };

  return (
    <Page>
      <>
        <ProgressBar answers={curQuestionNumber} />
        <div className="box container">
          <div className="absolute left-0 -top-10 w-full">
            <div className="font-display flex justify-center container text-9xl leading-none tracking-tight w-full border-box">
              <span className="font-handwriting relative -top-8">#</span>
              {curQuestionNumber > 0 ? curQuestionNumber + 1 : 1}
            </div>
          </div>

          <div className="text-center my-6 font-normal font-serif">
            {loading
              ? "Loading..."
              : questions && questions[numQuestionsRemaining - 1].question}
          </div>
        </div>
        <div className="footer items-end flex justify-center">
          <Answers handleClick={handleClick} />
        </div>
      </>
    </Page>
  );
}

export default withApollo(Question);
