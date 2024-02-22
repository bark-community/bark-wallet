import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AreaChart,
  BadgeDelta,
  BarList,
  Flex,
  Grid,
  Metric,
  SparkAreaChart,
  Tab,
  TabGroup,
  TabList,
  Title,
} from '@tremor/react';
import { ChevronLeftIcon, ChevronRightIcon, ChartPieIcon, ListBulletIcon } from '@heroicons/react/outline';
import GainsBar from '../components/GainsBar';
import { Page, useNavigation } from '../hooks/useNavigation';
import { useWindowParam } from '../hooks/useWindowParam';
import { getBarData } from '../utils/chart';
import { cls } from '../utils/constants';
import { isMobileSize, useIsMobile } from '../utils/mobile';
import { loadData } from '../utils/processData';
import { DataName, Data, Dataset } from '../utils/types';

const tokenValueStart = 100;

const t: Dataset = {
  price: 'Price',
  result: 'BARK Results',
  total: 'Cash',
  profit: 'Profits',
  gains: 'Gains',
  assets: 'Total Value',
  transfered: 'Invested',
  currency: 'Currency',
  type: 'Type',
  'transfer cost': 'Transfers',
  'strategy cost': 'Strategy',
  'price change': 'Price Change',
  charity: 'Charity',
  loading: 'Loading...',
  amount: 'Amount',
};

interface DashboardToken extends Data {
  available: number;
  duration: number;
}

interface Historic {
  date: number;
  stringDate: string;
  Invested: number;
  Cash: number;
}

interface TokenHistoric {
  date: string;
  Amount: number;
}

const GREEN_COLOR = 'green';
const RED_COLOR = 'red';

const today = new Date();
const thisPage = Page.Dashboard;

