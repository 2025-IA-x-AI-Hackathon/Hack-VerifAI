/**
 * Verification Results API Endpoint
 * GET /api/verification/[docId]
 *
 * Returns verification results and progress for a document
 */

import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getVerificationProgress } from '@/lib/verification';

export async function GET(
  request: NextRequest,
  { params }: { params: { docId: string } }
) {
  try {
    const { docId } = params;

    if (!docId) {
      return NextResponse.json(
        { error: 'doc_id is required' },
        { status: 400 }
      );
    }

    // Get verification results
    const results = storage.getResults(docId);

    // Get verification progress
    const progress = getVerificationProgress(docId);

    // Get all jobs to check for errors
    const jobs = storage.getJobs(docId);

    return NextResponse.json({
      success: true,
      doc_id: docId,
      results,
      progress,
      jobs: jobs.map(job => ({
        paragraph_id: job.paragraph.id,
        status: job.status,
        error: job.error,
        updated_at: job.updated_at,
      })),
    });
  } catch (error) {
    console.error('[Verification API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
