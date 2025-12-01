import { ImageResponse } from "next/og";
import { lookupApp } from "~/lib/app-store";

export const runtime = "edge";
export const alt = "App Region Checker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await lookupApp(id, "us");
  const app = data?.results?.[0];

  if (!app) {
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
          }}
        >
          <div style={{ fontSize: 60, fontWeight: "bold" }}>
            App Region Checker
          </div>
          <div style={{ fontSize: 30, marginTop: 20, color: "#888" }}>
            Check app availability worldwide
          </div>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: 60,
          gap: 60,
        }}
      >
        {/* App Icon */}
        <img
          src={app.artworkUrl512}
          alt={app.trackName}
          width={280}
          height={280}
          style={{
            borderRadius: 56,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        />

        {/* App Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              maxWidth: 600,
            }}
          >
            {app.trackName}
          </div>
          <div style={{ fontSize: 28, color: "#888" }}>{app.artistName}</div>
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 20,
              fontSize: 24,
              color: "#666",
            }}
          >
            <span
              style={{
                background: "#222",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              {app.primaryGenreName}
            </span>
            <span
              style={{
                background: "#222",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              {app.formattedPrice}
            </span>
            <span
              style={{
                background: "#222",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              v{app.version}
            </span>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 22,
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>Check availability in 170+ regions</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
