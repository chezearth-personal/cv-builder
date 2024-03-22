import React from 'react';
import ItemGroup from './ItemGroup';

export default function ItemGroups(props) {
  /** Updates the state with user's input */
  const handleAddSkillGroup = () =>
    props.setSkillGroups([ ...props.skillGroups, { name: '' }]);
  /** Updates an item within the list */
  const handleUpdateSkillGroup = (e, index) => {
    const { value } = e.target;
    const list = [...props.skillGroups];
    list[index]['name'] = value;
    props.setSkillGroups(list);
  }
  /** Removes a selected item from the list */
  const handleRemoveSkillGroup = (index) => {
    const list = [...props.skillGroups];
    list.splice(index, 1);
    props.setSkillGroups(list);
  }
  return (
    <div className='listItems'>General skills (across whole work history)
      {props.skillGroups.map((skillGroup, index) => (
        <ItemGroup
          index={index}
          numSkillGroups={props.skillGroups.length}
          skillGroup={skillGroup}
          addSkillGroup={handleAddSkillGroup}
          updateSkilGroup={handleUpdateSkillGroup}
          removeSkillGroup={handleRemoveSkillGroup}
        />
      ))}
    </div>
  );
}
