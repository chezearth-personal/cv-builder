// import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useIdleTimer } from 'react-idle-timer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Loading } from '_components/placeholders/Loading';
import { HomeTopics } from '_components/home-topics/HomeTopics';
import { Companies } from '_components/companies/Companies';
import { fetchWrapper } from '_helpers/fetch-wrapper';
import { alertActions } from '_store/alert.slice';
import { cvActions } from '_store/cv.slice';
import { authActions } from '_store/auth.slice';
import { logo } from 'resources/images';
import 'App.css';

export { Home };

function Home({ setResult }) {
  const [ state, setState ] = useState('Active');
  const [ count, setCount ] = useState(0);
  const [ remainingTime, setRemainingTime ] = useState(0);
  const [ skillTopics, setSkillTopics ] = useState([{ name: '', itemList: [] }]);
  const navigate = useNavigate();
  const auth = useSelector(x => x.auth.value);
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full Name is required'),
    occupation: Yup.string()
      .required('Occupation is required'),
    tel: Yup.string()
      .required('Telephone number is required'),
    email: Yup.string()
      .required('Email is required'),
    skillTopics: Yup.array().of(Yup.object().shape({
      name: Yup.string(),
      itemList: Yup.array().of(Yup.object().shape({
        name: Yup.string()
      })).min(1, 'At least one skill is required')
    })).min(1, 'At least one skill topic is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build form with useForm() hook */
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      const response = await dispatch(cvActions.create(data)).unwrap();
      /** Redirect to cv page and display success alert */
      navigate('/cv');
      dispatch(alertActions.success({
        message: `${response.message} `,
        showAfterRedirect: true
      }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }
  const initCompany = {
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    keyPhraseTopics: []
  };
  // const [ fullName, setFullName ] = useState('');
  // const [ occupation, setOccupation ] = useState('');
  // const [ headShot, setHeadShot ] = useState(null);
  // const [ tel, setTel ] = useState('');
  // const [ email, setEmail ] = useState('');
  // const [ website, setWebsite ] = useState('');
  // const [ loading, setLoading ] = useState(false);
  const [ companies, setCompanies ] = useState([initCompany]);
  /** Idle timer functions */
  const onIdle = () => {
    console.log('user is idle and user logged in?', auth ? 'yes' : 'no', auth);
    setState('Idle');
    if (auth) {
      console.log('logging out');
      dispatch(authActions.logout());
    } else {
      console.log('user not logged in');
    }
  }
  const onActive = () => {
    setState('Active');
  }
  const onAction = () => {
    setCount(count + 1);
  }
  // console.log('timeout =', process.env.REACT_APP_IDLE_TIMEOUT_MINUTES);
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: 60_000 * (process.env.REACT_APP_IDLE_TIMEOUT_MINUTES || 10),
    throttle: 500
  });
  /** Handle Form Success & Errors, Submit the form */
  // const handleFormSuccess = res => {
    // if (res.data.message) {
      /** Update the result object */
      // setResult(res.data.data);
      // navigate('/cv');
    // }
    // setLoading(true);
  // }
  // const handleFormError = err => {
    // if (err && err.response && /<pre>MulterError: File too large<br>/.test(err.response.data.toString())) {
      // console.error('navigate to \'ErrorPage/\'');
    // } else {
      // console.error(err);
    // }
    // setLoading(true);
  // }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    /** Check the text input for adding pill items have all been cleared */
    const inputItems = event.target.querySelectorAll('input[name="inputItem"]');
    const sendForm = [ ...inputItems].reduce((acc, item) => {
      if (item.value !== '') {
        alert(`Please click the 'Add item' button next to '${item.value}' to add it to the list`);
      }
      return acc && item.value === '';
    }, true)
    if (sendForm) {
      // const formData = new FormData();
      // headShot && formData.append('headshotImage', headShot, headShot.name);
      // formData.append('fullName', fullName);
      // formData.append('occupation', occupation);
      // formData.append('tel', tel);
      // formData.append('email', email);
      // formData.append('website', website);
      // formData.append('skillTopics', JSON.stringify(skillTopics));
      // formData.append('companyDetails', JSON.stringify(companies));
      fetchWrapper.post(
        'http://localhost:4000/cv/create',
        // formData,
        // handleFormSuccess,
        // handleFormError
      );
    }
    return <div></div>;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(Math.ceil(getRemainingTime() / 1000));
    }, 500);
    return () => clearInterval(interval);
  });

  return (
    <div className='App'>
      <div className='nav'>
        <h3>{!auth ? `Not logged in` : `Hi ${auth?.firstName}!`}</h3>
        {/**<p>You're logged in with React 18 + Redux & JWT</p>*/}
        <p>{auth && <Link to='/account'>My account</Link>}</p>
        <p>Idle timer: current state - {state} | Action events - {count} | {remainingTime} seconds remaining</p>
      </div>
      {{isSubmitting} ? null : <Loading />}
      <div className='App-header'>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <h1>CV Builder</h1>
      <p>Generate a CV with chatGPT in a few minutes</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='fullName'>Enter your full name <span className='req'>*</span></label>
        <input
          type='text'
          required
          name='fullName'
          id='fullName'
          placeholder={!auth ? '' : `${auth?.firstName} ${auth?.lastName}`}
          { ...register('fullName') }
          className={`form__control ${errors.fullName ? 'is-invalid' : ''}`}
          /*value={fullName}*/
          /*onChange={(e) => setFullName(e.target.value)}*/
        />
        <label htmlFor='occupation'>Enter your occupation <span className='req'>*</span></label>
        <input
          type='text'
          required
          name='occupation'
          id='occupation'
          { ...register('occupation') }
          className={`form__control ${errors.occupation ? 'is-invalid' : ''}`}
          // value={occupation}
          // onChange={(e) => setOccupation(e.target.value)}
        />
        <label htmlFor='photo'>Upload your headshot image</label>
        <input
          type='file'
          name='photo'
          id='photo'
          accept='image/x-png, image/jpeg'
          { ...register('headshotImage') }
          // onChange={e => setHeadShot(e.target.files[0])}
        />
        <h3>Contact Information</h3>
        <label htmlFor='tel'>Tel <span className='req'>*</span></label>
        <input
          type='tel'
          required
          name='tel'
          id='tel'
          { ...register('tel') }
          className={`form__control ${errors.tel ? 'is-invalid' : ''}`}
          // value={tel}
          // onChange={(e) => setTel(e.target.value)}
        />
        <label htmlFor='email'>Email address <span className='req'>*</span></label>
        <input
          type='email'
          required
          name='email'
          id='email'
          placeholder={!auth ? '' : auth?.email}
          autoComplete='email work home'
          { ...register('email') }
          className={`form__control ${errors.email ? 'is-invalid' : ''}`}
          // value={email}
          // onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor='website'>Website or online portfolio</label>
        <input
          type='url'
          name='website'
          id='website'
          placeholder='https://'
          { ...register('website') }
          className={`form__control ${errors.website ? 'is-invalid' : ''}`}
          // value={website}
          // onChange={(e) => setWebsite(e.target.value)}
        />
        <h3 className='listItems'>General skills (across whole work history)</h3>
        <HomeTopics
          homeTopics={skillTopics}
          setHomeTopics={setSkillTopics}
          description=''
          name='skillTopic'
          pillGroupLabel='Enter a skill topic'
          pillItemLabel='Skill to be added'
          { ...register('skillTopics') }
        />
        <h3>{`Companies you've worked at`}</h3>
        <Companies
          companies={companies}
          setCompanies={setCompanies}
          initCompany={initCompany}
          { ...register('companyDetails') }
        />
        <button disabled={isSubmitting} type='submit'>Create Your CV!</button>
      </form>
    </div>
  );
}
