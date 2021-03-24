const LoginReducer = (state = { username: 'Unknown', loggedIn: false }, action) => {
  switch (action.type) {
    case 'GETLOGIN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.text, loggedIn: action.status };
      return state;
    default:
      return state;
  }
};

export default LoginReducer;
