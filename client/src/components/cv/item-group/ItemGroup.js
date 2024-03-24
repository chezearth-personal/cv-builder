import React from 'react';
import Items from './Items';
import tick from '../../../tick.png';

export default function ItemGroup({ handleBr, itemGroup}) {
  console.log('ItemGroup.js - itemGroup:', itemGroup);
  return (
                <div className='cvTechSkillGroup'>
                  <img src={tick} alt=' - ' className='cvBullet'/>
                  <div className='cvBulletedItem'>
                    <h4 className='cvBulletHeading'>{itemGroup.name}</h4>
                    <Items handleBr={handleBr} items={itemGroup.itemList} />
                  </div>
                </div>
  );
}

                    // <p 
                      // dangerouslySetInnerHTML={{
                        // __html: handleBr(itemGroup.name + '\n'),
                      // }}
                      // className='cvBodyContent cvBulletContent'
                    // />
