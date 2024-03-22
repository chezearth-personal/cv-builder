import React from 'react';
import ItemGroup from './ItemGroup';

export default function ItemGroups(props) {
  /** Updates the state with user's input */
  const handleAddItemGroup = () =>
    props.setSkillGroups([ ...props.skillGroups, { name: '' }]);
  /** Updates an item within the list */
  const handleUpdateItemGroup = (e, index) => {
    const { value } = e.target;
    const list = [...props.skillGroups];
    list[index]['name'] = value;
    props.setSkillGroups(list);
  }
  /** Removes a selected item from the list */
  const handleRemoveItemGroup = (index) => {
    const list = [...props.skillGroups];
    list.splice(index, 1);
    props.setSkillGroups(list);
  }
  return (
    <div key={props.name} className='listItems'>{props.description}
      {props.itemGroups.map((itemGroup, index) => (
        <ItemGroup
          name={`skill_group_${index}`}
          index={index}
          numSkillGroups={props.itemGroups.length}
          itemGroup={itemGroup}
          addItemGroup={handleAddItemGroup}
          updateItemGroup={handleUpdateItemGroup}
          removeItemGroup={handleRemoveItemGroup}
        />
      ))}
    </div>
  );
}
