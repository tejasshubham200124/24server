import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

const NetworkWorking = () => {
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

        let apiUrl = `${process.env.REACT_APP_DVRHEALTH_API_URL}/networkreportworking?page=${page}`;

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
                const response = await axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/ExportOnlineSites`);
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
                            <h6>Network Report</h6>
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
                                <th>Bank</th>
                                <th>Latency</th>
                                <th>Http Port</th>
                                <th>Rtsp Port</th>
                                <th>Router Port</th>
                                <th>SDK Port</th>
                                <th>AI Port</th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((users, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }}>
                                        {users.ATMID}
                                    </td>
                                    <td style={{ color: 'teal', fontWeight: 600, fontSize: '13px' }}>{users.Bank}</td>
                                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.latency}</td>
                                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.http_port}</td>
                                    <td style={{ fontWeight: 600, fontSize: '13px' }}> {users.rtsp_port}</td>
                                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.router_port}</td>
                                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.sdk_port}</td>
                                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.ai_port}</td>
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

export default NetworkWorking;
