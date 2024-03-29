import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AreaChart,
  BadgeDelta,
  Divider,
  Flex,
  Metric,
  SparkAreaChart,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Title,
} from '@tremor/react';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import GainsBar from '../components/gainsBar';
import { Page, useNavigation } from '../hooks/useNavigation';
import { useUser } from '../hooks/useUser';
import { TOKEN_PATH } from '../utils/constants';
import { isMobileSize } from '../utils/mobile';
import { DataName, forceData, loadData } from '../utils/processData';
import { Data, Dataset } from '../utils/types';

// Translation of data names
const t: Dataset = {
  totalValue: 'Total Value',
  assets: 'Assets',
  emptyPortfolio: 'No assets found',
  dataLoading: 'Loading data...',
  tokenLogo: 'Token Logo',
  total: 'Total',
  transfered: 'Invested',
  loading: 'Loading...',
};

export interface PortfolioToken extends Data {
  symbol: string;
}

interface Asset {
  name: string;
  symbol: string;
  balance: number;
}

export interface Portfolio {
  id: number;
  address: string;
  token: number[];
  total: number;
  invested: number;
  profitValue: number;
  profitRatio: number;
  yearlyYield: number;
  solProfitPrice: number;
}

interface Wallet {
  image: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  total: number;
}

export interface UserHistoric {
  date: number;
  stringDate: string;
  Investi: number;
  Total: number;
}

// Current page
const thisPage = Page.Portfolio;

