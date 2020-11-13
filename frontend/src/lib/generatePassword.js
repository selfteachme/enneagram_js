// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const generatePassword = () => {
  return Math.floor(Math.random() * (1111 - 9999) + 9999).toString();
};
