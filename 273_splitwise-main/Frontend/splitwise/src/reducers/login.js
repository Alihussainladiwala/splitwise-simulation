const LoginReducer = (
  state = { username: 'Unknown', loggedIn: false, groupName: null },
  action
) => {
  switch (action.type) {
    case 'GETLOGIN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.text, loggedIn: action.status, groupName: action.group };
      return state;
    default:
      return state;
  }
};

export default LoginReducer;
