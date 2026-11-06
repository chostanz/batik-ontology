import { NextResponse } from 'next/server';
import ontologyBundle from '@/lib/ontologyData.json';

export async function GET() {
  return NextResponse.json(ontologyBundle.batiks);
}
