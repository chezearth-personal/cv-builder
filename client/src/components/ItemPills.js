import React, {useState} from "react";
import './ItemPills.css';

const ItemPill = (props) => {
  return (
    <div className='pill' key={props.index}>
      <p className='pillText'>{props.itemName}</p>
      <div className='pillRemove' onClick={() => props.removePill(props.index)}>{'\u00D7'}</div>
    </div>
  );
}

const ItemPills = (props) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const addToItem = (item) => {
    // console.log('item =', item);
    setItem(item);
  };
  const handleButtonClick = () => {
    console.log('item =', item);
    console.log('items =', items);
    console.log('item =', item);
    if (items.filter(i => i.name === item).length > 0) {
      alert('Item already exists');
      return setItems(() => [...items]);
    } else {
      return setItems(() => [...items, { name: item }]);
    }
  }
  const handleRemovePill = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  console.log('props =', props);
  return (
    <div className='itemPills' key={props.index}>
      <div className='itemPillsInput'>
        <div className='itemPillsTitle'>
          <label htmlFor='inputItem'>{props.pillItemLabel}</label>
          <input id='inputItem' type='text' onChange={(e) => addToItem(e.target.value)}/>
        </div>
        <div className='btn__group'>
          <button onClick={() => handleButtonClick()}>Add item</button>
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
