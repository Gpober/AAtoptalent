import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single candidate
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            author: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        applications: {
          include: {
            job: {
              include: {
                company: {
                  select: { id: true, name: true }
                }
              }
            }
          },
          orderBy: { appliedAt: 'desc' }
        },
        placements: {
          include: {
            company: {
              select: { id: true, name: true }
            },
            job: {
              select: { id: true, title: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    );
  }
}

// PUT update candidate
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        location: body.location,
        currentTitle: body.currentTitle,
        currentCompany: body.currentCompany,
        yearsExperience: body.yearsExperience ? parseInt(body.yearsExperience) : null,
        skills: body.skills,
        resumeUrl: body.resumeUrl,
        linkedinUrl: body.linkedinUrl,
        status: body.status,
        source: body.source,
        desiredSalary: body.desiredSalary,
        desiredRole: body.desiredRole,
        availability: body.availability
      }
    });

    return NextResponse.json(candidate);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    );
  }
}

// DELETE candidate
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.candidate.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}
