'use client';

import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  email: string;
  content: string;
  createdAt: number;
}

function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?slug=${slug}`);
    const data = await res.json();
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, content }),
    });

    if (res.status === 401) {
      window.location.href = '/dang-nhap';
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Có lỗi xảy ra');
      setLoading(false);
      return;
    }

    setContent('');
    setLoading(false);
    fetchComments();
  };

  return (
    <section className="mx-auto mt-16 w-[90vw] max-w-[900px] space-y-6">
      <h2 className="text-2xl font-bold">
        💬 Bình Luận ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          maxLength={1000}
          rows={3}
          className="w-full rounded-2xl border-2 border-gray-300 p-4 outline-none focus:border-amber-500 dark:border-gray-600 dark:bg-customGray-dark"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-full bg-amber-500 px-6 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? 'Đang gửi...' : 'Gửi Bình Luận'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-secondary text-center">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">{comment.email}</span>
              <span className="text-xs text-gray-400">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
