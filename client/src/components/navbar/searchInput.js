import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-autocomplete';
import Select from 'react-select';

const searchOptions = [
  {
    label: 'category',
    value: 'category',
  },
  {
    label: 'item',
    value: 'item',
  },
  {
    label: 'all',
    value: 'all',
  },
];

function SearchInput(props) {
  const { categories, items } = props;
  const { setSearchInput } = props;

  const [input, setInput] = useState('');
  const [allSearchOptions, setAllSearchOptions] = useState([]);
  const [itemSearchOptions, setItemSearchOptions] = useState([]);
  const [categorySerachOptions, setCategorySearchOptions] = useState([]);

  const [selectedSearchOption, setSelectedSearchOption] = useState('');

  useEffect(() => {
    // console.log(categories);
    const modCategories = categories.map((cat) => {
      return {
        _id: cat._id,
        name: cat.name,
        type: 'category',
      };
    });
    setCategorySearchOptions(modCategories);

    const modItems = items.map((item) => {
      return {
        _id: item._id,
        name: item.name,
        type: 'item',
      };
    });
    setItemSearchOptions(modItems);

    const modAll = [...modCategories, ...modItems];
    setAllSearchOptions(modAll);
    return () => {};
  }, []);
  return (
    <div className="mr-3">
      <form className="d-flex align-items-center">
        <div>
          <button
            type="submit"
            className="btn btn-sm btn-light mr-2"
            onClick={(e) => {
              e.preventDefault();
              setSearchInput(input);
            }}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div>
          <Autocomplete
            menuStyle={{ zIndex: 9, position: 'absolute', left: '3%' }}
            inputProps={{
              placeholder: 'search',
              style: {
                padding: '8px 8px',
                borderRadius: 4,
                borderWidth: 1,
                minWidth: '340px',
              },
            }}
            items={
              selectedSearchOption.value === 'category'
                ? categorySerachOptions
                : selectedSearchOption.value === 'item'
                ? itemSearchOptions
                : allSearchOptions
            }
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
        </div>
        <div className="ml-2">
          <Select
            className="navbar-search-select"
            options={searchOptions}
            value={selectedSearchOption}
            onChange={(e) => setSelectedSearchOption(e)}
            styles={{
              menu: (provided, state) => ({ ...provided }),
              input: (provided, state) => ({ ...provided }),
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default SearchInput;