export default function Portfolio() {
  // Hooks for user and navigation
  const { user } = useUser();
  const { page, needRefresh, setNeedRefresh } = useNavigation();

  // States for portfolio information
  const [wallet, setWallet] = useState<Wallet[]>();
  const [portfolio, setPortfolio] = useState<Portfolio>();
  const [historic, setHistoric] = useState<UserHistoric[]>([]);

  // Function to load assets
  const loadAssets = async (address: string, hasFiMsToken: boolean) => {
    try {
      const result = await fetch(
        `/api/solana/getAssets?address=${address}${hasFiMsToken ? '&creator=CCLcWAJX6fubUqGyZWz8dyUGEddRj8h4XZZCNSDzMVx4' : ''}`
      );
      if (!result.ok) throw new Error('Failed to fetch assets');

      const tokens: Asset[] = await result.json();
      return tokens;
    } catch (error) {
      console.error(error);
    }
  };

  // Ref to track loading state
  const isLoading = useRef(false);

  // Effect to load data
  useEffect(() => {
    if (!user || isLoading.current || !needRefresh || page !== thisPage) return;

    isLoading.current = true;
    setNeedRefresh(false);

    loadData(DataName.token)
      .then((tokens: PortfolioToken[]) =>
        loadData(DataName.portfolio)
          .then(async (data: Portfolio[]) => {
            if (!data.length) data = await forceData(DataName.portfolio);
            if (!tokens.length) tokens = await forceData(DataName.token);

            const p = data.find(d => d.id === user.id) ?? {
              id: user.id,
              address: user.address,
              token: [],
              total: 0,
              invested: 0,
              profitValue: 0,
              profitRatio: 0,
              yearlyYield: 0,
              solProfitPrice: 0,
            };
            const assets = await loadAssets(user.address, !!p.total);
            if (assets?.length) {
              p.total = assets.reduce(
                (a, b) => a + (b.balance ?? 0) * (tokens.find(t => t.label === b.name)?.value ?? 0),
                0,
              );
              p.profitValue = p.total - p.invested;
              p.profitRatio = p.invested ? p.profitValue / p.invested : 0;
              p.token = tokens.map(t => assets.find(a => a.name === t.label)?.balance ?? 0);
            }
            setPortfolio(p);

            setWallet(
              tokens
                .map((t, i) => ({
                  image: TOKEN_PATH + t.label.replaceAll(' ', '') + '.png',
                  name: t.label,
                  symbol: t.symbol,
                  balance: p.token[i],
                  value: t.value,
                  total: p.token[i] * t.value,
                }))
                .filter(t => t.balance)
                .sort((a, b) => b.total - a.total),
            );
          })
          .catch(console.error),
      )
      .then(() => loadData(user.name))
      .then(setHistoric)
      .catch(console.error)
      .finally(() => (isLoading.current = false));
  }, [needRefresh, setNeedRefresh, page, user]);

  // Memo for min and max values of historic data
  const { minHisto, maxHisto } = useMemo(() => {
    const minHisto = Math.min(...[...historic.map(d => d.Investi), ...historic.map(d => d.Total)]).toDecimalPlace(
      3,
      'down',
    );
    const maxHisto = Math.max(...[...historic.map(d => d.Investi), ...historic.map(d => d.Total)]).toDecimalPlace(
      3,
      'up',
    );

    return { minHisto, maxHisto };
  }, [historic]);

  return (
    <>
      {/* Portfolio Overview */}
      <Accordion defaultOpen={true}>
        <AccordionHeader>
          <Flex alignItems="start">
            <div>
              <Title className="text-left">{t.totalValue}</Title>
              <Metric color="green" className={!portfolio ? 'blur-sm' : 'animate-unblur'}>
                {(portfolio?.total ?? 0).toLocaleCurrency()}
              </Metric>
            </div>
            <BadgeDelta
              className={portfolio?.yearlyYield ? 'visible' : 'hidden'}
              deltaType={
                portfolio && portfolio?.yearlyYield < 0
                  ? 'moderateDecrease'
                  : portfolio && portfolio?.yearlyYield > 0
                    ? 'moderateIncrease'
                    : 'unchanged'
              }
            >
              {(portfolio?.yearlyYield ?? 0).toRatio()}
            </BadgeDelta>
          </Flex>
        </AccordionHeader>
        <AccordionBody>
          {/* Gains Bar */}
          {!portfolio || portfolio.invested ? <GainsBar values={portfolio} loaded={!!portfolio} /> : null}
          {/* Wallet Table */}
          {!wallet || wallet.length ? <Divider style={{ fontSize: 18 }}>{t.assets}</Divider> : null}

          {wallet ? (
            <Table>
              <TableBody>
                {wallet.map(asset => (
                  <TableRow
                    key={asset.name}
                    className="hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-subtle"
                  >
                    <TableCell>
                      <Image
                        className="rounded-full"
                        src={asset.image}
                        alt={t.tokenLogo}
                        width={50}
                        height={50}
                      ></Image>
                    </TableCell>
                    <TableCell>
                      <Flex justifyContent="between">
                        <div className="text-xl truncate">{asset.name}</div>
                        <div>{`${asset.balance.toShortFixed()} ${asset.symbol}`}</div>
                      </Flex>
                      <Flex justifyContent="between">
                        <div>{asset.value ? asset.value.toLocaleCurrency() : ''}</div>
                        <div className="font-bold text-lg">{asset.total.toLocaleCurrency()}</div>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableBody>
                {/* Loading Skeleton */}
                <TableRow className="animate-pulse">
                  <TableCell>
                    <div className="rounded-full w-[50px] h-[50px] bg-tremor-border"></div>
                  </TableCell>
                  <TableCell>
                    <Flex justifyContent="between">
                      <div className="bg-tremor-border w-24 h-7 mb-1 rounded-md"></div>
                      <div className="bg-tremor-border w-10 h-5 mb-1 rounded-md"></div>
                    </Flex>
                    <Flex justifyContent="between">
                      <div className="bg-tremor-border w-16 h-5 mb-1 rounded-md"></div>
                      <div className="bg-tremor-border w-24 h-7 mb-1 rounded-md"></div>
                    </Flex>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </AccordionBody>
      </Accordion>

      {/* Performance Section */}
      {!portfolio || portfolio?.invested ? (
        <Accordion className="group" defaultOpen={!isMobileSize()}>
          <AccordionHeader>
            <Title>Performance</Title>
            {historic.length > 1 && (
              <Flex className="w-full" justifyContent="center">
                {/* Performance Chart */}
                <SparkAreaChart
                  data={historic.sort((a, b) => a.date - b.date)}
                  categories={[t.total]}
                  index={'stringDate'}
                  colors={['emerald']}
                  className="ml-4 h-10 w-[80%] text-center animate-display group-data-[headlessui-state=open]:invisible"
                  curveType="monotone"
                  noDataText={t.loading}
                />
              </Flex>
            )}
          </AccordionHeader>
          <AccordionBody>
            {/* Historical Performance Area Chart */}
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
              minValue={minHisto}
              maxValue={maxHisto}
            />
          </AccordionBody>
        </Accordion>
      ) : null}
    </>
  );
}

