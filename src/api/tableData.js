import { client } from './httpsClient';

export const getTableData = () => {
  return client.get('/data');
};
