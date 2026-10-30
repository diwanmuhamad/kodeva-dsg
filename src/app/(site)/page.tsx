import { LandingView, type FeaturedCard } from "@/components/landing-view";
import { getCms } from "@/lib/cms/content";
import { minMonthlyPrice } from "@/lib/catalog-query";
import { getProduct } from "@/lib/products";

export default async function HomePage() {
  const cms = await getCms();
  const featured: FeaturedCard[] = cms.landing.featured.items.flatMap((item) => {
    const product = getProduct(item.productSlug);
    if (!product) return [];
    return [
      {
        id: item.id,
        headline: item.headline,
        image: item.image,
        imageAlt: item.imageAlt,
        slug: product.slug,
        name: product.name,
        category: product.category,
        price: minMonthlyPrice(product),
        quota: product.promoQuota,
      },
    ];
  });

  return <LandingView landing={cms.landing} featured={featured} />;
}
