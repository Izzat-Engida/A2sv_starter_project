export interface UpdateProfilePayload {
  full_name: string;
  email: string;
}
export interface ChangeUserPassword {
  old_password: string;
  new_password: string;
}
