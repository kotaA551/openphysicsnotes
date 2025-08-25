export default function LevelBadge({ level }: { level?: string }) {
const color = level === 'advanced' ? 'bg-fuchsia-600' : level === 'intermediate' ? 'bg-amber-600' : 'bg-emerald-600';
const label = level?.[0]?.toUpperCase() + (level?.slice(1) ?? 'Beginner');
return (
<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${color}`}>
{label}
</span>
);
}