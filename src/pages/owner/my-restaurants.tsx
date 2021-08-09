import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurantsQuery } from "../../__generated__/myRestaurantsQuery";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurantsQuery {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurantsQuery>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="max-w-screen-xl mx-auto mt-24">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants?.length === 0 ? (
          <>
            <h4 className="text-xl mb-4">You have no restaurants</h4>
            <Link
              to="/add-restaurant"
              className="text-lime-600 hover:underline"
            >
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-7 mt-14 mx-5 md:mx-0">
            {data?.myRestaurants.restaurants?.map(restaurant => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                coverImage={restaurant.coverImage}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
