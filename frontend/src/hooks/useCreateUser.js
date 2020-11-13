import { useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useAuthState } from "../state";
import { useRouter } from "next/router";
import { inOneHour } from "../lib/dateHelpers";

// graphql
import { QUERY_USER_EXIST } from "../graphql/authenticate";
import { MUTATION_ADD_USER, MUTATION_SET_EXPIRY } from "../graphql/users";

/** -------------------------------------------------
* HOOK
---------------------------------------------------- */
function useCreateUser() {
  const router = useRouter();
  const { signIn, password, userIdCookie, setEmailCookie } = useAuthState();
  const [userData, setUserData] = useState({});

  /**
   * createUser
   * ---
   * GraphQL Mutation that creates the user
   */
  const [createUser] = useMutation(MUTATION_ADD_USER, {
    onCompleted: () => {
      handleSignIn();
    },
  });

  /**
   * setExpiry
   * ---
   * GraphQL Mutation that creates a passcode for the user
   */
  const [setExpiry] = useMutation(MUTATION_SET_EXPIRY);

  /**
   * doesEmailExist
   * ---
   * GraphQL Query that checks to see if the user exists
   */
  const [doesEmailExist, { data: userExists }] = useLazyQuery(
    QUERY_USER_EXIST,
    {
      variables: {
        email: userData.email,
      },
      onCompleted: () => {
        // the user is not in the database, create them
        if (userExists.allUsers.length < 1) {
          console.log("🔍️ You're not in the database");
          createUser({
            variables: {
              name: userData.first_name,
              email: userData.email,
              password,
              zip: userData.zip,
            },
          });
        } // we found the user, send them a passcode
        else {
          console.log("👋 I found you");

          // save their email address in a cookie
          setEmailCookie(userData.email);

          // set up temporary passcode
          setExpiry({
            variables: {
              id: userExists.allUsers[0].id,
              password,
              passcode: Number(password),
              passwordExpires: inOneHour,
            },
          });

          // redirect the user
          router.push("/familiar");
        }
      },
    }
  );

  /**
   * handleSignIn
   * ---
   * Signs the user in
   */
  const handleSignIn = async () => {
    signIn(userData.email, password);
  };

  /**
   * Handle User
   */
  const handleUser = (formData) => {
    setUserData({ ...formData });
    doesEmailExist();
  };

  return [handleUser];
}

export { useCreateUser };
