import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Answers } from "../../components/Answers";
// Components
import { Route } from "../../constants/route";
import { Page } from "../../components/Page";
import { ProgressBar } from "../../components/ProgressBar";
// GraphQL
import { MUTATION_ADD_ANSWER } from "../../graphql/answers";
import { useRemainingQuestions } from "../../hooks/useRemainingQuestions";
import { useAuthState } from "../../state";
import { QUERY_REMAINING_QUESTIONS } from "../../graphql/users";

const totalQuestions = 45;

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function Question() {
  const router = useRouter();
  const { userIdCookie } = useAuthState();

  // state
  const [isDirty, setIsDirty] = useState(true);

  // graphQL
  const [createAnswer] = useMutation(MUTATION_ADD_ANSWER);

  const goToResults = () => {
    setIsDirty(false); // disable warning for exiting the page
    router.push(Route.RESULTS);
  };

  const handleWindowClose = (e) => {
    if (isDirty) {
      e.preventDefault();
      return (e.returnValue =
        "You're not done taking the quiz - are you sure you wish to go?");
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
  }, [isDirty]);

  // Get the data
  const { remainingQuestions, loading } = useRemainingQuestions();

  useEffect(() => {
    if (!remainingQuestions) return;

    const hasRemainingQuestions = Boolean(remainingQuestions.length);

    if (!hasRemainingQuestions) {
      goToResults();
    }
  }, [goToResults, remainingQuestions]);

  const { id: questionId, question } = remainingQuestions?.[0] ?? {};

  /**
   * Add the answer
   */
  const handleClick = async (value) => {
    // save the answer to the database
    await createAnswer({
      refetchQueries: [
        { query: QUERY_REMAINING_QUESTIONS, variables: { id: userIdCookie } },
      ],
      variables: {
        answer: value,
        userId: userIdCookie,
        questionId,
      },
    });
  };

  const questionAnswered = loading
    ? 0
    : totalQuestions - remainingQuestions.length;

  return (
    <Page>
      <>
        <ProgressBar answers={questionAnswered} />
        <div className="box container">
          <div className="absolute left-0 -top-10 w-full">
            <div className="font-display flex justify-center container text-9xl leading-none tracking-tight w-full border-box">
              {!loading && (
                <>
                  <span className="font-handwriting relative -top-8">#</span>
                  {questionAnswered}
                </>
              )}
            </div>
          </div>

          <div className="text-center my-6 font-normal font-serif">
            {loading ? "Loading..." : question}
          </div>
        </div>
        <div className="footer items-end flex justify-center">
          <Answers handleClick={handleClick} />
        </div>
      </>
    </Page>
  );
}

export { Question };
