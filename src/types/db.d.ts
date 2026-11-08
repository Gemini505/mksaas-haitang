import type {
  table_authors,
  table_collection_kinds,
  table_collection_quotes,
  table_collection_works,
  table_collections,
  table_dynasties,
  table_quotes,
  table_works,
} from '@/db/schema';

/**
 * Database Table Types
 */
export type Author = typeof table_authors.$inferSelect;
export type Dynasty = typeof table_dynasties.$inferSelect;
export type Quote = typeof table_quotes.$inferSelect;
export type Work = typeof table_works.$inferSelect;
export type Collection = typeof table_collections.$inferSelect;
export type CollectionKind = typeof table_collection_kinds.$inferSelect;
export type CollectionQuote = typeof table_collection_quotes.$inferSelect;
export type CollectionWork = typeof table_collection_works.$inferSelect;
