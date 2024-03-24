import React from 'react';

export default function Companies({ addCompany, updateCompany, removeCompany, companies}) {
  return (
    <div>
        <h3>Companies you've worked at</h3>
          {companies.map((company, index) => (
            <div className='nestedContainer' id="nestedCompanies" key={index}>
              <div className='companies'>
                <label htmlFor='name'>Company name</label>
                <input
                  className='text__company'
                  type='text'
                  required
                  name='name'
                  onChange={e => updateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='position'>Position held</label>
                <input
                  className='text__company'
                  type='text'
                  required
                  name='position'
                  onChange={e => updateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='startDate'>Start date</label>
                <input
                  className='text__company'
                  type='month'
                  required
                  name='startDate'
                  onChange={e => updateCompany(e, index)}
                />
              </div>
              {index < 1 && (
                <div className='companies' id='check__company'>
                  <label htmlFor='isCurrent'>Current position?</label>
                  <input
                    
                    type='checkbox'
                    // required
                    name='isCurrent'
                    onChange={e => updateCompany(e, index)}
                  />
                </div>
              )}
              {!company.isCurrent && (
                <div className='companies'>
                  <label htmlFor='endDate'>End date</label>
                  <input
                    className='text__company'
                    type='month'
                    required
                    name='endDate'
                    onChange={e => updateCompany(e, index)}
                  />
                </div>
              )}
              <div className='btn__group'>
                {companies.length - 1 === index && companies.length < 4 && (
                  <button id='addBtn' onClick={addCompany}>
                    Add
                  </button>
                )}
                {companies.length > 1 && (
                  <button id='deleteBtn' onClick={() => removeCompany(index)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
    </div>
  );
}
