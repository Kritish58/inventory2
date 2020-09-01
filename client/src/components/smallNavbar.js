import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Autocomplete from 'react-autocomplete';

import '../css/navbar.css';
import Dropdown from './navbar/dropdown';

function Navbar(props) {
  const { categories, items, generateStructure } = props;
  const { setSearchInput } = props;

  const [searchClicked, setSearchClicked] = useState(0);

  const [input, setInput] = useState('');
  const [allSearchOptions, setAllSearchOptions] = useState([]);

  useEffect(() => {
    const modCategories = categories.map((cat) => {
      return {
        _id: cat._id,
        name: cat.name,
        type: 'category',
      };
    });

    const modItems = items.map((item) => {
      return {
        _id: item._id,
        name: item.name,
        type: 'item',
      };
    });

    const modAll = [...modCategories, ...modItems];
    setAllSearchOptions(modAll);

    return () => {};
  }, [categories, items]);

  return (
    <div className="small-navbar navbar-maincontainer w-100 py-2" style={{ position: 'fixed', zIndex: 1000 }}>
      <div className="container">
        {/* search input for small nav */}
        <AnimatePresence>
          {!!searchClicked && (
            <motion.div
              initial={{ opacity: 0, top: 0, backgroundColor: '#05396B' }}
              animate={{ opacity: 1, top: 57, backgroundColor: '#fff' }}
              exit={{ opacity: 0, top: 0, backgroundColor: '#05396B' }}
              className={`w-75 ml-5 shadow rounded-bottom small-nav-search-div`}
            >
              {/* <input type="text" className="form-control" placeholder="search" /> */}
              {/* <SearchInput categories={categories} items={items} setSearchInput={setSearchInput} /> */}
              <div className="d-flex">
                <Autocomplete
                  menuStyle={{ zIndex: 9 }}
                  inputProps={{
                    placeholder: 'search',
                    style: {
                      padding: '6px 6px',
                      borderRadius: 4,
                      borderWidth: 0,
                      width: '60vw',
                    },
                  }}
                  items={allSearchOptions}
                  shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                  getItemValue={(item) => item.name}
                  renderItem={(item, highlighted) => (
                    <div
                      className="p-2 d-flex justify-content-between"
                      key={item.id}
                      style={{ backgroundColor: highlighted ? '#eee' : '#fff' }}
                    >
                      <span>{item.name}</span>
                      <span
                        style={{ fontSize: 10 }}
                        className={` ${item.type === 'category' ? 'bg-primary' : 'bg-success'} text-light rounded p-1`}
                      >
                        {item.type}
                      </span>
                    </div>
                  )}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onSelect={(value) => setInput(value)}
                />
                <button
                  className="btn btn-sm btn-danger ml-1"
                  style={{ height: 'fit-content', padding: '6px 8px', position: 'relative' }}
                  onClick={() => {
                    setSearchInput(input);
                    setInput('');
                  }}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="row align-items-center">
          {/*  */}
          <div className="col-5">
            <div className="d-flex align-items-center">
              <Link to="/" className="navbar-brand text-decoration-none">
                <span className=" d-flex flex-column align-items-center">
                  <i className="fas fa-home"></i>
                  <span style={{ fontSize: 10 }}>home</span>
                </span>
              </Link>
              <Dropdown categories={categories} />
              {!searchClicked && (
                <span
                  className="ml-3 d-flex flex-column align-items-center text-light"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearchClicked((prev) => !prev);
                  }}
                >
                  <i className=" fas fa-search" style={{ fontSize: 18 }}></i>
                  <small style={{ fontSize: 10 }}>find</small>
                </span>
              )}
              {!!searchClicked && (
                <span
                  className="ml-3 d-flex flex-column align-items-center text-light"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearchClicked((prev) => !prev);
                  }}
                >
                  <i className=" fas fa-times" style={{ fontSize: 18 }}></i>
                  <small style={{ fontSize: 10 }}>close</small>
                </span>
              )}
            </div>
          </div>

          {/*  */}
          {/* <div className=" col-12 col-sm-6">
            <div className="h-100 d-flex align-items-center ">
              <SearchInput categories={categories} items={items} setSearchInput={setSearchInput} />
            </div>
          </div> */}
          {/*  */}
          <div className="col-7">
            <div className="d-flex justify-content-end align-items-center">
              <div className="mr-2">
                <Link
                  to="/add"
                  className="btn btn-sm btn-light rounded text-muted"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="add"
                >
                  <i className="fas fa-plus"></i>
                </Link>
              </div>

              <div className="mr-2">
                <Link
                  to="/stats"
                  className="btn btn-sm btn-light rounded text-muted"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="stats"
                >
                  <i className="fas fa-info-circle"></i>
                </Link>
              </div>
              <div className="mr-2">
                <Link
                  to="/profile"
                  className="btn btn-sm btn-light text-muted"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="profile"
                >
                  <i className="fas fa-user-alt"></i>
                </Link>
              </div>

              {/* <div className="mr-2">
                <button
                  className="btn btn-sm btn-light text-muted"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="log out"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div> */}
              <div>
                <button className="btn btn-sm btn-warning" onClick={() => generateStructure()}>
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              {/*  */}
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
