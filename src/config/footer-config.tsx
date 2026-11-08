'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get footer config with translations
 *
 * NOTICE: used in client components only
 *
 * docs:
 * https://mksaas.com/docs/config/footer
 *
 * @returns The footer config with translated titles
 */
export function useFooterLinks(): NestedMenuItem[] {
  const t = useTranslations('Marketing.footer');

  return [
    {
      title: '网站导航',
      items: [
        {
          title: '诗词推荐',
          href: Routes.Root,
          external: false,
        },
        {
          title: '诗文检索',
          href: Routes.Works,
          external: false,
        },
        {
          title: '作者检索',
          href: Routes.Authors,
          external: false,
        },
        {
          title: '名句检索',
          href: Routes.Quotes,
          external: false,
        },
      ],
    },
    {
      title: '热门诗集',
      items: [
        {
          title: '唐诗三百首',
          href: '/works?c=1',
          external: false,
        },
        {
          title: '宋词三百首',
          href: '/works?c=2',
          external: false,
        },
        {
          title: '古诗十九首',
          href: '/works?c=13',
          external: false,
        },
        {
          title: '给孩子的诗',
          href: '/works?c=3',
          external: false,
        },
      ],
    },
    {
      title: '热门作者',
      items: [
        {
          title: '李白',
          href: '/authors/10041',
          external: false,
        },
        {
          title: '杜甫',
          href: '/authors/10035',
          external: false,
        },
        {
          title: '苏轼',
          href: '/authors/10001',
          external: false,
        },
        {
          title: '李清照',
          href: '/authors/10043',
          external: false,
        },
      ],
    },
    // {
    //   title: t('resources.title'),
    //   items: [
    // {
    //   title: t('resources.items.blog'),
    //   href: Routes.Blog,
    //   external: false,
    // },
    // {
    //   title: t('resources.items.docs'),
    //   href: Routes.Docs,
    //   external: false,
    // },
    // {
    //   title: t('resources.items.changelog'),
    //   href: Routes.Changelog,
    //   external: false,
    // },
    // {
    //   title: t('resources.items.roadmap'),
    //   href: Routes.Roadmap,
    //   external: true,
    // },
    //   ],
    // },
    // {
    //   title: t('company.title'),
    //   items: [
    // {
    //   title: t('company.items.about'),
    //   href: Routes.About,
    //   external: false,
    // },
    // {
    //   title: t('company.items.contact'),
    //   href: Routes.Contact,
    //   external: false,
    // },
    // {
    //   title: t('company.items.waitlist'),
    //   href: Routes.Waitlist,
    //   external: false,
    // },
    //   ],
    // },
    {
      title: '法律声明',
      items: [
        {
          title: t('company.items.about'),
          href: Routes.About,
          external: false,
        },
        {
          title: t('company.items.contact'),
          href: Routes.Contact,
          external: false,
        },
        // {
        //   title: t('legal.items.cookiePolicy'),
        //   href: Routes.CookiePolicy,
        //   external: false,
        // },
        {
          title: t('legal.items.privacyPolicy'),
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('legal.items.termsOfService'),
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
  ];
}
