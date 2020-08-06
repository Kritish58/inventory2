import React, { useState, useEffect } from 'react';

function EditItem(props) {
  const { categories } = props;
  const { selectedCategory } = props;
  return (
    <div className="row">
      <div className="col-12 col-sm-6">
        <span className="small text-muted">select category</span>
        <Select
          className="view-sort-select"
          value={selectedCategory}
          onChange={(e) => handleCategorySelectForItemAdd(e)}
          options={categories}
        />
      </div>
      <div className="col-12 col-sm-6">
        <span className="small text-muted">enter model name</span>
        <input type="text" className="form-control" value={itemInput} onChange={(e) => setItemInput(e.target.value)} />
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
          {!addItemLoader && <span>add</span>}
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
  );
}

export default EditItem;
