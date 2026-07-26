export default function AdSlot({ label = 'Quảng cáo' }: { label?: string }) {
  // TODO: sau khi được duyệt Google AdSense (hoặc mạng quảng cáo khác),
  // thay nội dung bên trong div này bằng đoạn code <ins class="adsbygoogle">
  // mà AdSense cung cấp cho bạn.
  return (
    <div className="my-8 flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 dark:border-gray-600">
      {label}
    </div>
  );
}
