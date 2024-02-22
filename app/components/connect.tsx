import { Button, Flex, TextInput, Title } from '@tremor/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePopup } from '../contexts/PopupProvider';
import { useUser } from '../hooks/useUser';
import { Dataset } from '../utils/types';

const translations: Dataset = {
  connect: 'Connect',
  userName: 'User Name',
  wrongUserName: 'Username is incorrect',
  letsGo: 'LetsGo!',
};

export default function Connect() {
  const { closePopup, isPopupOpen } = usePopup();
  const { connect } = useUser();

  const [userName, setUserName] = useState('');
  const [inputUserName, setInputUserName] = useState('');
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const isValidationDisabled = inputUserName.trim() === '' || hasConnectionError;

  const setFocus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleConnect = useCallback(async () => {
    if (isConnecting || isValidationDisabled) return;

    setIsConnecting(true);
    setUserName(inputUserName.trim());

    try {
      const user = await connect(inputUserName.trim());

      setHasConnectionError(user === undefined);

      if (user) {
        closePopup();
      } else {
        setFocus();
      }
    } catch (error) {
      console.error(error);
      setHasConnectionError(true);
      setFocus();
    } finally {
      setIsConnecting(false);
    }
  }, [inputUserName, closePopup, connect, setFocus, isConnecting, isValidationDisabled]);

  const changeUserName = useCallback(
    (value: string) => {
      setInputUserName(value.trim());
      setHasConnectionError(value.trim() !== '' && value.trim() === userName);
    },
    [userName],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Focus the input when the popup is opened
    if (isPopupOpen) {
      setFocus();
    }
  }, [isPopupOpen, setFocus]);

  return (
    <Flex flexDirection="col">
      <Title className="mb-6">{translations.connect}</Title>
      <TextInput
        autoFocus
        ref={inputRef}
        error={hasConnectionError}
        errorMessage={translations.wrongUserName}
        placeholder={translations.userName}
        defaultValue={inputUserName}
        onValueChange={changeUserName}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleConnect();
          }
        }}
      />
      <Button
        className="flex font-bold mt-6"
        loading={isConnecting}
        disabled={isValidationDisabled}
        style={{ borderRadius: 24 }}
        onClick={handleConnect}
      >
        {translations.letsGo}
      </Button>
    </Flex>
  );
}

