import React from "react";
import './Spinner.css';

const Loading = () => {
  return (
    <div className='spinner'>
      <div className='spinner__circle'>
        <h1 className='loader'>Loading, please wait...</h1>
      </div>
    </div>
  );
}

export default Loading;
