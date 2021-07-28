import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();

  return (
    <header className="py-5">
      <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
        <img src={nuberLogo} className="w-36" alt="Nuber Logo" />
        <span className="text-sm">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-xl" />
          </Link>
        </span>
      </div>
    </header>
  );
};
