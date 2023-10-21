import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

const OfflineSiteTable = () => {
  const [post, setPost] = useState([]);
  const [number, setNumber] = useState(1);
  const [postPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermEntered, setSearchTermEntered] = useState(''); 

  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const firstPost = (number - 1) * postPerPage;
  const lastPost = Math.min(firstPost + postPerPage, totalCount);

  useEffect(() => {
    fetchAllSitesData(number, searchTermEntered);
  }, [number, searchTermEntered]);

  const fetchAllSitesData = (page) => {
    setLoading(true);

    let apiUrl = `http://localhost:8000/OfflineSiteDetails?page=${page}`;

    if (searchTerm) {
      apiUrl += `&atmid=${searchTerm}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        console.log('API Response for Page', page, ':', response.data);
        const responseData = response.data.data || [];
        setPost(responseData);
        setTotalCount(response.data.totalCount || 0);
      })
      .catch((error) => {
        console.error('API Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleBackspace = (e) => {
      if (e.key === 'Backspace' && searchTerm === '') {
        fetchAllSitesData(number, ''); 
      }
    };
    window.addEventListener('keydown', handleBackspace);
    return () => {
      window.removeEventListener('keydown', handleBackspace);
    };
  }, [searchTerm]);

  const handlePageClick = (selected) => {
    const newPageNumber = selected.selected + 1;
    setNumber(newPageNumber);
    fetchAllSitesData(newPageNumber, searchTerm);
  };

  // const handleSearchTermChange = () => {
  //   setSearchTermEntered(searchTerm);
  // };

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = 'offline_sites';

    const ws = XLSX.utils.json_to_sheet(post);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    const href = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + fileExtension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {!loading && post.length > 0 && (
        <div>
          <div className="row">
            <div className="col-6 pt-2">
              <h6>Online Site Table</h6>
              <button onClick={exportToExcel} className="btn btn-primary mt-4">
                Export to Excel
              </button>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <div className='col-4 text-end login-form2'>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      fetchAllSitesData(number, e.target.value);
                    }
                  }}
                  placeholder='search atmid'
                  className='form-control'

                />
              </div>
            </div>
          </div>
          <Table striped bordered hover className='custom-table mt-4'>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>ATM ID</th>
                <th>
                  Up/Down
                </th>
                <th>City</th>
                <th>State</th>
                <th>Zone</th>
                <th>Last Communication</th>
                <th>HDD Status</th>
                <th>Router Ip</th>
                <th>Camera Status</th>
                <th>No Of Days</th>
              </tr>
            </thead>
            <tbody>
              {post.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '15px' }}>{item.atmid}</td>
                  <td>
                    {item.login_status === 0 ? (
                      <FiArrowUp style={{ color: 'green', fontSize: '20px' }} />
                    ) : (
                      <FiArrowDown style={{ color: 'red', fontSize: '20px' }} />
                    )}
                  </td>
                  <td>{item.city}</td>
                  <td>{item.state}</td>
                  <td>{item.zone}</td>
                  <td>{item.last_communication}</td>
                  <td style={{ color: item.hdd_status === 'working' ? 'green' : 'red', fontWeight: 'bold', fontSize: '15px' }}>
                    {item.hdd_status}
                  </td>
                  <td>{item.routerip}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: "20px",
                          backgroundColor: item.cam1 === 'working' ? 'green' : 'red',
                          marginRight: '5px',
                          paddingTop: "3px"
                        }}
                      ></div>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: "20px",
                          backgroundColor: item.cam2 === 'working' ? 'green' : 'red',
                          marginRight: '5px',
                        }}
                      ></div>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: "20px",
                          backgroundColor: item.cam3 === 'working' ? 'green' : 'red',
                          marginRight: '5px',
                        }}
                      ></div>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: "20px",
                          backgroundColor: item.cam4 === 'working' ? 'green' : 'red',
                        }}
                      ></div>
                    </div>
                  </td>
                  <td style={{ color: 'red', fontWeight: 'bold', fontSize: '15px' }}>{item.time_difference_hours_minutes}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            pageCount={Math.ceil(totalCount / postPerPage)}
            onPageChange={handlePageClick}
            containerClassName={'paginationBttns'}
            activeClassName={'paginationActive'}
            disableInitialCallback={true}
            initialPage={number - 1}
          />
        </div>
      )}
    </div>
  );
};

export default OfflineSiteTable;