export default function Dashboard() {
  const { page, needRefresh, setNeedRefresh } = useNavigation();
  const [dashboard, setDashboard] = useState<Data[]>([]);
  const [token, setToken] = useState<DashboardToken[]>([]);
  const [historic, setHistoric] = useState<Historic[]>([]);
  const [tokenHistoric, setTokenHistoric] = useState<TokenHistoric[][]>([]);
  const [tokenHistoricLimit, setTokenHistoricLimit] = useState<{ min: number; max: number }>();

  const findValue = useCallback((data: Data[], label: string | undefined) => {
    return label ? data.find(d => d.label.toLowerCase().includes(label.toLowerCase())) : undefined;
  }, []);

  const getValue = useCallback(
    (data: Data[], label: string | undefined, defaultValue = 0) => {
      return (findValue(data, label)?.value ?? defaultValue).toLocaleCurrency();
    },
    [findValue],
  );

  const getRatio = useCallback(
    (data: Data[], label: string | undefined, defaultValue = 0) => {
      return (findValue(data, label)?.ratio ?? defaultValue).toRatio();
    },
    [findValue],
  );

  const generateTokenHistoric = useCallback(
    (token: DashboardToken[]) => {
      token = token.filter(({ label, available }) => available && label !== 'Euro');
      setToken(token);

      let min = tokenValueStart;
      let max = tokenValueStart;
      const tokenHistoric: TokenHistoric[][] = [];

      token.forEach(t => {
        const tokenValueEnd = tokenValueStart * (1 + parseFloat(getRatio(token, t.label)) / 100);
        tokenHistoric.push([
          { date: new Date(today.getTime() - t.duration * 24 * 60 * 60 * 1000).toShortDate(), Amount: tokenValueStart },
          { date: today.toShortDate(), Amount: tokenValueEnd },
        ]);
        min = Math.min(min, tokenValueEnd);
        max = Math.max(max, tokenValueEnd);
      });

      setTokenHistoric(tokenHistoric);
      setTokenHistoricLimit({
        min: min,
        max: max,
      });
    },
    [getRatio],
  );

  const isLoading = useRef(false);
  useEffect(() => {
    if (isLoading.current || !needRefresh || page !== thisPage) return;

    isLoading.current = true;
    setNeedRefresh(false);

    loadData(DataName.dashboard)
      .then(setDashboard)
      .then(() => loadData(DataName.token))
      .then(generateTokenHistoric)
      .then(() => loadData(DataName.historic))
      .then(setHistoric)
      .catch(console.error)
      .finally(() => (isLoading.current = false));
  }, [needRefresh, setNeedRefresh, page, generateTokenHistoric]);

  const getBarList = useCallback(
    (labels: string[]) => {
      return labels
        .map(label => {
          return getBarData(t[label] ?? label, getValue(dashboard, label).fromCurrency());
        })
        .sort((a, b) => b.value - a.value);
    },
    [getValue, dashboard],
  );

  const getResultData = () => {
    return [
      { category: t.total, total: getValue(dashboard, 'total', 100000), data: getBarList(['Solana', 'Bitcoin', 'Nexo', 'BARK']) },
      { category: t.profit, total: getValue(dashboard, 'profit', 10000), data: getBarList(['transfer cost', 'strategy cost', 'price change', 'charity']) },
    ];
  };

  const isDesktop = useIsMobile(1280);
  const width = useWindowParam().width;
  const isTokenListExpanded = (width > 400 && width < 640) || width > 970;

  const [resultIndex, setResultIndex] = useState(0);
  const [priceIndex, setPriceIndex] = useState(0);

  const changeToken = useCallback(
    (increment = true) => {
      setTimeout(() => {
        setPriceIndex(((priceIndex ? priceIndex : token.length) + (increment ? 1 : -1)) % token.length);
      }, 100);
    },
    [priceIndex, token.length],
  );

  const getColorBasedOnValue = (value) => (value < 0 ? RED_COLOR : GREEN_COLOR);

  return (
    <>
      <Accordion defaultOpen={!isMobileSize()}>
        <AccordionHeader>
          <Flex alignItems="start">
            <div>
              <Title className="text-left">{t.assets}</Title>
              <Metric color={getColorBasedOnValue(parseFloat(getRatio(dashboard, 'price @')))} className={!dashboard.length ? 'blur-sm' : 'animate-unblur'}>
                {getValue(dashboard, 'assets', 500000)}
              </Metric>
            </div>
            <BadgeDelta
              deltaType={
                parseFloat(getRatio(dashboard, 'price @')) < 0
                  ? 'moderateDecrease'
                  : parseFloat(getRatio(dashboard, 'price @')) > 0
                  ? 'moderateIncrease'
                  : 'unchanged'
              }
            >
              {getRatio(dashboard, 'price @')}
            </BadgeDelta>
          </Flex>
        </AccordionHeader>
        <AccordionBody>
          <GainsBar
            values={{
              invested: getValue(dashboard, 'transfered').fromCurrency(),
              profitValue: getValue(dashboard, 'gains').fromCurrency(),
              profitRatio: parseFloat(getRatio(dashboard, 'gains')) / 100,
            }}
            loaded={!!dashboard.length}
          />
        </AccordionBody>
      </Accordion>

      <Grid numItemsSm={2} numItemsLg={getResultData().length} className="gap-6">
        <Accordion defaultOpen={!isMobileSize()}>
          <AccordionHeader>
            <Flex alignItems="start" flexDirection="col">
              <Flex alignItems="start" flexDirection={!isDesktop ? 'row' : 'col'}>
                <Title className="text-left whitespace-nowrap">{t.result}</Title>
                <TabGroup index={resultIndex} onIndexChange={setResultIndex} className="mb-4 xl:mb-0 xl:text-right">
                  <TabList
                    className="float-left xl:float-right"
                    variant={!isDesktop ? 'solid' : 'line'}
                    onClick={e => e.stopPropagation()}
                  >
                    <Tab icon={ChartPieIcon}>{t.total}</Tab>
                    <Tab icon={ListBulletIcon}>{t.profit}</Tab>
                  </TabList>
                </TabGroup>
              </Flex>
              <Flex alignItems="start">
                <Metric
                  color={getColorBasedOnValue(result[resultIndex].total.fromCurrency())}
                  className={!dashboard.length ? 'blur-sm' : 'animate-unblur'}
                >
                  {result[resultIndex].total}
                </Metric>
                <BadgeDelta
                  className="mt-2"
                  deltaType={
                    parseFloat(getRatio(dashboard, 'profit')) < 0
                      ? 'moderateDecrease'
                      : parseFloat(getRatio(dashboard, 'profit')) > 0
                      ? 'moderateIncrease'
                      : 'unchanged'
                  }
                >
                  {getRatio(dashboard, 'profit')}
                </BadgeDelta>
              </Flex>
            </Flex>
          </AccordionHeader>
          <AccordionBody>
            <BarList
              data-testid="bar-chart"
              data={result[resultIndex].data}
              showAnimation={true}
              valueFormatter={(number: number) =>
                (result[resultIndex].data.find(d => d.value === number)?.amount ?? number).toLocaleCurrency()
              }
              className="mt-2"
            />
          </AccordionBody>
        </Accordion>
        <Accordion defaultOpen={!isMobileSize()}>
          <AccordionHeader>
            <Flex alignItems="start" flexDirection="col">
              <Flex alignItems="start" flexDirection={!isDesktop ? 'row' : 'col'}>
                <Title className="text-left">{t.price}</Title>
                <TabGroup
                  index={priceIndex}
                  onIndexChange={isTokenListExpanded ? setPriceIndex : undefined}
                  className="mb-4 xl:mb-0 xl:text-right max-w-[200px]"
                >
                  <TabList
                    className="float-left xl:float-right"
                    variant={!isDesktop ? 'solid' : 'line'}
                    onClick={e => e.stopPropagation()}
                  >
                    <Flex>
                      {token.map((t, i) => (
                        <div
                          className={isTokenListExpanded || priceIndex === i ? 'block' : 'hidden'}
                          key={t.label}
                        >
                          <Flex>
                            <ChevronLeftIcon
                              className={cls('h-4 w-4 mr-2', !isTokenListExpanded ? 'block' : 'hidden')}
                              onClick={() => changeToken(false)}
                            />
                            <Tab onClick={!isTokenListExpanded ? () => changeToken() : undefined}>{t.label}</Tab>
                            <ChevronRightIcon
                              className={cls('h-4 w-4 ml-2', !isTokenListExpanded ? 'block' : 'hidden')}
                              onClick={() => changeToken(true)}
                            />
                          </Flex>
                        </div>
                      ))}
                    </Flex>
                  </TabList>
                </TabGroup>
              </Flex>
              <Flex alignItems="start">
                <Metric color={GREEN_COLOR} className={!token.length ? 'blur-sm' : 'animate-unblur'}>
                  {getValue(token, token.at(priceIndex)?.label)}
                </Metric>
                <BadgeDelta
                  className="mt-2"
                  deltaType={
                    parseFloat(getRatio(token, token.at(priceIndex)?.label)) < 0
                      ? 'moderateDecrease'
                      : parseFloat(getRatio(token, token.at(priceIndex)?.label)) > 0
                      ? 'moderateIncrease'
                      : 'unchanged'
                  }
                >
                  {getRatio(token, token.at(priceIndex)?.label)}
                </BadgeDelta>
              </Flex>
            </Flex>
          </AccordionHeader>
          <AccordionBody>
            <AreaChart
              className="h-44"
              data={tokenHistoric[priceIndex]}
              categories={[t.amount]}
              index="date"
              colors={[
                tokenHistoric.length && tokenHistoric[priceIndex][0].Amount < tokenHistoric[priceIndex][1].Amount
                  ? GREEN_COLOR
                  : RED_COLOR,
              ]}
              valueFormatter={number => number.toFixed(0)}
              yAxisWidth={50}
              showAnimation={true}
              animationDuration={2000}
              curveType="monotone"
              noDataText={t.loading}
              minValue={tokenHistoricLimit?.min ?? 0}
              maxValue={tokenHistoricLimit?.max ?? 0}
              showLegend={false}
              startEndOnly={true}
            />
          </AccordionBody>
        </Accordion>
      </Grid>
      <Accordion className="group" defaultOpen={!isMobileSize()}>
        <AccordionHeader>
          <Title>Performance</Title>
          {historic.length > 1 && (
            <SparkAreaChart
              className="ml-4 h-10 w-[80%] text-center animate-display group-data-[headlessui-state=open]:invisible"
              data={historic.sort((a, b) => a.date - b.date)}
              categories={[t.total]}
              index={'stringDate'}
              colors={['emerald']}
              curveType="monotone"
              noDataText={t.loading}
            />
          )}
        </AccordionHeader>
        <AccordionBody>
          <AreaChart
            className="h-80"
            data={historic.sort((a, b) => a.date - b.date)}
            categories={[t.transfered, t.total]}
            index="stringDate"
            colors={['indigo', 'fuchsia']}
            valueFormatter={number => number.toShortCurrency()}
            yAxisWidth={50}
            showAnimation={true}
            animationDuration={2000}
            curveType="monotone"
            noDataText={t.loading}
          />
        </AccordionBody>
      </Accordion>
    </>
  );
}

export default Portfolio;

