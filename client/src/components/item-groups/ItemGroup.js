import React from 'react';
import ItemPills from '../item-pills/ItemPills';

export default function ItemGroup(props) {
  <div className='compositeContainer' key={props.name}>
    <div className='nestedContainer'>
      <div className='listItem'>
        <div className='text__group'>
          <label htmlFor='skillGroup'>Enter a skill group</label>
          <input
            type='text'
            required
            name='skillGroup'
            onChange={e => props.updateSkillGroup(e, props.index)}
          />
        </div>
      </div>
      <div className='btn__group'>
        {props.numItemGroups - 1 === props.index && props.numItemGroups < 20 && (
          <button id='addBtn' onClick={props.addItemGroup}>
            Add
          </button>
        )}
        {props.numSkillGroups > 1 && (
          <button id='deleteBtn' onClick={() => props.removeItemGroup(props.index)}>
            Delete
          </button>
        )}
      </div>
    </div>
    <ItemPills
      name={`${props.name}_pills`}
      pillGroupLabel='Enter a skill group'
      pillItemLabel='Skill to be added'
    />
  </div>
}
