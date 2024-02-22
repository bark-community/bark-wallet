import { Flex, MarkerBar, Subtitle } from '@tremor/react';
import { cls } from '../utils/constants';
import { Dataset } from '../utils/types';

const t: Dataset = {
  invested: 'Invested',
  gains: 'Gains',
};

interface GainsBarProps {
  invested: number;
  profitValue: number;
  profitRatio: number;
}

export default function GainsBar({ values, loaded }: { values: GainsBarProps | undefined; loaded: boolean }) {
  const { invested, profitValue, profitRatio } = values || {
    invested: 0,
    profitValue: 0,
    profitRatio: 0,
  };
  const isPositive = profitRatio >= 0;
  const isOverKill = profitRatio * 100 > 100;
  const overKillValue = 10000 / (profitRatio * 100 + 100);

  return (
    <Flex className="mt-4 mb-1">
      {(invested || !loaded) && (
        <Subtitle className={cls('truncate w-0 text-left sm:w-1/2', !loaded && 'blur-sm')}>
          {`${t.invested} : ${invested.toLocaleCurrency()}`}
        </Subtitle>
      )}
      {(invested || !loaded) && (
        <Subtitle className={!loaded && 'blur-sm'}>
          {`${t.gains} : ${profitValue.toLocaleCurrency()}${profitRatio ? ` (${profitRatio.toRatio()})` : ''}`}
        </Subtitle>
      )}

      {(profitRatio || !loaded) && (
        <MarkerBar
          title="Gains"
          color={isPositive ? 'green' : 'red'}
          value={isOverKill ? overKillValue : isPositive ? 0 : 100}
          minValue={isOverKill ? overKillValue : isPositive ? 0 : 100 - Math.abs(profitRatio) * 100}
          maxValue={isOverKill ? 100 : isPositive ? profitRatio * 100 : 100}
        />
      )}
    </Flex>
  );
}
