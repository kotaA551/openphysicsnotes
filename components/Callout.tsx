import { clsx } from 'clsx';


export default function Callout({ type = 'info', children }: { type?: 'info' | 'warn' | 'success'; children: React.ReactNode }) {
const base = 'my-4 rounded-xl border p-4';
const styles = {
info: 'border-blue-200 bg-blue-50',
warn: 'border-amber-200 bg-amber-50',
success: 'border-emerald-200 bg-emerald-50',
} as const;
return <div className={clsx(base, styles[type])}>{children}</div>;
}