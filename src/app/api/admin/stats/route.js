import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET admin statistics
export async function GET() {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalPlacements,
      activeJobs,
      activeCandidates
    ] = await Promise.all([
      prisma.user.count(),
      prisma.candidate.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.placement.count(),
      prisma.job.count({ where: { status: 'open' } }),
      prisma.candidate.count({ where: { status: 'active' } })
    ]);

    // Get recent activity counts
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newCandidatesThisMonth,
      newCompaniesThisMonth,
      newApplicationsThisMonth
    ] = await Promise.all([
      prisma.candidate.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.company.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.application.count({
        where: { appliedAt: { gte: thirtyDaysAgo } }
      })
    ]);

    return NextResponse.json({
      totals: {
        users: totalUsers,
        candidates: totalCandidates,
        companies: totalCompanies,
        jobs: totalJobs,
        applications: totalApplications,
        placements: totalPlacements
      },
      active: {
        jobs: activeJobs,
        candidates: activeCandidates
      },
      thisMonth: {
        candidates: newCandidatesThisMonth,
        companies: newCompaniesThisMonth,
        applications: newApplicationsThisMonth
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
