import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
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
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation($createOrderInput: CreateOrderInput!) {
    createOrder(input: $createOrderInput) {
      ok
      error
    }
  }
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
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find(orderItem => orderItem.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems(current => [...current, { dishId, options: [] }]);
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems(current =>
      current.filter(orderItem => orderItem.dishId !== dishId)
    );
  };
  const addOptionToItem = (dishId: number, option: any) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems(current => [
        ...current,
        { dishId, options: [...oldItem.options!, option] },
      ]);
    }
  };
  console.log(orderItems);
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
      <div className="max-w-screen-xl mx-5 md:mx-auto mt-12 flex flex-col items-end">
        <button className="btn px-10" onClick={triggerStartOrder}>
          {orderStarted ? "Ordering" : "Start Order"}
        </button>
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-7 mt-14 w-full">
          {data?.restaurant.restaurant?.menu.map(dish => (
            <Dish
              key={dish.id}
              id={dish.id}
              name={dish.name}
              price={dish.price}
              description={dish.description}
              isCustomer={true}
              isSelected={isSelected(dish.id)}
              options={dish.options}
              orderStarted={orderStarted}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
              addOptionToItem={addOptionToItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
