export const metadata = { title: "Privacy Policy — Open Physics Notes" };

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>

      <h2>Overview</h2>
      <p>
        We collect minimal data necessary for basic site analytics.
        Personal data is not sold or shared with third parties except as required to operate analytics and affiliate programs.
      </p>

      <h2>Cookies</h2>
      <p>
        We may use cookies for session preferences, analytics, and affiliate
        tracking links. You can disable cookies in your browser settings.
      </p>

      <h2>Analytics</h2>
      <p>
        If analytics is enabled, page views and aggregated usage metrics may be
        processed to improve content quality.
      </p>
    </article>
  );
}
