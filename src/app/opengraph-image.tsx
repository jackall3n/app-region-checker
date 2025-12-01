import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "App Region Checker - Check App Store availability worldwide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "white",
          padding: 60,
        }}
      >
        {/* Globe emoji representation */}
        <div
          style={{
            fontSize: 120,
            marginBottom: 30,
          }}
        >
          🌍
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          App Region Checker
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#888",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Check iOS & Mac App Store availability across 170+ countries
        </div>

        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 50,
            fontSize: 24,
          }}
        >
          <span
            style={{
              background: "#10b981",
              color: "white",
              padding: "12px 24px",
              borderRadius: 12,
            }}
          >
            ✓ Region Availability
          </span>
          <span
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              borderRadius: 12,
            }}
          >
            💰 Local Pricing
          </span>
          <span
            style={{
              background: "#8b5cf6",
              color: "white",
              padding: "12px 24px",
              borderRadius: 12,
            }}
          >
            🔗 Direct Links
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
