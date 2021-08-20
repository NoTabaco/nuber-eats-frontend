import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { Dish } from "../../components/dish";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDER_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  myRestaurantQuery,
  myRestaurantQueryVariables,
} from "../../__generated__/myRestaurantQuery";
import { pendingOrdersSubscription } from "../../__generated__/pendingOrdersSubscription";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurantQuery($myRestaurantInput: MyRestaurantInput!) {
    myRestaurant(input: $myRestaurantInput) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrdersSubscription {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IMyRestaurantParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IMyRestaurantParams>();
  const { data } = useQuery<myRestaurantQuery, myRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { myRestaurantInput: { id: +id } } }
  );
  const { data: subscriptionData } = useSubscription<pendingOrdersSubscription>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData, history]);

  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || "Loading..."} | Nuber Eats
        </title>
      </Helmet>
      <div
        className="py-24 bg-center bg-cover bg-gray-800"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurants/${id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to="" className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-4">Please upload a dish!</h4>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-7 mt-14 mx-5 md:mx-0">
              {data?.myRestaurant.restaurant?.menu.map(dish => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  price={dish.price}
                  description={dish.description}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-14 mb-7">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div>
            <VictoryChart
              width={window.innerWidth}
              theme={VictoryTheme.material}
              height={400}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 18 }}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders?.map(order => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 3,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{ tickLabels: { fontSize: 18 } }}
                tickFormat={tick => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
