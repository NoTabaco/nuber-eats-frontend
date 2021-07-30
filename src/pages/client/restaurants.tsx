import { gql, useQuery } from "@apollo/client";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($restaurantsInput: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $restaurantsInput) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: { restaurantsInput: { page: 1 } },
  });

  return (
    <div>
      <form className="bg-gray-800 w-full py-32 flex justify-center items-center">
        <input
          className="input rounded-md border-0 w-3/12"
          type="Search"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-5">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories?.map(category => (
              <div className="flex flex-col items-center cursor-pointer">
                <div
                  key={category.id}
                  className="w-14 h-14 rounded-full bg-cover hover:bg-gray-100"
                  style={{ backgroundImage: `url(${category.coverImage})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
