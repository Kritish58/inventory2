import React from 'react';

function Dropdown(props) {
  const { categories } = props;
  return (
    <div className="dropdown">
      <span
        className=" text-light d-flex flex-column align-items-center"
        id="dropdownMenu1"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={{ cursor: 'pointer' }}
      >
        <i className="fas fa-th" style={{ fontSize: 18, cursor: 'pointer' }}></i>
        <span style={{ fontSize: 10 }}>tree</span>
      </span>
      <ul className="dropdown-menu multi-level navbar-dropdown-multilevel" role="menu" aria-labelledby="dropdownMenu">
        {categories.map((cat) => {
          return (
            <li key={cat._id} className="navbar-dropdown-submenu" style={{ minWidth: '180px', fontSize: '13px' }}>
              <span className="dropdown-item" tabIndex={-1} href="#">
                <span>{cat.name}</span> <i className="fas fa-caret-right text-muted"></i>
              </span>
              <ul className="dropdown-menu" style={{ minWidth: '180px', fontSize: '13px' }}>
                {cat.items.map((item) => {
                  return (
                    <li key={item._id} className="dropdown-item">
                      <span>{item.name}</span>
                    </li>
                  );
                })}
                {!cat.items.length && (
                  <li className="px-4 text-muted small" style={{ pointerEvents: 'none' }}>
                    no items
                  </li>
                )}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Dropdown;
