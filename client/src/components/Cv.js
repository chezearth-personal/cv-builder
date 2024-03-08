import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ErrorPage from './ErrorPage';

const Cv = ({ result }) => {
  // console.log('result.image_url =', result.image_url);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${result.fullName} CV`,
    onAfterPrint: () => console.log('Print successful!'),
  });
  /** Function that replaces the new line with a break tag */
  const replaceWithBr = (string) => string.replace(/\n/g, '<br />');
  /** Returns an error page if the result object is empty */
  if (JSON.stringify(result) === '{}') {
    return <ErrorPage />;
  }
  return (
    <>
      <button onClick={handlePrint}>Print page</button>
      <main className='container' ref={componentRef}>
        <header className='header'>
          <div>
            <h1>{result.fullName}</h1>
            <p className='cvTitle headerTitle'>
              {result.currentPosition} ({result.currentTechnologies})
            </p>
            <p className='cvTitle'>
              {result.currentLength}year(s) work experience
            </p>
          </div>
          <div>
            <img
              src={result.image_url}
              alt={result.fullName}
              className='cvImage'
            />
          </div>
        </header>
        <div className='cvBody'>
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
      </main>
    </>
  );
};
export default Cv;
