import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Tool definitions for Claude
const tools = [
  {
    name: "search_candidates",
    description: "Search for candidates in the database by skills, title, location, experience level, or availability. Use this when the user wants to find candidates matching certain criteria.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Free text search query for candidate skills, title, or summary"
        },
        location: {
          type: "string",
          description: "Location to filter candidates by (city, state, or country)"
        },
        status: {
          type: "string",
          enum: ["ACTIVE", "PASSIVE", "NOT_LOOKING", "PLACED"],
          description: "Candidate availability status"
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default 5)"
        }
      },
      required: []
    }
  },
  {
    name: "search_jobs",
    description: "Search for job openings in the database by title, company, location, or job type.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Free text search for job title or description"
        },
        location: {
          type: "string",
          description: "Job location filter"
        },
        type: {
          type: "string",
          enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE"],
          description: "Type of employment"
        },
        remote: {
          type: "boolean",
          description: "Filter for remote jobs only"
        },
        limit: {
          type: "number",
          description: "Maximum results to return"
        }
      },
      required: []
    }
  },
  {
    name: "search_companies",
    description: "Search for companies/clients in the database by name, industry, or location.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Company name or industry search"
        },
        location: {
          type: "string",
          description: "Company location filter"
        },
        limit: {
          type: "number",
          description: "Maximum results"
        }
      },
      required: []
    }
  },
  {
    name: "get_pipeline_stats",
    description: "Get recruiting pipeline statistics including total candidates, active jobs, placements, etc.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "match_candidate_to_job",
    description: "Analyze how well a specific candidate matches a job opening based on their skills and experience.",
    input_schema: {
      type: "object",
      properties: {
        candidateId: {
          type: "string",
          description: "The candidate's ID"
        },
        jobId: {
          type: "string",
          description: "The job's ID"
        }
      },
      required: ["candidateId", "jobId"]
    }
  },
  {
    name: "search_external_jobs",
    description: "Search for job listings from external sources on the web. Use this when the user wants to find jobs outside of the A&A Top Talent database, or wants to find opportunities for their candidates.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Job search query (title, skills, industry)"
        },
        location: {
          type: "string",
          description: "Preferred location for jobs"
        },
        remote: {
          type: "boolean",
          description: "Search for remote opportunities"
        }
      },
      required: ["query"]
    }
  }
];

// Tool implementations
async function searchCandidates({ query, location, status, limit = 5 }) {
  const where = {};

  if (query) {
    where.OR = [
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { title: { contains: query, mode: 'insensitive' } },
      { skills: { contains: query, mode: 'insensitive' } },
      { summary: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (status) {
    where.status = status;
  }

  const candidates = await prisma.candidate.findMany({
    where,
    take: limit,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      title: true,
      location: true,
      skills: true,
      experience: true,
      status: true,
      summary: true,
    }
  });

  return candidates;
}

async function searchJobs({ query, location, type, remote, limit = 5 }) {
  const where = { status: 'OPEN' };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { requirements: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (type) {
    where.type = type;
  }

  if (remote !== undefined) {
    where.remote = remote;
  }

  const jobs = await prisma.job.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      company: {
        select: { name: true }
      }
    }
  });

  return jobs.map(job => ({
    ...job,
    companyName: job.company?.name
  }));
}

async function searchCompanies({ query, location, limit = 5 }) {
  const where = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { industry: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  const companies = await prisma.company.findMany({
    where,
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });

  return companies.map(c => ({
    ...c,
    openJobs: c._count.jobs
  }));
}

async function getPipelineStats() {
  const [
    totalCandidates,
    activeCandidates,
    totalCompanies,
    openJobs,
    totalPlacements,
    recentPlacements
  ] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { status: 'ACTIVE' } }),
    prisma.company.count(),
    prisma.job.count({ where: { status: 'OPEN' } }),
    prisma.placement.count(),
    prisma.placement.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  return {
    totalCandidates,
    activeCandidates,
    totalCompanies,
    openJobs,
    totalPlacements,
    recentPlacements,
    summary: `You have ${totalCandidates} total candidates (${activeCandidates} actively looking), ${totalCompanies} companies, ${openJobs} open positions, and ${totalPlacements} placements (${recentPlacements} in the last 30 days).`
  };
}

