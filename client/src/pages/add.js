import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

import { isLoggedIn } from '../utils/authToken';

import '../css/add.css';

// const options = [
//   { value: 'price', label: 'price' },
//   { value: 'pcs', label: 'pcs' },
//   { value: 'date', label: 'date' },
// ];

const PCSLIMIT = 10000;
const PRICELIMIT = 500000;

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

function Add(props) {
  const { generateStructure } = props;
  const { items, categories } = props;

  const editItemRef = useRef(null);
  const execureScroll = () => scrollToRef(editItemRef);

  const [localItems, setLocalItems] = useState([]);
  const [localCategories, setLocalCategories] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [itemsList2, setItemsList2] = useState([]);

  const [searchSelectedItem, setSearchSelectedItem] = useState(null);
  const [searchSelectedCategory, setSearchSelectedCategory] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState(null);
  const [editItemPcs, setEditItemPcs] = useState(null);
  const [editItemId, setEditItemId] = useState('');
  const [updateItemLoader, setUpdateItemLoader] = useState(0);
  const [reactSelectLock, setReactSelectLock] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState(null);
  const [itemInput, setItemInput] = useState(null);
  const [priceInput, setPriceInput] = useState(null);
  const [pcsInput, setPcsInput] = useState(null);

  const [catAddErr, setCatAddErr] = useState('');
  const [itemAddErr, setItemAddErr] = useState('');

  const [addCategoryLoader, setAddCategoryLoader] = useState(0);
  const [addItemLoader, setItemAddLoader] = useState(0);
  const [deleteItemCount, setDeleteItemCount] = useState(0);

  const [editCategoryClicked, setEditCategoryClicked] = useState(0);
  const [editItemClicked, setEditItemClicked] = useState(0);
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      props.history.push('/login');
      return;
    }
  }, []);

  useEffect(() => {
    console.log(editItemId);
    return () => {};
  }, [editItemId]);

  useEffect(() => {
    console.log(items);
    console.log(categories);
    setLocalItems(items);
    const categoryStage = categories.map((cat) => {
      return {
        _id: cat._id,
        name: cat.name,
        value: cat.name,
        label: cat.name,
      };
    });
    setLocalCategories(categoryStage);
    return () => {};
  }, [items, categories]);

  const handleAddCategory = () => {
    console.log('click');
    const formData = new FormData();
    formData.append('name', categoryInput);
    setAddCategoryLoader(1);
    axios
      .post('/api/categories/createOne', formData)
      .then((res) => {
        console.log(res);
        setAddCategoryLoader(0);
        if (res.data.success) {
          setLocalCategories((prev) => {
            return [
              ...prev,
              {
                _id: res.data.newCategory._id,
                name: res.data.newCategory.name,
                label: res.data.newCategory.name,
                value: res.data.newCategory.name,
              },
            ];
          });
        }
      })
      .catch((err) => {
        setAddCategoryLoader(0);
        console.log(err);
      });
  };

  const handleUpdateCategory = () => {
    if (!editCategoryId || !categoryInput || !categoryInput.length) {
      setCatAddErr('category cannot be empty');
      setTimeout(() => {
        setCatAddErr('');
      }, 2000);
      return;
    }
    setAddCategoryLoader(1);
    let stage = localCategories;
    console.log(stage);
    stage = stage.map((cat) => {
      if (editCategoryId === cat._id) {
        cat.name = categoryInput;
        cat.label = categoryInput;
        cat.value = categoryInput;
      }
      return cat;
    });
    console.log(stage);
    setLocalCategories(stage);
    const formData = new FormData();
    formData.append('name', categoryInput);
    axios
      .post('/api/categories/editOne/' + editCategoryId, formData)
      .then((res) => {
        setAddCategoryLoader(0);
        console.log(res);
      })
      .catch((err) => {
        setAddCategoryLoader(0);
        console.log(err);
      });
  };

  const handleDeleteCategory = (catId, catName) => {
    const confirm = window.confirm(`delete category ${catName}? \n \n all items with this category will be deleted`);
    if (confirm) {
      const stage = localCategories.filter((cat) => {
        if (cat._id !== catId) {
          return cat;
        }
      });
      setLocalCategories(stage);
      const stageItems = localItems.filter((item) => {
        if (item.category !== catName) {
          return item;
        }
      });
      setLocalItems(stageItems);
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .post('/api/categories/deleteOne/' + catId)
        .then((res) => {
          if (res.data.success) {
            // generateStructure();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  const handleSearchItemSelect = (e) => {
    setSearchSelectedItem(e);
    setEditItemName(e.name);
    setEditItemPrice(e.price);
    setEditItemPcs(e.pcs);
    setEditItemId(e._id);
  };

  const handleEditItemPass = (itemId) => {
    const item = localItems.find((item) => {
      if (item._id === itemId) {
        return item;
      }
    });
    console.log(item);
    setEditItemId(itemId);
    setEditItemName(item.name);
    setEditItemPrice(item.price);
    setEditItemPcs(item.pcs);

    execureScroll();
  };

  const handleCategorySelectForItemAdd = (e) => {
    console.log('click');
    setSelectedCategory(e);
    console.log(localItems);
    const stage = localItems.filter((item) => {
      if (item.category === e.name) {
        return item;
      }
    });
    setItemsList(stage);
    const stage2 = stage.map((item) => {
      let mod = {};
      mod._id = item._id;
      mod.price = item.price;
      mod.pcs = item.pcs;
      mod.category = item.category;
      mod.name = item.name;
      mod.value = item.name;
      mod.label = item.name;
      return mod;
    });
    setItemsList2(stage2);
    setSearchSelectedItem(null);
    setSearchSelectedCategory(e);
    // setEditItemPcs('');
    // setEditItemPrice('');
    // setEditItemName('');
  };
  const handleUpdateItem = () => {
    if (!searchSelectedCategory || !editItemName || !editItemPcs || !editItemPrice || !editItemId) {
      return;
    }
    setUpdateItemLoader(1);
    const formData = new FormData();
    formData.append('name', editItemName);
    formData.append('price', editItemPrice);
    formData.append('pcs', editItemPcs);
    formData.append('catId', searchSelectedCategory._id);

    let stage = localItems;
    stage = stage.map((item) => {
      if (editItemId === item._id) {
        item.price = editItemPrice;
        item.pcs = editItemPcs;
        item.name = editItemName;
      }
      return item;
    });
    setSearchSelectedItem({ _id: editItemId, name: editItemName, label: editItemName, value: editItemName });
    setLocalItems(stage);

    axios
      .post('/api/items/editOne/' + editItemId, formData)
      .then((res) => {
        setUpdateItemLoader(0);
        console.log(res);
      })
      .catch((err) => {
        setUpdateItemLoader(0);
        console.log(err);
      });
  };

  const handleAddItem = () => {
    if (!selectedCategory || !priceInput || !pcsInput || !itemInput) {
      setItemAddErr('all fields are required');
      setTimeout(() => {
        setItemAddErr('');
      }, 2500);
      return;
    }
    if (pcsInput > PCSLIMIT) {
      setItemAddErr('PCS LIMIT EXCEEDED pcs limit is ' + PCSLIMIT);
      setTimeout(() => {
        setItemAddErr('');
      }, 2500);
      return;
    }
    if (priceInput > PRICELIMIT) {
      setItemAddErr('PRICE LIMIT EXCEEDED price limit is ' + PRICELIMIT);
      setTimeout(() => {
        setItemAddErr('');
      }, 2500);
      return;
    }

    const formData = new FormData();
    formData.append('price', priceInput);
    formData.append('pcs', pcsInput);
    formData.append('name', itemInput);

    // set item in item list

    const stage = itemsList;
    const exists = itemsList.find((item) => {
      if (item.name === itemInput) {
        return item;
      }
    });
    if (!exists) {
      stage.push({ name: itemInput });
      setItemsList(stage);
    } else {
      setItemAddErr('DUPLICATE ERROR this item already exists');
      setTimeout(() => {
        setItemAddErr('');
      }, 2500);
      return;
    }

    setItemAddLoader(1);
    axios
      .post('/api/items/createOne/' + selectedCategory._id, formData)
      .then((res) => {
        setItemAddLoader(0);
        console.log(res);
        if (res.data.success) {
          // const stage = itemsList;
          // stage.push({ _id: res.data.newItem._id, name: res.data.newItem.name });
          // console.log(stage);
          // setItemsList(stage);
          // console.log('success');
          // console.log('local items', localItems);
          // console.log();
          let stage = localItems;
          stage.push({ category: res.data.newItem.category, _id: res.data.newItem._id, name: res.data.newItem.name });
          setLocalItems(stage);
        }
        if (res.data.duplicate) {
          setItemAddErr('DUPLICATE ERROR this item already exists');
          setTimeout(() => {
            setItemAddErr('');
          }, 2500);
        }
      })
      .catch((err) => {
        setItemAddLoader(0);
        console.log(err);
      });
  };

  const handleItemDelete = (itemId) => {
    console.log(itemId);
    const stage = itemsList.filter((item) => {
      if (item._id !== itemId) {
        return item;
      }
    });
    setItemsList(stage);
    const stage2 = localItems.filter((item) => {
      if (item._id !== itemId) {
        return item;
      }
    });
    setLocalItems(stage2);
    console.log(stage2);
    setDeleteItemCount((prev) => prev + 1);
    axios
      .post('/api/items/deleteOne/' + itemId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="py-3 pb-5 container bg-light">
      <div className="add-fixed-buttons shadow rounded-right">
        <a className="btn rounded-0 text-muted" href="#add-category">
          <i className="fas fa-tree"></i>
        </a>
        <a className="btn rounded-0 text-muted " href="#add-item">
          <i className="fab fa-pagelines"></i>
        </a>
        <a className="btn rounded-0 text-muted" href="#add-edit-item">
          <i className="fas fa-leaf"></i>
        </a>
      </div>

      <div id="add-category" className="d-flex justify-content-between">
        <h4 className="text-muted lead d-flex align-items-center m-0">
          <span>{editCategoryClicked ? 'edit' : 'add'} category </span>
          <i className="fas fa-caret-down small ml-1"></i>
        </h4>
        <div>
          <button className="btn btn-sm btn-warning" onClick={() => generateStructure()}>
            Refresh
          </button>
        </div>
      </div>

      {/*  */}
      <div className="row">
        <div className="col-12 col-sm-6 mb-4 mt-1">
          <AnimatePresence>
            {!!catAddErr.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="alert alert-danger small"
              >
                {catAddErr}
              </motion.div>
            )}
          </AnimatePresence>
          {/* add category */}
          {!editCategoryClicked && (
            <div className="">
              <span className="small text-muted">enter category name</span>
              <div>
                <input
                  type="text"
                  className="form-control"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-danger d-flex align-items-center"
                  disabled={addCategoryLoader ? true : false}
                  onClick={() => handleAddCategory()}
                >
                  {!addCategoryLoader && <span>Add</span>}
                  {!!addCategoryLoader && (
                    <span
                      className="spinner-border"
                      style={{ height: '14px', width: '14px', borderWidth: '2px' }}
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
          {/* edit category */}
          {!!editCategoryClicked && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div>
                <span className="small text-muted">enter category name</span>
                <input
                  type="text"
                  className="form-control"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                />
              </div>
              <div className="mt-2 d-flex align-items-center">
                {!!editCategoryClicked && (
                  <button
                    className="btn btn-sm btn-dark mr-2"
                    onClick={() => {
                      setEditCategoryClicked(0);
                      setCategoryInput('');
                    }}
                  >
                    cancel
                  </button>
                )}
                <button
                  className={`btn btn-sm ${
                    editCategoryClicked ? 'btn-success' : 'btn-primary'
                  } d-flex align-items-center`}
                  disabled={addCategoryLoader ? true : false}
                  onClick={() => handleUpdateCategory()}
                >
                  {!addCategoryLoader && <span>update</span>}
                  {!!addCategoryLoader && (
                    <span
                      className="spinner-border"
                      style={{ height: '14px', width: '14px', borderWidth: '2px' }}
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <div className="col-12 col-sm-6  text-dark">
          <h5>categories</h5>
          <ul className="add-ul shadow">
            {localCategories.map((cat) => {
              return (
                <li className="d-flex justify-content-between align-items-center">
                  <span>{cat.name}</span>
                  <span>
                    {!!editCategoryClicked && cat._id === editCategoryId && (
                      <i
                        className="fas fa-times small mx-2"
                        onClick={() => {
                          setEditCategoryClicked(0);
                          setCategoryInput('');
                        }}
                      ></i>
                    )}
                    <i
                      className="fas fa-edit small mx-2"
                      onClick={() => {
                        setEditCategoryId(cat._id);
                        setEditCategoryClicked(1);
                        setCategoryInput(cat.name);
                      }}
                    ></i>
                    <i
                      className="fas fa-trash-alt small mx-2"
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    ></i>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <hr />
      {/*  */}
      <h4 id="add-item" className="text-muted lead d-flex align-items-center m-0">
        <span>add item </span>
        <i className="fas fa-caret-down small ml-1"></i>
      </h4>

      {/*  */}
      <div className="row">
        <div className="col-12 col-sm-6 mt-1 mb-4">
          <AnimatePresence>
            {!!itemAddErr.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="alert alert-danger small"
              >
                {itemAddErr}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="row">
            <div className="col-12 col-sm-12">
              <span className="small text-muted">select category</span>
              <Select
                className="view-sort-select"
                value={selectedCategory}
                onChange={(e) => handleCategorySelectForItemAdd(e)}
                options={localCategories}
              />
            </div>
            <div className="col-12 col-sm-12">
              <span className="small text-muted">enter model name</span>
              <input
                type="text"
                className="form-control"
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <span className="small text-muted">enter price</span>
              <input
                type="number"
                min="0"
                className="form-control"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <span className="small text-muted">enter pcs</span>
              <input
                type="number"
                min="0"
                className="form-control"
                value={pcsInput}
                onChange={(e) => setPcsInput(e.target.value)}
              />
            </div>
            <div className="col-12 mt-2">
              <button
                className="btn btn-sm btn-primary d-flex align-items-center"
                disabled={addItemLoader ? true : false}
                onClick={() => handleAddItem()}
              >
                {!addItemLoader && <span>Add</span>}
                {!!addItemLoader && (
                  <span
                    className="spinner-border"
                    style={{ height: '14px', width: '14px', borderWidth: '2px' }}
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 small">
          <h5>items</h5>
          {deleteItemCount > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-info small">
              {deleteItemCount} items has been deleted
            </motion.div>
          )}
          <ul className="add-ul shadow">
            {itemsList.map((item) => {
              return (
                <li className="d-flex justify-content-between align-items-center">
                  <span>{item.name}</span>{' '}
                  <span className="d-flex align-items-center">
                    {item.category && (
                      <i className="fas fa-edit small mx-2" onClick={() => handleEditItemPass(item._id)}></i>
                    )}
                    {item.category && item._id && (
                      <i className="fas fa-trash-alt small mx-2" onClick={() => handleItemDelete(item._id)}></i>
                    )}
                  </span>
                </li>
              );
            })}
            {!itemsList.length && selectedCategory && (
              <li className="bg-secondary text-light rounded">no items in this category</li>
            )}
            {!itemsList.length && !selectedCategory && (
              <li className="bg-secondary rounded text-light">no category selected</li>
            )}
          </ul>
        </div>
      </div>
      {/*  */}
      <hr />
      {/*  */}
      <div href="add-edit-item" ref={editItemRef} className="row">
        <div className="col-12 mb-2">
          <h4 className="text-muted lead d-flex align-items-center m-0">
            <span>edit item </span>
            <i className="fas fa-caret-down small ml-1"></i>
          </h4>
        </div>
        <div className="col-12 col-sm-6">
          <div className="row">
            <div className="col-12 col-sm-4">
              <span className="small text-muted">select category</span>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategorySelectForItemAdd(e)}
                options={localCategories}
              />
            </div>
            <div className="col-12 col-sm-8">
              <span className="small text-muted">search item</span>
              <Select value={searchSelectedItem} onChange={(e) => handleSearchItemSelect(e)} options={itemsList2} />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 px-5 py-2">
          <div className="row justify-content-end">
            <button className="btn btn-sm btn-light my-1" onClick={() => setReactSelectLock((prev) => !prev)}>
              {!!reactSelectLock && <i className="fas fa-lock"></i>}
              {!reactSelectLock && <i className="fas fa-lock-open"></i>}
            </button>
            <button className="btn btn-sm btn-light my-1 ml-1" onClick={() => handleUpdateItem()}>
              {!updateItemLoader && <i className="fas fa-check"></i>}
              {!!updateItemLoader && (
                <span
                  className="spinner-border"
                  style={{ height: '13px', width: '13px', borderWidth: '2px' }}
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </span>
              )}
            </button>
          </div>
          <div className="row border bg-dark shadow-sm p-4 rounded" style={{ backgroundColor: 'transparent' }}>
            <div className="col-12">
              <span className="small text-light">change category</span>
              <Select
                value={searchSelectedCategory}
                onChange={(e) => setSearchSelectedCategory(e)}
                options={localCategories}
                isDisabled={reactSelectLock ? true : false}
              />
            </div>
            <div className="col-12 mt-1">
              <span className="small text-light">edit item name</span>
              <input
                type="text"
                className="form-control"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
              />
            </div>
            <div className="col-6">
              <span className="small text-light">edit price</span>
              <input
                type="number"
                min="0"
                className="form-control"
                value={editItemPrice}
                onChange={(e) => setEditItemPrice(e.target.value)}
              />
            </div>
            <div className="col-6">
              <span className="small text-light">edit pcs</span>
              <input
                type="number"
                min="0"
                className="form-control"
                value={editItemPcs}
                onChange={(e) => setEditItemPcs(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

export default Add;
