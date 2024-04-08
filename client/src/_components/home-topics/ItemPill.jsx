import React from 'react';


const ItemPill = (props) => {
  return (
    <div className='pill'>
      <p className='pillText'>{props.itemName}</p>
      <div
        className='pillRemove'
        onClick={() => props.removePill(props.index)}
      >
        {'\u00D7'}
      </div>
    </div>
  );
}

export default ItemPill;
