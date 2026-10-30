import { ImageResponse } from "next/og";

export const alt = "Kodeva Promo Akhir Tahun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1a2420",
          color: "#f3efe4",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#e2b15a" }}>PROMO AKHIR TAHUN</div>
        <div style={{ display: "flex", fontSize: 84, marginTop: 12 }}>Kodeva</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 18 }}>Software usaha untuk UMKM</div>
      </div>
    ),
    { ...size },
  );
}
