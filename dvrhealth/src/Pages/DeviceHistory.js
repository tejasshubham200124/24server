import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DeviceHistory = () => {


    function formatDate(inputDate) {
        // Parse the input date string
        const dateObj = new Date(inputDate);

        // Extract year, month, and day components
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        // Format the date in the desired format
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }


    const [post, setPost] = useState([]);
    const [number, setNumber] = useState(1);
    const [postPerPage] = useState(50);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState([])
    const { atmId } = useParams();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = (pageNumber, atmId, startDate, endDate) => {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_DVRHEALTH_API_URL;
        const postPerPage = 100;

        // const formattedStartDate = startDate
        //     ? startDate.toISOString().slice(0, 19).replace('T', ' ')
        //     : null;

        // const formattedEndDate = endDate
        //     ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
        //         .toISOString()
        //         .slice(0, 19)
        //         .replace('T', ' ')
        //     : null;

        //     const formattedStartDate = startDate
        //     ? new Date(startDate).toISOString().slice(0, 19).replace('T', ' ')
        //     : null;

        //   const formattedEndDate = endDate
        //     ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ')
        //     : null;

        let apiUrlWithEndpoint = `${apiUrl}/devicehistoryThree/${atmId}?page=${pageNumber}&recordsPerPage=${postPerPage}`;

        if (startDate && endDate) {
            apiUrlWithEndpoint += `&startDate=${startDate}&endDate=${endDate}`;
        }

        axios
            .get(apiUrlWithEndpoint)
            .then((response) => {
                if (response.data && response.data.data) {
                    setPost(response.data.data);
                    console.log(response)
                    console.log(response.data.data)
                    setTotalCount(response.data.totalCount);
                    setLoading(false);
                } else {
                    console.log('No data received from API.');
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };


    useEffect(() => {
        fetchData(number, atmId, startDate, endDate);
    }, [atmId, number, startDate, endDate]);

    const handlePageClick = (selected) => {
        const newPageNumber = selected.selected + 1;
        setNumber(newPageNumber);
        fetchData(newPageNumber, startDate, endDate);
    };

    const exportToExcel = async (atmId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/DeviceHistoryExport?atmId=${atmId}`);
            setData(response.data.data);
            generateExcelFile();
        } catch (error) {
            console.error('Error fetching data from API:', error);
            setLoading(false);
        }
    };
    

    const generateExcelFile = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DVR Health Data');
        XLSX.writeFile(wb, 'DeviceHistory.xlsx');
        setLoading(false);
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
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 style={{ color: '#0851a6', fontWeight: '600', fontSize: '15px' }}>Device History</h6>

                        <div className='date'>
                            <span style={{ color: '#0851a6', fontWeight: '600', fontSize: '15px' }}>Select Date Range :</span>
                            <div className="date-picker-container">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Start Date"
                                    className="custom-date-picker"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="End Date"
                                    className="custom-date-picker"
                                />
                            </div>
                        </div>
                        <button onClick={exportToExcel} className="btn btn-primary ">
                            Export to Excel
                        </button>

                    </div>

                    <Table striped bordered hover className="custom-table mt-4">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>ATM ID</th>
                                <th>Up/Down</th>
                                <th>Device Time</th>
                                <th>HDD Status</th>
                                <th>Last Communication</th>
                                <th>Router Ip</th>
                                <th>Camera Status</th>
                                <th>Rec From</th>
                                <th>Rec To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '15px' }}>{item.atmid}</td>
                                    <td>
                                        {item.login_status === "working" ? (
                                            <FiArrowUp style={{ color: 'green', fontSize: '20px' }} />
                                        ) : (
                                            <FiArrowDown style={{ color: 'red', fontSize: '20px' }} />
                                        )}
                                    </td>
                                    <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{item.cdate}</td>


                                    <td style={{ color: item.hdd_status === 'working' ? 'green' : 'red', fontWeight: 'bold', fontSize: '15px' }}>
                                        {item.hdd_status}
                                    </td>
                                    <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{item.last_communication}</td>
                                    <td style={{ color: 'skyblue', fontWeight: 'bold', fontSize: '13px' }}>{item.ip}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div
                                                style={{
                                                    width: '15px',
                                                    height: '15px',
                                                    borderRadius: '20px',
                                                    backgroundColor: item.cam1 === 'working' ? 'green' : 'red',
                                                    marginRight: '5px',
                                                    paddingTop: '3px',
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    width: '15px',
                                                    height: '15px',
                                                    borderRadius: '20px',
                                                    backgroundColor: item.cam2 === 'working' ? 'green' : 'red',
                                                    marginRight: '5px',
                                                }}
                                            ></div>

                                            <div
                                                style={{
                                                    width: '15px',
                                                    height: '15px',
                                                    borderRadius: '20px',
                                                    backgroundColor: item.cam3 === 'working' ? 'green' : 'red',
                                                    marginRight: '5px',
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    width: '15px',
                                                    height: '15px',
                                                    borderRadius: '20px',
                                                    backgroundColor: item.cam4 === 'working' ? 'green' : 'red',
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{item.recording_from}</td>
                                    <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{item.recording_to}</td>
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

export default DeviceHistory;
