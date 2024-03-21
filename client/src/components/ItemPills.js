import React, {useState} from "react";
import './ItemPills.css';

// const ItemPill = () => {
  // return (
    // <div className='pill'>
      // <p className='pillText'>{item.name}</p>
      // <div className='pillRemove' onClick={() => handleRemovePill(index)}></div>
    // </div>
  // );
// }

const ItemPills = () => {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const handleRemovePill = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  const addToItem = (item) => {
    // console.log('item =', item);
    setItem(item);
  };
  const handleButtonClick = () => {
    console.log('item =', item);
    setItems([...items, { name: item }]);
    console.log('items =', items);
    console.log('item =', item);
    setItem('');
    console.log('item =', item);
    // console.log('newItem =', newItem);
    // Items.push({ name: newItem });
    // console.log(newItem);
    // setItems(newItem);
  }
  return (
    <div className='itemPills'>
      <div className='itemPillsInput'>
        <div className='itemPillsTitle'>
          <label htmlFor='inputItem'>Item to be added</label>
          <input id='inputItem' type='text' onChange={(e) => addToItem(e.target.value)}/>
        </div>
        <div className='btn__group'>
          <button onClick={() => handleButtonClick()}>Add item</button>
        </div>
      </div>
      <div className='itemPillsList'>
        {items.map((item, index) => (
          <div className='pill' key={index}>
            <p className='pillText'>{item.name}</p>
            <div className='pillRemove' onClick={() => handleRemovePill(index)}>{'\u00D7'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemPills;
