import React from 'react';
import Company from './Company';

export default function Companies({ addCompany, updateCompany, removeCompany, companies}) {
  return (
    <div>
        <h3>Companies you've worked at</h3>
          {companies.map((company, index) => (
            <Company
              key={index}
              addCompany={addCompany}
              updateCompany={updateCompany}
              removeCompany={removeCompany}
              company={company}
              index={index}
              numCompanies={companies.length}
            />
          ))}
    </div>
  );
}
