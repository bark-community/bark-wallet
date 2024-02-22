// 'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { NavigationContext, Page } from '../hooks/useNavigation';

const pages = Object.keys(Page).map(page => Page[page as keyof typeof Page]);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page | undefined>();
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    if (page && !needRefresh) setNeedRefresh(true);
  }, [page, needRefresh]);

  return (
    <NavigationContext.Provider
      value={{
        page,
        setPage,
        pages,
        needRefresh,
        setNeedRefresh,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
