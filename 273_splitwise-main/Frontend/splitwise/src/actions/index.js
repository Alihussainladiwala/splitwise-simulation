// eslint-disable-next-line arrow-body-style
export const setUser = (username, loggedIn) => {
  return {
    type: 'GETLOGIN',
    text: username,
    status: loggedIn,
  };
};

export default setUser;
