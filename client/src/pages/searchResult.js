import React, { useState, useEffect } from 'react';

import ItemsView from '../components/view/itemsView';

function SearchResult(props) {
  const { items, categories } = props;
  const { searchInput } = props;

  const [localItems, setLocalItems] = useState([]);
  const [localCats, setLocalCats] = useState([]);

  useEffect(() => {
    const stageItems = items.filter((item) => {
      if (item.name.toLowerCase().includes(searchInput.toLowerCase())) {
        return item;
      }
    });
    const stageCats = categories.filter((cat) => {
      if (cat.name.toLowerCase().includes(searchInput.toLowerCase())) {
        return cat;
      }
    });
    setLocalItems(stageItems);
    setLocalCats(stageCats);
    return () => {};
  }, []);
  return (
    <div className="container bg-light py-2">
      {/*  */}
      <div className="table-responsive" style={{ fontSize: '14px' }}>
        <div>
          <ItemsView items={localItems} />
        </div>
      </div>
      {/*  */}
      {localCats.map((cat) => {
        return (
          <div className=" border rounded shadow-sm m-3 bg-white p-3 ">
            <div className="d-flex align-items-center mb-2">
              {/* <h5 className="m-0 text-dark">{cat.name}</h5> */}
              <h5 className="m-0 text-dark">{cat.name}</h5>

              <button className="btn btn-sm btn-light ml-2 text-muted">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <div className="row small font-weight-bold">
              <div className="col-6 col-sm-4">
                <p>items</p>
                <p>total price</p>
                <p>total pcs</p>
                <p>%(price/G)</p>
                <p>%(pcs/G)</p>
              </div>
              <div className="col-6 col-sm-8">
                <p>{cat.items.length}</p>
                <p>Rs.{cat.localPrice}/-</p>
                <p>{cat.localPcs}</p>
                <p>{Math.round((cat.priceVsGlobal + Number.EPSILON) * 100) / 100}%</p>
                <p>{Math.round((cat.pcsVsGlobal + Number.EPSILON) * 100) / 100}%</p>
              </div>
            </div>
          </div>
        );
      })}
      {/*  */}
    </div>
  );
}

export default SearchResult;
