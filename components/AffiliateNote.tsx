export default function AffiliateNote({ text = 'This section may contain affiliate links. If you purchase through these links, Open Physics Notes may earn a commission at no extra cost to you.' }: { text?: string }) {
 return <aside className="translation-notice"><p>{text}</p></aside>;
}
