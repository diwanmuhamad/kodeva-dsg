const accents: Record<string, string> = {
  operasional: "#1e6b45",
  sdm: "#9f341f",
  keuangan: "#8a6a22",
  addon: "#245c62",
};

export function ProductShot({ name, category }: { name: string; category: string }) {
  const accent = accents[category] ?? "#1e6b45";
  return (
    <svg viewBox="0 0 640 480" role="img" aria-label={`Tangkapan layar ${name}`} className="h-full w-full">
      <rect width="640" height="480" fill="#f7f1e6" />
      <rect x="28" y="24" width="584" height="432" rx="28" fill="#fffdf8" />
      <circle cx="64" cy="58" r="8" fill="#e4d8c4" />
      <circle cx="88" cy="58" r="8" fill="#e4d8c4" />
      <circle cx="112" cy="58" r="8" fill={accent} />
      <rect x="52" y="96" width="150" height="312" rx="18" fill="#17241c" />
      <rect x="72" y="124" width="110" height="14" rx="7" fill="#f3efe4" />
      <rect x="72" y="156" width="86" height="10" rx="5" fill={accent} />
      <rect x="72" y="182" width="86" height="10" rx="5" fill="#6d776f" />
      <rect x="72" y="208" width="86" height="10" rx="5" fill="#6d776f" />
      <rect x="224" y="96" width="360" height="120" rx="18" fill={accent} />
      <text x="248" y="150" fill="#fffdf8" fontSize="28" fontFamily="Georgia, serif">
        {name}
      </text>
      <text x="248" y="182" fill="#fffdf8" fontSize="16" fontFamily="Segoe UI, sans-serif">
        Promo Akhir Tahun
      </text>
      <rect x="224" y="236" width="170" height="172" rx="18" fill="#f3efe4" />
      <rect x="414" y="236" width="170" height="80" rx="18" fill="#f3efe4" />
      <rect x="414" y="328" width="170" height="80" rx="18" fill="#f6e4c4" />
    </svg>
  );
}

export function Illustration({ variant, label }: { variant: string; label: string }) {
  const leaf = variant.includes("tim") ? "#9f341f" : variant.includes("laporan") ? "#8a6a22" : "#1e6b45";
  return (
    <svg viewBox="0 0 640 480" role="img" aria-label={label} className="h-full w-full">
      <rect width="640" height="480" fill="#efe6d4" />
      <rect x="70" y="250" width="500" height="150" rx="24" fill="#fffdf8" />
      <rect x="110" y="210" width="180" height="190" rx="20" fill="#17241c" />
      <rect x="320" y="150" width="210" height="250" rx="24" fill={leaf} />
      <circle cx="180" cy="160" r="46" fill="#e2b15a" />
      <rect x="350" y="190" width="150" height="16" rx="8" fill="#fffdf8" />
      <rect x="350" y="224" width="110" height="16" rx="8" fill="#fffdf8" opacity="0.75" />
      <rect x="350" y="300" width="90" height="64" rx="16" fill="#17241c" />
    </svg>
  );
}
