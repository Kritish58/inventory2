import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Home from './pages/view';
import Navbar from './components/navbar';
import SmallNavbar from './components/smallNavbar';
import Add from './pages/add';
import Stats from './pages/stats';
import Profile from './pages/profile';
import SearchResult from './pages/searchResult';
import Login from './pages/login';
import Signup from './pages/signup';
import { isLoggedIn } from './utils/authToken';

function App(props) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const [loader, setLoader] = useState(0);

  const [isAuthPage, setIsAuthPage] = useState(false);

  // hide navbar if it is auth page
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('login') || location.pathname.includes('signup')) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
    return () => {};
  }, [location]);

  useEffect(() => {
    if (!isLoggedIn()) {
      props.history.push('/login');
      return;
    }
    generateStructure();
    return () => {};
  }, []);

  useEffect(() => {
    if (!isAuthPage) {
      // props.history.push('/searchResults');
    }
    return () => {};
  }, [searchInput]);

  const generateStructure = () => {
    setLoader(1);
    axios
      .get('/api/categories/generate/structure', {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setLoader(0);
        if (res.data.success) {
          setCategories(res.data.categories);
          setItems(res.data.items);
        }
      })
      .catch((err) => {
        setLoader(0);
        console.log(err);
      });
  };
  return (
    <div className="App">
      {!!loader && <h4>Loading...</h4>}
      {!loader && (
        <div>
          {!isAuthPage && (
            <>
              <Navbar
                {...props}
                generateStructure={generateStructure}
                items={items}
                categories={categories}
                setSearchInput={setSearchInput}
              />
              <SmallNavbar
                {...props}
                generateStructure={generateStructure}
                items={items}
                categories={categories}
                setSearchInput={setSearchInput}
              />
            </>
          )}

          <div className={isAuthPage ? 'p-0' : 'p-5'}>
            <Switch>
              <Route
                exact
                path="/"
                component={(props) => (
                  <Home {...props} generateStructure={generateStructure} items={items} categories={categories} />
                )}
              />
              <Route
                path="/login"
                component={(props) => (
                  <Login {...props} generateStructure={generateStructure} items={items} categories={categories} />
                )}
              />
              <Route
                path="/signup"
                component={(props) => (
                  <Signup {...props} generateStructure={generateStructure} items={items} categories={categories} />
                )}
              />
              <Route
                path="/add"
                component={(props) => (
                  <Add {...props} generateStructure={generateStructure} items={items} categories={categories} />
                )}
              />
              <Route
                path="/stats"
                component={(props) => (
                  <Stats {...props} generateStructure={generateStructure} items={items} categories={categories} />
                )}
              />
              <Route
                path="/profile"
                component={(props) => (
                  <Profile {...props} generateStructure={generateStructure} items={items} categories={categories} />
                )}
              />
              <Route
                path="/searchResults"
                component={(props) => (
                  <SearchResult
                    {...props}
                    generateStructure={generateStructure}
                    items={items}
                    categories={categories}
                    searchInput={searchInput}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(App);
