import { Button, Flex, List, ListItem, Title } from '@tremor/react';
import { usePopup } from '../contexts/PopupProvider';
import { Transaction, TransactionType } from '../pages/transactions';
import { cls } from '../utils/constants';
import { Dataset } from '../utils/types';

const t: Dataset = {
  cost: 'Cost',
  date: 'Date',
  movement: 'Movement',
  token: 'Tokens',
  rate: 'Rate',
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  donation: 'Donation',
  swap: 'Swap',
  payment: 'Payment',
  from: 'from',
  close: 'Close',
};

export const TransactionDetails = ({ transaction }: { transaction: Transaction }) => {
  const { closePopup } = usePopup();

  const renderTransactionDetail = (item: string, index: number) => {
    const isNumeric = !isNaN(Number(transaction[item]));
    
    // Only render the details if the condition is met
    if (transaction[item] !== undefined && (transaction.type !== TransactionType.donation || item !== 'cost')) {
      return (
        <ListItem key={index}>
          <span>{t[item]}</span>
          <span className={cls('font-bold', isNumeric ? (Number(transaction[item]) >= 0 ? 'text-green-400' : 'text-red-400') : '')}>
            {isNumeric ? Number(transaction[item]).toLocaleCurrency() : String(transaction[item])}
          </span>
        </ListItem>
      );
    }

    return null;
  };

  return (
    <>
      <Title className="text-center mb-2">
        {t[TransactionType[transaction.type ?? 0]]} {t.from} {transaction.date.toShortDate()}
      </Title>
      <List>{['movement', 'cost', 'token', 'rate'].map(renderTransactionDetail)}</List>
      <Flex justifyContent="center" className="mt-6">
        <Button className="font-bold" style={{ borderRadius: 24 }} onClick={closePopup}>
          {t.close}
        </Button>
      </Flex>
    </>
  );
};


    </>
  );
};
