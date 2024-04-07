import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ErrorPage from '../_components/placeholders/ErrorPage';
import ItemGroups from '../_components/cv/item-group/ItemGroups';
import ImageEmail from '../resources/images/email-logo.png';
import ImageTel from '../resources/images/tel-logo.png';
import ImageWeb from '../resources/images/web-logo.png';
import './Cv.css';

const possesive = (num) => num > 1 ? 's\'' : 'year\'s';

const Cv = ({ result }) => {
  const componentRef = useRef();
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
    : string.replace(/(\n)\1+/, '$1').replace(/\n/g, '<br />');
  // console.log('result =', result);
  /** Looks for and creates bullet points */
  // const createBulletPoints = (string) => {
    // const arr = string.split('- ');
    // return arr
      // .map((txt, index) => {
        // if (index === 0) {
          // return `${txt}</p><ul><`
        // } else if (index === arr.length - 1) {
          // const fs = txt.indexOf('.');
          // return txt.substring(0, fs - 1) + '</li></ul><p>' + txt.substring(fs + 1);
        // } else {
          // return `>${txt}</li><`
        // }
      // })
      // .join('li');
  // }
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
                <div className='cvContact'>
                  <img className='cvIcon' src={ImageWeb} alt='website' />
                  <p>{result.website}</p>
                </div>
              </div>
            </div>
            <ItemGroups handleBr={replaceWithBr} itemGroups={result.skillTopics} headingText='TECHNICAL SKILLS' />
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
              {result.workHistories.map((companyDetail, index) => (
                <div key={index} className='cvBodyContent'>
                  <p className='cvBodyCompany' key={index}>
                    {companyDetail.name}
                  </p>
                  <div className='cvBodyPosition'>
                    <p>{companyDetail.position}</p>
                    <p>{companyDetail.startDate} to {companyDetail.isCurrent ? 'present' : companyDetail.endDate}</p>
                  </div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: replaceWithBr(companyDetail.companyStory),
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
