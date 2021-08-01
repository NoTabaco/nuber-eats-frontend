import { Link } from "react-router-dom";

interface ICategoryProps {
  id: number;
  coverImage?: string | null;
  name: string;
  slug: string;
}

export const Category: React.FC<ICategoryProps> = ({
  id,
  coverImage,
  name,
  slug,
}) => (
  <Link to={`/category/${slug}`}>
    <div className="flex flex-col group items-center cursor-pointer">
      <div
        className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100"
        style={{ backgroundImage: `url(${coverImage})` }}
      ></div>
      <span className="mt-1 text-sm font-medium">{name}</span>
    </div>
  </Link>
);
