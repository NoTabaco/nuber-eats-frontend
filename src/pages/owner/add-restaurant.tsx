import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurantMutation,
  createRestaurantMutationVariables,
} from "../../__generated__/createRestaurantMutation";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurantMutation(
    $createRestaurantInput: CreateRestaurantInput!
  ) {
    createRestaurant(input: $createRestaurantInput) {
      ok
      error
    }
  }
`;

interface ICreateRestaurantForm {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const onCompleted = (data: createRestaurantMutation) => {
    const {
      createRestaurant: { ok, error },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurantMutation,
    createRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ICreateRestaurantForm>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, address, categoryName } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:5000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          createRestaurantInput: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (error) {}
  };

  return (
    <div className="container flex flex-col items-center mt-10 md:mt-24 w-full max-w-screen-sm">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-3xl mb-5">Add Restaurant</h4>
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
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
          type="text"
          className="input"
        />
        <input
          {...register("categoryName", {
            required: "Category Name is required",
          })}
          placeholder="Category Name"
          type="text"
          className="input"
        />
        <div>
          <input
            {...register("file", { required: true })}
            type="file"
            accept="image/*"
          />
        </div>
        <Button
          canClick={isValid}
          loading={uploading}
          actionText={"Create Restaurant"}
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
