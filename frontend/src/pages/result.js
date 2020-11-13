import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { withApollo } from "../lib/apollo";
import { useAuthState } from "../state";

// components
import { Page } from "../components/Page";
import { Enneagram } from "../components/Enneagram";
import { Block } from "../components/Block";

// GraphQL
import { QUERY_GET_RESULTS } from "../graphql/results";
import { QUERY_GET_USERS_TYPE } from "../graphql/users";

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function result() {
  const router = useRouter();
  const { isAuthenticated, userIdCookie } = useAuthState();
  const [loading, setLoading] = useState(true);

  // state
  const [content, setContent] = useState();
  const [description, setDescription] = useState();
  const [usersType, setUsersType] = useState();

  // get the user's type
  const { data, loading: resultLoading, error: resultError } = useQuery(
    QUERY_GET_USERS_TYPE,
    {
      variables: {
        userId: userIdCookie,
      },
      onCompleted: () => {
        if (data.User && data.User.remainingQuestions.length > 0) {
          router.push("/question");
        }
        setUsersType(data.User.answersByType);
        setLoading(false);
      },
    }
  );

  // get the content for the specific type
  const {
    data: results,
    loading: resultsLoading,
    error: resultsError,
  } = useQuery(QUERY_GET_RESULTS, {
    variables: {
      type: usersType,
    },
    onCompleted: () => {
      setContent(results.allResults[0]);

      // drill down to the document nodes
      const document = results.allResults[0].description.document;
      const nodes = JSON.parse(document);
      setDescription(nodes);
    },
  });

  return (
    <Page>
      {!loading && (
        <>
          <div className="container box relative">
            <h2 className="font-handwriting normal-case text-9xl absolute -top-8">
              Hello
            </h2>
            <h2 className="text-center">{content && content.subheading}</h2>
            <h1 className="text-center mb-6 text-6xl">
              {content && content.name}
            </h1>
            <Enneagram
              className={`w-9/12 mx-auto mb-8 max-w-xs result-${usersType}`}
            />
            {description &&
              description.nodes.map((item, index) => (
                <Block node={item} key={index} />
              ))}
          </div>
          <div className="footer">&nbsp;</div>
        </>
      )}
    </Page>
  );
}

export default withApollo(result);
