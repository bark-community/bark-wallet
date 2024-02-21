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

  return (
    <>
      <Title className="text-center mb-2">
        {t[TransactionType[transaction.type ?? 0]]} {t.from} {transaction.date}
      </Title>
      <List>
        {['movement', 'cost', 'token', 'rate'].map((item, index) =>
          transaction[item] ? (
            <ListItem key={index}>
              {transaction.type !== TransactionType.donation || item !== 'cost' ? (
                <>
                  <span>{t[item]}</span>
                  <span
                    className={cls(
                      'font-bold',
                      !isNaN(Number(transaction[item]))
                        ? Number(transaction[item]) >= 0
                          ? 'text-grey-400'
                          : 'text-red-400'
                        : '',
                    )}
                  >
                    {isNaN(Number(transaction[item]))
                      ? transaction[item]
                      : Number(transaction[item]).toLocaleCurrency()}
                  </span>
                </>
              ) : null}
            </ListItem>
          ) : null,
        )}
      </List>
      <Flex justifyContent="center" className="mt-6">
        <Button className="font-bold" style={{ borderRadius: 16 }} onClick={closePopup}>
          {t.close}
        </Button>
      </Flex>
    </>
  );
};
