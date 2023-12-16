import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';


const Comfort = () => {
    const [post, setPost] = useState([]);
    const [number, setNumber] = useState(1);
    const [postPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermEntered, setSearchTermEntered] = useState('');
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const firstPost = (number - 1) * postPerPage;
    const lastPost = Math.min(firstPost + postPerPage, totalCount);

    useEffect(() => {
        fetchAllSitesData(number, searchTermEntered);
    }, [number, searchTermEntered]);

    const fetchAllSitesData = (page) => {
        setLoading(true);

        let apiUrl = `${process.env.REACT_APP_DVRHEALTH_API_URL}/PanelHealthDetailsapid?page=${page}`;

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
                const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/ExportPanelHealthDetails`);
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
        XLSX.writeFile(wb, 'Online_Sites.xlsx');
    };

    // const getZoneStatus = (zone) => {
    //     let statusText = "";
    //     let statusColor = "";

    //     if (zone.zone_no <= 36) {
    //         switch (zone.status) {
    //             case 0:
    //                 statusText = "Close";
    //                 statusColor = "red";
    //                 break;
    //             case 1:
    //                 statusText = "Open";
    //                 statusColor = "green";
    //                 break;
    //             default:
    //                 statusText = "Unknown";
    //                 break;
    //         }
    //     } else {
    //         switch (zone.status) {
    //             case 0:
    //                 statusText = "Close";
    //                 statusColor = "#6C3428";
    //                 break;
    //             case 1:
    //                 statusText = "Triggered";
    //                 statusColor = "#6C3428";
    //                 break;
    //             case 2:
    //                 statusText = "Disconnected";
    //                 statusColor = "#6C3428";
    //                 break;
    //             case 3:
    //                 statusText = "Open";
    //                 statusColor = "#6C3428";
    //                 break;
    //             default:
    //                 statusText = "Unknown";
    //                 statusColor = "#6C3428";
    //                 break;
    //         }
    //     }

    //     return <span style={{ color: statusColor }}>{statusText}</span>;
    // };


    const getZoneStatus = (zone) => {
        let statusText = "";
        let statusColor = "";
    
        switch (zone.armed) {
            case 1:
                statusText = "Open";
                statusColor = "green";
                break;
            case 0:
                statusText = "Bypassed";
                statusColor = "red"; 
                break;
            default:
                statusText = "Unknown";
                break;
        }
    
        return <span style={{ color: statusColor }}>{statusText}</span>;
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
                            <h6>Comfort Panel</h6>
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
                    <div style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>
                        <Table className='custom-tablepanel mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>ATM ID</th>
                                    <th>Panel Name</th>
                                    {post.length > 0 && Array.isArray(post[0].zone_config) ? (
                                        post[0].zone_config.map((zone, zoneIndex) => (
                                            <th key={zoneIndex}>{zone.zone_name}</th>
                                        ))
                                    ) : (
                                        <th>No Zone Data</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {post.map((users, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }}>
                                            {users.atmid}
                                        </td>
                                        <td style={{ color: 'orange', fontWeight: 'bold', fontSize: '13px' }}>{users.panel_name}</td>
                                        {users.zone_config && Array.isArray(users.zone_config) ? (
                                            users.zone_config.map((zone, zoneIndex) => (
                                                <td key={zoneIndex}>{getZoneStatus(zone)}</td>
                                            ))
                                        ) : (
                                            <td>No Zone Data</td>
                                        )}
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
            )}
        </div>
    );
};

export default Comfort;
