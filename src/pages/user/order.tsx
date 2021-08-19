import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  getOrderQuery,
  getOrderQueryVariables,
} from "../../__generated__/getOrderQuery";

const GET_ORDER_QUERY = gql`
  query getOrderQuery($getOrderInput: GetOrderInput!) {
    getOrder(input: $getOrderInput) {
      ok
      error
      order {
        id
        total
        status
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

interface IOrderParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IOrderParams>();
  const { data } = useQuery<getOrderQuery, getOrderQueryVariables>(
    GET_ORDER_QUERY,
    { variables: { getOrderInput: { id: +params.id } } }
  );
  console.log(data);
  return (
    <div className="container flex justify-center mt-10 md:mt-24">
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
          <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
            Status: {data?.getOrder.order?.status}
          </span>
        </div>
      </div>
    </div>
  );
};
