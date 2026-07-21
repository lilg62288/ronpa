import { ImageResponse } from "next/og";

// SNSシェア時のプレビュー画像（1200x630）
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RONPA - リアルタイム対人ディベート × AI採点";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(900px 500px at 50% 25%, #0b1a2e 0%, #05070d 70%)",
          color: "#e4ebfa",
          fontFamily: "sans-serif",
        }}
      >
        {/* ロゴ: 赤・青の吹き出しが重なるマーク */}
        <div style={{ display: "flex", position: "relative", marginBottom: 40 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "10px solid #ff4d6d",
              marginRight: -34,
            }}
          />
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "10px solid #3d8bff",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 78,
              width: 64,
              height: 64,
              background: "#e4ebfa",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 800,
              color: "#05070d",
            }}
          >
            R
          </div>
        </div>

        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            letterSpacing: 24,
            paddingLeft: 24,
            textShadow: "0 0 40px rgba(0,229,255,0.5)",
          }}
        >
          RONPA
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 26,
            letterSpacing: 8,
            color: "#00e5ff",
          }}
        >
          REALTIME DEBATE × AI JUDGING
        </div>
        <div style={{ marginTop: 36, fontSize: 34, color: "#93a4c8" }}>
          リアルタイム対人ディベート × AI採点
        </div>
      </div>
    ),
    { ...size },
  );
}
