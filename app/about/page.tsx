export const metadata = { title: "About — Open Physics Notes" };

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>About</h1>
      <p>
        Open Physics Notes is an open, free set of lecture-style notes covering
        undergraduate through frontier topics in physics. The goal is clarity,
        rigor, and accessibility.
      </p>
      <h2>Editorial Policy</h2>
      <p>
        Equations are typeset with LaTeX/KaTeX. References are added where
        appropriate. Corrections and suggestions are welcome.
      </p>
    </article>
  );
}
