// constants.ts
export const EMAIL: string = 'contact@barkprotocol.net';
export const TRANSACTION_TIME_OUT: number = 60; // Time out in seconds
export const IS_LOCAL: boolean = !process.env.NEXT_PUBLIC_VERCEL_ENV;

/**
 * Formats a date object into a string representation in the format "YYYY-MM-DD" based on the precision value.
 * @param date - The date object to be formatted. If not provided, the current date is used.
 * @param precision - An integer value indicating the level of precision in the formatted date. The default value is 3.
 * @returns A formatted string representing the date in the format "YYYY-MM-DD" based on the precision value.
 */
export const getFormattedDate = (date: Date = new Date(), precision: number = 3): string => {
  if (!isNaN(date.getTime())) {
    return (
      date.getFullYear() +
      (precision > 1 ? '-' + ('0' + (date.getMonth() + 1)).slice(-2) : '') +
      (precision > 2 ? '-' + ('0' + date.getDate()).slice(-2) : '')
    );
  }
  return '';
};

export const cls = (...classes: string[]): string => classes.filter(Boolean).join(' ');

// solana.ts
import { PublicKey, clusterApiUrl } from '@solana/web3.js';

export const TOKEN_PATH: string = 'https://raw.githubusercontent.com/bark-community/bark-token/main/';
export const MEMO_PROGRAM_ID: PublicKey = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
export const IS_DEV: boolean = process.env.NEXT_PUBLIC_IS_DEV === 'true';
export const SPL_TOKEN: PublicKey = new PublicKey(
  IS_DEV ? 'BARKPp4yRWtcLhwMryz889TK2kV2aWP4jqCaRKnHLaLj' : 'BARKZV4nBBm21Ha47RAW3nYzSU9FpnMNSHxRp7P4FGJ3'
);
export const ENDPOINT: string =
  IS_DEV ? clusterApiUrl('devnet') : process.env.NEXT_PUBLIC_CLUSTER_ENDPOINT || 'https://solana-mainnet.rpc.extrnode.com';

export const getShortAddress = (address: string): string => address.slice(0, 4) + '...' + address.slice(-4);
