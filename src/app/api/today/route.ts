import { getDb } from '@/db';
import { table_quotes, table_works } from '@/db/schema';
import { textToHtml } from '@/lib/text-utils';
import todayJson from '@/scripts/today/today.json';
import { asc, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

// Validate Basic Auth
function validateBasicAuth(authHeader: string | null): {
  isValid: boolean;
  username?: string;
} {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.error('Invalid Basic Auth header');
    return { isValid: false };
  }

  if (!process.env.BASIC_AUTH_USERNAME || !process.env.BASIC_AUTH_PASSWORD) {
    console.error('BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD is not set');
    return { isValid: false };
  }

  try {
    // Parse Basic Auth
    const base64Credentials = authHeader.substring(6); // Remove "Basic " prefix
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8'
    );
    const [username, password] = credentials.split(':');

    // Set expected username and password
    const expectedUsername = process.env.BASIC_AUTH_USERNAME || 'admin';
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD || 'password';

    if (username === expectedUsername && password === expectedPassword) {
      console.log('Valid username and password');
      return { isValid: true, username };
    }

    console.error('Invalid username or password');
    return { isValid: false };
  } catch (error) {
    console.error('Error validating Basic Auth', error);
    return { isValid: false };
  }
}

export async function GET(request: NextRequest) {
  // Validate Basic Auth (disable for now)
  // const authHeader = request.headers.get('authorization');
  // const authResult = validateBasicAuth(authHeader);

  // if (!authResult.isValid) {
  //   return NextResponse.json(
  //     { error: 'Unauthorized' },
  //     {
  //       status: 401,
  //       headers: {
  //         'WWW-Authenticate': 'Basic realm="Secure Area"',
  //       },
  //     }
  //   );
  // }

  // get today's date as YYYY-MM-DD
  const today = new Date();
  // const today = new Date('2024-04-18');
  const dateString = today.toISOString().split('T')[0];

  // get work_id from today.json
  const work_id = todayJson[dateString as keyof typeof todayJson] || null;
  console.log('TodayRoute, work id: ', work_id);

  if (work_id == null) {
    console.error('TodayRoute, work id is null');
    return NextResponse.json({ error: 'Work not found' }, { status: 404 });
  }

  const id = work_id.toString();

  // find work by id
  const db = await getDb();
  const works = await db
    .select()
    .from(table_works)
    .where(eq(table_works.id, Number.parseInt(id as string)))
    .limit(1);

  if (works.length === 0) {
    console.error(`TodayRoute, work not found, id: ${id}`);
    return NextResponse.json({ error: 'Work not found' }, { status: 404 });
  }

  const work = works[0];

  // find quotes by work id
  const quotes = await db
    .select()
    .from(table_quotes)
    .where(eq(table_quotes.work_id, work.id))
    .orderBy(asc(table_quotes.id));

  if (quotes.length === 0) {
    console.error(`TodayRoute, quotes not found, work id: ${work.id}`);
    return NextResponse.json({ error: 'Quotes not found' }, { status: 404 });
  }

  const quote = quotes[0];

  // Build comprehensive content with titles and clean text
  const contentSections = [];

  contentSections.push(
    '<strong>🌸 海棠诗社</strong> <br/>古诗词的数字桃源，纯粹的古诗词学习网站'
  );

  contentSections.push(`🗓️ ${dateString}`);

  // Add title section
  contentSections.push(`<strong>${work.title}</strong>`);

  // Add dynasty and author section
  contentSections.push(`${work.dynasty} - ${work.author}`);

  // Add content section
  if (work.content) {
    contentSections.push(`${textToHtml(work.content)}`);
  }

  // Add intro section
  if (work.intro) {
    contentSections.push(
      `<strong>📚 简介</strong><br/>${textToHtml(work.intro)}`
    );
  }

  // Add annotation section
  if (work.annotation) {
    contentSections.push(
      `<strong>📚 注释</strong><br/>${textToHtml(work.annotation)}`
    );
  }

  // Add translation section
  if (work.translation) {
    contentSections.push(
      `<strong>📚 翻译</strong><br/>${textToHtml(work.translation)}`
    );
  }

  // Add master comment section
  if (work.master_comment) {
    contentSections.push(
      `<strong>📚 评价</strong><br/>${textToHtml(work.master_comment)}`
    );
  }

  contentSections.push(
    '👉 点击阅读原文，查看更多内容 <br/>海棠诗社： https://haitang.app'
  );

  // Combine all sections with double line breaks
  const shareContent = contentSections.join('<br/>');

  const response = {
    id: work.id,
    date: dateString,
    title: work.title,
    quote: quote.quote,
    dynasty: quote.dynasty,
    author: quote.author,
    content: work.content,
    shareContent: shareContent,
  };

  return NextResponse.json(response);
}
