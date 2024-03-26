import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../placeholders/Loading';
import ItemGroups from './item-group/ItemGroups';
import Companies from './work-history/Companies';
import logo from '../../logo.svg';
import '../../index.css';

const Home = ({ setResult }) => {
  const initCompany = {
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    keywordGroups: []
  };
  const [fullName, setFullName] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [tels, setTels] = useState([{ telNumber: '', telType: '' }]);
  const [email, setEmail] = useState('');
  const [skillGroups, setSkillGroups] = useState([{ name: '', itemList: [] }]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([initCompany])
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
  const handleAddCompany = () => 
    setCompanies([ ...companies, initCompany]);
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
  /** Submit the form */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    headShot && formData.append('headshotImage', headShot, headShot.name);
    formData.append('fullName', fullName);
    formData.append('tels', JSON.stringify(tels));
    formData.append('email', email);
    formData.append('skillGroups', JSON.stringify(skillGroups));
    formData.append('workHistory', JSON.stringify(companies));
    console.log('skillGroups = ', skillGroups);
    console.log('skillGroups JSON:', JSON.stringify(skillGroups));
    console.log('workHistory = ', companies);
    console.log('Companies JSON:', JSON.stringify(companies));
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
                <div className='text__group'>
                  <label htmlFor={`telNumber_${index}`}>tel</label>
                  <input
                    type='tel'
                    required
                    name={`telNumber_${index}`}
                    id={`telNumber_${index}`}
                    onChange={e => handleUpdateTel(e, index)}
                  />
                </div>
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
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            required
            name='email'
            id='email'
            value={email}
            autoComplete='email'
            onChange={e => setEmail(e.target.value)}
          />
        <ItemGroups
          itemGroups={skillGroups}
          setItemGroups={setSkillGroups}
          description='General skills (across whole work history)'
          name='skillGroup'
          pillGroupLabel='Enter a skill group'
          pillItemLabel='Skill to be added'
        />
        <Companies
          addCompany={handleAddCompany}
          updateCompany={handleUpdateCompany}
          removeCompany={handleRemoveCompany}
          companies={companies}
        />
        <button>CREATE CV</button>
      </form>
    </div>
  );
}

export default Home;
