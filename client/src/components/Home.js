import React, { useState } from 'react';
import Loading from './Loading'

const Home = () => {
  const [fullName, setFullName] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [currentLength, setCurrentLength] = useState(1);
  const [currentTechnologies, setCurrentTechnologies] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([{ name: '', position: '' }]);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({
      fullName,
      currentPosition,
      currentLength,
      currentTechnologies,
      headShot
    });
    setLoading(true);
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
