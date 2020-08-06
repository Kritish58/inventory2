import React, { useState, useEffect } from 'react';
import _ from 'underscore';

function ItemsView(props) {
  const { items, sortBy } = props;
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    if (sortBy === 'pcs') {
      let stage = items;
      stage = _.sortBy(stage, 'pcs');
      stage = stage.reverse();
      setLocalItems(stage);
    } else {
      let stage = items;
      stage = _.sortBy(stage, 'totalPrice');
      stage = stage.reverse();
      setLocalItems(stage);
    }
    return () => {};
  }, [sortBy]);

  useEffect(() => {
    setLocalItems(items);
    return () => {};
  }, [items]);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Item</th>
            <th scope="col">Category</th>
            <th scope="col">Price/pcs</th>
            <th scope="col">Pcs</th>
            <th scope="col">Sum</th>
            <th scope="col">%(price/L)</th>
            <th scope="col">%(pcs/L)</th>
            <th scope="col">%(price/G)</th>
            <th scope="col">%(pcs/G)</th>
          </tr>
        </thead>
        <tbody>
          {localItems.map((item, index) => {
            return (
              <tr key={item._id}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs.{item.price}/-</td>
                <td>{item.pcs}</td>
                <td>Rs.{item.totalPrice}/-</td>
                <td>{Math.round((item.pricePerLocal + Number.EPSILON) * 100) / 100}%</td>
                <td>{Math.round((item.pcsPerLocal + Number.EPSILON) * 100) / 100}%</td>
                <td>{Math.round((item.pricePerGlobal + Number.EPSILON) * 100) / 100}%</td>
                <td>{Math.round((item.pcsPerGlobal + Number.EPSILON) * 100) / 100}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ItemsView;
