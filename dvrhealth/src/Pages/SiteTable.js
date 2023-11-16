import React, { useState, useEffect, Suspense } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import TableRow from './TableRow';


const SiteTable= () => {
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

        let apiUrl = `${process.env.REACT_APP_DVRHEALTH_API_URL}/AllSitesTwodemo?page=${page}`;

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
                const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/ExportAllSites`);
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
        XLSX.writeFile(wb, 'SiteTable.xlsx');
    };

    const Fallback = () => <tr><td>Loading....</td></tr>;

    return (
        <div>
            {loading && (
                <div className="loader-container">
                    <div className="loader">
                    </div>
                </div>

            )}

            {!loading && post.length > 0 && (
                <div>
                    <div className="row">
                        <div className="col-6 pt-2">
                            <h6>Site Table</h6>
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
                        <Table  className='custom-tablepanel mt-4'>
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
                                {post.length > 0 ? (
                                    post.map((user, index) => (
                                        <Suspense fallback={<Fallback />} key={index}>
                                            <TableRow users={user} index={index} />
                                        </Suspense>))
                                ) : (
                                    <tr>
                                        <td colSpan='12'>No data available.</td>
                                    </tr>
                                )}
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

export default SiteTable;
