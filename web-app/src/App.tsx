import React, { useState } from 'react';
import AppHeader from './components/AppHeader';
import './App.css';
import Login from './pages/Login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/Login',
    element: <Login />
  }
]);

function App() {

  const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);

  const login = async function () {
    const options = {
      method: 'POST',
      headers: new Headers({
        'authorization': 'Basic username:password'
      })
    }
    const response = await fetch('http://localhost:9090/login', options);

    if (response.status === 200) {
    }
  }

  login();

  return (
    <div className="App">
      <AppHeader isLoggedIn={isLoggedIn} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
