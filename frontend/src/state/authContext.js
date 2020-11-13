import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useCookie } from "../hooks";
import Cookies from "js-cookie";
import { withApollo } from "../lib/apollo";
import { generatePassword } from "../lib/generatePassword";

// GraphQL
import { MUTATION_AUTHENTICATE_USER } from "../graphql/authenticate";
import { QUERY_REMAINING_QUESTIONS } from "../graphql/users";

/**
 * AuthContext
 * -----------
 * This is the base react context instance.
 * It should not be used directly.
 */
export const AuthContext = createContext();

/**
 * useAuth
 * -------
 * A hook which provides access to the AuthContext
 */
export const useAuthState = () => useContext(AuthContext);

/**
 * AuthContext
 * -------
 * A context provider
 */
const AuthProvider = ({ children }) => {
  const [userIdCookie, setUserIdCookie] = useCookie({ key: "eg_id" });
  const [sessionCookie, setSessionCookie] = useCookie({ key: "eg_session" });
  const [emailCookie, setEmailCookie] = useCookie({ key: "eg_email" });
  const [password, setPassword] = useState(generatePassword());
  const [isAuthenticated, setIsAuthenticated] = useState(0);

  // queries and mutations
  const [authenticateUser] = useMutation(MUTATION_AUTHENTICATE_USER);

  /**
   * Update isAuthenticated when the user id or session cookie updates
   */
  useEffect(() => {
    setIsAuthenticated(userIdCookie && sessionCookie);
  }, [userIdCookie, sessionCookie]);

  /**
   * Sign In
   */
  const signIn = (email, password) => {
    console.log("signing in");
    authenticateUser({
      variables: {
        email: email,
        password: password,
      },
    }).then((result) => {
      const {
        token,
        item: { email, id },
      } = result.data.authenticateUserWithPassword;

      // set cookies with session information
      setUserIdCookie(id);
      setSessionCookie(token);
    });
  };

  /**
   * Sign Out
   */
  const signOut = () => {
    console.log("signing out");
    // sign out of keystone
    // remove cookie
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        userIdCookie,
        setUserIdCookie,
        password,
        emailCookie,
        setEmailCookie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
