import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { setToken } from '../utils/authToken';

function Login(props) {
  const { generateStructure } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [loginLoader, setLoginLoader] = useState(0);

  const initState = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    setLoginLoader(1);
    axios
      .post('/api/users/login', { email, password })
      .then((res) => {
        setLoginLoader(0);
        if (res.data.emailDoesNotExist) {
          setErrMsg('email does not exist');
          setTimeout(() => {
            setErrMsg('');
          }, 2500);
        }
        if (res.data.passwordIncorrect) {
          setErrMsg('password incorrect');
          setTimeout(() => {
            setErrMsg('');
          }, 2500);
        }
        if (res.data.success) {
          initState();
          setToken(res.data.token);
          generateStructure();
          props.history.push('/');
        }
      })
      .catch((err) => {
        setLoginLoader(0);
        console.log(err);
      });
  };

  return (
    <div className="login-container">
      <form className="container login-form" onSubmit={(e) => handleSubmit(e)}>
        <div>
          <p className="display-4 text-center">Login</p>
        </div>
        <AnimatePresence>
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
        </AnimatePresence>
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
        <div className="my-3">
          <button type="submit" className="btn btn-sm btn-primary" disabled={loginLoader ? true : false}>
            {!loginLoader && <span>login</span>}
            {!!loginLoader && (
              <div className="spinner-border" style={{ width: 14, height: 14, borderWidth: 2 }} role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
        </div>
        <div className="small text-primary">
          No account? <Link to="/signup">create here</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
