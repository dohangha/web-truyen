import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export interface Comment {
  id: string;
  slug: string;
  userId: string;
  email: string;
  content: string;
  createdAt: number;
}

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

async function readComments(): Promise<Comment[]> {
  try {
    const raw = await fs.readFile(COMMENTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeComments(comments: Comment[]) {
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true });
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

export async function addComment(
  slug: string,
  userId: string,
  email: string,
  content: string
): Promise<Comment> {
  const comments = await readComments();

  const comment: Comment = {
    id: randomUUID(),
    slug,
    userId,
    email,
    content: content.trim().slice(0, 1000), // giới hạn độ dài, chống spam dài
    createdAt: Date.now(),
  };

  comments.push(comment);
  await writeComments(comments);

  return comment;
}

export async function getCommentsForSlug(slug: string): Promise<Comment[]> {
  const comments = await readComments();
  return comments
    .filter((c) => c.slug === slug)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await readComments();
  const filtered = comments.filter((c) => c.id !== id);

  if (filtered.length === comments.length) return false;

  await writeComments(filtered);
  return true;
}
