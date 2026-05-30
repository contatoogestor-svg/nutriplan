import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#16a34a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Bowl */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12a10 10 0 0 0 20 0" />
          <path d="M12 2v4" />
          <path d="M8 3l1.5 3" />
          <path d="M16 3l-1.5 3" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
