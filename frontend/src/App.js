import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './App.css';
import ErrorPage from './components/ErrorPage';
import Home from './components/home/Home';
import RootLayout from './RootLayout';
import Register from './components/register/Register';

function App() {
  const browserRouter=createBrowserRouter([{
    path:'',
    element:<RootLayout />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:'',
        element:<Home />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  }])

  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;