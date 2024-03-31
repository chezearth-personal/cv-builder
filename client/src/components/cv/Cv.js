import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ErrorPage from '../placeholders/ErrorPage';
import ItemGroups from './item-group/ItemGroups';
import ImageEmail from '../../images/email-logo.png';
import ImageTel from '../../images/tel-logo.jpeg';
import './Cv.css';

const Cv = ({ result }) => {
  const componentRef = useRef();
  const possesive = (num) => num > 1 ? 's\'' : 'year\'s';
  console.log('companyDetails = ', result.companyDetails);
  const totalWorkMonths = !result.companyDetails
    ? 0
    : result.companyDetails
      .map(work => {
        const startDate = new Date(work.startDate);
        const endDate = !work.isCurrent ? new Date(work.endDate) : new Date();
        return Math.floor((endDate - startDate) / (3600000 * 24 * 30.4375) + 1);
      })
      .reduce((acc, curr) => acc + curr, 0);
  const totalWorkYears = totalWorkMonths > 60
    ? `${Math.round(totalWorkMonths / 12)} years'`
    : totalWorkMonths < 12
      ? `${totalWorkMonths} month${possesive(totalWorkMonths)}`
      : `${Math.floor(totalWorkMonths / 12)} year${
        possesive(Math.floor(totalWorkMonths / 12))
      }${
        totalWorkMonths % 12 === 0
          ? ''
          : ` and ${totalWorkMonths % 12} month${possesive(totalWorkMonths % 12)}`
      }`;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${result.fullName} CV`,
    onAfterPrint: () => alert('Print successful!')
  });
  /** Function that replaces the new line with a single HTML break tag */
  const replaceWithBr = (string) => !string
    ? ''
    : Array
      .from(new Set((string.replace(/\n/g, '<br />')
      .split('<br />'))))
      .map(e => e === '' ? '<br />' : e)
      .join('');
  /** Returns an error page if the result object is empty */
  if (JSON.stringify(result) === '{}') {
    return <ErrorPage />;
  }
  return (
    <>
      <button onClick={handlePrint}>Print page</button>
      <main className='container' ref={componentRef}>
        <header className='header'>
          <div className='headingText'>
            <h1>{result.fullName.toUpperCase()}</h1>
            <h2>{result.occupation.toUpperCase()}</h2>
            <p className='cvTitle'>
              {totalWorkYears} work experience
            </p>
          </div>
          {!result.imageUrl ? '' : (
            <div>
              <img
                src={result.imageUrl}
                alt={result.fullName}
                className='cvImage'
              />
            </div>
          )}
        </header>
        <div className='cvBody'>
          <div className='cvKeyPoints'>
            <div className='cvPoint'>
              <h4 className='cvBodyTitle cvHistoryTitle'>CONTACT</h4>
              <div className='cvContactList'>
                  <div className='cvContact'>
                    <img className='cvIcon' src={ImageEmail} alt='email' />
                    <p>{result.email}</p>
                  </div>
                  <div className='cvContact'>
                    <img className='cvIcon' src={ImageTel} alt='tel' />
                    <p>{result.tel}</p>
                  </div>
              </div>
            </div>
            <ItemGroups handleBr={replaceWithBr} itemGroups={result.skillGroups} headingText='TECHNICAL SKILLS' />
          </div>
          <div className='cvStory'>
            <div>
              <h4 className='cvBodyTitle cvHistoryTitle'>PROFILE SUMMARY</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: replaceWithBr(result.profile),
                }}
                className='cvBodyContent'
              />
            </div>
            <div>
              <h4 className='cvBodyTitle cvHistoryTitle'>WORK HISTORY</h4>
              {result.workHistories.map((workStory, index) => (
                <div key={index} className='cvBodyContent'>
                  <p className='cvBodyCompany' key={index}>
                    {workStory.name}
                  </p>
                  <div className='cvBodyPosition'>
                    <p>{workStory.position}</p>
                    <p>{workStory.startDate} to {workStory.isCurrent ? 'present' : workStory.endDate}</p>
                  </div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: replaceWithBr(workStory.companyStory),
                    }}
                    className='cvBodyContent'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Cv;

            // <div>
              // <h4 className='cvBodyTitle cvHistoryTitle'>JOB PROFILE</h4>
              // <p
                // dangerouslySetInnerHTML={{
                  // __html: replaceWithBr(result.jobResponsibilities),
                // }}
                // className='cvBodyContent'
              // />
            // </div>
            // <div>
              // <h4 className='cvBodyTitle cvHistoryTitle'>JOB RESPONSIBILITIES</h4>
              // <p
                // dangerouslySetInnerHTML={{
                  // __html: replaceWithBr(result.keyPoints),
                // }}
                // className='cvBodyContent'
              // />
            // </div>
