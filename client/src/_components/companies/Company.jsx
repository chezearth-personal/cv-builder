import { useState } from 'react';
import { HomeTopics } from '_components/home-topics/HomeTopics';

export function Company({
  addCompany,
  updateCompany,
  removeCompany,
  company,
  ...props
}) {
  const [ keyPhraseTopics, setkeyPhraseTopics ] = useState([{ name: '', itemList: [] }]);
  const handleUpdateHomeTopics = (list) => company.keyPhraseTopics = list;
  return (
    <div className='compositeContainer'>
      <div className='company'>
        <div className='nestedContainer' id="nestedCompanies">
          <div className='companies'>
            <label htmlFor={`name_${props.index}`}>Company name <span className='req'>*</span></label>
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
            <label htmlFor={`position_${props.index}`}>Position held <span className='req'>*</span></label>
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
            <label htmlFor={`startDate_${props.index}`}>Start date <span className='req'>*</span></label>
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
                name='isCurrent'
                id={`isCurrent_${props.index}`}
                onChange={e => updateCompany(e, props.index)}
              />
            </div>
          )}
          {!company.isCurrent && (
            <div className='companies'>
              <label htmlFor={`endDate_${props.index}`}>End date <span className='req'>*</span></label>
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
              <button className='btn__add' id='add_btn_{props.index}' onClick={addCompany}>
                Add
              </button>
            )}
            {props.numCompanies > 1 && (
              <button className='deleteBtn' id='deleteBtn' onClick={() => removeCompany(props.index)}>
                Delete
              </button>
            )}
          </div>
        </div>
        <HomeTopics
          homeTopics={keyPhraseTopics}
          setHomeTopics={setkeyPhraseTopics}
          updateParent={handleUpdateHomeTopics}
          name='keyPhraseTopics'
          description='Topics (e.g. "company background", "situation", "task", "action", "result", "learning") and key phrases'
          pillGroupLabel='Enter a key phrase topic'
          pillItemLabel='Key phrase to be added'
        />
      </div>
    </div>
  );
}
