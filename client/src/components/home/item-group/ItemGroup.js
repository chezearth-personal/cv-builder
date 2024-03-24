import React, { useState } from 'react';
import ItemPills from '../item-pill/ItemPills';

export default function ItemGroup({
  // itemGroups,
  itemGroup,
  addItemGroup,
  updateItemGroup,
  removeItemGroup,
  ...props
}) {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const addToItem = (item) => {
    setItem(item);
  };
  const handleAddPill = () => {
    const newItem = item.trim();
    const numSame = items.filter(i => i.name === item).length; 
    setItem('');
    if (newItem !== '' && numSame === 0) {
      const newItemsList = [...items, { name: newItem }];
      // updateItemGroup({ ...itemGroup, ...{ itemList: newItemsList } });
      updateItemGroup(Object.assign(itemGroup, { itemList: newItemsList }));
      // console.log('(added item to items) items =' , items);
      setItems(() => newItemsList);
    } else {
      if (numSame > 0) {
        alert('Item already exists');
      }
      setItems(() => [...items]);
    }
  }
  const handleRemovePill = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    updateItemGroup(Object.assign(itemGroup, { itemList: newItems }));
    setItems(newItems);
  };
  return (
    <div className='compositeContainer'>
      <div className='nestedContainer'>
        <div className='listItem'>
          <div className='text__group'>
            <label htmlFor='skillGroup'>Enter a skill group</label>
            <input
              type='text'
              required
              name='skillGroup'
              id='skillGroup'
              onChange={e => updateItemGroup(e, props.index)}
            />
          </div>
        </div>
        <div className='btn__group'>
          {props.numItemGroups - 1 === props.index && props.numItemGroups < 20 && (
            <button id='addBtn' onClick={addItemGroup}>
              Add
            </button>
          )}
          {props.numItemGroups > 1 && (
            <button id='deleteBtn' onClick={() => removeItemGroup(props.index)}>
              Delete
            </button>
          )}
        </div>
      </div>
      <ItemPills
        addToItem={addToItem}
        addPill={handleAddPill}
        removePill={handleRemovePill}
        items={items}
        item={item}
        pillGroupLabel='Enter a skill group'
        pillItemLabel='Skill to be added'
      />
    </div>
  );
}
        // name={`${props.name}_pills`}
