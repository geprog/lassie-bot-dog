import { Gitlab } from '@gitbeaker/node';

const api = (host: string, token: string) =>
  new Gitlab({
    host,
    token,
  });

export default api;
