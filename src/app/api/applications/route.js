import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all applications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const candidateId = searchParams.get('candidateId');
    const jobId = searchParams.get('jobId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (candidateId) {
      where.candidateId = candidateId;
    }

    if (jobId) {
      where.jobId = jobId;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { appliedAt: 'desc' },
        include: {
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              currentTitle: true
            }
          },
          job: {
            include: {
              company: {
                select: { id: true, name: true }
              }
            }
          }
        }
      }),
      prisma.application.count({ where })
    ]);

    return NextResponse.json({
      applications,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST create new application
export async function POST(request) {
  try {
    const body = await request.json();

    const { candidateId, jobId, notes } = body;

    // Validate required fields
    if (!candidateId || !jobId) {
      return NextResponse.json(
        { error: 'Candidate and job are required' },
        { status: 400 }
      );
    }

    // Check if application already exists
    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobId: { candidateId, jobId }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Candidate has already applied to this job' },
        { status: 409 }
      );
    }

    // Verify candidate and job exist
    const [candidate, job] = await Promise.all([
      prisma.candidate.findUnique({ where: { id: candidateId } }),
      prisma.job.findUnique({ where: { id: jobId } })
    ]);

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId,
        notes,
        status: 'submitted'
      },
      include: {
        candidate: {
          select: { id: true, firstName: true, lastName: true }
        },
        job: {
          include: {
            company: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
