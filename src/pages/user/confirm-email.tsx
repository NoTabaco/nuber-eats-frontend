import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useMe } from "../../hooks/useMe";
import {
  verifyEmailMutation,
  verifyEmailMutationVariables,
} from "../../__generated__/verifyEmailMutation";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmailMutation($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: verifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
    }
  };
  const [verifyEmailMutation] = useMutation<
    verifyEmailMutation,
    verifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmailMutation({
      variables: { verifyEmailInput: { code } },
    });
  }, []);

  return (
    <div className="mt-60 flex flex-col justify-center items-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
