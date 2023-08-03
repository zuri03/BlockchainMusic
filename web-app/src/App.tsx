import React, { useState } from 'react';
import AppHeader from './components/AppHeader';
import './App.css';
import Login from './pages/Login';
import Browse from './pages/Browse';
import SignUp from './pages/SignUp';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);
  const successfulLogin = () => setIsLoggedIn(true)
  
  const router = createBrowserRouter([
    {
      path: '/Login',
      element: <Login notifyLogin={successfulLogin}/>
    },
    {
      path: '/Browse',
      element: <Browse />
    },
    {
      path: '/SignUp',
      element: <SignUp />
    }
  ]);

  return (
    <div className="App">
      <AppHeader isLoggedIn={isLoggedIn} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
