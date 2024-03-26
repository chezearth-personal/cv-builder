import React from 'react';
import ItemGroups from '../item-group/ItemGroups';

export default function Company({
  addCompany,
  updateCompany,
  removeCompany,
  company,
  setCompanies,
  keywordGroups,
  setKeywordGroups,
  ...props
}) {
  // console.log('company =', company);
  // console.log('props.index =', props.index);
  // console.log('props.numCompanies =', props.numCompanies);
  const handleUpdateGroupItems = (list) => {
    // console.log('list =', list);
    // console.log('deconstructed list =', [...list]);
    setKeywordGroups(list);
    company.keywordGroups = [ ...list ]; //
  }
  return (
    <div className='compositeContainer'>
      <div className='company'>
        <div className='nestedContainer' id="nestedCompanies">
          <div className='companies'>
            <label htmlFor={`name_${props.index}`}>Company name</label>
            <input
              className='text__company'
              type='text'
              required
              autoComplete='organization'
              name='name'
              id={`name_${props.index}`}
              onChange={e => updateCompany(e, props.index)}
            />
          </div>
          <div className='companies'>
            <label htmlFor={`position_${props.index}`}>Position held</label>
            <input
              className='text__company'
              type='text'
              required
              name='position'
              id={`position_${props.index}`}
              onChange={e => updateCompany(e, props.index)}
            />
          </div>
          <div className='companies'>
            <label htmlFor={`startDate_${props.index}`}>Start date</label>
            <input
              className='text__company'
              type='month'
              required
              name='startDate'
              id={`startDate_${props.index}`}
              onChange={e => updateCompany(e, props.index)}
            />
          </div>
          {props.index < 1 && (
            <div className='check__group'>
              <label htmlFor={`isCurrent_${props.index}`}>Current position?</label>
              <input
                className='check__company'
                type='checkbox'
                // required
                name='isCurrent'
                id={`isCurrent_${props.index}`}
                onChange={e => updateCompany(e, props.index)}
              />
            </div>
          )}
          {!company.isCurrent && (
            <div className='companies'>
              <label htmlFor={`endDate_${props.index}`}>End date</label>
              <input
                className='text__company'
                type='month'
                required
                name='endDate'
                id={`endDate_${props.index}`}
                onChange={e => updateCompany(e, props.index)}
              />
            </div>
          )}
          <div className='btn__group'>
            {props.numCompanies - 1 === props.index && props.numCompanies < 4 && (
              <button id='addBtn' onClick={addCompany}>
                Add
              </button>
            )}
            {props.numCompanies > 1 && (
              <button id='deleteBtn' onClick={() => removeCompany(props.index)}>
                Delete
              </button>
            )}
          </div>
        </div>
        <ItemGroups
          itemGroups={keywordGroups}
          setItemGroups={setKeywordGroups}
          updateParent={handleUpdateGroupItems}
          name='keywordGroups'
          description='Keywords grouped by topic, e.g. "company background", "situation", "task", "action", "result", "learning"'
          pillGroupLabel='Enter a keyword topic'
          pillItemLabel='Keyword to be added'
        />
      </div>
    </div>
  );
}
