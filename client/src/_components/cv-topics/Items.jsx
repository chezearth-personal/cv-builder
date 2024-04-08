import React from 'react';

export default function Items({ items }) {
  // console.log('items =', items);
  const itemsList = items.reduce((res, item) => (res.length === 0 ? res : res + ', ') + item.name, '');
  // console.log(itemsList);
  return (
    <>
      <p className='cvBodyContent cvBulletContent'>{itemsList}</p>
    </>
  );
}
