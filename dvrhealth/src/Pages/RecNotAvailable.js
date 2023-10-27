import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

const RecNotAvailable = () => {
    const [post, setPost] = useState([]);
    const [number, setNumber] = useState(1);
    const [postPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermEntered, setSearchTermEntered] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const firstPost = (number - 1) * postPerPage;
    const lastPost = Math.min(firstPost + postPerPage, totalCount);

    useEffect(() => {
        fetchAllSitesData(number, searchTermEntered);
    }, [number, searchTermEntered]);

    const fetchAllSitesData = (page) => {
        setLoading(true);

        let apiUrl = `${process.env.REACT_APP_DVRHEALTH_API_URL}/RecNotAvailableDetails?page=${page}`;

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


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/RecNotavailableExport`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DVR Health Data');
        XLSX.writeFile(wb, 'RecordingNotAvailable.xlsx');
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
                            <h6>Recording Not Available</h6>
                            <button onClick={exportToExcel} className="btn btn-primary mt-3">
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
                                <th>Device Time</th>
                                <th>HDD Status</th>
                                <th>Last Communication</th>
                                <th>Router Ip</th>
                                <th>Dvr type</th>
                                <th>Camera Status</th>
                                <th>Rec From</th>
                                <th>Rec To</th>
                                {/* <th>Gap</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((users, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }}>
                                        {users.atmid}
                                    </td>
                                    <td>
                                        {users.login_status === 0 ? (
                                            <FiArrowUp style={{ color: 'green', fontWeight: 600, fontSize: '18px' }} />
                                        ) : (
                                            <FiArrowDown style={{ color: 'red', fontWeight: 600, fontSize: '18px' }} />
                                        )}
                                    </td>
                                    <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.cdate}</td>
                                    <td style={{ color: users.hdd_status === 'working' ? 'green' : 'red', fontWeight: 'bold', fontSize: '14px' }}>
                                        {users.hdd_status}
                                    </td>
                                    <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.last_communication}</td>

                                    <td style={{ color: 'skyblue', fontWeight: 'bold', fontSize: '13px' }}>{users.routerip}</td>
                                    <td style={{ color: 'orange', fontWeight: 600, fontSize: '13px' }}>{users.dvrtype}</td>

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
                                    {/* <td style={{ color: 'Teal', fontWeight: 600, fontSize: '13px' }}>{users.time_difference_hours_minutes}</td> */}
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

export default RecNotAvailable;
