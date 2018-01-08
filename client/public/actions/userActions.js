export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
export const USER_REGISTER = 'USER_REGISTER';
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_FAIL = 'USER_LOGOUT_FAIL';

export function userLogin(values){
  console.log('DISPATCH: ', USER_LOGIN);
  return {
    type: USER_LOGIN,
    payload: values
  }
}

export function userRegister(values){
  console.log('DISPATCH: ', USER_REGISTER);

  return {
    type: USER_REGISTER,
    payload: values
  }
}

export function userLogout(values){
  console.log('DISPATCH: ', USER_LOGOUT);

  return {
    type: USER_LOGOUT,
    payload: values
  }
}
