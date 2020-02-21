import React from 'react';
import loadingImage from '../../../img/712-88.gif';

const loading = (props) => {
  return (
    <div className="loading">
      <p className="image"><img src={loadingImage} width="88" height="88" alt="Loading...." /></p>
    </div>
  );
};

export default loading