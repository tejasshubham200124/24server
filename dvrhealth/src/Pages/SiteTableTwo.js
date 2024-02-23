
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { BsRouter } from 'react-icons/bs'
import { LiaInternetExplorer } from 'react-icons/lia'
import { TbSdk } from 'react-icons/tb'
import { BiSolidVideoRecording } from 'react-icons/bi'
import { FaRaspberryPi } from 'react-icons/fa'
import { Table } from 'react-bootstrap';

const DvrData = () => {
  const [data, setData] = useState([]);
  const [atmid, setAtmid] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, [currentPage, atmid]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/api/data`, {
        params: { limit: itemsPerPage, offset: (currentPage - 1) * itemsPerPage, atmid },
      });

      setData(response.data.data);
      setTotalRecords(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handlePagination = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pageCount = Math.ceil(totalRecords / itemsPerPage);

    if (pageCount <= 1) {
      return null;
    }

    const renderEllipsis = (key) => (
      <Pagination.Ellipsis key={key} disabled />
    );

    const renderPageItem = (pageNumber, key) => (
      <Pagination.Item
        key={key}
        active={currentPage === pageNumber}
        onClick={() => handlePagination(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>
    );

    const renderPaginationItems = () => {
      const pageItems = [];

    
      const maxPagesToShow = 5;
      const startPage = Math.max(1, currentPage - maxPagesToShow);
      const endPage = Math.min(pageCount, currentPage + maxPagesToShow);

      for (let i = startPage; i <= endPage; i++) {
        pageItems.push(renderPageItem(i, i));
      }

      return pageItems;
    };

    return (
      <Pagination>
        {currentPage > 3 && renderEllipsis('start')}
        {renderPaginationItems()}
        {currentPage < pageCount - 2 && renderEllipsis('end')}
      </Pagination>
    );
  };



  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by ATMID"
          value={atmid}
          onChange={(e) => setAtmid(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>
        <Table className='custom-tablepanel mt-4'>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>ATM ID</th>
              <th>Bank</th>
              <th>
                Up/Down
              </th>
              <th>Device Time</th>
              <th>City</th>
              <th>State</th>
              <th>Zone</th>
              <th>HDD Status</th>
              <th>Last Communication</th>
              <th>Router Ip</th>
              <th>Dvr type</th>
              <th>HTTP Port</th>
              <th>RTSP Port</th>
              <th>Router Port</th>
              <th>SDK Port</th>
              <th>AI Port</th>
              <th>Camera Status</th>
              <th>Rec From</th>
              <th>Rec To</th>
            </tr>
          </thead>
          <tbody>
            {data.map((users, index) => (
              <tr key={users.atmid}>
                <td>{index + 1}</td>
                <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }}>
                  <Link
                    to={`/admin/DeviceHistory/${users.atmid}`}
                    style={{
                      textDecoration: 'none',
                      color: 'darkblue',
                      fontWeight: 'bold',
                      fontSize: '15px',
                    }}
                  >
                    {users.atmid}
                  </Link>
                </td>
                <td style={{ color: 'teal', fontWeight: 600, fontSize: '13px' }}>{users.Bank}</td>
                <td>
                  {users.login_status === 'working' ? (
                    <FiArrowUp style={{ color: 'green', fontWeight: 600, fontSize: '18px' }} />
                  ) : (
                    <FiArrowDown style={{ color: 'red', fontWeight: 600, fontSize: '18px' }} />
                  )}
                </td>
                <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.cdate}</td>
                <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.City}</td>
                <td style={{ fontWeight: 600, fontSize: '13px' }}> {users.State}</td>
                <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.Zone}</td>
                <td style={{ color: users.hdd_status === 'working' ? 'green' : 'red', fontWeight: 'bold', fontSize: '14px' }}>
                  {users.hdd_status}
                </td>
                <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.last_communication}</td>
                <td style={{ color: 'skyblue', fontWeight: 'bold', fontSize: '13px' }}>{users.ip}</td>
                <td style={{ color: '#9C4CFF', fontWeight: 600, fontSize: '13px' }}>{users.dvrtype}</td>
                <td style={{ fontWeight: 600, color: (users.http_port_status === 'Y') ? 'green' : (users.http_port_status === 'O') ? 'orange' : 'red' }}>
                  {users.http_port_status === 'Y' ? <LiaInternetExplorer size={22} color="green" /> : (users.http_port_status === 'O') ? <LiaInternetExplorer size={22} color="orange" /> : <LiaInternetExplorer size={22} color="red" />}
                </td>
                <td style={{ fontWeight: 700, color: (users.rtsp_port_status === 'Y') ? 'green' : (users.rtsp_port_status === 'O') ? 'orange' : 'red' }}>
                  {users.rtsp_port_status === 'Y' ? <BiSolidVideoRecording size={20} color="green" /> : (users.rtsp_port_status === 'O') ? <BiSolidVideoRecording size={20} color="orange" /> : <BiSolidVideoRecording size={20} color="red" />}
                </td>
                <td style={{ fontWeight: 700, color: (users.router_port_status === 'Y') ? 'green' : (users.router_port_status === 'O') ? 'orange' : 'red' }}>
                  {users.router_port_status === 'Y' ? <BsRouter size={20} color="green" /> : (users.router_port_status === 'O') ? <BsRouter size={20} color="orange" /> : <BsRouter size={20} color="red" />}
                </td>
                <td style={{ fontWeight: 700, color: (users.sdk_port_status === 'Y') ? 'green' : (users.sdk_port_status === 'O') ? 'orange' : 'red' }}>
                  {users.sdk_port_status === 'Y' ? <TbSdk size={20} color="green" /> : (users.sdk_port_status === 'O') ? <TbSdk size={20} color="orange" /> : <TbSdk size={20} color="red" />}
                </td>
                <td style={{ fontWeight: 700, color: (users.ai_port_status === 'Y') ? 'green' : (users.ai_port_status === 'O') ? 'orange' : 'red', fontWeight: 600, fontSize: '13px' }}>
                  {users.ai_port_status === 'Y' ? <FaRaspberryPi size={20} color="green" /> : (users.ai_port_status === 'O') ? <FaRaspberryPi size={20} color="orange" /> : <FaRaspberryPi size={20} color="red" />}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: "17px",
                        backgroundColor: users.cam1 === 'working' ? 'green' : 'red',
                        marginRight: '5px',
                        paddingTop: "5px"
                      }}
                    ></div>
                    <div
                      style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: "17px",
                        backgroundColor: users.cam2 === 'working' ? 'green' : 'red',
                        marginRight: '5px',
                        paddingTop: "5px"
                      }}
                    ></div>
                    <div
                      style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: "17px",
                        backgroundColor: users.cam3 === 'working' ? 'green' : 'red',
                        marginRight: '5px',
                        paddingTop: "5px"
                      }}
                    ></div>
                    <div
                      style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: "17px",
                        backgroundColor: users.cam4 === 'working' ? 'green' : 'red',
                        paddingTop: "5px"
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.recording_from}</td>
                <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.recording_to}</td>

              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}
      </div>
    </div>
  );
};

export default DvrData;
