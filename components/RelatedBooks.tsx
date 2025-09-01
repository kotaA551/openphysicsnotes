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
      <h2 className="text-lg mb-4">Further Reading</h2>
      <ul className="flex flex-col flex-wrap gap-6">
        {items.map((book, i) => (
          <li key={i}>
            <a href={book.href} target="_blank" rel="noopener noreferrer" className="block no-underline">
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="mb-2 w-full h-auto object-contain"
                />
              )}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p className="font-semibold hover:opacity-80">{book.title}</p>
              {book.author && (
                <p className="text-sm">{book.author}</p>
              )}
              {book.note && (
                <p className="text-md">{book.note}</p>
              )}
            </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
