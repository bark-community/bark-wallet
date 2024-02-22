import { Keypair } from '@solana/web3.js';
import { DashboardToken, Historic } from '../pages/dashboard';
import { Portfolio, PortfolioToken, UserHistoric } from '../pages/portfolio';
import { Transaction } from '../pages/transactions';
import { DBUser } from '../pages/users';
import { Data } from './types';

// Define error classes
class MissingDataError extends Error {
  name = 'MissingDataError';
  message = 'missing data';
}

class WrongDataPatternError extends Error {
  name = 'WrongDataPatternError';
  message = 'wrong data pattern';
}

export class UserNotFoundError extends Error {
  name = 'UserNotFoundError';
  message = 'user not found';
  constructor(email: string | undefined) {
    super(`user not found: ${email}`, { cause: email });
  }
}

export enum DataName {
  dashboard = 'Dashboard',
  historic = 'Historic',
  token = 'Token',
  portfolio = 'Portfolio',
  userHistoric = 'UserHistoric',
  transactions = 'Transactions',
}

// Set a value that return all parameters needed to process data (convertFunction, hasFilter, minColInRow, minColInHeader)
type Parameter = {
  convert: (item: string[]) => any;
  range: string;
  isHeaderLess?: boolean;
  minColInRow?: number;
};

// Define constants
const MAX_ROW_VALUE = 100000;

// Define parameters for each data name
const dataNameParameters = new Map<DataName, Parameter>([
  [DataName.dashboard, { convert: convertDashboardData, range: 'A:D' }],
  [DataName.historic, { convert: convertHistoricData, range: 'A:L' }],
  [DataName.token, { convert: convertTokenData, range: 'A:I', minColInRow: 4 }],
  [DataName.portfolio, { convert: convertPortfolioData, range: 'A:M' }],
  [DataName.userHistoric, { convert: convertUserHistoricData, range: 'A:I' }],
  [DataName.transactions, { convert: convertTransactionsData, range: 'A:H' }],
]);

// Cache for data
const dataCache = new Map<DataName, { data: any[]; expire: number }>();

// Function to get public key
export function getPublicKey() {
  let publicKey = localStorage.getItem('PublicKey') || '';
  if (!publicKey) {
    publicKey = Keypair.generate().publicKey.toString();
    localStorage.setItem('PublicKey', publicKey);
  }
  return publicKey;
}

// Function to load data
export async function loadData(name: DataName | string) {
  if (!navigator.onLine) throw new Error('The web app is offline');

  const dataName = Object.values(DataName).find((value) => value === name) || DataName.userHistoric;
  const parameter = dataNameParameters.get(dataName);

  if (!parameter) throw new Error('data name not found');

  const cache = dataCache.get(dataName);
  let data = cache?.data || [];

  if (!cache?.data.length || (cache.expire < Date.now())) {
    data = await cacheData(name, dataName, parameter);
  }

  if (!data) throw new Error('data not loaded');

  return data;
}

// Function to force data loading
export async function forceData(name: DataName | string) {
  let data: any[] = [];
  while (!data.length) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    data = await loadData(name);
  }
  return data;
}

// Function to clear data cache
export function clearData() {
  [DataName.userHistoric].forEach(name => {
    dataCache.set(name, { data: [], expire: 0 });
  });
}

// Function to cache data
async function cacheData(sheetName: string, dataName: DataName, parameter: Parameter) {
  const numberOfColumns = getNumberOfColumns(parameter.range);

  const data = (await fetchData(sheetName, parameter.range, parameter.isRaw))
    ?.filter((_, i) => (parameter.isHeaderLess ? true : i !== 0))
    .map(item => {
      checkColumn(item, parameter.minColInRow ?? numberOfColumns);
      return parameter.convert(item);
    }) || [];

  dataCache.set(dataName, { data, expire: Date.now() + 1000 * 60 });

  return data;
}

// Function to fetch data from API
async function fetchData(sheetName: string, range: string, isRaw?: boolean) {
  try {
    const result = await fetch(`./api/spreadsheet?sheetName=${sheetName}&range=${range}&isRaw=${isRaw ?? false}`);
    if (result.ok) {
      const data = await result.json();
      checkData(data, getNumberOfColumns(range));
      return data.values;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof WrongDataPatternError) {
      return;
    }
    return undefined;
  }
}

// Function to check data integrity
function checkData(data: any, minCol: number, maxCol = minCol, minRow = 1, maxRow = MAX_ROW_VALUE) {
  if (!data) throw new Error('data not fetched');
  if (data.error) throw new Error(data.error);
  if (!data.values?.length) throw new MissingDataError();
  if (
    data.values &&
    (data.values.length < minRow ||
      data.values.length > maxRow ||
      data.values[0].length < minCol ||
      data.values[0].length > maxCol)
  )
    throw new WrongDataPatternError();
}

// Function to check minimum column in a row
function checkColumn(item: any[], minCol: number) {
  if (item.length < minCol) throw new WrongDataPatternError();
}

// Function to convert dashboard data
function convertDashboardData(item: string[]): Data {
  return {
    label: String(item.at(0)).trim(),
    value: Number(item.at(2)),
    ratio: Number(item.at(3)),
  };
}

// Function to convert token data
function convertTokenData(item: string[]): DashboardToken & PortfolioToken {
  return {
    symbol: String(item.at(0)).trim(),
    label: String(item.at(1)).trim(),
    value: Number(item.at(3)),
    available: Number(item.at(4)),
    ratio: Number(item.at(6)),
    duration: Number(item.at(8)),
  };
}

// Function to convert historic data
function convertHistoricData(item: string[]): Historic {
  return {
    date: Number(item.at(0)),
    stringDate: Number(item.at(0)).toLocaleDateString(),
    Investi: Number(item.at(1)),
    Trésorerie: Number(item.at(5)),
  };
}

// Function to convert portfolio data
function convertPortfolioData(item: string[]): Portfolio & DBUser {
  return {
    id: Number(item.at(0)),
    name: String(item.at(1)).trim(),
    address: String(item.at(2)).trim(),
    ispublic: String(item.at(3)).trim() === 'true',
    token: [Number(item.at(4)), Number(item.at(5)), Number(item.at(6))],
    total: Number(item.at(7)),
    invested: Number(item.at(8)),
    profitValue: Number(item.at(9)),
    profitRatio: Number(item.at(10)),
    yearlyYield: Number(item.at(11)),
    solProfitPrice: Number(item.at(12)),
  };
}

// Function to convert user historic data
function convertUserHistoricData(item: string[]): UserHistoric {
  return {
    date: Number(item.at(0)),
    stringDate: Number(item.at(0)).toLocaleDateString(),
    Investi: Number(item.at(2)),
    Total: Number(item.at(8)),
  };
}

// Function to convert transactions data
function convertTransactionsData(item: string[]): Transaction {
  return {
    id: Number(item.at(0)),
    date: new Date(String(item.at(1)).trim()),
    userid: Number(item.at(2)),
    address: String(item.at(3)).trim(),
    movement: Number(item.at(4)),
    cost: Number(item.at(5)),
    token: String(item.at(6)).trim(),
    amount: Number(item.at(7)),
  };
}

// Function to get the number of columns from a range
function getNumberOfColumns(range: string): number {
  const [start, end] = range.split(':').map(columnNameToNumber);
  return end - start + 1;
}

// Function to convert a column name to a number
function columnNameToNumber(columnName: string): number {
  return columnName.split('').reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);
}
