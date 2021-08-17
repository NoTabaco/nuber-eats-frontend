import { restaurantQuery_restaurant_restaurant_menu_options } from "../__generated__/restaurantQuery";

interface IDishProps {
  id?: number;
  name: string;
  price: number;
  description: string;
  isCustomer?: boolean;
  isSelected?: boolean;
  orderStarted?: boolean;
  options?: restaurantQuery_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, option: any) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  description,
  isCustomer = false,
  isSelected = false,
  orderStarted = false,
  options,
  addItemToOrder,
  removeFromOrder,
  addOptionToItem,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`px-4 py-3 border transition duration-500 ease-in-out cursor-pointer ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-8">
        <h3 className="font-medium mb-1">
          {name}{" "}
          {orderStarted && (
            <button onClick={onClick}>{isSelected ? "Remove" : "Add"}</button>
          )}
        </h3>
        <h4 className="font-light text-gray-500 text-sm">{description}</h4>
      </div>
      <span className="font-light">${price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="mt-5 mb-2 font-medium">Dish Options</h5>
          {options?.map((option, index) => (
            <span
              key={index}
              className="flex items-center"
              onClick={() =>
                addOptionToItem &&
                addOptionToItem(id, {
                  name: option.name,
                })
              }
            >
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
