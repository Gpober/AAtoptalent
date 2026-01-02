import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || null;
      });
      rows.push(row);
    }
  }

  return { headers, rows };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or invalid' }, { status: 400 });
    }

    const imported = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      try {
        // Validate required fields
        if (!row.name) {
          errors.push(`Row ${rowNum}: Missing required field (name)`);
          continue;
        }

        // Create company
        const company = await prisma.company.create({
          data: {
            name: row.name,
            industry: row.industry || null,
            website: row.website || null,
            size: row.size || null,
            location: row.location || null,
            description: row.description || null,
            status: row.status || 'active',
          }
        });

        // If contact info is provided, create a contact
        if (row.contactFirstName && row.contactLastName) {
          await prisma.contact.create({
            data: {
              firstName: row.contactFirstName,
              lastName: row.contactLastName,
              email: row.contactEmail || null,
              phone: row.contactPhone || null,
              title: row.contactTitle || null,
              isPrimary: true,
              companyId: company.id,
            }
          });
        }

        imported.push(company);
      } catch (error) {
        errors.push(`Row ${rowNum}: ${error.message}`);
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      imported: imported.length,
      total: rows.length,
      errors: errors,
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: 'Failed to import companies' }, { status: 500 });
  }
}
