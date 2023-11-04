
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MainLayout from './Components/MainLayout';
import Home from './Pages/Home';
import OnlineSiteTable from './Pages/OnlineSiteTable';
import Cards from './Pages/Cards';
import Tables from './Pages/Tables';
import CameraOne from './Pages/CameraOne';
import CameraTwo from './Pages/CameraTwo';
import CameraThree from './Pages/CameraThree';
import CameraFour from './Pages/CameraFour';
import ExampleTwo from './Pages/ExampleTwo';
import SiteTable from './Pages/SiteTable';
import Hdd from './Pages/Hdd';
import TableRow from './Pages/TableRow';
import NotExist from './Pages/NotExist';
import NoDisk from './Pages/NoDisk';
import NoDiscIdle from './Pages/NoDiscIdle';
import Unformatted from './Pages/Unformatted';
import Abnormal from './Pages/Abnormal';
import FormattedData from './Pages/FormattedData';
import NeverOn from './Pages/NeverOn';
import HddNotWorking from './Pages/HddNotWorking';
import AgingMoreThan30 from './Pages/AgingMoreThan30';
import Null from './Pages/Null';
import OfflineSiteTable from './Pages/OfflineSiteTable';
import DeviceHistory from './Pages/DeviceHistory';
import TimeDifference from './Pages/TimeDifference';
import Login from './Pages/Login';
import axios from 'axios';
import SignUp from './Pages/SignUp';
import { getUserId, setUserSession ,removeUserSession } from './Utils/Common';
import RecNotAvailable from './Pages/RecNotAvailable';
import Logout from './Utils/Logout';
import PanelHealth from './Pages/PanelHealth';
import Comfort from './Pages/Comfort';


function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const id = getUserId();

    if (!id) {
      if (window.location.pathname !== '/SignUp') {
        navigate('/');
      }
      return;
    }

    axios
      .get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/verify_id`)
      .then((response) => {
        try {
          const userDataArray = response.data;
          const userData = userDataArray.find(user => user.id === id);
          if (!userData || !userData.id) {
            navigate('/');
            return;
          }
          setUserSession(userData.id);

        } catch (error) {
          console.error('Error parsing response:', error);
          navigate('/');
        }
      })
      .catch((error) => {
        removeUserSession();
        console.error('Error:', error);
        navigate('/');
      });
  }, [navigate]);


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />

      <Route
        path="/admin/*"
        element={getUserId() ? <MainLayout /> : <Navigate to="/" />}
      >
        <Route index element={<Home />} />
        <Route path="OnlineSiteTable" element={<OnlineSiteTable />} />
        <Route path="OfflineSiteTable" element={<OfflineSiteTable />} />
        <Route path="Cards" element={<Cards />} />
        <Route path="CameraOne" element={<CameraOne />} />
        <Route path="CameraTwo" element={<CameraTwo />} />
        <Route path="CameraThree" element={<CameraThree />} />
        <Route path="CameraFour" element={<CameraFour />} />
        <Route path="DeviceHistory/:atmId" element={<DeviceHistory />} />
        <Route path="Tables" element={<Tables />} />
        <Route path="ExampleTwo" element={<ExampleTwo />} />
        <Route path="SiteTable" element={<SiteTable />} />
        <Route path="Hdd" element={<Hdd />} />
        <Route path="TableRow" element={<TableRow />} />
        <Route path="NotExist" element={<NotExist />} />
        <Route path="NoDisk" element={<NoDisk />} />
        <Route path="NoDiscIdle" element={<NoDiscIdle />} />
        <Route path="Unformatted" element={<Unformatted />} />
        <Route path="Abnormal" element={<Abnormal />} />
        <Route path="Null" element={<Null />} />
        <Route path="FormattedData" element={<FormattedData />} />
        <Route path="NeverOn" element={<NeverOn />} />
        <Route path="HddNotWorking" element={<HddNotWorking />} />
        <Route path="AgingMoreThan30" element={<AgingMoreThan30 />} />
        <Route path="TimeDifference" element={<TimeDifference />} />
        <Route path="RecNotAvailable" element={<RecNotAvailable />} />
        <Route path="Logout" element={<Logout />} />
        <Route path="PanelHealth" element={<PanelHealth />} />
        <Route path="Comfort" element={<Comfort />} />

      </Route>
    </Routes>
  );
}

export default App;


