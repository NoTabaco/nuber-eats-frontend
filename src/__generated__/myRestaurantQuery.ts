/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurantQuery
// ====================================================

export interface myRestaurantQuery_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurantQuery_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: myRestaurantQuery_myRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface myRestaurantQuery_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurantQuery_myRestaurant_restaurant | null;
}

export interface myRestaurantQuery {
  myRestaurant: myRestaurantQuery_myRestaurant;
}

export interface myRestaurantQueryVariables {
  myRestaurantInput: MyRestaurantInput;
}