async function matchCandidateToJob({ candidateId, jobId }) {
  const [candidate, job] = await Promise.all([
    prisma.candidate.findUnique({ where: { id: candidateId } }),
    prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    })
  ]);

  if (!candidate || !job) {
    return { error: "Candidate or job not found" };
  }

  return {
    candidate: {
      name: `${candidate.firstName} ${candidate.lastName}`,
      title: candidate.title,
      skills: candidate.skills,
      experience: candidate.experience,
      location: candidate.location
    },
    job: {
      title: job.title,
      company: job.company?.name,
      requirements: job.requirements,
      location: job.location,
      salary: job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : null
    }
  };
}

async function searchExternalJobs({ query, location, remote }) {
  // For external job search, we'll provide guidance on where to search
  // In a production app, you'd integrate with job board APIs
  const searchQuery = [query, location, remote ? "remote" : ""].filter(Boolean).join(" ");

  return {
    searchSuggestion: `To find "${query}" jobs${location ? ` in ${location}` : ''}${remote ? ' (remote)' : ''}, I recommend checking:`,
    sources: [
      { name: "LinkedIn Jobs", url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}` },
      { name: "Indeed", url: `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location || '')}` },
      { name: "Glassdoor", url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(query)}` },
    ],
    tips: [
      "LinkedIn is great for professional/corporate roles",
      "Indeed has the largest volume of listings",
      "Glassdoor includes salary insights",
      "Check company career pages directly for the best opportunities"
    ]
  };
}

// Execute tool calls
async function executeTool(toolName, toolInput) {
  switch (toolName) {
    case 'search_candidates':
      return await searchCandidates(toolInput);
    case 'search_jobs':
      return await searchJobs(toolInput);
    case 'search_companies':
      return await searchCompanies(toolInput);
    case 'get_pipeline_stats':
      return await getPipelineStats();
    case 'match_candidate_to_job':
      return await matchCandidateToJob(toolInput);
    case 'search_external_jobs':
      return await searchExternalJobs(toolInput);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

const systemPrompt = `You are an AI recruiting assistant for A&A Top Talent, a professional recruiting platform. Your role is to help recruiters find candidates, match them with jobs, and provide market insights.

You have access to the following tools:
- search_candidates: Find candidates in the database by skills, experience, location
- search_jobs: Find job openings in the A&A Top Talent database
- search_companies: Find companies/clients in the database
- get_pipeline_stats: Get overview statistics of the recruiting pipeline
- match_candidate_to_job: Analyze how well a candidate fits a job
- search_external_jobs: Help find job listings from external sources

Guidelines:
1. Be helpful, professional, and concise
2. When searching, use relevant filters to narrow results
3. When presenting candidates or jobs, highlight key details
4. If the database is empty or has no matches, be helpful about next steps
5. For external job searches, provide actionable links and tips
6. Always respect candidate privacy - don't share sensitive info unnecessarily
7. Use markdown formatting for readability (bold for emphasis, bullet points for lists)

Remember: You're helping recruiters be more efficient and find the best matches between candidates and opportunities.`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        response: "The AI assistant is not configured yet. Please add your ANTHROPIC_API_KEY to the environment variables to enable this feature.",
        error: "API key not configured"
      });
    }

    // Build conversation messages
    const messages = [
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Initial Claude call
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages
    });

    // Handle tool use
    let toolResults = [];
    let structuredData = {};

    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');

      const toolResultsContent = await Promise.all(
        toolUseBlocks.map(async (toolUse) => {
          const result = await executeTool(toolUse.name, toolUse.input);

          // Store structured data for frontend
          if (toolUse.name === 'search_candidates' && Array.isArray(result)) {
            structuredData.candidates = result;
          } else if (toolUse.name === 'search_jobs' && Array.isArray(result)) {
            structuredData.jobs = result;
          } else if (toolUse.name === 'search_external_jobs') {
            structuredData.externalJobs = result;
          }

          return {
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(result)
          };
        })
      );

      // Continue conversation with tool results
      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResultsContent });

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        tools,
        messages
      });
    }

    // Extract text response
    const textContent = response.content.find(block => block.type === 'text');
    const responseText = textContent?.text || "I couldn't generate a response. Please try again.";

    return NextResponse.json({
      response: responseText,
      data: structuredData
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to process request',
      response: "I encountered an error processing your request. Please try again."
    }, { status: 500 });
  }
}
