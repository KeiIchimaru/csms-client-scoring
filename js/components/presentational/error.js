import React from 'react';

const error = (props) => {
  return (
      <>
      <h2>Error</h2>
      <p>{props.error.message}</p>
    </>
  );
};
  
export default error