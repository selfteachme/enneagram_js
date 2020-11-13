require("dotenv").config();
const { groupBy, shuffle } = require("lodash");
const {
  Text,
  Checkbox,
  Integer,
  Password,
  DateTime,
  Relationship,
  Virtual,
} = require("@keystonejs/fields");
const { gql } = require("apollo-server-express");
const { sendEmail } = require("../emails");

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

// const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

module.exports = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      // access: {
      //   update: access.userIsAdmin,
      // },
    },
    password: {
      type: Password,
      minLength: 4,
      isRequired: false,
    },
    passcode: {
      type: Integer,
      isRequired: false,
      minLength: 4,
    },
    zip: {
      type: Text,
      isRequired: true,
    },
    passwordExpires: {
      type: DateTime,
      format: "dd/MM/yyyy HH:mm",
    },
    answer: {
      type: Relationship,
      ref: "Answer.user",
      many: true,
    },
    answersByType: {
      type: Virtual,
      graphQLReturnType: `Int`,
      resolver: async (item, args, context) => {
        const { data: answers, errors } = await context.executeGraphQL({
          query: gql`
            query QUERY_GET_USERS_ANSWERS($userId: ID!) {
              allAnswers(where: { user: { id: $userId } }) {
                id
                answer
                question {
                  type
                }
              }
            }
          `,
          variables: {
            userId: item.id,
          },
        });

        // group answers by type
        // expected result: { "1": [{answer: X}, {answer: Y}], "2": [{answer: A}, {answer: B}], ...}
        const groupedAnswers = await groupBy(answers.allAnswers, function(
          item
        ) {
          return item.question.type;
        });

        // loop over the object and get the sum for each answer
        let quizResult = 1;
        let highestSum = 0;

        for (const [key, value] of Object.entries(groupedAnswers)) {
          let sum = 0;

          for (const oneAnswer of value) {
            sum = sum + oneAnswer.answer;
          }

          if (sum > highestSum) {
            quizResult = Number(key);
            highestSum = sum;
          }
        }

        return quizResult;
      },
    },
    remainingQuestions: {
      type: Virtual,
      graphQLReturnType: `[Question]`,
      resolver: async (item, args, context) => {
        const { data, errors } = await context.executeGraphQL({
          query: gql`
            query UNANSWERED_QUESTIONS_QUERY($id: ID) {
              allQuestions(where: { answer_none: { user: { id: $id } } }) {
                id
                question
                answer {
                  answer
                  user {
                    name
                  }
                }
              }
            }
          `,
          variables: {
            id: item.id,
          },
        });
        return shuffle(data.allQuestions);
      },
    },
  },

  hooks: {
    afterChange: async ({ updatedItem, existingItem }) => {
      if (existingItem && updatedItem.password !== existingItem.password) {
        const url = process.env.SERVER_URL || "http://localhost:5000";

        const props = {
          recipientEmail: updatedItem.email,
          signinUrl: `${url}/familiar`,
          passcode: updatedItem.passcode,
        };

        const options = {
          subject: "👀 You look familiar... Here's your access code.",
          to: updatedItem,
          from: process.env.MAILGUN_FROM,
          domain: process.env.MAILGUN_DOMAIN,
          apiKey: process.env.MAILGUN_API_KEY,
        };

        await sendEmail("familiar.jsx", props, options);
      }
    },
  },

  // List-level access controls
  // access: {
  //   read: access.userIsAdminOrOwner,
  //   update: access.userIsAdminOrOwner,
  //   create: true,
  //   delete: access.userIsAdmin,
  //   auth: true,
  // },
};
