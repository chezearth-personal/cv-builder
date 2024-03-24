import React from "react";
import ItemPill from './ItemPill';
import './ItemPills.css';


const ItemPills = ({ addToItem, addPill, removePill, items, item, ...props }) => {
  // console.log('props =', props);
  return (
    <div className='itemPills' key={props.name}>
      <div className='itemPillsInput'>
        <div className='text__group'>
          <label htmlFor='inputItem'>{props.pillItemLabel}</label>
          <input id='inputItem' type='text' value={item} onChange={(e) => addToItem(e.target.value)} />
        </div>
        <div className='btn__group'>
          <button onClick={() => addPill()}>Add item</button>
        </div>
      </div>
      <div className='itemPillsList'>
        {items.map((item, index) => (
          <ItemPill key={index} index={index} itemName={item.name} removePill={removePill} />
        ))}
      </div>
    </div>
  );
}

export default ItemPills;
