export type Post = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  /* When JOINed with author info: */
  author_username?: string;
  author_email?: string;
  author_avatar?: string;
  author_is_admin?: boolean;
  /* When JOINed with two_factor_auth info: */
  is_2fa_enabled?: boolean;
};

export type Comment = {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  /* Currently these properties are not in the DB, but are generated on the fly */
  avatar?: string;
};
