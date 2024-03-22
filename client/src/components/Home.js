import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';
import ItemGroups from './item-groups/ItemGroups';
import logo from '../logo.svg';
import '../index.css';

const Home = ({ setResult }) => {
  const [fullName, setFullName] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [tels, setTels] = useState([{ telNumber: '', telType: '' }]);
  const [email, setEmail] = useState('');
  const [technologies, setTechnologies] = useState([{ name: '' }]);
  const [skillGroups, setSkillGroups] = useState([{ name: '', itemList: [] }]);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([{ name: '', position: '', startDate: '', endDate: '', isCurrent: null}]);
  const navigate = useNavigate();
  /** Updates the state with user's input */
  const handleAddTel = () =>
    setTels([ ...tels, { telNumber: '', telType: '' }]);
  /** Removes a selected item from the list */
  const handleRemoveTel = (index) => {
    const list = [...tels];
    list.splice(index, 1);
    setTels(list);
  }
  /** Updates an item within the list */
  const handleUpdateTel = (e, index) => {
    const {name, value } = e.target;
    const list = [...tels];
    list[index][name] = value;
    setTels(list);
  }
  /** Updates the state with user's input */
  const handleAddTechnology = () =>
    setTechnologies([ ...technologies, { name: '' }]);
  /** Removes a selected item from the list */
  const handleRemoveTechnology = (index) => {
    const list = [...technologies];
    list.splice(index, 1);
    setTechnologies(list);
  }
  /** Updates an item within the list */
  const handleUpdateTechnology = (e, index) => {
    const { value } = e.target;
    const list = [...technologies];
    // console.log('list', list);
    list[index]['name'] = value;
    // console.log('list', list);
    setTechnologies(list);
  }
  /** Updates the state with user's input */
  const handleAddCompany = () => 
    setCompanyInfo([ ...companyInfo, { name: '', position: '', startDate: '', endDate: '', isCurrent: false}]);
  /** Removes a selected item from the list */
  const handleRemoveCompany = (index) => {
    const list = [...companyInfo];
    list.splice(index, 1);
    setCompanyInfo(list);
  }
  /** Updates an item within the list*/
  const handleUpdateCompany = (e, index) => {
    const {name, value } = e.target;
    const list = [...companyInfo];
    list[index][name] = value;
    setCompanyInfo(list);
  }
  /** Submit the form */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    headShot && formData.append('headshotImage', headShot, headShot.name);
    formData.append('fullName', fullName);
    formData.append('tels', JSON.stringify(tels));
    formData.append('email', email);
    formData.append('technologies', JSON.stringify(technologies));
    formData.append('skillGroups', JSON.stringify(skillGroups));
    console.log('skillGroups = ', skillGroups);
    console.log('JSON:', JSON.stringify(skillGroups));
    formData.append('workHistory', JSON.stringify(companyInfo));
    axios
      .post('http://localhost:4000/cv/create', formData, {})
      .then(res => {
        if (res.data.message) {
          /** Update the result object */
          setResult(res.data.data);
          navigate('/cv');
        }
      })
      .catch(err => {
        if (err && err.response && /<pre>MulterError: File too large<br>/.test(err.response.data.toString())) {
          console.error('navigate to \'ErrorPage/\'');
        } else {
          console.error(err);
        }
      });
    setLoading(true);
    return <div></div>;
  }
  /** Renders the loading component you submit the form */
  if (loading) {
    return <Loading />;
  }
  return (
    <div className='app'>
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <h1>CV Builder</h1>
      <p>Generate a CV with chatGPT in a few seconds</p>
      <form
        onSubmit={handleFormSubmit}
        method='POST'
        encType='multipart/form-data'
      >
        <label htmlFor='fullName'>Enter your full name</label>
        <input
          type='text'
          required
          name='fullName'
          id='fullName'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label htmlFor='photo'>Upload your headshot image</label>
        <input
          type='file'
          name='photo'
          id='photo'
          accept='image/x-png, image/jpeg'
          onChange={e => setHeadShot(e.target.files[0])}
        />
        <h3>Contact Information</h3>
        <div className='listItems'>Enter your telephone numbers
          {tels.map((tel, index) => (
            <div className='nestedContainer' key={index}>
              <div className='listItem'>
                <label htmlFor={`telNumber_${index}`}>tel</label>
                <input
                  type='tel'
                  required
                  name={`telNumber_${index}`}
                  id={`telNumber_${index}`}
                  onChange={e => handleUpdateTel(e, index)}
                />
              </div>
              <div className='btn__group'>
                {tels.length - 1 === index && tels.length < 4 && (
                  <button id='addBtn' onClick={handleAddTel}>
                    Add
                  </button>
                )}
                {tels.length > 1 && (
                  <button id='deleteBtn' onClick={() => handleRemoveTel(index)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            required
            name='email'
            id='email'
            className='currentInput'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <h3>Technical Skills</h3>
        <div className='listItems'>Choose or enter a technology
          {technologies.map((technology, index) => (
            <div className='nestedContainer' key={index}>
              <div className='listItem'>
                <label htmlFor='technology'>Technology</label>
                <input
                  type='text'
                  required
                  name='skillGroup'
                  onChange={e => handleUpdateTechnology(e, index)}
                />
              </div>
              <div className='btn__group'>
                {technologies.length - 1 === index && technologies.length < 20 && (
                  <button id='addBtn' onClick={handleAddTechnology}>
                    Add
                  </button>
                )}
                {technologies.length > 1 && (
                  <button id='deleteBtn' onClick={() => handleRemoveTechnology(index)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <ItemGroups
          description='General skills (across whole work history)'
          itemGroups={skillGroups}
          setItemGroups={setSkillGroups}
        />
        <h3>Companies you've worked at</h3>
          {companyInfo.map((company, index) => (
            <div className='nestedContainer' id="nestedCompanies" key={index}>
              <div className='companies'>
                <label htmlFor='name'>Company name</label>
                <input
                  className='text__company'
                  type='text'
                  required
                  name='name'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='position'>Position held</label>
                <input
                  className='text__company'
                  type='text'
                  required
                  name='position'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='startDate'>Start date</label>
                <input
                  className='text__company'
                  type='month'
                  required
                  name='startDate'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              {index < 1 && (
                <div className='companies' id='check__company'>
                  <label htmlFor='isCurrent'>Current position?</label>
                  <input
                    
                    type='checkbox'
                    // required
                    name='isCurrent'
                    onChange={e => handleUpdateCompany(e, index)}
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
                    onChange={e => handleUpdateCompany(e, index)}
                  />
                </div>
              )}
              <div className='btn__group'>
                {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                  <button id='addBtn' onClick={handleAddCompany}>
                    Add
                  </button>
                )}
                {companyInfo.length > 1 && (
                  <button id='deleteBtn' onClick={() => handleRemoveCompany(index)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        <button>CREATE CV</button>
      </form>
    </div>
  );
}

export default Home;
