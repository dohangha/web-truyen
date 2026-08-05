import { getPlaiceholder } from 'plaiceholder';

// Ảnh 1x1 pixel trong suốt, dùng làm blurDataURL fallback khi không lấy được ảnh gốc
const FALLBACK_BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

export async function getBlurImage(src: string) {
  try {
    const res = await fetch(src);

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${src}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    const {
      metadata: { height, width },
      ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 });

    return {
      ...plaiceholder,
      img: { src, height, width },
    };
  } catch (error) {
    console.error('getBlurImage failed for', src, error);

    // Fallback: dùng ảnh blur 1x1 trong suốt để tránh lỗi thiếu blurDataURL,
    // thay vì làm sập cả trang khi link ảnh Notion bị hết hạn hoặc 403.
    return {
      base64: FALLBACK_BLUR_DATA_URL,
      img: { src, height: 0, width: 0 },
    };
  }
}