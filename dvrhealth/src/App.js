
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/MainLayout';
import Home from './Pages/Home';
import OnlineSiteTable from './Pages/OnlineSiteTable';
import Cards from './Pages/Cards';
import Tables from './Pages/Tables';
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
function App() {
  return (
    <Routes>
      <Route path='/admin/*' element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="OnlineSiteTable" element={<OnlineSiteTable/>} />
      <Route path="OfflineSiteTable" element={<OfflineSiteTable  />} />
      <Route path="Cards" element={<Cards/>} />
      <Route path="DeviceHistory/:atmId" element={<DeviceHistory />} />
      <Route path="Tables" element={<Tables/>} />
      <Route path="ExampleTwo/:atmId" element={<ExampleTwo/>} />
      <Route path="SiteTable" element={<SiteTable/>} />
      <Route path="Hdd" element={<Hdd/>} />
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
      </Route>
    </Routes>
  );
}

export default App;


