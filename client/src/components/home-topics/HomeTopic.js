import React, { useState } from 'react';
import ItemPills from './item-pill/ItemPills';

const HomeTopic = ({
  homeTopic,
  addHomeTopic,
  updateHomeTopic,
  removeHomeTopic,
  ...props
}) => {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState('');
  const addToTopic = (topic) => {
    setTopic(topic);
  };
  const handleAddPill = () => {
    const newTopic = topic.trim();
    const numSame = topics.filter(t => t.name === topic).length; 
    setTopic('');
    if (newTopic !== '' && numSame === 0) {
      const newTopicsList = [...topics, { name: newTopic }];
      updateHomeTopic(Object.assign(homeTopic, { itemList: newTopicsList }));
      setTopics(() => newTopicsList);
    } else {
      if (numSame > 0) {
        alert('Item already exists');
      }
      setTopics(() => [...topics]);
    }
  }
  const handleRemovePill = (index) => {
    const newTopics = [ ...topics ];
    newTopics.splice(index, 1);
    updateHomeTopic(Object.assign(homeTopic, { topicList: newTopics }));
    setTopics(newTopics);
  };
  return (
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
                onChange={e => updateHomeTopic(e, props.index)}
              />
            </div>
          </div>
          <div className='btn__group'>
            {props.numHomeTopics - 1 === props.index && props.numHomeTopics < 20 && (
              <button type='button' className='addBtn' onClick={addHomeTopic}>
                Add
              </button>
            )}
            {props.numHomeTopics > 1 && (
              <button type='button' className='deleteBtn' onClick={() => removeHomeTopic(props.index)}>
                Delete
              </button>
            )}
          </div>
        </div>
        <div className='itemPillsInput'>
          <div className='text__group'>
            <label htmlFor={`${props.name}_input_${props.index}`}>{props.pillItemLabel}</label>
            <input
              id={`${props.name}_input_${props.index}`}
              name='inputItem'
              type='text'
              value={topic}
              onChange={(e) => addToTopic(e.target.value)}
            />
          </div>
          <div className='btn__group'>
            <button type='button' onClick={() => handleAddPill()}>Add item</button>
          </div>
        </div>
      </div>
      <ItemPills
        addToItem={addToTopic}
        removePill={handleRemovePill}
        items={topics}
        item={topic}
        index={props.index}
        name={props.name}
        pillGroupLabel={props.pillGroupLabel}
        pillItemLabel={props.pillItemLabel}
      />
    </div>
  );
}

export default HomeTopic;
