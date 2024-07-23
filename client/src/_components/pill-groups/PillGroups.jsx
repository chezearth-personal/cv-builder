import { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';
// import { PillGroup } from './PillGroup';
// import {
  // addPillGroup,
  // updatePillGroup,
  // removePillGroup,
  // selectPillGroups
// } from '../../_store/pill-groups.slice';
import { ItemPills } from './ItemPills';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';


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
  const { register } = useFormContext();
  // const methods = useFormContext();
  // const currentPillGroup = useSelector(pillGroup);
  // const dispatch = useDispatch();

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
                      name='pillGroup'
                      id={`${props.name}_${props.index}`}
                      { ...register('pillGroup.name') }
                      // value={pillGroup.name}
                      // onChange={() => dispatch(updatePillGroup())}
                      // onChange={e => updatePillGroup(e, props.index)}
                    />
                  </div>
                </div>
                <div className='btn__group'>
                  {props.numPillGroups - 1 === props.index && props.numPillGroups < 20 && (
                    <button
                      type='button'
                      className='btn__add'
                      // onClick={() => dispatch(addPillGroup())}
                      onClick={addPillGroup}
                    >
                      Add
                    </button>
                  )}
                  {props.numPillGroups > 1 && (
                    <button
                      type='button'
                      className='deleteBtn'
                      // onClick={() => dispatch(removePillGroup())}
                      onClick={() => removePillGroup(props.index)}
                    >
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

export function PillGroups({
  pillGroups,
  setPillGroups,
  updateParent,
  ...props
}) {
  /** ? */
  // export const ConnectForm = ({ children }) => {
    // const methods = useFormContext();
    // return children({ ...methods });
  // };
  const { register } = useFormContext();
  console.log('register =', register);
  // const methods = useForm();
  // const pillGroups = useSelector(selectPillGroups);
  // const validationSchema = Yup.object().shape({
    // pillGroups: Yup.array().of(Yup.object().shape({
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
    console.log('PillGroup index =', index);
    setPillGroups(pillGroupsList => {
      console.log('list =', pillGroupsList);
      const newPillGroupsList = pillGroupsList.filter((e, i) => i !== index)
      console.log('list after splice =', newPillGroupsList);
      return newPillGroupsList;;
    });
    console.log('pillGroups after set =', pillGroups);
  }

  return (
        <div>
          <p>{props.description}</p>
          {pillGroups.map((pillGroup, index) => (
            <PillGroup key={index}
              pillGroup={pillGroup}
              addPillGroup={handleAddPillGroup}
              updatePillGroup={handleUpdatePillGroup}
              removePillGroup={handleRemovePillGroup}
              index={index}
              numPillGroups={pillGroups.length}
              name={props.name}
              pillGroupLabel={props.pillGroupLabel}
              pillItemLabel={props.pillItemLabel}
              {...register('pillGroups')}
            />
          ))}
        </div>
  );
}
