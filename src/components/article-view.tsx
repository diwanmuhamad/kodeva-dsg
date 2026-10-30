import Link from "next/link";

import { CmsImage } from "@/components/cms-image";
import { CopyLink } from "@/components/copy-link";
import type { Post } from "@/lib/cms/schema";
import { categoryLabel, minMonthlyPrice } from "@/lib/catalog-query";
import { formatDate, formatIdr } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ArticleBody({ blocks }: { blocks: Post["body"] }) {
  return (
    <div className="grid gap-4">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return (
            <h2 key={block.id} className="text-3xl">
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={block.id} className="list-disc space-y-2 pl-5 leading-7">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={block.id} className="text-lg leading-8">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export function ArticleView({
  post,
  product,
}: {
  post: Post;
  product?: Product;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">{post.category}</p>
      <h1 className="mt-2 text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
      <div className="mt-6">
        <CmsImage
          src={post.cover}
          alt={post.coverAlt}
          productName={product?.name}
          category={product?.category}
          priority
        />
      </div>
      <p className="mt-6 text-lg leading-8 text-muted">{post.excerpt}</p>
      <div className="mt-8">
        <ArticleBody blocks={post.body} />
      </div>
      {product ? (
        <aside className="mt-10 rounded-[1.75rem] border border-line bg-card p-5">
          <p className="text-sm font-semibold text-forest">Produk di katalog</p>
          <h2 className="mt-1 text-2xl">{product.name}</h2>
          <p className="mt-2 text-sm text-muted">{product.summary}</p>
          <p className="mt-2 text-sm font-semibold">
            {categoryLabel(product.category)} · mulai {formatIdr(minMonthlyPrice(product))}
          </p>
          <Link href={`/produk/${product.slug}`} className="mt-4 inline-flex min-h-11 items-center font-semibold text-forest">
            Lihat harga dan kuota
          </Link>
        </aside>
      ) : null}
      <div className="mt-8">
        <CopyLink path={`/blog/${post.slug}`} />
      </div>
    </article>
  );
}
