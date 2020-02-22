import React from 'react';

const error = (props) => {
  return (
    <div className="error-page">
      <div className="error-header">
        <h2 className="error">Error!!</h2>
      </div>
      <div className="error-body">
        <p>{props.error.message}</p>
      </div>
      <div className="error-footer">
        <p>システム管理者にご連絡ください。</p>
      </div>
    </div>
  );
};
  
export default error