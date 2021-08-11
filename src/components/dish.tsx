interface IDishProps {
  name: string;
  price: number;
  description: string;
}

export const Dish: React.FC<IDishProps> = ({ name, price, description }) => {
  return (
    <div className="px-4 py-3 border hover:border-gray-800 transition duration-500 ease-in-out">
      <div className="mb-8">
        <h3 className="font-medium mb-1">{name}</h3>
        <h4 className="font-light text-gray-500 text-sm">{description}</h4>
      </div>
      <span className="font-light">${price}</span>
    </div>
  );
};
