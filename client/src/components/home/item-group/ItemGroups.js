import React from 'react';
import ItemGroup from './ItemGroup';

export default function ItemGroups({ itemGroups, setItemGroups, updateParent, ...props }) {
  /** Updates the state with user's input */
  const handleAddItemGroup = () =>
    setItemGroups([ ...itemGroups, { name: '' }]);
  /** Updates an item within the list */
  const handleUpdateItemGroup = (e, index) => {
    if (e && e.target) {
      const { value } = e.target;
      const list = [...itemGroups];
      list[index]['name'] = value;
      setItemGroups(list);
      console.log('updateParent =', updateParent);
      if (updateParent) {
        updateParent(list);
      }
    }
  }
  /** Removes a selected item from the list */
  const handleRemoveItemGroup = (index) => {
    const list = [...itemGroups];
    list.splice(index, 1);
    setItemGroups(list);
  }
  return (
    <div>
      <p>{props.description}</p>
      {itemGroups.map((itemGroup, index) => (
          <ItemGroup
            key={index}
            itemGroup={itemGroup}
            addItemGroup={handleAddItemGroup}
            updateItemGroup={handleUpdateItemGroup}
            removeItemGroup={handleRemoveItemGroup}
            index={index}
            numItemGroups={itemGroups.length}
            name={props.name}
            pillGroupLabel={props.pillGroupLabel}
            pillItemLabel={props.pillItemLabel}
          />
      ))}
    </div>
  );
}
