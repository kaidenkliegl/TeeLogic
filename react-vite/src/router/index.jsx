import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import GolferDetail from '../components/Golfers/GolferDetail';
import GolferForm from '../components/Golfers/GolferForm';
import GolferList from '../components/Golfers/GolferList';
import TeeTimeList from '../components/TeeTimes/teeTimeList';
import Layout from './Layout';
import PricingRules from '../components/Pricing/PricingList';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LoginFormPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
      path: "golfers/:golferId",
      element:<GolferDetail/>
      },
      {
        path: "golfer/all",
        element:<GolferList/>,
        },
      {
        path: "golfer/new",
        element:<GolferForm/>,
        },
      {
        path: "teetimes/all",
        element:<TeeTimeList/>,
      },
      {
        path: "pricing/all",
        element:<PricingRules/>,
      },
    
     
          

    ],
  },
]);