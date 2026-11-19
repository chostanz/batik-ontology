import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ontologyBundle from '@/lib/ontologyData.json';

export function generateStaticParams() {
  return ontologyBundle.batiks.map((b: { id: string }) => ({
    id: b.id,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cleanId = params.id.replace(/\.svg$/, '');
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'gambar', `${cleanId}.svg`),
    path.join(process.cwd(), 'gambar', `${cleanId}.svg`),
    path.join(process.cwd(), 'src', 'main', 'resources', 'gambar', `${cleanId}.svg`),
    path.join(process.cwd(), 'public', 'img', `${cleanId}.svg`),
    path.join(process.cwd(), 'public', 'img', cleanId)
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const fileBuffer = fs.readFileSync(p);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  }

  return new NextResponse('Image not found', { status: 404 });
}
