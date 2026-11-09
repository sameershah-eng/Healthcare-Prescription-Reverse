import { Currency } from '../types';

export const ZIG_EXCHANGE_RATE = 26.0; // 1 USD = 26 ZiG

export function formatPrice(amountUSD: number, currency: Currency): string {
  if (currency === 'ZiG') {
    const zigAmount = (amountUSD * ZIG_EXCHANGE_RATE).toFixed(2);
    return `ZiG ${zigAmount}`;
  }
  return `US$${amountUSD.toFixed(2)}`;
}

export function formatDate(timestampOrStr: number | string): string {
  if (typeof timestampOrStr === 'string') return timestampOrStr;
  const d = new Date(timestampOrStr);
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
