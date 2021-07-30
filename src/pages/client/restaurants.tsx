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
              <div
                key={category.id}
                className="flex flex-col group items-center cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100"
                  style={{ backgroundImage: `url(${category.coverImage})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-7 mt-10">
            {data?.restaurants.results?.map(restaurant => (
              <div key={restaurant.id}>
                <div
                  className="bg-cover bg-center py-24 mb-2"
                  style={{ backgroundImage: `url(${restaurant.coverImage})` }}
                ></div>
                <h3 className="text-lg font-medium">{restaurant.name}</h3>
                <span className="border-t-2 border-gray-200">
                  {restaurant.category?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
