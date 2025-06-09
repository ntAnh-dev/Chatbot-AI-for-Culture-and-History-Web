export const saveToken = (token: string) => {
  localStorage.setItem('access_token', token);
}

export const saveEmail = (email: string) => {
  localStorage.setItem('email', email);
}

export const getToken = () => {
  return localStorage.getItem('access_token');
}

export const getEmail = () => {
  return localStorage.getItem('email');
}

export const hasToken = () => {
  return !!getToken();
}

export const clearToken = () => {
  localStorage.removeItem('access_token');
}

export const clearEmail = () => {
  localStorage.removeItem('email');
}