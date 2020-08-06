import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../css/navbar.css';
import Dropdown from './navbar/dropdown';
import SearchInput from './navbar/searchInput';

function Navbar(props) {
  const { categories, items, generateStructure } = props;
  const { setSearchInput } = props;

  return (
    <div className="navbar-maincontainer py-2">
      <div className="container">
        <div className="row align-items-center">
          {/*  */}
          <div className="col-3">
            <div className="d-flex align-items-center">
              <Link to="/" className="navbar-brand text-decoration-none">
                <span className="m-0 d-flex flex-column align-items-center">
                  <i className="fas fa-home"></i>
                  <span style={{ fontSize: 10 }}>home</span>
                </span>
              </Link>
              <Dropdown categories={categories} />
            </div>
          </div>

          {/*  */}
          <div className=" col-12 col-sm-6">
            <div className="h-100 d-flex align-items-center ">
              <SearchInput categories={categories} items={items} setSearchInput={setSearchInput} />
            </div>
          </div>
          {/*  */}
          <div className="col-12 col-sm-3">
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
