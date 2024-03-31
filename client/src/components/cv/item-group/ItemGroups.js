import React from 'react';
import ItemGroup from './ItemGroup';

export default function ItemGroups({ handleBr, itemGroups, ...props }) {
  return (
    <div className='cvPoint'>
      <h4 className='cvBodyTitle'>{props.headingText}</h4>
      {itemGroups.map((itemGroup, index) => (
        <ItemGroup key={index} handleBr={handleBr} itemGroup={itemGroup} />
      ))}
    </div>
  )
}

