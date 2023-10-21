import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap'
import ReactPaginate from "react-paginate";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

const NeverOn = () => {
    const [post, setPost] = useState([]);
    const [number, setNumber] = useState(1);
    const [postPerPage] = useState(100);
    const [searchQuery, setSearchQuery] = useState('');
    const lastPost = number * postPerPage;
    const firstPost = lastPost - postPerPage;
    const [loading, setLoading] = useState(true);

    const exportToExcel = () => {
        const fileType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'Cam4_NotWorkingReport';

        const ws = XLSX.utils.json_to_sheet(filteredPosts);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
        });
        const data = new Blob([excelBuffer], { type: fileType });
        const href = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + fileExtension;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const filteredPosts = post
        ? post.filter(post =>
            post.atmid && post.atmid.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handleSearch = e => {
        setSearchQuery(e.target.value);
    };


    const currentPost = filteredPosts.slice(firstPost, lastPost);
    const PageCount = Math.ceil(filteredPosts.length / postPerPage);
    const ChangePage = ({ selected }) => {
        setNumber(selected + 1);
    };

    useEffect(() => {
        axios.get('http://localhost:8000/neverondetails')
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setPost(response.data);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);


    return (
        <div>
            {loading && (
                <div id="page">
                    <div id="container">
                        <div id="ring"></div>
                        <div id="ring"></div>
                        <div id="ring"></div>
                        <div id="ring"></div>
                        <div id="h3">loading..</div>
                    </div>
                </div>
            )}
            {!loading && post.length > 0 && (
                <div>
                    <div className="row">
                        <div className="col-6 pt-2">
                            <h6>Never On Sites</h6>
                            <button onClick={exportToExcel} className="btn btn-primary mt-4">
                                Export to Excel
                            </button>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <div className='col-4 text-end login-form2'>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder='search atmid'
                                    className='form-control '
                                />
                            </div>
                        </div>
                    </div>
                    <Table striped bordered hover className='custom-table mt-4'>
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>ATM ID</th>
                                <th>Router Ip</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Zone</th>
                                <th>Site Address</th>
                              

                            </tr>
                        </thead>
                        <tbody>
                            {post.length > 0 ? (
                                currentPost.map((users, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '15px' }}>{users.atmid}</td>                                         
                                            <td style={{ color: 'skyblue', fontWeight: 'bold', fontSize: '15px' }}>{users.ip}</td>
                                            <td>{users.CITY}</td>                                            
                                            <td>{users.STATE}</td>
                                            <td>{users.ZONE}</td>
                                            <td>{users.SiteAddress}</td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan='10'>Loading...</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={PageCount}
                        onPageChange={ChangePage}
                        containerClassName={"paginationBttns"}
                        activeClassName={"paginationActive"}
                        disableInitialCallback={true}
                        initialPage={0}
                    ></ReactPaginate>
                </div>
            )}
        </div>
    )
}

export default NeverOn