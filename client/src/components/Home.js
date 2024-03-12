import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading'

const Home = ({ setResult }) => {
  const [fullName, setFullName] = useState('');
  const [tels, setTels] = useState([{ telNumber: '', telType: '' }]);
  // const [telType, setTelType] = useState('');
  const [email, setEmail] = useState('');
  // const [currentPosition, setCurrentPosition] = useState('');
  // const [currentLength, setCurrentLength] = useState(1);
  const [technologies, setTechnologies] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([{ name: '', position: '' }]);
  const navigate = useNavigate();
  /** Updates the state with user's input */
  const handleAddTel = () =>
    setTels([ ...tels, { telNumber: '', telType: '' }]);
  /** Updates an item within the list */
  const handleUpdateTels = (e, index) => {
    const {telNumber, value } = e.target;
    const list = [...tels];
    list[index][telNumber] = value;
    setTels(list);
  }
  /** Updates the state with user's input */
  const handleAddCompany = () => 
    setCompanyInfo([ ...companyInfo, { name: '', position: '' }]);
  /** Removes a selected item from the list */
  const handleRemoveCompany = (index) => {
    const list = [...companyInfo];
    list.splice(index, 1);
    setCompanyInfo(list);
  }
  /** Updates an item within the list*/
  const handleUpdateCompany = (e, index) => {
    const { name, value } = e.target;
    const list = [...companyInfo];
    list[index][name] = value;
    setCompanyInfo(list);
  }
  // const handleNewSubmitTime = (newTime) => [newTime, ...submitTime];
  /** Submit the form */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('headshotImage', headShot, headShot.name);
    formData.append('fullName', fullName);
    formData.append('tels', tels);
    formData.append('email', email);
    formData.append('technologies', technologies);
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
      <h1>CV Builder</h1>
      <p>Generate a CV with chatGPT in a few seconds</p>
      <form
        onSubmit={handleFormSubmit}
        method='POST'
        encType='multipart/form-data'
      >
        <label htmlFor='fullName'>Enter you full name</label>
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
          required
          name='photo'
          id='photo'
          accept='image/x-png, image/jpeg'
          onChange={e => setHeadShot(e.target.files[0])}
        />
        <h3>Contact Information</h3>
        <div className='contacts'>Enter your telephone numbers
          {tels.map((tel, index) => (
            <div className='nestedContainer' key = {index}>
              <div className='tels'>
                <label htmlFor='telNumber'>tel</label>
                <input
                  type='text'
                  required
                  name='telNumber'
                  onChange={e => handleUpdateTels(e, index)}
                />
              </div>
              <div className='btn__group'>
                {tels.length - 1 === index && tels.length < 4 && (
                  <button id='addBtn' onClick={handleAddTel}>
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor='email'>Email address</label>
          <input
            type='number'
            required
            name='email'
            id='email'
            className='currentInput'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <h3>Skills and technologies</h3>
        <div>
          <label htmlFor='technologies'>Technologies used?</label>
          <input
            type='text'
            required
            name='technologies'
            className='currentInput'
            value={technologies}
            onChange={e => setTechnologies(e.target.value)}
          />
        </div>
        <h3>Companies you've worked at</h3>
          {companyInfo.map((company, index) => (
            <div className='nestedContainer' key={index}>
              <div className='companies'>
                <label htmlFor='name'>Company name</label>
                <input
                  type='text'
                  required
                  name='name'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='position'>Position held</label>
                <input
                  type='text'
                  required
                  name='position'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='startDate'>Start date</label>
                <input
                  type='date'
                  required
                  name='startDate'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='isCurrent'>Current position?</label>
                <input
                  type='checkbox'
                  required
                  name='isCurrent'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>
              <div className='companies'>
                <label htmlFor='endDate'>End date</label>
                <input
                  type='date'
                  required
                  name='endDate'
                  onChange={e => handleUpdateCompany(e, index)}
                />
              </div>

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
