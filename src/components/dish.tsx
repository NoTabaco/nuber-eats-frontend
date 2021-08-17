import { restaurantQuery_restaurant_restaurant_menu_options } from "../__generated__/restaurantQuery";

interface IDishProps {
  name: string;
  price: number;
  description: string;
  isCustomer?: boolean;
  options?: restaurantQuery_restaurant_restaurant_menu_options[] | null;
}

export const Dish: React.FC<IDishProps> = ({
  name,
  price,
  description,
  isCustomer = false,
  options,
}) => {
  return (
    <div className="px-4 py-3 border hover:border-gray-800 transition duration-500 ease-in-out">
      <div className="mb-8">
        <h3 className="font-medium mb-1">{name}</h3>
        <h4 className="font-light text-gray-500 text-sm">{description}</h4>
      </div>
      <span className="font-light">${price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="mt-5 mb-2 font-medium">Dish Options</h5>
          {options?.map((option, index) => (
            <span key={index} className="flex items-center">
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
