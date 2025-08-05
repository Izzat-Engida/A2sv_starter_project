export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}
export interface UpdateUserPayload {
  full_name: string;
  role: string;
}
export interface CreateUserPayload {
  id: string;
  full_name: string;
  email: string;
  role: string;
  message: string;
}

export interface DeleteUserPayload {
  full_name: string;
  id: stirng;
}
