// import React, { useState } from 'react';
import Company from './Company';

export default function Companies({
  // addCompany,
  // updateCompany,
  // removeCompany,
  companies,
  setCompanies,
  // keywordGroups,
  // setKeywordGroups,
  initCompany
}) {
  // console.log('initCompany =', initCompany);
  // console.log('companies =', companies);
  // const [keywordGroups, setKeywordGroups] = useState([{ name: '', itemList: [] }]);
  /** Updates the state with user's input */
  const handleAddCompany = () => {
    // console.log('handleAddCompany(): initCompany =', initCompany);
    return setCompanies([ ...companies, initCompany]);
  }
  /** Removes a selected item from the list */
  const handleRemoveCompany = (index) => {
    const list = [...companies];
    list.splice(index, 1);
    setCompanies(list);
  }
  /** Updates an item within the list*/
  const handleUpdateCompany = (e, index) => {
    const {name, value } = e.target;
    const list = [...companies];
    if (name === 'isCurrent') {
      list[index][name] = !list[index][name];
    } else {
      list[index][name] = value;
    }
    // setKeywordGroups(keywordGroups);
    console.log('list[index] =' , list[index]);
    // console.log('keywordGroups =' , keywordGroups);
    // const listObj = Object.assign(list[index], { keywordGroups });
    // console.log('listObj =' , listObj);
    setCompanies(list);
  }
  return (
    <div>
          {companies.map((company, index) => (
            <Company
              key={index}
              addCompany={handleAddCompany}
              updateCompany={handleUpdateCompany}
              removeCompany={handleRemoveCompany}
              company={company}
              // keywordGroups={keywordGroups}
              // setKeywordGroups={setKeywordGroups}
              index={index}
              numCompanies={companies.length}
            />
          ))}
    </div>
  );
}
