import Link from "next/link";

import { CmsImage } from "@/components/cms-image";
import { LeadForm } from "@/components/lead-form";
import { TrackedLink } from "@/components/tracked-link";
import { primaryButtonClass } from "@/components/styles";
import type { LandingContent } from "@/lib/cms/schema";
import { categoryLabel } from "@/lib/catalog-query";
import { formatIdr } from "@/lib/format";

export type FeaturedCard = {
  id: string;
  headline: string;
  image: string;
  imageAlt: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  quota: number;
};

export function LandingView({
  landing,
  featured,
}: {
  landing: LandingContent;
  featured: FeaturedCard[];
}) {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">{landing.hero.eyebrow}</p>
          <h1 className="mt-3 max-w-xl text-4xl leading-tight text-balance md:text-6xl">{landing.hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{landing.hero.subtitle}</p>
          <div className="mt-8">
            <TrackedLink href={landing.hero.ctaHref} text={landing.hero.ctaLabel} className={primaryButtonClass}>
              {landing.hero.ctaLabel}
            </TrackedLink>
          </div>
        </div>
        <CmsImage
          src={landing.hero.image}
          alt={landing.hero.imageAlt}
          priority
          frameClassName="aspect-[4/3] rounded-[2rem]"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="unggulan">
        <h2 id="unggulan" className="text-3xl md:text-4xl">
          {landing.featured.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{landing.featured.intro}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((item) => (
            <Link key={item.id} href={`/produk/${item.slug}`} className="block rounded-[1.75rem] border border-line bg-card p-3">
              <CmsImage
                src={item.image}
                alt={item.imageAlt}
                productName={item.name}
                category={item.category}
                frameClassName="aspect-[4/3] rounded-[1.25rem]"
              />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-forest">
                {categoryLabel(item.category)}
              </p>
              <h3 className="mt-1 text-2xl">{item.headline}</h3>
              <p className="mt-2 text-sm text-muted">
                Mulai {formatIdr(item.price)} / lisensi / bulan · sisa kuota {item.quota}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="testimoni">
        <h2 id="testimoni" className="text-3xl md:text-4xl">
          {landing.testimonials.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{landing.testimonials.intro}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {landing.testimonials.items.map((item) => (
            <figure key={item.id} className="rounded-[1.75rem] bg-ink p-5 text-paper">
              <blockquote className="text-lg leading-7">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-gold">
                {item.name}, {item.role} · {item.company}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl md:text-4xl">
          {landing.faq.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{landing.faq.intro}</p>
        <div className="mt-6 grid gap-3">
          {landing.faq.items.map((item) => (
            <details key={item.id} className="rounded-2xl border border-line bg-card px-4 py-2">
              <summary className="min-h-11 cursor-pointer py-2 font-semibold">{item.question}</summary>
              <p className="pb-4 leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="kontak" className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-4xl">{landing.lead.heading}</h2>
          <p className="mt-3 leading-7 text-muted">{landing.lead.intro}</p>
        </div>
        <div className="relative rounded-[1.75rem] border border-line bg-card p-5">
          <LeadForm lead={landing.lead} />
        </div>
      </section>
    </div>
  );
}
