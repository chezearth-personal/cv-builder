import React, {useState} from "react";

const ItemPills = () => {
  // const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const handleRemovePill = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  return (
    <div className='itemPills'>
      {items.map((item, index) => (
        <div className='pill'>
          <p className='pillText'>{item.name}</p>
          <div className='pillRemove' onClick={() => handleRemovePill(index)}>
            X
          </div>
        </div>
      ))}
    </div>
  );
}
