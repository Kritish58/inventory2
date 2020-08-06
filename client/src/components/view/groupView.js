import React, { useState, useEffect } from 'react';
import _ from 'underscore';

function GroupView(props) {
  const { sortBy, items } = props;
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    if (sortBy === 'pcs') {
      let stage = items;
      stage = _.groupBy(_.sortBy(items, 'pcs').reverse(), 'category');
      console.log(stage);
      setGroups(stage);
    } else {
      let stage = items;
      stage = _.groupBy(_.sortBy(items, 'totalPrice').reverse(), 'category');
      console.log(stage);
      setGroups(stage);
    }

    return () => {};
  }, [sortBy]);

  return (
    <div>
      {groups &&
        Object.keys(groups).length &&
        Object.keys(groups).map((key, i) => {
          return (
            <div>
              <h5 className="text-dark mt-2">{key}</h5>
              <table key={key} className="table mb-4">
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
                  {groups[key].map((item, index) => {
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
        })}
    </div>
  );
}

export default GroupView;
