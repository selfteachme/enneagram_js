import Link from "next/link";
import { gql } from "@apollo/client";
import { withApollo } from "../lib/apollo";
import { Page } from "../components/Page";
import { Answers } from "../components/Answers";

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function Directions() {
  return (
    <Page>
      <>
        <div className="container box relative w-11/12">
          <h2 className="text-center">Instructions</h2>
          <h1 className="text-center">It's Easy.</h1>
          <p className="mx-auto text-center">
            Answer the following questions with:
          </p>
          <Answers disabled={true} />
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
            <Link href="/question">
              <a className="submit">
                <span>Start</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="footer">&nbsp;</div>
      </>
    </Page>
  );
}

export default withApollo(Directions);
