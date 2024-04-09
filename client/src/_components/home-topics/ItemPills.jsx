import React from "react";
// import ItemPill from './ItemPill';
import './ItemPills.css';

export { ItemPills };

function ItemPills({ removePill, items }) {
  return items && (
    <div className='itemPills'>
      <div className='itemPillsList'>
        {items.map((item, index) => (
          <div key={index} className='pill'>
            <p className='pillText'>{item.name}</p>
            <div
              className='pillRemove'
              onClick={() => removePill(index)}
            >
              {'\u00D7'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
