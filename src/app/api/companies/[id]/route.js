import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single company
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
        },
        jobs: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { applications: true }
            }
          }
        },
        notes: {
          include: {
            author: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        placements: {
          include: {
            candidate: {
              select: { id: true, firstName: true, lastName: true }
            },
            job: {
              select: { id: true, title: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

// PUT update company
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: body.name,
        industry: body.industry,
        website: body.website,
        size: body.size,
        location: body.location,
        description: body.description,
        status: body.status
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

// DELETE company
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.company.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
