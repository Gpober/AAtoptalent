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
      const rowNum = i + 2; // +2 because row 1 is headers, and we're 0-indexed

      try {
        // Validate required fields
        if (!row.firstName || !row.lastName || !row.email) {
          errors.push(`Row ${rowNum}: Missing required fields (firstName, lastName, email)`);
          continue;
        }

        // Check for duplicate email
        const existing = await prisma.candidate.findUnique({
          where: { email: row.email }
        });

        if (existing) {
          errors.push(`Row ${rowNum}: Email ${row.email} already exists`);
          continue;
        }

        // Create candidate
        const candidate = await prisma.candidate.create({
          data: {
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phone: row.phone || null,
            location: row.location || null,
            currentTitle: row.currentTitle || null,
            currentCompany: row.currentCompany || null,
            yearsExperience: row.yearsExperience ? parseInt(row.yearsExperience) : null,
            skills: row.skills || null,
            linkedinUrl: row.linkedinUrl || null,
            resumeUrl: row.resumeUrl || null,
            status: row.status || 'active',
            source: row.source || 'csv_import',
            desiredSalary: row.desiredSalary || null,
            desiredRole: row.desiredRole || null,
            availability: row.availability || null,
          }
        });

        imported.push(candidate);
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
    return NextResponse.json({ error: 'Failed to import candidates' }, { status: 500 });
  }
}
