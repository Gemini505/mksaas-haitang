'use server';

import { getDb } from '@/db';
import { table_users_like_works } from '@/db/schema';
import { getSession } from '@/lib/server';
import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

const actionClient = createSafeActionClient();

const addFavoriteSchema = z.object({
  workId: z.number().int().min(1, { message: 'workId is required' }),
  workTitle: z.string().min(1),
  workAuthor: z.string().min(1),
  workDynasty: z.string().min(1),
});

const favoriteSchema = z.object({
  workId: z.number().int().min(1, { message: 'workId is required' }),
});

export const addFavoriteAction = actionClient
  .schema(addFavoriteSchema)
  .action(async ({ parsedInput }) => {
    const { workId, workTitle, workAuthor, workDynasty } = parsedInput;
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = session.user.id;
    const db = await getDb();
    try {
      await db.insert(table_users_like_works).values({
        works_id: workId,
        works_title: workTitle,
        works_author: workAuthor,
        works_dynasty: workDynasty,
        user_id: userId,
      });
      return { success: true, isFavorite: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });

export const removeFavoriteAction = actionClient
  .schema(favoriteSchema)
  .action(async ({ parsedInput }) => {
    const { workId } = parsedInput;
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = session.user.id;
    try {
      const db = await getDb();
      await db
        .delete(table_users_like_works)
        .where(
          and(
            eq(table_users_like_works.user_id, userId),
            eq(table_users_like_works.works_id, workId)
          )
        );
      return { success: true, isFavorite: false };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });

export const checkFavoriteAction = actionClient
  .schema(favoriteSchema)
  .action(async ({ parsedInput }) => {
    const { workId } = parsedInput;
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized', isFavorite: false };
    }
    const userId = session.user.id;
    try {
      const db = await getDb();
      const exist = await db
        .select()
        .from(table_users_like_works)
        .where(
          and(
            eq(table_users_like_works.user_id, userId),
            eq(table_users_like_works.works_id, workId)
          )
        )
        .limit(1);
      return { success: true, isFavorite: exist.length > 0 };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
        isFavorite: false,
      };
    }
  });
