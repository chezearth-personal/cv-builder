import { useState } from 'react';
import HomeTopic from './HomeTopic';

const HomeTopics = ({
  homeTopics,
  setHomeTopics,
  updateParent,
  ...props
}) => {
  // const [homeTopic, setHomeTopic] = useState({ name: '' });
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
      console.log('list =', homeTopics);
      const newHomeTopics = homeTopics.filter((homeTopic, i) => i !== index)
      console.log('list after splice =', newHomeTopics);
      // newHomeTopics.forEach((homeTopic) => {
        // setItems(homeTopic.itemList);
      // });
      return newHomeTopics;
    });
    // list.splice(index, 1);
    // setHomeTopics(list);
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
            // items={items}
            // setItems={setItems}
            index={index}
            numHomeTopics={homeTopics.length}
            name={props.name}
            pillGroupLabel={props.pillGroupLabel}
            pillItemLabel={props.pillItemLabel}
          />
          <div>{homeTopic.name}</div>
          <div className='compositeContainer subContainer'>
            <div className='inputContainer'>
              <div className='nestedContainer'>
                <div className='listItem'>
                  <div className='text__group'>
                    <label htmlFor={`${props.name}_${props.index}`}>{props.pillGroupLabel} <span className='req'>*</span></label>
                    <input
                      type='text'
                      required
                      name='homeTopic'
                      id={`${props.name}_${props.index}`}
                      value={homeTopic.name}
                      onChange={e => handleUpdateHomeTopic(e, index)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeTopics;
