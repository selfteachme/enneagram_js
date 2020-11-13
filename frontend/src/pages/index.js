import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { withApollo } from "../lib/apollo";
import { useRouter } from "next/router";
import { useAuthState } from "../state";
import { inOneHour } from "../lib/dateHelpers";
import { useAnswers } from "../hooks/useAnswers";
import { useCreateUser } from "../hooks/useCreateUser";

// Components
import { Page } from "../components/Page";

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function Home() {
  // hooks
  const router = useRouter();
  const { isAuthenticated, signIn, userIdCookie, password } = useAuthState();
  const [numCompletedAnswers] = useAnswers();
  const [handleUser] = useCreateUser();

  // set up state
  const [isLoading, setIsLoading] = useState(false);
  const [graphQLErrors, setGraphQLErrors] = useState();
  const [email, setEmail] = useState();

  // set up the form
  const { register, handleSubmit, watch, errors } = useForm();

  /**
   * onSubmit
   * ---
   * when the user submits the form, handle it
   */
  const onSubmit = (data) => {
    handleUser(data);
  };

  /**
   * Check to see the user has been authenticated
   * ---
   * if the user has cookies = they're already logged in
   * cookies only last ~ 1 hour
   */
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🎉 I AM AUTHENTICATED!!");
      const totalQuestions = process.env.TOTAL_QUESTIONS;

      // does the user have questions left?
      // yes
      // -- send them to the questions page
      if (numCompletedAnswers && numCompletedAnswers < totalQuestions) {
        router.push("/question");
      } // no, they're finished
      // --- ask them if they want to retake the quiz
      else if (numCompletedAnswers >= totalQuestions) {
        router.push("/retake");
      } // the user hasn't answered any questions
      // --- send them to the directions page
      else {
        router.push("/directions");
      }
    }
  }, [isAuthenticated, numCompletedAnswers]);

  return (
    <Page>
      <>
        <div className="box container">
          <div className="box__free absolute -top-16 md:-top-10 left-1 md:-left-1 font-handwriting text-8xl">
            free
          </div>
          <h1 className="font-display leading-none">Enneagram Assessment</h1>
          <form
            className="grid sm:grid-cols-1 md:grid-cols-3 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {graphQLErrors && (
              <div className="error col-span-3">
                Whoops! Looks like there was an error.
                <br />
                {graphQLErrors}
              </div>
            )}
            <div>
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                name="first_name"
                ref={register({ required: true })}
                required
              />
            </div>
            <div>
              <label htmlFor="last_name">Email Address</label>
              <input
                type="email"
                name="email"
                ref={register({ required: true })}
                required
              />
            </div>
            <div>
              <label htmlFor="zip">Zip</label>
              <input
                type="text"
                name="zip"
                ref={register({ required: true })}
                required
              />
            </div>
            <div className="md:col-span-2 sm:col-span-1">
              <label
                htmlFor="agree"
                className="font-normal normal-case font-serif text-sm"
              >
                <input
                  ref={register({ required: true })}
                  type="checkbox"
                  name="agree"
                  className="mr-1"
                  required
                />{" "}
                I agree to your{" "}
                <Link href="terms-conditions">
                  <a className="font-bold underline hover:no-underline">
                    terms and conditions.
                  </a>
                </Link>
              </label>
            </div>
            <div className="relative text-center md:text-right">
              <button
                className="submit md:absolute md:right-0 relative -bottom-16 -mt-16 md:mt-0 center"
                role="submit"
              >
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>
        <div className="container footer flex justify-center items-center md:justify-start md:items-start relative mx-auto py-2 text-sm font-serif font-normal px-4">
          <div className="pb-1 -mt-8">
            <Link href="what">
              <a className="uppercase underline hover:no-underline font-bold text-xs font-sans">
                What is the Enneagram?
              </a>
            </Link>
          </div>
        </div>
      </>
    </Page>
  );
}

export default withApollo(Home);
