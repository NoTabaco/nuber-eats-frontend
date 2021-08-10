import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createDishMutation,
  createDishMutationVariables,
} from "../../__generated__/createDishMutation";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDishMutation($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput) {
      ok
      error
    }
  }
`;

interface IAddDishForm {
  name: string;
  price: string;
  description: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const history = useHistory();
  const [createDishMutation, { loading, data }] = useMutation<
    createDishMutation,
    createDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { myRestaurantInput: { id: +restaurantId } },
      },
    ],
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IAddDishForm>({
    mode: "onChange",
  });
  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        createDishInput: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    history.goBack();
  };

  return (
    <div className="container max-w-screen-sm flex flex-col items-center mt-10 md:mt-32">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-3xl mb-5">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 mt-5 mb-4 w-full"
      >
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          type="text"
          className="input"
        />
        <input
          {...register("price", { required: "Price is required" })}
          placeholder="Price"
          type="number"
          className="input"
          min={0}
        />
        <input
          {...register("description", { required: "Description is required" })}
          placeholder="Description"
          type="text"
          className="input"
        />
        <Button
          canClick={isValid}
          loading={loading}
          actionText={"Create Dish"}
        />
        {data?.createDish.error && (
          <FormError errorMessage={data.createDish.error} />
        )}
      </form>
    </div>
  );
};
