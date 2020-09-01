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
    <div className=" bg-light py-2 pb-5">
      <div className="row bg-white mx-2 my-3 py-2 rounded shadow-sm small">
        {/*  */}

        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-light text-muted rounded">
            <div className="row mb-2">
              <div className="col">
                <span className="text-dark">Category</span> w/m Pcs
              </div>
              <div className="col">
                <span className="text-dark">{catWithMostPcs && catWithMostPcs.name}</span> (
                {catWithMostPcs && catWithMostPcs.localPcs}pcs)
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span className="text-dark">Category</span> w/l Pcs
              </div>
              <div className="col">
                <span className="text-dark">{catWithLeastPcs && catWithLeastPcs.name}</span> (
                {catWithLeastPcs && catWithLeastPcs.localPcs}pcs)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-light text-muted rounded">
            <div className="row mb-2">
              <div className="col">
                <span className="text-dark">Category</span> w/m Price
              </div>
              <div className="col">
                <span className="text-dark">{catWithMostPrice && catWithMostPrice.name}</span> (Rs.
                {catWithMostPrice && catWithMostPrice.localPrice}/-)
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span className="text-dark">Category</span> w/l Price
              </div>
              <div className="col">
                <span className="text-dark">{catWithLeastPrice && catWithLeastPrice.name}</span> (Rs.
                {catWithLeastPrice && catWithLeastPrice.localPrice}/-)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-light text-muted rounded">
            <div className="row mb-2">
              <div className="col">
                <span className="text-dark">Category</span> w/m items
              </div>
              <div className="col">
                <span className="text-dark">{catWithMostItems && catWithMostItems.name}</span> (
                {catWithMostItems && catWithMostPrice.items.length} items)
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span className="text-dark">Category</span> w/l items
              </div>
              <div className="col">
                <span className="text-dark">{catWithLeastItems && catWithLeastItems.name}</span> (
                {catWithLeastItems && catWithLeastItems.items.length} items)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-light text-muted  rounded">
            <div className="row mb-2">
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>Item</span> w/m Pcs
              </div>
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>{itemWithMostPcs && itemWithMostPcs.name}</span> (
                <span className="text-success font-weight-bold">{itemWithMostPcs && itemWithMostPcs.pcs}pcs ,</span>
                <span className="text-dark">{itemWithMostPcs && itemWithMostPcs.category}</span>)
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>Item</span> w/l Pcs
              </div>
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>{itemWithLeastPcs && itemWithLeastPcs.name}</span> ({' '}
                <span className="text-success font-weight-bold">{itemWithLeastPcs && itemWithLeastPcs.pcs}pcs ,</span>
                <span className="text-dark">{itemWithLeastPcs && itemWithLeastPcs.category}</span>)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-light text-muted rounded">
            <div className="row mb-2">
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>Item</span> w/m Price
              </div>
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>{itemWithMostPrice && itemWithMostPrice.name}</span> (
                <span className="text-success font-weight-bold">
                  Rs.{itemWithMostPrice && itemWithMostPrice.price}/- ,
                </span>
                <span className="text-dark">{itemWithMostPrice && itemWithMostPrice.category}</span>)
              </div>
            </div>
            <div className="row">
              <div className="col">
                <span style={{ textDecoration: 'underline' }}>Item</span> w/l Price
              </div>
              <div className="col">
                {' '}
                <span style={{ textDecoration: 'underline' }}>{itemWithLeastPrice && itemWithLeastPrice.name}</span> (
                <span className="text-success font-weight-bold">
                  Rs.
                  {itemWithLeastPrice && itemWithLeastPrice.price}/- ,
                </span>
                <span className="text-dark">{itemWithLeastPrice && itemWithLeastPrice.category}</span>)
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="col-12 col-sm-6">
          <div className="border my-2 p-3 bg-light text-muted rounded">
            <div className="row  mb-2">
              <div className="col stat-head">Total Pcs</div>
              <div className="col stat-body">{totalPcs}pcs</div>
            </div>
            <div className="row mb-2">
              <div className="col">Total Price</div>
              <div className="col">Rs.{totalPrice}/-</div>
            </div>
            <div className="row mb-2">
              <div className="col">Total Categories</div>
              <div className="col">{categories.length} categories</div>
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
