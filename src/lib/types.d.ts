export type Post = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  user_id: number;
  created_at: string;
  updated_at: string;
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
};
