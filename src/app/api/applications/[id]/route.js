import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single application
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        candidate: true,
        job: {
          include: {
            company: true
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PUT update application status
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes
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

    return NextResponse.json(application);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// DELETE application
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.application.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
