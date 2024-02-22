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
import { useCallback, useEffect, useRef, useState } from 'react';
import GainsBar from '../components/GainsBar';
import { Page, useNavigation } from '../hooks/useNavigation';
import { useWindowParam } from '../hooks/useWindowParam';
import { getBarData } from '../utils/chart';
import { cls } from '../utils/constants';
import { isMobileSize, useIsMobile } from '../utils/mobile';
import { loadData } from '../utils/processData';
import { Data, DataName, Dataset, Filter } from '../utils/types';
import { getRatio, getValue } from '../utils/dataUtils';

// ... (other imports)

const tokenValueStart = 100;
const GREEN_COLOR = 'green';
const RED_COLOR = 'red';

export interface DashboardToken extends Data {
  available: number;
  duration: number;
}

interface TokenHistoric {
  date: string;
  Amount: number;
}

// ... (other constants and utility functions)

export default function Dashboard() {
  // ... (other state hooks and variables)

  const findValue = useCallback((data: Data[], label: string | undefined) => {
    return label ? data.find(d => d.label.toLowerCase().includes(label.toLowerCase())) : undefined;
  }, []);

  const generateTokenHistoric = useCallback(
    (token: DashboardToken[]) => {
      token = token.filter(({ label, available }) => available && label !== 'Euro');

      setToken(token);

      let min = tokenValueStart;
      let max = tokenValueStart;
      const tokenHistoric: TokenHistoric[][] = [];
      token.forEach(t => {
        // ... (other logic for generating token historic)
      });
      setTokenHistoric(tokenHistoric);
      setTokenHistoricLimit({
        min: min,
        max: max,
      });
    },
    [getRatio],
  );

  // ... (other useEffect and functions)

  const getColorBasedOnValue = (value: number) => (value < 0 ? RED_COLOR : GREEN_COLOR);

  return (
    <>
      {/* ... (other components) */}

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
          {/* ... (other components) */}
        </AccordionBody>
      </Accordion>

      <Grid numItemsSm={2} numItemsLg={getResultData().length} className="gap-6">
        <Accordion defaultOpen={!isMobileSize()}>
          <AccordionHeader>
            <Flex alignItems="start" flexDirection="col">
              <Flex alignItems="start" flexDirection={!isDesktop ? 'row' : 'col'}>
                <Title className="text-left whitespace-nowrap">{t.result}</Title>
                <TabGroup index={resultIndex} onIndexChange={setResultIndex} className="mb-4 xl:mb-0 xl:text-right">
                  {/* ... (other components) */}
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
            {/* ... (other components) */}
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
                  {/* ... (other components) */}
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
            {/* ... (other components) */}
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
          {/* ... (other components) */}
        </AccordionBody>
      </Accordion>
    </>
  );
}
