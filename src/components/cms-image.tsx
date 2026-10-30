import Image from "next/image";
import type { ReactNode } from "react";

import { Illustration, ProductShot } from "@/components/artwork";

export function CmsImage({
  src,
  alt,
  productName,
  category = "operasional",
  frameClassName = "aspect-[4/3] rounded-[1.75rem]",
  priority = false,
}: {
  src: string;
  alt: string;
  productName?: string;
  category?: string;
  frameClassName?: string;
  priority?: boolean;
}) {
  let inner: ReactNode;
  if (src === "product" && productName) {
    inner = <ProductShot name={productName} category={category} />;
  } else if (src.startsWith("preset:") || src === "product") {
    inner = <Illustration variant={src} label={alt} />;
  } else {
    inner = (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 640px, 100vw"
        className="object-cover"
        priority={priority}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-mist ${frameClassName}`}>
      {src.startsWith("preset:") || src === "product" ? (
        <div className="absolute inset-0">{inner}</div>
      ) : (
        inner
      )}
    </div>
  );
}
