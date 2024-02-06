import { ImageResponse } from "@vercel/og";
import Image from "next/image";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
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
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <Image alt="og" src="/images/profile_pic.jpg" width={3310} height={2075} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
