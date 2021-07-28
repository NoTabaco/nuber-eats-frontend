import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { Restaurants } from "../pages/client/restaurants";
import { UserRole } from "../__generated__/globalTypes";

const ClientRoutes = () => [
  <Route path="/" exact key={Math.random()}>
    <Restaurants />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client && ClientRoutes()}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
