export interface UserResponse {
  id: number;
  avatar: string;
  error?: string;
}

export interface InviteResponse {
  error?: string;
  message?: string;
}
