import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all candidates
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { skills: { contains: search } },
        { currentTitle: { contains: search } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { applications: true, placements: true }
          }
        }
      }),
      prisma.candidate.count({ where })
    ]);

    return NextResponse.json({
      candidates,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

// POST create new candidate
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      currentTitle,
      currentCompany,
      yearsExperience,
      skills,
      resumeUrl,
      linkedinUrl,
      status,
      source,
      desiredSalary,
      desiredRole,
      availability
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.candidate.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A candidate with this email already exists' },
        { status: 409 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        location,
        currentTitle,
        currentCompany,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
        skills,
        resumeUrl,
        linkedinUrl,
        status: status || 'active',
        source,
        desiredSalary,
        desiredRole,
        availability
      }
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}
