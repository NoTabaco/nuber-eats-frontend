import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  createOrderMutation,
  createOrderMutationVariables,
} from "../../__generated__/createOrderMutation";
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
      orderId
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
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find(aOption => aOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems(current => [
          ...current,
          { dishId, options: [...oldItem.options!, { name: optionName }] },
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find(option => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems(current => [
        ...current,
        {
          dishId,
          options: oldItem.options?.filter(
            option => option.name !== optionName
          ),
        },
      ]);
    }
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrderMutation) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrderMutation,
    createOrderMutationVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });
  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order?");
    if (ok) {
      createOrderMutation({
        variables: {
          createOrderInput: { restaurantId: +params.id, items: orderItems },
        },
      });
    }
  };

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
        {!orderStarted && (
          <button className="btn px-10" onClick={triggerStartOrder}>
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button className="btn px-10 mr-3" onClick={triggerConfirmOrder}>
              Confirm Order
            </button>
            <button
              className="btn px-10 bg-black hover:bg-black"
              onClick={triggerCancelOrder}
            >
              Cancel Order
            </button>
          </div>
        )}
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
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  name={option.name}
                  extra={option.extra}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
