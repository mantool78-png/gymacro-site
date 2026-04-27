import Link from "next/link";
import type { Article, DisciplineSlug } from "@/lib/mock-data";
import { disciplineAccents } from "@/lib/mock-data";

interface DocumentsAndChecklistsProps {
  documents: Article[];
  checklists: Article[];
  disciplineSlug: DisciplineSlug;
}

function DocIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

export function DocumentsAndChecklists({
  documents,
  checklists,
  disciplineSlug,
}: DocumentsAndChecklistsProps) {
  if (!documents.length && !checklists.length) return null;

  const accent = disciplineAccents[disciplineSlug];

  return (
    <section className="border-b border-zinc-100 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Документы */}
          {documents.length > 0 && (
            <div>
              <h2
                className="mb-4 flex items-center gap-2 font-display text-lg font-bold tracking-tight"
                style={{ color: accent.gradFrom }}
              >
                <DocIcon />
                Документы и правила
              </h2>
              <ul className="flex flex-col gap-2">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <Link
                      href={`/posts/${doc.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 transition hover:border-zinc-200 hover:bg-white hover:shadow-sm"
                    >
                      <span style={{ color: accent.gradFrom }}>
                        <DocIcon />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900">
                          {doc.title}
                        </p>
                        {doc.excerpt && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{doc.excerpt}</p>
                        )}
                      </div>
                      <svg
                        className="ml-auto h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-500 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Чек-листы */}
          {checklists.length > 0 && (
            <div>
              <h2
                className="mb-4 flex items-center gap-2 font-display text-lg font-bold tracking-tight"
                style={{ color: accent.gradFrom }}
              >
                <ChecklistIcon />
                Чек-листы и гайды
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {checklists.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/posts/${item.slug}`}
                      className="group flex items-start gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 transition hover:border-zinc-200 hover:bg-white hover:shadow-sm"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: accent.soft }}
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          style={{ color: accent.gradFrom }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <p className="text-sm font-medium leading-snug text-zinc-800 group-hover:text-zinc-900">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
