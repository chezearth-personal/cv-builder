import React from 'react';
import ItemGroup from './ItemGroup';

export default function ItemGroups({ itemGroups, setItemGroups, ...props }) {
  /** Updates the state with user's input */
  const handleAddItemGroup = () =>
    setItemGroups([ ...itemGroups, { name: '' }]);
  /** Updates an item within the list */
  const handleUpdateItemGroup = (e, index) => {
    const { value } = e.target;
    const list = [...itemGroups];
    list[index]['name'] = value;
    setItemGroups(list);
  }
  /** Removes a selected item from the list */
  const handleRemoveItemGroup = (index) => {
    const list = [...itemGroups];
    list.splice(index, 1);
    setItemGroups(list);
  }
  return (
    <div className='listItems'>{props.description}
      {itemGroups.map((itemGroup, index) => (
        <div className='compositeContainer' key={index}>
          <ItemGroup
            addItemGroup={handleAddItemGroup}
            updateItemGroup={handleUpdateItemGroup}
            removeItemGroup={handleRemoveItemGroup}
            index={index}
            numItemGroups={itemGroups.length}
          />
        </div>
      ))}
    </div>
  );
}