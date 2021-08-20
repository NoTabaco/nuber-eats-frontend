import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { useMe } from "../../hooks/useMe";
import {
  editOrderMutation,
  editOrderMutationVariables,
} from "../../__generated__/editOrderMutation";
import {
  getOrderQuery,
  getOrderQueryVariables,
} from "../../__generated__/getOrderQuery";
import { OrderStatus, UserRole } from "../../__generated__/globalTypes";
import { orderUpdatesSubscription } from "../../__generated__/orderUpdatesSubscription";

const GET_ORDER_QUERY = gql`
  query getOrderQuery($getOrderInput: GetOrderInput!) {
    getOrder(input: $getOrderInput) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdatesSubscription(
    $orderUpdatesInput: OrderUpdatesInput!
  ) {
    orderUpdates(input: $orderUpdatesInput) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrderMutation($editOrderInput: EditOrderInput!) {
    editOrder(input: $editOrderInput) {
      ok
      error
    }
  }
`;

interface IOrderParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IOrderParams>();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<
    editOrderMutation,
    editOrderMutationVariables
  >(EDIT_ORDER_MUTATION);
  const { data, subscribeToMore } = useQuery<
    getOrderQuery,
    getOrderQueryVariables
  >(GET_ORDER_QUERY, { variables: { getOrderInput: { id: +params.id } } });
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: { orderUpdatesInput: { id: +params.id } },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdatesSubscription } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: data.orderUpdates,
            },
          };
        },
      });
    }
  }, [data, params.id, subscribeToMore]);
  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: { editOrderInput: { id: +params.id, status: newStatus } },
    });
  };

  return (
    <div className="container flex justify-center mt-10 md:mt-24">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet"}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  className="btn"
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  className="btn"
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Pending &&
                data?.getOrder.order?.status !== OrderStatus.Cooking && (
                  <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
