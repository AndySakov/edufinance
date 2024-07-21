import { AuthenticatedUser } from "./user";

export interface AuthState {
  user: AuthenticatedUser | null;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
}
