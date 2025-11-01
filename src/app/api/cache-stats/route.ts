/**
 * Cache Statistics API Endpoint
 * GET /api/cache-stats - Returns cache hit rates, sizes, and metrics for monitoring
 * DELETE /api/cache-stats - Clears all caches
 */

import { NextResponse } from 'next/server';
import { getCacheStats, clearAllCaches } from '@/lib/cache';

export async function GET() {
  try {
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearAllCaches();

    return NextResponse.json({
      success: true,
      message: '모든 캐시가 초기화되었습니다',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error clearing caches:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
