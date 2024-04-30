import { ChangeEvent, useState } from "react";
import { BsChevronDown } from "react-icons/bs";

interface CategorySelectorProps {
  onSelectedCategory: (category: string) => void;
}

const CategorySelector = ({ onSelectedCategory }: CategorySelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onSelectedCategory(category); // Notify parent component
  };

  return (
    <>
      <div className="relative w-full lg:max-w-sm">
        <select
          className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600 cursor-pointer"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {/* Other category options */}
          <option value="All">All</option>
          <option value="General">General</option>
          <option value="Events">Events</option>
          <option value="Good and services">Good and services</option>
          <option value="News">News</option>
          <option value="Activities">Activities</option>
        </select>
        <BsChevronDown className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </>
  );
};

export default CategorySelector;
