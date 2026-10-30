import Link from "next/link";
import { Suspense } from "react";

import { CmsImage } from "@/components/cms-image";
import { Pagination } from "@/components/pagination";
import { getCms } from "@/lib/cms/content";
import { publishedPosts } from "@/lib/cms/posts";
import { formatDate } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { firstQuery, pageNumber, paginate } from "@/lib/query";

export const metadata = {
  title: "Blog",
  description: "Artikel promo, operasional, SDM, dan keuangan dari Kodeva.",
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-muted">Memuat artikel...</p>}>
      <BlogIndex searchParams={searchParams} />
    </Suspense>
  );
}

async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const query = await searchParams;
  const cms = await getCms();
  const page = paginate(publishedPosts(cms.posts), pageNumber(firstQuery(query.page)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl md:text-5xl">Blog</h1>
      <p className="mt-3 max-w-2xl text-muted">Artikel yang sudah terbit. Draf hanya bisa dilihat dari studio.</p>
      {page.items.length === 0 ? (
        <p className="mt-8">Belum ada artikel.</p>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {page.items.map((post) => {
            const product = post.productSlug ? getProduct(post.productSlug) : undefined;
            return (
              <article key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-[1.75rem] border border-line bg-card p-3 transition hover:border-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                >
                  <CmsImage
                    src={post.cover}
                    alt={post.coverAlt}
                    productName={product?.name}
                    category={product?.category}
                    frameClassName="aspect-[16/9] rounded-[1.25rem]"
                  />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-forest">{post.category}</p>
                  <h2 className="mt-1 text-2xl">{post.title}</h2>
                  <p className="mt-2 text-sm text-muted">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
                </Link>
              </article>
            );
          })}
        </div>
      )}
      <Pagination page={page.current} totalPages={page.totalPages} />
    </div>
  );
}
