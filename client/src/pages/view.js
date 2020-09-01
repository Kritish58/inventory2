import React, { useState, useEffect } from 'react';
import ActionsAtTop from '../components/view/actionsAtTop';
import ItemsView from '../components/view/itemsView';
import GroupView from '../components/view/groupView';
import { isLoggedIn } from '../utils/authToken';

function Dashboard(props) {
  const { categories, items } = props;
  const [sortBy, setSortBy] = useState('');
  const [group, setGroup] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      props.history.push('/login');
    }
    return () => {};
  }, []);

  return (
    <div className="container my-2 p-2 bg-light">
      <ActionsAtTop setSortBy={setSortBy} setGroup={setGroup} />

      <div className="table-responsive" style={{ fontSize: '14px' }}>
        <div>
          {!group && <ItemsView items={items} sortBy={sortBy} />}
          {!!group && <GroupView items={items} sortBy={sortBy} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
