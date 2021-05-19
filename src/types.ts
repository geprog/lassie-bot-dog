import api from './api';

export type Api = ReturnType<typeof api>;

type ThenArgRecursive<T> = T extends PromiseLike<infer U> ? ThenArgRecursive<U> : T;

export type ProjectSchema = ThenArgRecursive<ReturnType<Api['Projects']['all']>>[0];

export type Approval = {
  user_has_approved: true;
  user_can_approve: false;
  approved: true;
  approved_by: [{ user: User }, { user: User }];
};

export type User = {
  id: number;
  name: string;
  username: string;
  state: 'active';
  avatar_url: string;
  web_url: string;
};
