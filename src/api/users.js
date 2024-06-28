import { client } from './httpsClient';

export const getUsers = () => {
  return client.get('/users');
};

export const searchUser = (payload) => {
  return client.get(`/users?search=${payload}`);
};
