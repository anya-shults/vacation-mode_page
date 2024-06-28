import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://precoro-vuejs-test-task-api.avramch.workers.dev',
});
