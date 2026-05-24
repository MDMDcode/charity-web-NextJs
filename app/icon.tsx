import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const API = "https://api-shamel.tmt3.sa/api/v1";

export default async function Icon() {
  const res = await fetch(`${API}/settings`, { cache: 'no-store' });
  const json = await res.json();
  const iconUrl = json?.data?.site_icon?.original || 'https://api-shamel.tmt3.sa/storage/99/01KS99PG4EYQD4HP198RMS7DHV.png';

  return new ImageResponse(
    (
      <img
        src={iconUrl}
        width={32}
        height={32}
        style={{ borderRadius: '50%' }}
      />
    ),
    { ...size }
  );
}