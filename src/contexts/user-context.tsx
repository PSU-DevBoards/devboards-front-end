import { useAuth0 } from '@auth0/auth0-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import UserService, { User } from '../services/user.service';

const UserContext = createContext<User | undefined>(undefined);

function UserProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (isAuthenticated) {
      UserService.getCurrentUser().then(setUser);
    }
  }, [isLoading]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function useUser() {
  const user = useContext(UserContext);

  return user;
}

export { UserProvider, useUser };
