import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";

const CATEGORY_QUERY = gql`
  query categoryQuery($categoryInput: CategoryInput!) {
    category(input: $categoryInput) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  // come from /:slug
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    { variables: { categoryInput: { page: 1, slug: params.slug } } }
  );

  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <h1>Category</h1>
    </div>
  );
};
