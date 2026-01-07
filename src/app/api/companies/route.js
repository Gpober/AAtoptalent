import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all companies
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const industry = searchParams.get('industry');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (industry) {
      where.industry = industry;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { industry: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { jobs: true, contacts: true, placements: true }
          }
        }
      }),
      prisma.company.count({ where })
    ]);

    return NextResponse.json({
      companies,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST create new company
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      industry,
      website,
      size,
      location,
      description,
      status,
      contact
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Build company data with optional nested contact creation
    const companyData = {
      name,
      industry,
      website,
      size,
      location,
      description,
      status: status || 'active'
    };

    // If contact data is provided, create the contact along with the company
    if (contact && (contact.firstName || contact.lastName)) {
      companyData.contacts = {
        create: {
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || null,
          phone: contact.phone || null,
          title: contact.title || null,
          isPrimary: true
        }
      };
    }

    const company = await prisma.company.create({
      data: companyData,
      include: {
        contacts: true
      }
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
