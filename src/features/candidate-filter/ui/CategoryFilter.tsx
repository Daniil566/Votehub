interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="filter-row">
      {categories.map((category) => (
        <button
          className={activeCategory === category ? "active" : ""}
          key={category}
          type="button"
          onClick={() => onChange(category)}
        >
          {category === "all" ? "Все" : category}
        </button>
      ))}
    </div>
  );
}
