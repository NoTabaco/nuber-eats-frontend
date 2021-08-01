import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantQuery,
  restaurantQueryVariables,
} from "../../__generated__/restaurantQuery";

const RESTAURANT_QUERY = gql`
  query restaurantQuery($restaurantInput: RestaurantInput!) {
    restaurant(input: $restaurantInput) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();
  const { loading, data } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    { variables: { restaurantInput: { restaurantId: +params.id } } }
  );

  return (
    <div>
      <Helmet>
        <title>{`${data?.restaurant.restaurant?.name} | Nuber Eats`}</title>
      </Helmet>
      <div
        className="py-14 bg-center bg-cover bg-gray-800"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-6 pl-20">
          <h4 className="text-3xl mb-1">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-3">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  );
};
