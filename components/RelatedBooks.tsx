type BookItem = {
  title: string;
  author?: string;
  note?: string;
  href: string;
  image?: string;
};

export default function RelatedBooks({ items }: { items: BookItem[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-4">Further Reading</h2>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((book, i) => (
          <li key={i} className="border rounded p-3 hover:shadow">
            <a href={book.href} target="_blank" rel="noopener noreferrer" className="block">
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="mb-2 w-full h-auto object-contain"
                />
              )}
              <p className="font-semibold">{book.title}</p>
              {book.author && <p className="text-sm text-gray-600">{book.author}</p>}
              {book.note && <p className="text-xs text-gray-500">{book.note}</p>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
