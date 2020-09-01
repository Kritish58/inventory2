import React, { useEffect } from 'react';

import { isLoggedIn, removeToken } from '../utils/authToken';

function Profile(props) {
  useEffect(() => {
    if (!isLoggedIn()) {
      props.history.push('/login');
      return;
    }
    return () => {};
  }, []);

  const handleLogout = () => {
    removeToken();
    props.history.push('/login');
  };
  return (
    <div>
      <p
        className="d-flex flex-column align-items-center"
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-150%)' }}
      >
        <span className="display-4">profile</span>
        <button className="btn btn-sm btn-primary my-2" onClick={() => handleLogout()}>
          Logout
        </button>
      </p>
    </div>
  );
}

export default Profile;
