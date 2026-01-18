import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all contacts for a company
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const contacts = await prisma.contact.findMany({
      where: { companyId: id },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST create a new contact for a company
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // If this contact should be primary, unset other primary contacts
    if (body.isPrimary) {
      await prisma.contact.updateMany({
        where: { companyId: id, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    const contact = await prisma.contact.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email || null,
        phone: body.phone || null,
        cellPhone: body.cellPhone || null,
        workPhone: body.workPhone || null,
        title: body.title || null,
        isPrimary: body.isPrimary || false,
        companyId: id
      }
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
