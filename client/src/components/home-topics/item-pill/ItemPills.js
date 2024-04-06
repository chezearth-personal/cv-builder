import React from "react";
import ItemPill from './ItemPill';
import './ItemPills.css';


const ItemPills = ({ addToItem, addPill, removePill, items, item }) => {
  // console.log('props =', props);
  return (
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

export default ItemPills;
