import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const DeviceHistory = () => {
    const [post, setPost] = useState([]);
    const [number, setNumber] = useState(1);
    const [postPerPage] = useState(50);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const { atmId } = useParams();

    // useEffect(() => {
    //     axios
    //         .get(`http://localhost:8000/devicehistoryTwo/${atmId}`)
    //         .then((response) => {
    //             if (response.data && response.data.data) {
    //                 setPost(response.data.data);
    //                 setTotalCount(response.data.totalCount); 
    //                 setLoading(false);
    //             } else {
    //                 console.log('No data received from API.');
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //             setLoading(false);
    //         });
    // }, [atmId]);

    // const handlePageClick = (selected) => {
    //     const newPageNumber = selected.selected + 1;
    //     setNumber(newPageNumber);
    // };

    const fetchData = (pageNumber) => {
        setLoading(true);
        axios
            .get(`http://localhost:8000/devicehistoryTwo/${atmId}?page=${pageNumber}&recordsPerPage=${postPerPage}`)
            .then((response) => {
                if (response.data && response.data.data) {
                    setPost(response.data.data);
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
        fetchData(number); // Fetch initial data on component load
    }, [atmId, number]);

    const handlePageClick = (selected) => {
        const newPageNumber = selected.selected + 1;
        setNumber(newPageNumber);
        fetchData(newPageNumber); // Fetch data for the selected page
    };


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
                            <h6>Offline Site Table</h6>
                            <button onClick={exportToExcel} className="btn btn-primary mt-4">
                                Export to Excel
                            </button>
                        </div>
                    </div>
                    <Table striped bordered hover className="custom-table mt-4">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>ATM ID</th>
                                <th>Up/Down</th>
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

export default DeviceHistory;
