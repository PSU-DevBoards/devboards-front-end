import React, { useEffect, useState } from 'react';
import userService from '../services/user.service';

function Dashboard() {
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    userService.getCurrentUser().then((user) => setUserInfo(user.username));
  }, []);

  return (
    <div>
      <p>Welcome to the dashboard!</p>
      <p>{userInfo}</p>
    </div>
  );
}

export default Dashboard;
