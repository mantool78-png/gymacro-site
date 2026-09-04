import Link from "next/link";

export type RelatedPostLink = {
  slug: string;
  title: string;
};

export function RelatedPosts({ posts }: { posts: RelatedPostLink[] }) {
  if (!posts.length) return null;

  return (
    <nav
      className="mt-10 rounded-2xl border border-zinc-200/80 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8"
      aria-labelledby="related-posts-heading"
    >
      <h2
        id="related-posts-heading"
        className="font-display text-lg font-bold tracking-tight text-zinc-900 md:text-xl"
      >
        Читайте также
      </h2>
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-[15px] font-medium text-violet-700 underline decoration-violet-200 underline-offset-3 transition hover:text-violet-900 hover:decoration-violet-400"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
