import { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { withApollo } from "../lib/apollo";
import { useRouter } from "next/router";
import { useAuthState } from "../state";
import { happenedWithinTheHour } from "../lib/dateHelpers";

// components
import { Page } from "../components/Page";

// graphQL
import { QUERY_EXPIRY_PAST } from "../graphql/users";

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
function Familiar() {
  const router = useRouter();
  const { emailCookie, userIdCookie } = useAuthState();
  const [passcode, setPasscode] = useState();
  const [resendCode, setResendCode] = useState(false);

  // set up the form
  const { handleSubmit, register, errors, setError } = useForm({
    mode: "onChange",
  });

  /**
   * checkPasscode
   * ---
   *
   */
  const [checkPasscode, { data: passcodeData }] = useLazyQuery(
    QUERY_EXPIRY_PAST,
    {
      variables: {
        email: emailCookie,
      },
      onCompleted: () => {
        const dataToCheck = passcodeData.allUsers[0];
        if (
          happenedWithinTheHour(dataToCheck.passwordExpires) &&
          passcode === dataToCheck.passcode
        ) {
          console.log("😅 You made it");
          signIn(emailCookie, passcode);
        } else {
          console.log("😱 You messed up somewhere");
          console.log({});
          setResendCode(true);
        }
      },
    }
  );

  // set up references to input fields
  const number = [];
  number[0] = useRef();
  number[1] = useRef();
  number[2] = useRef();
  number[3] = useRef();

  /**
   * handlePaste
   * ---
   * when a user tries to paste the passcode into the fields
   */
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");

    // loop over each input and populate with the index of that string
    number.forEach((input, i) => {
      input.current.value = paste[i] || "";
    });
  };

  /**
   * nextInput
   * ---
   * Focuses on the next input
   */
  const nextInput = (ref) => {
    const item = ref;
    item.current.focus();
  };

  /**
   * resendCode
   * ---
   * set a new passcode and send a new email
   */
  const handleResendCode = () => {
    console.log(" ✈️ sending new code");
  };

  /**
   * Submit Form
   * ---
   * Handles form submission
   * Check to see if the passcode matches and
   * if its within the hour of issuing
   */
  const onSubmit = (data) => {
    // create a string of the object's values
    const passcode = Object.values(data).toString().replace(/,/g, "");
    setPasscode(Number(passcode));
    checkPasscode();
  };

  /**
   * isNumber
   * ---
   * Uses for input validation
   * The field can only take a number
   */
  const isNumber = (value) => {
    return !isNaN(value);
  };

  return (
    <Page>
      <>
        <div className="container box relative w-11/12">
          <h2 className="text-center">Welcome Back</h2>
          <h1 className="text-center">You look familiar.</h1>
          {resendCode && (
            <div className="text-center">
              <button
                className="text-sm uppercase mb-2 text-red-500 tracking-wide hover:underline"
                onClick={handleResendCode}
              >
                resend code
              </button>
            </div>
          )}
          <p className="mx-auto text-center">
            We just want to make sure we have the right person in mind. Check
            your inbox, you should see an email from us with a 4 digit passcode.
          </p>
          <h2 className="text-center mt-6 mb-1">
            Check your email for a code.
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="flex justify-center max-w-xs mx-auto mb-2 md:mb-8">
              <input
                type="text"
                name="number0"
                className={errors.number1 ? "number error" : "number"}
                maxLength="1"
                ref={(e) => {
                  register(e, {
                    required: true,
                    validate: (value) => !isNaN(value),
                  });
                  number[0].current = e;
                }}
                onChange={() => {
                  if (number[0].current.value) nextInput(number[1]);
                }}
                onPaste={handlePaste}
              />
              <input
                type="text"
                name="number1"
                className={errors.number2 ? "number error" : "number"}
                maxLength="1"
                ref={(e) => {
                  register(e, {
                    required: true,
                    validate: (value) => !isNaN(value),
                  });
                  number[1].current = e;
                }}
                onChange={() => {
                  if (number[1].current.value) nextInput(number[2]);
                }}
              />
              <input
                type="text"
                name="number2"
                className={errors.number3 ? "number error" : "number"}
                maxLength="1"
                ref={(e) => {
                  register(e, {
                    required: true,
                    validate: (value) => !isNaN(value),
                  });
                  number[2].current = e;
                }}
                onChange={() => {
                  if (number[2].current.value) nextInput(number[3]);
                }}
              />
              <input
                type="text"
                name="number3"
                className={errors.number4 ? "number error" : "number"}
                maxLength="1"
                ref={(e) => {
                  register(e, {
                    required: true,
                    validate: (value) => !isNaN(value),
                  });
                  number[3].current = e;
                }}
              />
            </div>
            <div className="absolute w-full flex justify-center top-32">
              <button className="submit" type="submit">
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>
        <div className="footer">&nbsp;</div>
      </>
    </Page>
  );
}

export default withApollo(Familiar);
