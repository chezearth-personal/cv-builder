import React from 'react';
import ErrorPage from './ErrorPage';

const Cv = ({ result }) => {
  if (JSON.stringify(result) === '{}') {
    return <ErrorPage />;
  }
  const handlePrint = () => alert('Print successful!');
  return (
    <>
      <button onClick={handlePrint}>Pront page</button>
      <main className='container'>
        <p>Hello!</p>
      </main>
    </>
  );
};
export default Cv;
