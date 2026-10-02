import { person } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-data text-muted">
          © {new Date().getFullYear()} {person.name}
        </p>
        <p className="t-data text-muted">Built with Next.js and Tailwind CSS</p>
        <a
          href="#top"
          className="btn t-data inline-flex rounded-md px-2 py-1 text-muted hover:text-fg"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
