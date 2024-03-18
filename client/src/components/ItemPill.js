import React, {useState} from "react";

const ItemPill = () => {
  const [item, setItem] = useState('');
  return (
    <div className='pill'>
      <p className='pillText'>{item}</p>
      <div className='pillRemove'>
        X
      </div>
    </div>
  );
}
