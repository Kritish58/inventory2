import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import _ from 'underscore';

import { isLoggedIn } from '../utils/authToken';

const sortOptions = [
  { value: 'price', label: 'price' },
  { value: 'pcs', label: 'pcs' },
];

function Stats(props) {
  const { generateStructure } = props;
  const { categories, items } = props;
  const [localCategories, setLocalCategories] = useState([]);

  const [selectedSortOption, setSelectedSortOption] = useState(null);

  const [catWithMostPcs, setCatWithMostPcs] = useState(null);
  const [catWithMostPrice, setCatWithMostPrice] = useState(null);
  const [catWithMostItems, setCatWithMostItems] = useState(null);
  const [catWithLeastPcs, setCatWithLeastPcs] = useState(null);
  const [catWithLeastPrice, setCatWithLeastPrice] = useState(null);
  const [catWithLeastItems, setCatWithLeastItems] = useState(null);

  const [itemWithMostPcs, setItemWithMostPcs] = useState([]);
  const [itemWithMostPrice, setItemWithMostPrice] = useState([]);
  const [itemWithLeastPcs, setItemWithLeastPcs] = useState([]);
  const [itemWithLeastPrice, setItemWithLeastPrice] = useState([]);

  const [totalItems, setTotalItems] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [totalPcs, setTotalPcs] = useState(null);

  const generateTotalValues = () => {
    let totalItems = 0;
    let totalPrice = 0;
    let totalPcs = 0;
    categories.forEach((cat) => {
      totalItems = totalItems + cat.items.length;
      totalPrice = totalPrice + cat.localPrice;
      totalPcs = totalPcs + cat.localPcs;
    });
    setTotalItems(totalItems);
    setTotalPrice(totalPrice);
    setTotalPcs(totalPcs);
  };

  const generateCatWithMostValues = () => {
    const catWithMostPcs = categories.reduce((prev, current) => {
      return prev.localPcs > current.localPcs ? prev : current;
    });
    const catWithLeastPcs = categories.reduce((prev, current) => {
      return current.localPcs < prev.localPcs ? current : prev;
    });
    const catWithMostPrice = categories.reduce((prev, current) => {
      return current.localPrice > prev.localPrice ? current : prev;
    });
    const catWithLeastPrice = categories.reduce((prev, current) => {
      return current.localPrice < prev.localPrice ? current : prev;
    });
    const catWithMostItems = categories.reduce((prev, current) => {
      return current.items.length > prev.items.length ? current : prev;
    });
    const catWithLeastItems = categories.reduce((prev, current) => {
      return current.items.length < prev.items.length ? current : prev;
    });
    setCatWithMostPcs(catWithMostPcs);
    setCatWithMostPrice(catWithMostPrice);
    setCatWithMostItems(catWithMostItems);

    setCatWithLeastPcs(catWithLeastPcs);
    setCatWithLeastPrice(catWithLeastPrice);
    setCatWithLeastItems(catWithLeastItems);
  };

  const generateItemsWithMostValues = () => {
    console.log(items);
    const itemWithMostPrice = items.reduce((prev, current) => {
      return current.price > prev.price ? current : prev;
    });
    const itemWithMostPcs = items.reduce((prev, current) => {
      return current.pcs > prev.pcs ? current : prev;
    });
    const itemWithLeastPrice = items.reduce((prev, current) => {
      return current.price < prev.price ? current : prev;
    });
    const itemWithLeastPcs = items.reduce((prev, current) => {
      return current.pcs < prev.pcs ? current : prev;
    });

    setItemWithMostPrice(itemWithMostPrice);
    setItemWithMostPcs(itemWithMostPcs);

    setItemWithLeastPrice(itemWithLeastPrice);
    setItemWithLeastPcs(itemWithLeastPcs);
  };

  const handleSortSelect = (e) => {
    setSelectedSortOption(e);
    let stage = localCategories;

    if (e.value === 'price') {
      stage = _.sortBy(stage, 'localPrice').reverse();
      setLocalCategories(stage);
      return;
    }
    if (e.value === 'pcs') {
      stage = _.sortBy(stage, 'localPcs').reverse();
      setLocalCategories(stage);
      return;
    }
  };

  const handleDeleteCategory = (catId, catName) => {
    const confirm = window.confirm(`delete category ${catName}? \n \n all items with this category will be deleted`);
    if (confirm) {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .post('/api/categories/deleteOne/' + catId)
        .then((res) => {
          if (res.data.success) {
            generateStructure();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      props.history.push('/login');
      return;
    }
    // generateStructure();
    return () => {};
  }, []);

  useEffect(() => {
    setLocalCategories(categories);

    generateTotalValues();
    generateCatWithMostValues();
    generateItemsWithMostValues();
    console.log(categories);
    return () => {};
  }, [categories]);

  return (
    <div className="container bg-light py-2 pb-5">
      <div className="row bg-white mx-2 my-3 py-2 rounded shadow-sm small font-weight-bold">
        {/*  */}

        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-info text-light rounded">
            <div className="row">
              <div className="col">Category w/m Pcs</div>
              <div className="col">
                {catWithMostPcs && catWithMostPcs.name} ({catWithMostPcs && catWithMostPcs.localPcs}pcs)
              </div>
            </div>
            <div className="row">
              <div className="col">Category w/l Pcs</div>
              <div className="col">
                {catWithLeastPcs && catWithLeastPcs.name} ({catWithLeastPcs && catWithLeastPcs.localPcs}pcs)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-info text-light rounded">
            <div className="row">
              <div className="col">Category w/m Price</div>
              <div className="col">
                {catWithMostPrice && catWithMostPrice.name} (Rs.{catWithMostPrice && catWithMostPrice.localPrice}/-)
              </div>
            </div>
            <div className="row">
              <div className="col">Category w/l Price</div>
              <div className="col">
                {catWithLeastPrice && catWithLeastPrice.name} (Rs.{catWithLeastPrice && catWithLeastPrice.localPrice}/-)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-info text-light rounded">
            <div className="row">
              <div className="col">Category w/m items</div>
              <div className="col">
                {catWithMostItems && catWithMostItems.name} ({catWithMostItems && catWithMostPrice.items.length} items)
              </div>
            </div>
            <div className="row">
              <div className="col">Category w/l items</div>
              <div className="col">
                {catWithLeastItems && catWithLeastItems.name} ({catWithLeastItems && catWithLeastItems.items.length}{' '}
                items)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-info text-light rounded">
            <div className="row">
              <div className="col">Item w/m Pcs</div>
              <div className="col">
                {itemWithMostPcs && itemWithMostPcs.name} ({itemWithMostPcs && itemWithMostPcs.pcs}pcs ,
                {itemWithMostPcs && itemWithMostPcs.category})
              </div>
            </div>
            <div className="row">
              <div className="col">Item w/l Pcs</div>
              <div className="col">
                {itemWithLeastPcs && itemWithLeastPcs.name} ({itemWithLeastPcs && itemWithLeastPcs.pcs}pcs ,
                {itemWithLeastPcs && itemWithLeastPcs.category})
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-info text-light rounded">
            <div className="row">
              <div className="col">Item w/m Price</div>
              <div className="col">
                {itemWithMostPrice && itemWithMostPrice.name} (Rs.{itemWithMostPrice && itemWithMostPrice.price}/- ,
                {itemWithMostPrice && itemWithMostPrice.category})
              </div>
            </div>
            <div className="row">
              <div className="col">Item w/l Price</div>
              <div className="col">
                {' '}
                {itemWithLeastPrice && itemWithLeastPrice.name} (Rs.{itemWithLeastPrice && itemWithLeastPrice.price}/- ,
                {itemWithLeastPrice && itemWithLeastPrice.category})
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-info text-light rounded">
            <div className="row ">
              <div className="col stat-head">Total Pcs</div>
              <div className="col stat-body">{totalPcs}pcs</div>
            </div>
            <div className="row">
              <div className="col">Total Price</div>
              <div className="col">Rs.{totalPrice}/-</div>
            </div>
            <div className="row">
              <div className="col">Total Categories</div>
              <div className="col">{categories.length} cats</div>
            </div>
            <div className="row">
              <div className="col">Total Items</div>
              <div className="col">{totalItems} items</div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
      {/*  */}
      <div className="px-2" style={{ maxWidth: 200 }}>
        <span className="small text-muted"> sort by</span>
        <Select options={sortOptions} value={selectedSortOption} onChange={(e) => handleSortSelect(e)} />
      </div>
      <div className="row justify-content-center">
        {localCategories.map((cat) => {
          return (
            <div className="col-12 col-sm-5 col-sm-offset-2 border rounded shadow-sm m-3 bg-white p-3 ">
              <div className="d-flex align-items-center mb-2">
                <h5 className="m-0 text-dark">{cat.name}</h5>

                <button
                  className="btn btn-sm btn-light ml-2 text-muted"
                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                >
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
      </div>
    </div>
  );
}

export default Stats;
