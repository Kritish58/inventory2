import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Home from './pages/view';
import Navbar from './components/navbar';
import SmallNavbar from './components/smallNavbar';
import Add from './pages/add';
import Stats from './pages/stats';
import Profile from './pages/profile';
import SearchResult from './pages/searchResult';

function App(props) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [globalPcs, setGlobalPcs] = useState(null);
  const [globalPrice, setglobalPrice] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const [loader, setLoader] = useState(0);

  useEffect(() => {
    generateStructure();
    return () => {};
  }, []);

  useEffect(() => {
    props.history.push('/searchResults');
    return () => {};
  }, [searchInput]);

  const generateStructure = () => {
    setLoader(1);
    axios
      .get('/api/categories/generate/structure')
      .then((res) => {
        console.log(res);
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
      {!loader && !!categories.length && !!items.length && (
        <div>
          {/* media query is used to select between the two */}
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

          <div className="p-5">
            <Switch>
              <Route
                exact
                path="/"
                component={(props) => (
                  <Home {...props} generateStructure={generateStructure} items={items} categories={categories} />
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

      {!loader && (!categories.length || !items.length) && (
        <Add categories={categories} items={items} generateStructure={generateStructure} />
      )}
    </div>
  );
}

export default withRouter(App);
