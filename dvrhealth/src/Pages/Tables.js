import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap'
import { Card } from 'antd';
import axios from 'axios';
import { BsRouter } from 'react-icons/bs'
import { MdHttp } from 'react-icons/md'
import { BiVideoRecording } from 'react-icons/bi'
import { FaRegClock } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const Tables = () => {
    const [post, setPost] = useState([]);
    const [count, setCount] = useState(0)
    const [notAvailable,setNotAvailable]=useState(0)
    const [timeDiff,setTimeDiff]=useState(0)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/30DaysAging`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setPost(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {

        fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/30DaysAgingCount`)
            .then(response => response.json())
            .then(data => setCount(data.count))
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);


    useEffect(() => {
        fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/RecNotAvailableCount`)
            .then(response => response.json())
            .then(data => setNotAvailable(data.recnotavailable))
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/TimeDifferenceCount`)
            .then(response => response.json())
            .then(data => setTimeDiff(data.time_difference_count))
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);

    return (
        <div className='content'>
            <div className='third-part'>

                <Card
                    style={{
                        width: 620,
                        height: 460,
                        borderRadius: '15px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                    }}
                >
                    <h6>Aging Sites more than a month</h6>
                    <h6><span className='clr'> ( {count} )</span> Total sites</h6>
                    <Table striped bordered hover className='custom-table mt-4'>
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>ATM ID</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Zone</th>
                                <th>No of Days</th>

                            </tr>
                        </thead>
                        <tbody>
                            {post.length > 0 ? (
                                post.slice(0, 5).map((users, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '15px' }}>{users.atmid}</td>
                                            <td>{users.city}</td>
                                            <td>{users.state}</td>
                                            <td>{users.zone}</td>
                                            <td style={{ color: 'red', fontWeight: 'bold', fontSize: '15px' }}>{users.days_difference}</td>
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
                    <div className="show-all-button-container">
                        <Link to="/admin/AgingMoreThan30" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                            <button className="show-all-button">Show All Sites</button>
                        </Link>
                    </div>
                </Card>
            </div>
            <div className='forth-part'>
                <div className='straight'>
                    <Card
                        style={{
                            width: 280,
                            height: 130,
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',


                        }}
                    >
                        <div class="d-flex align-items-center mt-2">
                            <div>
                                <p class="mb-0 text-secondary">HTTP</p>
                                <h4 class="my-1 text-info">69</h4>

                            </div>
                            <div class="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto"><MdHttp />
                            </div>
                        </div>
                    </Card>
                    <Card
                        style={{
                            width: 280,
                            height: 130,
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div class="d-flex align-items-center mt-2">
                            <div>
                                <p class="mb-0 text-secondary">RTSP</p>
                                <h4 class="my-1 text-info">69</h4>
                            </div>
                            <div class="widgets-icons-2 rounded-circle bg-gradient-blooker5 text-white ms-auto"><BiVideoRecording />
                            </div>
                        </div>
                    </Card>
                    <Card
                        style={{
                            width: 280,
                            height: 130,
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div class="d-flex align-items-center mt-2">
                            <div>
                                <p class="mb-0 text-secondary">Router</p>
                                <h4 class="my-1 text-info">69</h4>

                            </div>
                            <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><BsRouter />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='mt-3  d-flex flex-row '>
                    <Card
                        style={{
                            width: 430,
                            height: 250,
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '16px',
                            backgroundImage: 'url(/camera.png)',
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div class="d-flex align-items-center ">
                            <div>
                                <p class="mb-0 text-secondary ">Recording not available </p>
                                <Link to='/admin/RecNotAvailable' style={{ textDecoration: 'none' }}><h5 class="my-1 neveronsi2">{notAvailable}</h5></Link>
                                
                            </div>
                        </div>
                    </Card>
                    <div className='pl-2'>
                        <Card
                            style={{
                                width: 200,
                                height: 250,
                                borderRadius: '15px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div class="d-flex align-items-center mt-2">
                                <div>
                                    <p class="mb-0 text-secondary">Time Difference</p>
                                    <Link to='/admin/TimeDIfference' style={{ textDecoration: 'none' }}>
                                        <h4 class="my-1 text-info">{timeDiff}</h4>
                                    </Link>

                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><FaRegClock />
                                </div>
                            </div>
                            <div className='d-flex justify-content-center mt-2'>
                                <img src="/images.png" alt="Your Image" width="180" height="100" />
                            </div>
                        </Card>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Tables