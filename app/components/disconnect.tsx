import { Button, Flex, Title } from '@tremor/react';
import { useCallback, useEffect, useRef } from 'react';
import { usePopup } from '../contexts/PopupProvider';
import { useUser } from '../hooks/useUser';
import { Dataset } from '../utils/types';

const t: Dataset = {
  disconnect: 'Disconnect?',
  goodBye: 'Goodbye!',
};

export default function Disconnect() {
  const { closePopup, isPopupOpen } = usePopup();
  const { disconnect } = useUser();

  const handleDisconnect = useCallback(() => {
    disconnect();
    closePopup();
  }, [closePopup, disconnect]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the button when the popup is opened
    if (isPopupOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isPopupOpen]);

  return (
    <Flex flexDirection="col">
      <Title className="mb-6">{t.disconnect}</Title>
      <Button ref={buttonRef} className="flex font-bold" style={{ borderRadius: 16 }} onClick={handleDisconnect}>
        {t.goodBye}
      </Button>
    </Flex>
  );
}
