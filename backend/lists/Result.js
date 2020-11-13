const {
  Text,
  Select
} = require("@keystonejs/fields");
const { Content } = require('@keystonejs/fields-content');

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
    name: { type: Text },
    subheading: { type: Text},
    description: {
      type: Content,
      isRequired: true,
      blocks: [
        Content.blocks.heading
      ]
    },
    type: { type: Select, options: options, dataType: "integer" },
  }
}