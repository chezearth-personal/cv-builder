import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { HomeTopic } from './HomeTopic';
import { ItemPills } from './ItemPills';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';

export function PillGroups({
  pillGroups,
  setPillGroups,
  updateParent,
  ...props
}) {
  // const validationSchema = Yup.object().shape({
    // homeTopics: Yup.array().of(Yup.object().shape({
      // name: Yup.string(),
      // itemList: Yup.array().of(Yup.object().shape({
        // name: Yup.string()
      // }))
    // }))
  // });
  // const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build form with useForm() hook */
  // const { register, handleSubmit, formState } = useForm(formOptions);
  /** Updates the state with user's input */
  const handleAddPillGroup = () =>
    setPillGroups([ ...pillGroups, { name: '', itemList: []}]);
  /** Updates an item within the list */
  const handleUpdatePillGroup = (e, index) => {
    if (e && e.target) {
      const { value } = e.target;
      const list = [ ...pillGroups ];
      list[index]['name'] = value;
      setPillGroups(list);
      if (updateParent) {
        updateParent(list);
      }
    }
  }
  /** Removes a selected item from the list */
  const handleRemovePillGroup = (index) => {
    console.log('HomeTopic index =', index);
    setPillGroups(pillGroupsList => {
      console.log('list =', pillGroupsList);
      const newPillGroupsList = pillGroupsList.filter((e, i) => i !== index)
      console.log('list after splice =', newPillGroupsList);
      return newPillGroupsList;;
    });
    console.log('homeTopics after set =', pillGroups);
  }

  /** ? Individual topic, contains a name field and an array of items pills  */
  const PillGroup = ({
    pillGroup,
    addPillGroup,
    updatePillGroup,
    removePillGroup,
    ...props
  }) => {
    const [items, setItems] = useState([]);
    const [item, setItem] = useState('');
    const addToItem = (item) => {
      setItem(item);
    };

    const handleAddPill = () => {
      const newItem = item.trim();
      const numSame = items.filter(i => i.name === newItem).length; 
      setItem('');
      if (newItem !== '' && numSame === 0) {
        setItems(items => [ ...items, { name: newItem } ]);
        updatePillGroup(Object.assign(pillGroup, { itemList: [ ...items, { name: newItem } ] }));
      } else {
        if (numSame > 0) {
          alert('Item already exists');
        }
        setItems(() => [...items]);
      }
    }
    const handleRemovePill = (index) => {
      const newItems = [ ...items ];
      newItems.splice(index, 1);
      updatePillGroup(Object.assign(pillGroup, { itemList: newItems }));
      setItems(newItems);
    }
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
                  value={pillGroup.name}
                  onChange={e => updatePillGroup(e, props.index)}
                />
              </div>
            </div>
            <div className='btn__group'>
              {props.numHomeTopics - 1 === props.index && props.numHomeTopics < 20 && (
                <button type='button' className='btn__add' onClick={addPillGroup}>
                  Add
                </button>
              )}
              {props.numHomeTopics > 1 && (
                <button type='button' className='deleteBtn' onClick={() => removePillGroup(props.index)}>
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
                value={item}
                onChange={(e) => addToItem(e.target.value)}
              />
            </div>
            <div className='btn__group'>
              <button type='button' onClick={() => handleAddPill()}>Add item</button>
            </div>
          </div>
        </div>
        <ItemPills
          removePill={handleRemovePill}
          items={pillGroup.itemList}
        />
      </div>
    );
  }

  return (
    <div>
      <p>{props.description}</p>
      {pillGroups.map((pillGroup, index) => (
        <PillGroup key={index}
          homeTopic={pillGroup}
          addHomeTopic={handleAddPillGroup}
          updateHomeTopic={handleUpdatePillGroup}
          removeHomeTopic={handleRemovePillGroup}
          index={index}
          numHomeTopics={pillGroups.length}
          name={props.name}
          pillGroupLabel={props.pillGroupLabel}
          pillItemLabel={props.pillItemLabel}
        />
      ))}
    </div>
  );
}
