import { NextResponse } from 'next/server';

const API_BASE = process.env.NESTJS_API_URL || 'http://localhost:5001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || '';
    const mindMapId = searchParams.get('mindMapId') || '';
    const res = await fetch(
      `${API_BASE}/api/nodes/color/next?parentId=${parentId}&mindMapId=${mindMapId}`,
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}
