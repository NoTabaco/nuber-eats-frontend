/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: pendingOrdersSubscription
// ====================================================

export interface pendingOrdersSubscription_pendingOrders_driver {
  __typename: "User";
  email: string;
}

export interface pendingOrdersSubscription_pendingOrders_customer {
  __typename: "User";
  email: string;
}

export interface pendingOrdersSubscription_pendingOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface pendingOrdersSubscription_pendingOrders {
  __typename: "Order";
  id: number;
  total: number | null;
  status: OrderStatus;
  driver: pendingOrdersSubscription_pendingOrders_driver | null;
  customer: pendingOrdersSubscription_pendingOrders_customer | null;
  restaurant: pendingOrdersSubscription_pendingOrders_restaurant | null;
}

export interface pendingOrdersSubscription {
  pendingOrders: pendingOrdersSubscription_pendingOrders;
}
