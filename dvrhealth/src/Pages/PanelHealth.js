import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';


const PanelHealth = () => {
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

        let apiUrl = `${process.env.REACT_APP_DVRHEALTH_API_URL}/PanelHealthDetails?page=${page}`;

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


    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/ExportOfflineSites`);
    //             setData(response.data.data);
    //         } catch (error) {
    //             console.error('Error fetching data from API:', error);
    //         }
    //         setLoading(false);
    //     };

    //     fetchData();
    // }, []);

    
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DVR Health Data');
        XLSX.writeFile(wb, 'Offline_Sites.xlsx');
    };


    return (
        <div>
            <div>
                <div className="row">
                        <div className="col-6 pt-2">
                            <h6>Panel Health</h6>
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
                <div style={{  overflowY: 'auto',scrollbarWidth: 'thin' }}>
                    <Table striped bordered hover className='custom-tablepanel mt-4'>
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>ATM ID</th>
                                <th>
                                    Customer
                                </th>
                                <th>State</th>
                                <th>City</th>
                                <th>Bank</th>
                                <th>Panel Ip</th>
                                <th>Panel Name</th>
                                <th>Date Time</th>
                                <th>Lobby Pr Motion Sensor</th>
                                <th>Glass Break Senson</th>
                                <th>Panic Switch</th>
                                <th>Main Door shutt Normal No type</th>
                                <th>ATM Removal</th>
                                <th>ATM 1 Vibration</th>
                                <th>Smoke Detector 12V IN+</th>
                                <th>VideoLoss/VideoTemper/HDD Alarm</th>
                                <th>ATM 1 Thermar/Heat</th>
                                <th>ATM 2 Thermar/Heat</th>
                                <th>Chest Door Open ATM 1</th>
                                <th>Chest Door Open ATM 2</th>
                                <th>Chest Door Open ATM 3</th>
                                <th>Ac/UPS Removal</th>
                                <th>Cheque DropBox Removal</th>
                                <th>CCTV 1+2+3 Removal</th>
                                <th>ATM 3 Thermal HeaT</th>
                                <th>Backroom Door Open</th>
                                <th>Lobby Temprature Sensor High</th>
                                <th>ATM 1/2 HoodDoor Senson</th>
                                <th>Lobby Temprature Sensor Low</th>
                                <th>Silence Key</th>
                                <th>AC Mains Fail</th>
                                <th>Ups O/P Fail</th>
                                <th>Panel Temper Switch</th>
                                <th>Low Battery</th>
                                <th>No Battery</th>
                                <th>Fire Trouble Smoke sensor</th>
                                <th>Current Status</th>
                                <th>Site Address</th>
                            </tr>
                        </thead>
                        <tbody>
                        {post.map((users, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }}>
                                        {users.atmid}
                                    </td>
                                    <td>{users.customer}</td>
                                    <td>{users.state}</td>
                                    <td>{users.zone}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.ip}</td>
                                    <td>{users.panelName}</td>
                                    <td>{users.date}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    <td>{users.Bank}</td>
                                    
                                   
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

            </div>

        </div>
    );
};

export default PanelHealth;
