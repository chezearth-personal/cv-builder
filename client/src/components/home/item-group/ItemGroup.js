import React, { useState } from 'react';
import ItemPills from './item-pill/ItemPills';

export default function ItemGroup({
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
      updateItemGroup(Object.assign(itemGroup, { itemList: newItemsList }));
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
      <div className='inputContainer'>
        <div className='nestedContainer'>
          <div className='listItem'>
            <div className='text__group'>
              <label htmlFor={`${props.name}_${props.index}`}>{props.pillGroupLabel}</label>
              <input
                type='text'
                required
                name='itemGroup'
                id={`${props.name}_${props.index}`}
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
        <div className='itemPillsInput'>
          <div className='text__group'>
            <label htmlFor={`${props.name}_input_${props.index}`}>{props.pillItemLabel}</label>
            <input
              id={`${props.name}_input_${props.index}`}
              name='inputItem'
              type='text'
              value={item}
              onChange={(e) => addToItem(e.target.value)}
            />
          </div>
          <div className='btn__group'>
            <button onClick={() => handleAddPill()}>Add item</button>
          </div>
        </div>
      </div>
      <ItemPills
        addToItem={addToItem}
        removePill={handleRemovePill}
        items={items}
        item={item}
        index={props.index}
        name={props.name}
        pillGroupLabel={props.pillGroupLabel}
        pillItemLabel={props.pillItemLabel}
      />
    </div>
  );
}
        // name={`${props.name}_pills`}
