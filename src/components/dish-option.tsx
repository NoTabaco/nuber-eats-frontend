interface IDishOptionProps {
  dishId: number;
  name: string;
  extra: number | null;
  isSelected: boolean;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  dishId,
  name,
  extra,
  isSelected,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };

  return (
    <span
      className={`border px-2 py-1 ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{name}</span>
      <span className="text-sm opacity-75">(${extra})</span>
    </span>
  );
};
