import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import * as XLSX from 'xlsx';
import TableRow from './TableRow';
import debounce from 'lodash.debounce';


const SiteTable = () => {
    const [post, setPost] = useState([]);
    const [number, setNumber] = useState(1);
    const [postPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(true);
    const [debouncedLoading, setDebouncedLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const firstPost = (number - 1) * postPerPage;
    const lastPost = Math.min(firstPost + postPerPage, totalCount);




    useEffect(() => {
        fetchAllSitesData(number, searchTerm);
    }, [number, searchTerm]);

    const fetchAllSitesData = (page) => {
        setLoading(true); // Set loading state before sending the request

        let apiUrl = `http://localhost:8000/AllSites?page=${page}`;

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


    const debouncedFetchData = debounce((value) => {
        fetchAllSitesData(number, value);
    }, 4000)

    const handleSearchTermChange = (value) => {
        setSearchTerm(value);
        debouncedFetchData(value);
    };

    const handlePageClick = (selected) => {
        const newPageNumber = selected.selected + 1;
        setNumber(newPageNumber);
        fetchAllSitesData(newPageNumber, searchTerm);
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

    const Fallback = () => <tr><td>Loading....</td></tr>;

    return (
        <div>
            {(loading || debouncedLoading) && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            {!loading && post.length > 0 && (
                <div>
                    <div className="row">
                        <div className="col-6 pt-2">
                            <h6>Dummy Table</h6>
                            <button onClick={exportToExcel} className="btn btn-primary mt-4">
                                Export to Excel
                            </button>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <div className='col-4 text-end login-form2'>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchTermChange(e.target.value)}
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
                                <th>City</th>
                                <th>State</th>
                                <th>Zone</th>
                                <th>
                                    Up/Down
                                </th>

                                <th>Last Communication</th>
                                <th>HDD Status</th>
                                <th>Router Ip</th>
                                <th>Dvr type</th>
                                <th>Camera Status</th>
                                <th>Latency</th>
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
            )}
        </div>
    );
};

export default SiteTable;