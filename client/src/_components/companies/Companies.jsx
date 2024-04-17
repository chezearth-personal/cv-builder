import { Company } from './Company';

export function Companies({
  companies,
  setCompanies,
  initCompany
}) {
  /** Updates the state with user's input */
  const handleAddCompany = () => {
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
              index={index}
              numCompanies={companies.length}
            />
          ))}
    </div>
  );
}
