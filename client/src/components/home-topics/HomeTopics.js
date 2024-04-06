import React from 'react';
import HomeTopic from './HomeTopic';

const HomeTopics = ({
  homeTopics,
  setHomeTopics,
  updateParent,
  ...props
}) => {
  /** Updates the state with user's input */
  const handleAddHomeTopic = () =>
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
    console.log('HomeTopic index =', index);
    // const list = [...homeTopics];
    setHomeTopics(homeTopics => {
      // console.log('list =', homeTopics);
      const newHomeTopics = homeTopics.filter((homeTopic, i) => i !== index)
      // console.log('list after splice =', newHomeTopics);
      return newHomeTopics;
    });
    // console.log('homeTopics after set =', homeTopics);
  }
  return (
    <div>
      <p>{props.description}</p>
      {homeTopics.map((homeTopic, index) => (
        <div key={index}>
          <HomeTopic
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
        </div>
      ))}
    </div>
  );
}

export default HomeTopics;
