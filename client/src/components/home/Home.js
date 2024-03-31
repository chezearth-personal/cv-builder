import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../placeholders/Loading';
import ItemGroups from './item-group/ItemGroups';
import Companies from './work-history/Companies';
import logo from '../../logo.svg';
import '../../App.css'

const Home = ({ setResult }) => {
  const initCompany = {
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    keyPhraseGroups: []
  };
  const [fullName, setFullName] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [skillGroups, setSkillGroups] = useState([{ name: '', itemList: [] }]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([initCompany]);
  const navigate = useNavigate();
  /** Updates the state with user's input */
  // const handleAddTel = () =>
    // setTels([ ...tels, { telNumber: '', telType: '' }]);
  /** Removes a selected item from the list */
  // const handleRemoveTel = (index) => {
    // const list = [...tels];
    // list.splice(index, 1);
    // setTels(list);
  // }
  /** Updates an item within the list */
  // const handleUpdateTel = (e, index) => {
    // const {name, value } = e.target;
    // const list = [...tels];
    // list[index][name] = value;
    // setTels(list);
  // }
  /** Submit the form */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    headShot && formData.append('headshotImage', headShot, headShot.name);
    formData.append('fullName', fullName);
    formData.append('tel', tel);
    formData.append('email', email);
    formData.append('skillGroups', JSON.stringify(skillGroups));
    formData.append('companyDetails', JSON.stringify(companies));
    console.log('skillGroups = ', skillGroups);
    console.log('skillGroups JSON:', JSON.stringify(skillGroups));
    console.log('companyDetails = ', companies);
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
    <div className='App'>
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
        <label htmlFor='{telNumber}'>tel</label>
        <input
          type='tel'
          required
          name='telNumber'
          id='telNumber'
          onChange={(e) => setTel(e.target.value)}
        />
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
        <h3 className='listItems'>General skills (across whole work history)</h3>
        <ItemGroups
          itemGroups={skillGroups}
          setItemGroups={setSkillGroups}
          description=''
          name='skillGroup'
          pillGroupLabel='Enter a skill group'
          pillItemLabel='Skill to be added'
        />
        <h3>Companies you've worked at</h3>
        <Companies
          companies={companies}
          setCompanies={setCompanies}
          initCompany={initCompany}
        />
        <button>CREATE CV</button>
      </form>
    </div>
  );
}

export default Home;

        // <div className='listItems'>Enter your telephone numbers
          // {tels.map((tel, index) => (
            // <div className='nestedContainer' key={index}>
              // <div className='listItem'>
                // <div className='text__group'>
                  // <label htmlFor={`telNumber_${index}`}>tel</label>
                  // <input
                    // type='tel'
                    // required
                    // name={`telNumber_${index}`}
                    // id={`telNumber_${index}`}
                    // onChange={e => handleUpdateTel(e, index)}
                  // />
                // </div>
              // </div>
              // <div className='btn__group'>
                // {tels.length - 1 === index && tels.length < 4 && (
                  // <button id='addBtn' onClick={handleAddTel}>
                    // Add
                  // </button>
                // )}
                // {tels.length > 1 && (
                  // <button id='deleteBtn' onClick={() => handleRemoveTel(index)}>
                    // Delete
                  // </button>
                // )}
              // </div>
            // </div>
          // ))}
        // </div>
