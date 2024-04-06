import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/placeholders/Loading';
import HomeTopics from '../components/home-topics/HomeTopics';
import Companies from '../components/companies/Companies';
import logo from '../images/logo.svg';
import '../App.css'

const Home = ({ setResult }) => {
  const initCompany = {
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    keyPhraseTopics: []
  };
  const [fullName, setFullName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [headShot, setHeadShot] = useState(null);
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [skillTopics, setSkillTopics] = useState([{ name: '', itemList: [] }]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([initCompany]);
  const navigate = useNavigate();
  /** Submit the form */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    headShot && formData.append('headshotImage', headShot, headShot.name);
    formData.append('fullName', fullName);
    formData.append('occupation', occupation);
    formData.append('tel', tel);
    formData.append('email', email);
    formData.append('website', website);
    formData.append('skillTopics', JSON.stringify(skillTopics));
    formData.append('companyDetails', JSON.stringify(companies));
    // console.log('skillGroups JSON:', JSON.stringify(skillGroups));
    console.log('companies JSON:', JSON.stringify(companies));
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
      <p>Generate a CV with chatGPT in a few minutes</p>
      <form
        onSubmit={handleFormSubmit}
        method='POST'
        encType='multipart/form-data'
      >
        <label htmlFor='fullName'>Enter your full name <span className='req'>*</span></label>
        <input
          type='text'
          required
          name='fullName'
          id='fullName'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label htmlFor='jobTitle'>Enter your occupation <span className='req'>*</span></label>
        <input
          type='text'
          required
          name='occupation'
          id='occupation'
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
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
        <label htmlFor='{telNumber}'>Tel <span className='req'>*</span></label>
        <input
          type='tel'
          required
          name='telNumber'
          id='telNumber'
          onChange={(e) => setTel(e.target.value)}
        />
        <label htmlFor='email'>Email address <span className='req'>*</span></label>
        <input
          type='email'
          required
          name='email'
          id='email'
          value={email}
          autoComplete='email'
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor='website'>Website or online portfolio</label>
        <input
          type='url'
          name='website'
          id='website'
          placeholder='https://'
          onChange={(e) => setWebsite(e.target.value)}
        />
        <h3 className='listItems'>General skills (across whole work history)</h3>
        <HomeTopics
          homeTopics={skillTopics}
          setHomeTopics={setSkillTopics}
          description=''
          name='skillTopic'
          pillGroupLabel='Enter a skill topic'
          pillItemLabel='Skill to be added'
        />
        <h3>{`Companies you've worked at`}</h3>
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
