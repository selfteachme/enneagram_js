const { Select, Text, Relationship, Uuid } = require("@keystonejs/fields");

const options = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
];

module.exports = {
  fields: {
    question: { type: Text, isMultiline: true },
    type: { type: Select, options: options, dataType: "integer" },
    answer: { type: Relationship, ref: "Answer.question", many: true },
  },
  labelField: "question",
};
