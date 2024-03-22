import React from 'react';
import ItemPills from './ItemPills';

export default function ItemGroup(props) {
  <div className='compositeContainer' key={props.index}>
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
        {props.numSkillGroups - 1 === props.index && props.numSkillGroups < 20 && (
          <button id='addBtn' onClick={props.addSkillGroup}>
            Add
          </button>
        )}
        {props.numSkillGroups > 1 && (
          <button id='deleteBtn' onClick={() => props.removeSkillGroup(props.index)}>
            Delete
          </button>
        )}
      </div>
    </div>
    <ItemPills
      index={props.index}
      pillGroup='SkillGroup'
      pillGroupLabel='Enter a skill group'
      pillItemLabel='Skill to be added'
    />
  </div>
}
