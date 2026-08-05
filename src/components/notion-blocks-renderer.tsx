import Image from 'next/image';
import Link from 'next/link';

type RichText = {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
};

type Block = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: Block[];
  [key: string]: any;
};

function RichTextRenderer({ richText }: { richText: RichText[] }) {
  if (!richText || richText.length === 0) return null;

  return (
    <>
      {richText.map((t, i) => {
        let content: React.ReactNode = t.plain_text;

        if (t.annotations.code) {
          content = (
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-[0.9em] dark:bg-white/10">
              {content}
            </code>
          );
        }
        if (t.annotations.bold) content = <strong>{content}</strong>;
        if (t.annotations.italic) content = <em>{content}</em>;
        if (t.annotations.strikethrough) content = <s>{content}</s>;
        if (t.annotations.underline) content = <u>{content}</u>;

        if (t.href) {
          content = (
            <Link
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 underline hover:text-amber-700 dark:text-amber-400"
            >
              {content}
            </Link>
          );
        }

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      if (block.paragraph.rich_text.length === 0) {
        return <div className="h-4" />; // dòng trống giữ khoảng cách
      }
      return (
        <p className="mb-4 leading-relaxed">
          <RichTextRenderer richText={block.paragraph.rich_text} />
        </p>
      );

    case 'heading_1':
      return (
        <h2 className="mb-4 mt-8 text-2xl font-bold">
          <RichTextRenderer richText={block.heading_1.rich_text} />
        </h2>
      );

    case 'heading_2':
      return (
        <h3 className="mb-3 mt-6 text-xl font-bold">
          <RichTextRenderer richText={block.heading_2.rich_text} />
        </h3>
      );

    case 'heading_3':
      return (
        <h4 className="mb-3 mt-5 text-lg font-bold">
          <RichTextRenderer richText={block.heading_3.rich_text} />
        </h4>
      );

    case 'bulleted_list_item':
      return (
        <li className="mb-2 ml-6 list-disc leading-relaxed">
          <RichTextRenderer richText={block.bulleted_list_item.rich_text} />
          {block.children && (
            <ul>
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ul>
          )}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="mb-2 ml-6 list-decimal leading-relaxed">
          <RichTextRenderer richText={block.numbered_list_item.rich_text} />
          {block.children && (
            <ol>
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ol>
          )}
        </li>
      );

    case 'quote':
      return (
        <blockquote className="my-4 border-l-4 border-amber-400 pl-4 italic text-secondary">
          <RichTextRenderer richText={block.quote.rich_text} />
        </blockquote>
      );

    case 'callout':
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
          {block.callout.icon?.emoji && (
            <span className="text-xl">{block.callout.icon.emoji}</span>
          )}
          <div className="leading-relaxed">
            <RichTextRenderer richText={block.callout.rich_text} />
          </div>
        </div>
      );

    case 'divider':
      return <hr className="my-8 border-black/10 dark:border-white/10" />;

    case 'image': {
      const url =
        block.image.type === 'file'
          ? block.image.file.url
          : block.image.external.url;
      const caption = block.image.caption?.[0]?.plain_text;

      return (
        <div className="relative my-6 aspect-video w-full">
          <Image
            src={url}
            alt={caption || 'ảnh minh họa'}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 900px) 100vw, 900px"
          />
          {caption && (
            <p className="mt-2 text-center text-sm text-secondary">
              {caption}
            </p>
          )}
        </div>
      );
    }

    default:
      // Loại block chưa hỗ trợ -> bỏ qua thay vì làm crash cả trang.
      return null;
  }
}

export default function NotionBlocksRenderer({
  blocks,
}: {
  blocks: Block[];
}) {
  return (
    <div className="prose mx-auto w-full max-w-3xl px-4">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}