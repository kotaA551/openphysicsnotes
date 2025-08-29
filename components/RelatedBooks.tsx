type Book = { title: string; author?: string; href: string; note?: string };

export default function RelatedBooks({ items }: { items: Book[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Further Reading</h2>
      <ul className="mt-3 grid gap-3">
        {items.map((b) => (
          <li key={b.href} className="border rounded-lg p-4 hover:bg-black/[0.02]">
            <a className="font-medium underline" href={b.href} target="_blank" rel="noopener noreferrer">
              {b.title}
            </a>
            {b.author && <span className="block text-sm text-black/70">{b.author}</span>}
            {b.note && <p className="mt-1 text-sm text-black/80">{b.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
