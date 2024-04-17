import { HomeTopic } from './HomeTopic';

export function HomeTopics({
  homeTopics,
  setHomeTopics,
  updateParent,
  ...props
}) {
  /** Updates the state with user's input */
  const handleAddHomeTopic = () =>
    setHomeTopics([ ...homeTopics, { name: '', itemList: []}]);
  /** Updates an item within the list */
  const handleUpdateHomeTopic = (e, index) => {
    if (e && e.target) {
      const { value } = e.target;
      const list = [ ...homeTopics ];
      list[index]['name'] = value;
      setHomeTopics(list);
      if (updateParent) {
        updateParent(list);
      }
    }
  }
  /** Removes a selected item from the list */
  const handleRemoveHomeTopic = (index) => {
    // console.log('HomeTopic index =', index);
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
        <HomeTopic key={index}
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



    // <div key={index} className='compositeContainer subContainer'>
      // <div className='inputContainer'>
        // <div className='nestedContainer'>
          // <div className='listItem'>
            // <div className='text__group'>
              // <label htmlFor={`${props.name}_${props.index}`}>{props.pillGroupLabel} <span className='req'>*</span></label>
              // <input
                // type='text'
                // required
                // name='homeTopic'
                // id={`${props.name}_${props.index}`}
                // value={homeTopic.name}
                // onChange={e => handleUpdateHomeTopic(e, props.index)}
              // />
            // </div>
          // </div>
          // <div className='btn__group'>
            // {props.numHomeTopics - 1 === props.index && props.numHomeTopics < 20 && (
              // <button type='button' className='btn__add' onClick={handleAddHomeTopic}>
                // Add
              // </button>
            // )}
            // {props.numHomeTopics > 1 && (
              // <button type='button' className='deleteBtn' onClick={() => handleRemoveHomeTopic(props.index)}>
                // Delete
              // </button>
            // )}
          // </div>
        // </div>
        // <div className='itemPillsInput'>
          // <div className='text__group'>
            // <label htmlFor={`${props.name}_input_${props.index}`}>{props.pillItemLabel}</label>
            // <input
              // id={`${props.name}_input_${props.index}`}
              // name='inputItem'
              // type='text'
              // value={item}
              // onChange={(e) => addToItem(e.target.value)}
            // />
          // </div>
          // <div className='btn__group'>
            // <button type='button' onClick={() => handleAddPill()}>Add item</button>
          // </div>
        // </div>
      // </div>
      // <ItemPills
        // addToItem={addToItem}
        // removePill={handleRemovePill}
        // items={homeTopic.itemList}
        // item={item}
        // index={props.index}
        // name={props.name}
        // pillGroupLabel={props.pillGroupLabel}
        // pillItemLabel={props.pillItemLabel}
      // />
    // </div>
