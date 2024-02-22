// 'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

export interface PopupContextState {
  isPopupOpen: boolean;
  openPopup: (popup: ReactNode, shouldCloseManually?: boolean) => void;
  closePopup: () => void;
  autoClosePopup: () => void;
  popup: ReactNode;
}

export const PopupContext = createContext<PopupContextState>({
  isPopupOpen: false,
  openPopup: () => {},
  closePopup: () => {},
  autoClosePopup: () => {},
  popup: null,
});

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<ReactNode>();
  const [shouldCloseManually, setShouldCloseManually] = useState<boolean>();

  const openPopup = (newPopup: ReactNode, shouldCloseManually?: boolean) => {
    setPopup(newPopup);
    setShouldCloseManually(shouldCloseManually);
  };

  const closePopup = () => setPopup(undefined);

  const autoClosePopup = () => !shouldCloseManually && setPopup(undefined);

  return (
    <PopupContext.Provider
      value={{
        isPopupOpen: !!popup,
        openPopup,
        closePopup,
        autoClosePopup,
        popup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextState => useContext(PopupContext);
