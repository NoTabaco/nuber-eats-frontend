import { gql, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  createDishMutation,
  createDishMutationVariables,
} from "../../__generated__/createDishMutation";

const CREATE_DISH_MUTATION = gql`
  mutation createDishMutation($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput) {
      ok
      error
    }
  }
`;

export const AddDish = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [createDishMutation, { loading, data }] = useMutation<
    createDishMutation,
    createDishMutationVariables
  >(CREATE_DISH_MUTATION);

  return <h1>AddDish</h1>;
};
