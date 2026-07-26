import { NextRequest, NextResponse } from 'next/server';

import { deleteComment } from '@/libs/comments';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const password = request.headers.get('x-admin-password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const success = await deleteComment(params.id);

  if (!success) {
    return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
