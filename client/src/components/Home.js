import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading'

const Home = ({ setResult }) => {
  const [fullName, setFullName] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [currentLength, setCurrentLength] = useState(1);
  const [currentTechnologies, setCurrentTechnologies] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([{ name: '', position: '' }]);
  const navigate = useNavigate();
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
    formData.append('currentPosition', currentPosition);
    formData.append('currentLength', currentLength);
    formData.append('currentTechnologies', currentTechnologies);
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
        <div className='nestedContainer'>
          <div>
            <label htmlFor='currentPosition'>Current position</label>
            <input
              type='text'
              required
              name='currentPosition'
              id='currentPosition'
              className='currentInput'
              value={currentPosition}
              onChange={e => setCurrentPosition(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='currentLength'>For how long?</label>
            <input
              type='number'
              required
              name='currentLength'
              id='currentLength'
              className='currentInput'
              value={currentLength}
              onChange={e => setCurrentLength(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='currentTechnologies'>Technologies used?</label>
            <input
              type='text'
              required
              name='currentTechnologies'
              className='currentInput'
              value={currentTechnologies}
              onChange={e => setCurrentTechnologies(e.target.value)}
            />
          </div>
        </div>
        <label htmlFor='photo'>Upload your headshot image</label>
        <input
          type='file'
          required
          name='photo'
          id='photo'
          accept='image/x-png, image/jpeg'
          onChange={e => setHeadShot(e.target.files[0])}
        />
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
