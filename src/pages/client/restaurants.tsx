import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Category } from "../../components/category";
import { Restaurant } from "../../components/restaurant";
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
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: { restaurantsInput: { page } },
  });
  const onPrevPageClick = () => setPage(current => current - 1);
  const onNextPageClick = () => setPage(current => current + 1);

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
        <div className="max-w-screen-xl mx-auto mt-5 pb-14">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories?.map(category => (
              <Category
                key={category.id}
                coverImage={category.coverImage}
                name={category.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-7 mt-14">
            {data?.restaurants.results?.map(restaurant => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                coverImage={restaurant.coverImage}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-12">
            {page > 1 ? (
              <button
                className="font-medium text-2xl focus:outline-none"
                onClick={onPrevPageClick}
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                className="font-medium text-2xl focus:outline-none"
                onClick={onNextPageClick}
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
