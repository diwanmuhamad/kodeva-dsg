import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleView } from "@/components/article-view";
import { getCms } from "@/lib/cms/content";
import { findPublished, publishedPosts } from "@/lib/cms/posts";
import { getProduct } from "@/lib/products";

/** Allow soft navigation while the article shell streams params + CMS data. */
export const instant = false;

export async function generateStaticParams() {
  const cms = await getCms();
  return publishedPosts(cms.posts).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCms();
  const post = findPublished(cms.posts, slug);
  if (!post) return { title: "Artikel tidak ditemukan" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-muted">Memuat artikel...</p>}>
      <BlogArticle params={params} />
    </Suspense>
  );
}

async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cms = await getCms();
  const post = findPublished(cms.posts, slug);
  if (!post) notFound();
  const product = post.productSlug ? getProduct(post.productSlug) : undefined;
  return <ArticleView post={post} product={product} />;
}
