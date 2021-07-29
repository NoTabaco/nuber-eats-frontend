import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { useMe } from "../../hooks/useMe";
import {
  editProfileMutation,
  editProfileMutationVariables,
} from "../../__generated__/editProfileMutation";
import { UserRole } from "../../__generated__/globalTypes";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
  role: UserRole;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const onCompleted = (data: editProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
    }
  };
  const [editProfileMutation, { loading, data: editProfileMutationResult }] =
    useMutation<editProfileMutation, editProfileMutationVariables>(
      EDIT_PROFILE_MUTATION,
      {
        onCompleted,
      }
    );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
      role: userData?.me.role,
    },
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      editProfileMutation({
        variables: {
          editProfileInput: {
            email,
            role,
            ...(password !== "" && { password }),
          },
        },
      });
    }
  };

  return (
    <div className="mt-44 flex flex-col justify-center items-center">
      <Helmet>
        <title>EditProfile | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        className="grid gap-3 mt-5 mb-4 w-full max-w-screen-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Please enter a valid email",
            },
          })}
          className="input"
          type="email"
          required
          placeholder="Email"
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email.message} />
        )}
        <input
          {...register("password")}
          className="input"
          type="password"
          placeholder="Password"
        />
        <select {...register("role")} className="input">
          {Object.keys(UserRole).map((role, index) => (
            <option key={index}>{role}</option>
          ))}
        </select>
        <Button
          canClick={isValid}
          loading={loading}
          actionText={"Save Profile"}
        />
        {editProfileMutationResult?.editProfile.error && (
          <FormError
            errorMessage={editProfileMutationResult?.editProfile.error}
          />
        )}
      </form>
    </div>
  );
};
