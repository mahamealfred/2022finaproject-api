// create a function to generate a random password
const generateRandomPassword = () => {
  const randomString = Math.random().toString(36).slice(-8);
  return randomString;
};

export default generateRandomPassword;
