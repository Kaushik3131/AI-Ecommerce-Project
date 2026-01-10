"use server";

import { sanityFetch } from "@/sanity/lib/live";
import {
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from "@/sanity/queries/products";

interface FetchMoreProductsParams {
  searchQuery: string;
  categorySlug: string;
  color: string;
  material: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sort: string;
  offset: number;
  limit: number;
}

export async function fetchMoreProducts(params: FetchMoreProductsParams) {
  const getQuery = () => {
    if (params.searchQuery && params.sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (params.sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  const { data: products } = await sanityFetch({
    query: getQuery(),
    params: {
      searchQuery: params.searchQuery,
      categorySlug: params.categorySlug,
      color: params.color,
      material: params.material,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      inStock: params.inStock,
      offset: params.offset,
      limit: params.limit,
    },
  });

  return products;
}
