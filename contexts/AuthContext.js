import { createContext } from 'react';

export const AuthContext = createContext({
  onboard: async (profile) => {},
  update: async (profile) => {},
  logout: async () => {},
});
