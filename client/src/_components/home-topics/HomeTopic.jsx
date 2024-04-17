import { useState } from 'react';
import { ItemPills } from './ItemPills';

export function HomeTopic ({
  homeTopic,
  addHomeTopic,
  updateHomeTopic,
  removeHomeTopic,
  ...props
}) {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const addToItem = (item) => {
    setItem(item);
  };

  const handleAddPill = () => {
    // console.log('item =', item);
    // console.log('items =', items);
    const newItem = item.trim();
    const numSame = items.filter(i => i.name === newItem).length; 
    // console.log('numSame =', numSame);
    setItem('');
    if (newItem !== '' && numSame === 0) {
      setItems(items => [ ...items, { name: newItem } ]);
      // console.log('after update items =', items);
      // const newItemsList = [...items, { name: newItem }];
      updateHomeTopic(Object.assign(homeTopic, { itemList: [ ...items, { name: newItem } ] }));
    } else {
      if (numSame > 0) {
        alert('Item already exists');
      }
      setItems(() => [...items]);
    }
  }
  const handleRemovePill = (index) => {
    const newItems = [ ...items ];
    newItems.splice(index, 1);
    updateHomeTopic(Object.assign(homeTopic, { itemList: newItems }));
    setItems(newItems);
  };

  return (
    <div className='compositeContainer subContainer'>
      <div className='inputContainer'>
        <div className='nestedContainer'>
          <div className='listItem'>
            <div className='text__group'>
              <label htmlFor={`${props.name}_${props.index}`}>{props.pillGroupLabel} <span className='req'>*</span></label>
              <input
                type='text'
                required
                name='homeTopic'
                id={`${props.name}_${props.index}`}
                value={homeTopic.name}
                onChange={e => updateHomeTopic(e, props.index)}
              />
            </div>
          </div>
          <div className='btn__group'>
            {props.numHomeTopics - 1 === props.index && props.numHomeTopics < 20 && (
              <button type='button' className='btn__add' onClick={addHomeTopic}>
                Add
              </button>
            )}
            {props.numHomeTopics > 1 && (
              <button type='button' className='deleteBtn' onClick={() => removeHomeTopic(props.index)}>
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
            <button type='button' onClick={() => handleAddPill()}>Add item</button>
          </div>
        </div>
      </div>
      <ItemPills
        removePill={handleRemovePill}
        items={homeTopic.itemList}
      />
    </div>
  );
}
