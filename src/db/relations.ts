import { relations } from 'drizzle-orm/relations';
import { table_users_like_works, table_works, user } from './schema';

export const usersLikeWorksRelations = relations(
  table_users_like_works,
  ({ one }) => ({
    user: one(user, {
      fields: [table_users_like_works.user_id],
      references: [user.id],
    }),
    work: one(table_works, {
      fields: [table_users_like_works.works_id],
      references: [table_works.id],
    }),
  })
);

export const usersRelations = relations(user, ({ many }) => ({
  usersLikeWorks: many(table_users_like_works),
}));

export const worksRelations = relations(table_works, ({ many }) => ({
  usersLikeWorks: many(table_users_like_works),
}));
