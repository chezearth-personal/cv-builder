import React, {useState} from "react";
import ItemPill from './ItemPill';
import './ItemPills.css';


const ItemPills = (props) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const addToItem = (item) => {
    // console.log('item =', item);
    setItem(item);
  };
  const handleAddPill = () => {
    // console.log('item =', item);
    // console.log('items =', items);
    const newItem = item.trim();
    const numSame = items.filter(i => i.name === item).length; 
    setItem('');
    if (newItem !== '' && numSame === 0) {
      return setItems(() => [...items, { name: newItem }]);
    } else if (numSame > 0) {
      alert('Item already exists');
    }
    return setItems(() => [...items]);
  }
  const handleRemovePill = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  // console.log('props =', props);
  return (
    <div className='itemPills' key={props.name}>
      <div className='itemPillsInput'>
        <div className='text__group'>
          <label htmlFor='inputItem'>{props.pillItemLabel}</label>
          <input id='inputItem' type='text' value={item} onChange={(e) => addToItem(e.target.value)} />
        </div>
        <div className='btn__group'>
          <button onClick={() => handleAddPill()}>Add item</button>
        </div>
      </div>
      <div className='itemPillsList'>
        {items.map((item, index) => (
          <ItemPill key={index} index={index} itemName={item.name} removePill={handleRemovePill} />
        ))}
      </div>
    </div>
  );
}

export default ItemPills;
