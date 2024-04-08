import React from "react";
import ItemPill from './ItemPill';
import './ItemPills.css';

export { ItemPills };

function ItemPills({ removePill, items }) {
  return items && (
    <div className='itemPills'>
      <div className='itemPillsList'>
        {items.map((item, index) => (
          <ItemPill
            key={index}
            index={index}
            itemName={item.name}
            removePill={removePill}
          />
        ))}
      </div>
    </div>
  );
}
