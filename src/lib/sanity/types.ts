export type SanityCmsImage = {
  mode?: string;
  alt?: string;
  // Sanity image asset reference / expanded asset from GROQ
  asset?: unknown;
};

export type SanityPortableBlock = {
  _key?: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{ _key?: string; _type?: string; text?: string }>;
};

export type SanityPostDoc = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  status?: "draft" | "published";
  publishedAt?: string;
  productSlug?: string | null;
  cover?: SanityCmsImage;
  body?: SanityPortableBlock[];
};

export type SanityLandingDoc = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    image?: SanityCmsImage;
  };
  featured?: {
    heading?: string;
    intro?: string;
    items?: Array<{
      _key?: string;
      productSlug?: string;
      headline?: string;
      image?: SanityCmsImage;
    }>;
  };
  testimonials?: {
    heading?: string;
    intro?: string;
    items?: Array<{
      _key?: string;
      quote?: string;
      name?: string;
      role?: string;
      company?: string;
    }>;
  };
  faq?: {
    heading?: string;
    intro?: string;
    items?: Array<{
      _key?: string;
      question?: string;
      answer?: string;
    }>;
  };
  lead?: {
    heading?: string;
    intro?: string;
    note?: string;
    submitLabel?: string;
  };
};
