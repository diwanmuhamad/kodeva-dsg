import type { Post } from "@/lib/cms/schema";

export function publishedPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function findPublished(posts: Post[], slug: string): Post | undefined {
  return publishedPosts(posts).find((post) => post.slug === slug);
}
