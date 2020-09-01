import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { set } from 'mongoose';

const sortOptions = [
  { value: 'price', label: 'price' },
  { value: 'pcs', label: 'pcs' },
];
function ActionsAtTop(props) {
  const { setSortBy, setGroup } = props;

  const [selectedSort, setSelectedSort] = useState(null);
  const [groupClicked, setGroupClicked] = useState(0);

  const handleSortSelect = (e) => {
    setSelectedSort(e);
  };

  const handleGroupClicked = () => {
    setGroup(!groupClicked);
    setGroupClicked((prev) => !prev);
    setSelectedSort(null);
  };
  useEffect(() => {
    if (selectedSort) {
      setSortBy(selectedSort.value);
    }
    return () => {};
  }, [selectedSort]);

  return (
    <>
      <div className="d-flex justify-content-between my-2">
        {/*  */}

        <div className="d-flex flex-column">
          <span className="d-block small">sort by</span>
          <Select
            className="view-sort-select"
            value={selectedSort}
            onChange={(e) => handleSortSelect(e)}
            options={sortOptions}
          />
        </div>

        {/*  */}
        {/* <div className="">
          <button className="btn btn-sm border text-muted view-prev-next-button">
            <i className="fas fa-arrow-left"></i>
          </button>
          <span className="mx-2 text-dark">
            <strong>1</strong>
          </span>
          <button className="btn btn-sm border text-muted view-prev-next-button">
            <i className="fas fa-arrow-right"></i>
          </button>
        </div> */}
        {/*  */}
        <div>
          <button className={`btn btn-sm btn-success`} onClick={() => handleGroupClicked()}>
            <span>
              {!!groupClicked ? 'un' : ''}group <i className="fas fa-layer-group"></i>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ActionsAtTop;
