export const landingQuery = `*[_type == "landingPage" && _id == "landingPage"][0]{
  hero{
    eyebrow,
    title,
    subtitle,
    ctaLabel,
    ctaHref,
    image{
      mode,
      alt,
      asset
    }
  },
  featured{
    heading,
    intro,
    items[]{
      _key,
      productSlug,
      headline,
      image{ mode, alt, asset }
    }
  },
  testimonials{
    heading,
    intro,
    items[]{ _key, quote, name, role, company }
  },
  faq{
    heading,
    intro,
    items[]{ _key, question, answer }
  },
  lead{ heading, intro, note, submitLabel }
}`;

export const postsQuery = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  status,
  publishedAt,
  productSlug,
  cover{ mode, alt, asset },
  body
}`;
