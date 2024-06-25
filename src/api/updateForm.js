import { client } from './httpsClient';

export const updateForm = (payload) => {
  return client.patch('/update', payload);
};
