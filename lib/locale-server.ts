import { notFound } from 'next/navigation';
import { isLocale } from './i18n';
export function requireLocale(value: string) { if (!isLocale(value) || value === 'en') notFound(); return value; }
