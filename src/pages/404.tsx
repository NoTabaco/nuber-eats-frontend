import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col justify-center items-center">
    <Helmet>
      <title>Not Found | Nuber Eats</title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">Page Not Found</h2>
    <h4 className="font-medium text-base mb-6">
      The page you're looking for does not exist or has moved
    </h4>
    <Link to="/" className="hover:underline text-lime-600">
      Go back home &rarr;
    </Link>
  </div>
);
