import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single job
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: { id: true, name: true, industry: true, location: true }
        },
        applications: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentTitle: true,
                status: true
              }
            }
          },
          orderBy: { appliedAt: 'desc' }
        },
        placements: {
          include: {
            candidate: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT update job
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const job = await prisma.job.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
        location: body.location,
        type: body.type,
        status: body.status
      },
      include: {
        company: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE job
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.job.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
