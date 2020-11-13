const { Select, Relationship } = require("@keystonejs/fields");

const answers = [
  { value: 1, label: "Nope" },
  { value: 2, label: "Meh" },
  { value: 3, label: "50/50" },
  { value: 4, label: "Sure" },
  { value: 5, label: "100%" },
];

module.exports = {
  fields: {
    answer: {
      type: Select,
      options: answers,
      dataType: "integer",
    },
    user: {
      type: Relationship,
      ref: "User.answer",
      many: false,
    },
    question: {
      type: Relationship,
      ref: "Question.answer",
      many: false,
    },
  },
};
