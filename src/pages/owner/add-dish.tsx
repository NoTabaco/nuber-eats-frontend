import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
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

type IAddDishForm = {
  name: string;
  price: string;
  description: string;
  options: {
    name: string;
    choices?: {
      name: string;
      extra: string;
    }[];
    extra: string;
  }[];
};

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
    control,
    getValues,
    formState: { isValid },
  } = useForm<IAddDishForm>({
    mode: "onChange",
  });
  const { fields, remove, append } = useFieldArray({
    name: "options",
    control,
  });
  const onSubmit = () => {
    const { name, price, description, ...options } = getValues();
    const optionsObj = options.options.map(option => ({
      name: option.name,
      extra: +option.extra,
    }));
    createDishMutation({
      variables: {
        createDishInput: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionsObj,
        },
      },
    });
    history.goBack();
  };
  const onAddOptionClick = () => {
    append({ name: "", extra: undefined });
  };
  const onDeleteClick = (idToDelete: number) => {
    remove(idToDelete);
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
        <div className="mt-2 mb-4">
          <h4 className="font-medium text-lg mb-3">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2"
          >
            Add Dish Option
          </span>
          {fields.map((field, index) => (
            <div key={field.id} className="mt-3">
              <input
                {...register(`options.${index}.name` as const)}
                className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                type="text"
                placeholder="Option Name"
              />
              <input
                {...register(`options.${index}.extra` as const)}
                className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                type="number"
                min={0}
                placeholder="Option Extra"
              />
              <span
                className="cursor-pointer text-white bg-red-500 py-2 px-4 ml-5"
                onClick={() => onDeleteClick(index)}
              >
                Delete Option
              </span>
            </div>
          ))}
        </div>
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
