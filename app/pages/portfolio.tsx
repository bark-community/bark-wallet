import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AreaChart,
  BadgeDelta,
  Flex,
  Metric,
  SparkAreaChart,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Title,
} from '@tremor/react';
import GainsBar from '../components/gainsBar';
import { Page, useNavigation } from '../hooks/useNavigation';
import { useUser } from '../hooks/useUser';
import { TOKEN_PATH } from '../utils/constants';
import { isMobileSize } from '../utils/mobile';
import { loadData, forceData } from '../utils/processData';
import { DataName, Dataset } from '../utils/types';

// Import functions from dataService and portfolioUtils
import { loadTokens, loadPortfolioData, loadUserAssets } from '../utils/dataService';
import { calculatePortfolioValues, createWalletFromTokens } from '../utils/portfolioUtils';

const dataset: Dataset = {
  // ... (unchanged)
};

const Portfolio = () => {
  const { user } = useUser();
  const { page, needRefresh, setNeedRefresh } = useNavigation();

  const [wallet, setWallet] = useState<Wallet[] | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [historic, setHistoric] = useState<UserHistoric[]>([]);

  const fetchData = async () => {
    if (!user || !needRefresh || page !== thisPage) return;

    setNeedRefresh(false);

    try {
      await loadTokens();
      const portfolioData = await loadPortfolioData(user);
      const userAssets = await loadUserAssets(user);

      const { tokens, portfolio } = calculatePortfolioValues(userAssets, portfolioData);

      setWallet(createWalletFromTokens(tokens, portfolio));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, user]);

  const renderGainsBar = () => (!portfolio || portfolio.invested ? <GainsBar values={portfolio} loaded={!!portfolio} /> : null);

  const renderWalletTable = () => (
    <Table>
      <TableBody>
        {wallet?.map(asset => (
          <TableRow
            key={asset.name}
            className="hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-subtle"
          >
            <TableCell>
              <Image
                className="rounded-full"
                src={asset.image}
                alt={dataset.tokenLogo}
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
  );

  const renderLoadingSkeleton = () => (
    <Table>
      <TableBody>
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
  );

  const renderPerformanceAccordion = () => (
    <Accordion className="group" defaultOpen={!isMobileSize()}>
      <AccordionHeader>
        <Title>Performance</Title>
        {historic.length > 1 && (
          <Flex className="w-full" justifyContent="center">
            <SparkAreaChart
              data={historic.sort((a, b) => a.date - b.date)}
              categories={[dataset.total]}
              index={'stringDate'}
              colors={['emerald']}
              className="ml-4 h-10 w-[80%] text-center animate-display group-data-[headlessui-state=open]:invisible"
              curveType="monotone"
              noDataText={dataset.loading}
            />
          </Flex>
        )}
      </AccordionHeader>
      <AccordionBody>
        <AreaChart
          className="h-80"
          data={historic.sort((a, b) => a.date - b.date)}
          categories={[dataset.transfered, dataset.total]}
          index="stringDate"
          colors={['indigo', 'fuchsia']}
          valueFormatter={number => number.toShortCurrency()}
          yAxisWidth={50}
          showAnimation={true}
          animationDuration={2000}
          curveType="monotone"
          noDataText={dataset.loading}
          minValue={minHisto}
          maxValue={maxHisto}
        />
      </AccordionBody>
    </Accordion>
  );

  return (
    <>
      <Accordion defaultOpen={true}>
        {/* ... (unchanged) */}
        <AccordionBody>
          {renderGainsBar()}
          {wallet ? renderWalletTable() : renderLoadingSkeleton()}
        </AccordionBody>
      </Accordion>

      {(!portfolio || portfolio?.invested) && renderPerformanceAccordion()}
    </>
  );
};

export default Portfolio;
