import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for the AI recruiter
const SYSTEM_PROMPT = `You are an AI recruiting assistant for A&A Top Talent, a recruiting and staffing company. Your role is to help recruiters and hiring managers with:

1. Finding and matching candidates with job opportunities
2. Answering questions about the recruiting pipeline
3. Providing insights on candidates, companies, and open positions
4. Helping with candidate sourcing and screening
5. Offering recruitment best practices and advice

You have access to the company's database of candidates, companies, jobs, and applications. When users ask about specific candidates or jobs, provide detailed, helpful information.

Be professional, concise, and helpful. If you don't have specific data to answer a question, acknowledge it and offer to help in other ways.`;

async function getRecruitingContext() {
  try {
    const [candidatesCount, companiesCount, jobsCount, applicationsCount] = await Promise.all([
      prisma.candidate.count(),
      prisma.company.count(),
      prisma.job.count({ where: { status: 'open' } }),
      prisma.application.count(),
    ]);

    return {
      totalCandidates: candidatesCount,
      totalCompanies: companiesCount,
      openPositions: jobsCount,
      totalApplications: applicationsCount,
    };
  } catch (error) {
    console.error('Error fetching recruiting context:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Get recruiting context
    const context = await getRecruitingContext();

    // Build context message
    let contextMessage = '';
    if (context) {
      contextMessage = `\n\nCurrent recruiting pipeline stats:
- Total Candidates: ${context.totalCandidates}
- Active Companies: ${context.totalCompanies}
- Open Positions: ${context.openPositions}
- Total Applications: ${context.totalApplications}`;
    }

    // Format messages for Claude
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Add context to the first user message if available
    if (contextMessage && formattedMessages.length > 0 && formattedMessages[0].role === 'user') {
      formattedMessages[0].content += contextMessage;
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
    });

    // Extract the response text
    const assistantMessage = response.content[0].text;

    return NextResponse.json({
      message: assistantMessage,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      }
    });
  } catch (error) {
    console.error('Error in chat API:', error);

    // Handle specific Anthropic API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY environment variable.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    );
  }
}
