// 'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Page, useNavigation } from '../hooks/useNavigation';
import { User, UserContext } from '../hooks/useUser';
import { useLocalStorage } from '../utils/localStorage';
import { clearData } from '../utils/processData';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setPage, setNeedRefresh } = useNavigation();

  const connecting = useRef(false);
  const [user, setUser] = useLocalStorage<User | undefined>('user', undefined);
  const [isConnected, setIsConnected] = useState(!!user);

  const disconnect = useCallback(() => {
    setUser(undefined);
    clearData();
  }, [setUser]);

  const connect = useCallback(
    async (userName: string) => {
      if (!userName || userName.toLowerCase() === user?.name.toLowerCase() || connecting.current) return user;

      connecting.current = true;
      try {
        const result = await fetch('/api/database/getUsers');
        if (!result.ok) throw new Error('Error while fetching users');

        const users: User[] = await result.json();
        const newUser = users.find(u => u.name.toLowerCase() === userName.toLowerCase());

        if (newUser) {
          setUser(newUser);
          setIsConnected(true);
        } else {
          console.error('No user found');
          disconnect();
        }

        return newUser;
      } catch (error) {
        console.error(error);
        disconnect();
        return undefined;
      } finally {
        connecting.current = false;
      }
    },
    [disconnect, user, setUser],
  );

  useEffect(() => {
    setPage(isConnected ? Page.Portfolio : Page.Dashboard);
    setNeedRefresh(true);
  }, [isConnected, setPage, setNeedRefresh]);

  return (
    <UserContext.Provider
      value={{
        user,
        connect,
        disconnect,
        isConnected,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
