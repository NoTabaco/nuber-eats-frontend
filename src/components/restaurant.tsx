interface IRestaurantProps {
  id: number;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImage,
  name,
  categoryName,
}) => (
  <div className="flex flex-col">
    <div
      className="bg-cover bg-center py-24 mb-2"
      style={{ backgroundImage: `url(${coverImage})` }}
    ></div>
    <h3 className="text-lg">{name}</h3>
    <span className="border-t border-gray-400 mt-2 py-2 text-xs opacity-50">
      {categoryName}
    </span>
  </div>
);
