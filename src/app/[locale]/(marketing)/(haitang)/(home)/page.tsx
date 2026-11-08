import QuotesCard from '@/components/custom/home/quotes-card';
import TodayCard from '@/components/custom/home/today-card';
import { constructMetadata } from '@/lib/metadata';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    pathname: '/',
  });
}

export default async function HomePage(props: NextPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <TodayCard />

      <QuotesCard />
    </div>
  );
}
