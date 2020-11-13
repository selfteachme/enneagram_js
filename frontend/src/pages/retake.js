import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { withApollo } from "../lib/apollo";
import { useAuthState } from "../state";

// components
import { Page } from "../components/Page";

// hooks
import { useAnswers } from "../hooks/useAnswers";

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function Retake() {
  const { userIdCookie } = useAuthState();
  const router = useRouter();
  const [numCompletedAnswers, removeAnswers] = useAnswers();

  /**
   * Check to make sure that the user is unfinished
   * ---
   * if you haven't finished the quiz and you manage to land here
   */
  useEffect(() => {
    const totalQuestions = process.env.TOTAL_QUESTIONS;

    // if the the user isn't finished
    if (numCompletedAnswers < totalQuestions) {
      router.push("/unfinished");
    }
    // if the user hasn't even started
    else if (numCompletedAnswers < 1) {
      router.push("/directions");
    }
  }, [numCompletedAnswers]);

  /**
   * Start Over Action
   * ---
   * Remove all the user's existing answers
   *  */
  const startOver = () => {
    removeAnswers();
    router.push("/directions");
  };

  return (
    <Page>
      <>
        <div className="container box relative w-11/12">
          <h2 className="text-center">Welcome Back</h2>
          <h1 className="text-center">You look familiar.</h1>
          <p className="mx-auto text-center pb-16">
            It looks like you've taken this quiz before.
          </p>
          <div className="absolute bottom-2 left-4">
            <button
              className="uppercase underline hover:no-underline font-bold text-xs font-sans"
              onClick={startOver}
            >
              Start Over
            </button>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
            <Link href="/result">
              <a className="submit">
                <span>View Results</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="footer">&nbsp;</div>
      </>
    </Page>
  );
}

export default withApollo(Retake);
