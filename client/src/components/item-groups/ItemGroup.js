import React from 'react';
import ItemPills from '../item-pills/ItemPills';

export default function ItemGroup({
  addItemGroup,
  updateItemGroup,
  removeItemGroup,
  ...props
}) {
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
        pillGroupLabel='Enter a skill group'
        pillItemLabel='Skill to be added'
      />
    </div>
  );
}
        // name={`${props.name}_pills`}
