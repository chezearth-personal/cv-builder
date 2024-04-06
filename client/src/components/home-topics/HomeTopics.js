import React from 'react';
import HomeTopic from './HomeTopic';

const HomeTopics = ({
  homeTopics,
  setHomeTopics,
  updateParent,
  ...props
}) => {
  /** Updates the state with user's input */
  const handleAddItemGroup = () =>
    setHomeTopics([ ...homeTopics, { name: '' }]);
  /** Updates an item within the list */
  const handleUpdateHomeTopic = (e, index) => {
    if (e && e.target) {
      const { value } = e.target;
      const list = [...homeTopics];
      list[index]['name'] = value;
      setHomeTopics(list);
      if (updateParent) {
        updateParent(list);
      }
    }
  }
  /** Removes a selected item from the list */
  const handleRemoveHomeTopic = (index) => {
    const list = [...homeTopics];
    list.splice(index, 1);
    setHomeTopics(list);
  }
  return (
    <div>
      <p>{props.description}</p>
      {homeTopics.map((homeTopic, index) => (
          <HomeTopic
            key={index}
            homeTopic={homeTopic}
            addHomeTopic={handleAddHomeTopic}
            updateHomeTopic={handleUpdateHomeTopic}
            removeHomeTopic={handleRemoveHomeTopic}
            index={index}
            numHomeTopics={homeTopics.length}
            name={props.name}
            pillGroupLabel={props.pillGroupLabel}
            pillItemLabel={props.pillItemLabel}
          />
      ))}
    </div>
  );
}

export default HomeTopics;
