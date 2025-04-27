import { useState } from 'react';

type MenuProps = {
  categories: string[];
};

export default function ServiceMenu({ categories }: MenuProps) {
  const [selected, setSelected] = useState(categories[0]); // first one selected by default

  return (
    <div className="service-menu">
      {categories.map((category) => (
        <button
          key={category}
          className={`menu-item ${selected === category ? 'active' : ''}`}
          onClick={() => setSelected(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}