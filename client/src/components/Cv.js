import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ErrorPage from './ErrorPage';
import '../Cv.css';
import tick from '../tick.png';

const Cv = ({ result }) => {
  const componentRef = useRef();
  const possesive = (num) => num > 1 ? 's\'' : 'year\'s';
  console.log('workHistory = ', result.workHistory);
  const totalWorkMonths = !result.workHistory
    ? 0
    : result.workHistory
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
  /** Function that replaces the new line with a break tag */
  const replaceWithBr = (string) => string.replace(/\n/g, '<br />');
  /** Returns an error page if the result object is empty */
  if (JSON.stringify(result) === '{}') {
    return <ErrorPage />;
  }
  console.log('result.imageUrl =\n', result && result.imageUrl);
  console.log('result.objective =', result.objective);
  console.log('replaceWithBr() = ', replaceWithBr(result.objective));
  console.log('result.technologiesString =', result.technologies);
  console.log('replaceWithBr() = ', replaceWithBr(result.technologies));
  return (
    <>
      <button onClick={handlePrint}>Print page</button>
      <main className='container' ref={componentRef}>
        <header className='header'>
          <div className='headingText'>
            <h1>{result.fullName.toUpperCase()}</h1>
            <h2>SOFTWARE ENGINEER</h2>
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
            <div>
              <h2 className='cvBodyTitle'>TECHNICAL SKILLS</h2>
              <div className='cvTechSkillGroup'>
                <img src={tick} alt=' - ' className='cvBullet'/>
                <div className='cvBulletedItem'>
                  <h4 className='cvGroupHeading'>Languages and Frameworks</h4>
                  <p 
                    dangerouslySetInnerHTML={{
                      __html: replaceWithBr(result.technologies + '\n'),
                    }}
                    className='cvBodyContent'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='cvStory'>
            <div>
              <h2 className='cvBodyTitle'>PROFILE SUMMARY</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: replaceWithBr(result.objective),
                }}
                className='cvBodyContent'
              />
            </div>
            <div>
              <h2 className='cvBodyTitle'>WORK HISTORY</h2>
              {result.workHistory.map(work => (
                <p className='cvBodyContent' key={work.name}>
                  <span style={{ fontWeight: "bold" }}>{work.name}</span> -{" "}
                  {work.position}
                </p>
              ))}
            </div>
            <div>
              <h2 className='cvBodyTitle'>JOB PROFILE</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: replaceWithBr(result.jobResponsibilities),
                }}
                className='cvBodyContent'
              />
            </div>
            <div>
              <h2 className='cvBodyTitle'>JOB RESPONSIBILITIES</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: replaceWithBr(result.keyPoints),
                }}
                className='cvBodyContent'
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Cv;
