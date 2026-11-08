/**
 * Category
 */
export type Category = {
  name: string;
  slug: string;
};

/**
 * Category List
 */
export type CategoryList = Category[];

/**
 * Group
 */
export type Group = {
  name: string;
  slug: string;
  categories: Category[];
};

/**
 * Group List
 */
export type GroupList = Group[];

/**
 * Tag Filter Item
 */
export interface TagFilterItem {
  slug: string;
  name: string;
}

/**
 * Category Filter Item
 */
export interface CategoryFilterItem {
  slug: string;
  name: string;
}

/**
 * Recommendation
 */
export type Recommendation = {
  name: string;
  url: string;
};

/**
 * Recommendation List
 */
export type RecommendationList = Recommendation[];
