import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { setToken } from '../utils/authToken';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [signupLoader, setSignupLoader] = useState(0);

  const initState = () => {
    setEmail('');
    setPassword('');
    setKey('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !key) {
      return;
    }

    setSignupLoader(1);
    axios
      .post('/api/users/signup', { email, password, key })
      .then((res) => {
        setSignupLoader(0);
        console.log(res);
        if (res.data.invalidKey) {
          setErrMsg('invalid key, please try another');
          setTimeout(() => {
            setErrMsg('');
          }, 2500);
        }
        if (res.data.emailAlreadyExists) {
          setErrMsg('email already exists, please try another');
          setTimeout(() => {
            setErrMsg('');
          }, 2500);
        }
        if (res.data.success) {
          initState();
          setToken(res.data.token);
        }
      })
      .catch((err) => {
        setSignupLoader(0);
        console.log(err);
      });
  };

  return (
    <div className="signup-container">
      <form className="container signup-form" onSubmit={(e) => handleSubmit(e)}>
        <div>
          <p className="display-4 text-center">Sign up</p>
        </div>
        {!!errMsg.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="alert alert-warning small"
          >
            {errMsg}
          </motion.div>
        )}
        <div className="my-2">
          <label htmlFor="email" className="small">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-2">
          <label htmlFor="password" className="small">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="my-2">
          <label htmlFor="key" className="small">
            Key
          </label>
          <input
            type="password"
            id="key"
            className="form-control"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <div className="my-3">
          <button type="submit" className="btn btn-sm btn-success" disabled={signupLoader ? true : false}>
            {!signupLoader && <span>sign up</span>}
            {!!signupLoader && (
              <div className="spinner-border" style={{ width: 14, height: 14, borderWidth: 2 }} role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
        </div>
        <div className="small text-primary">
          Already got an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
