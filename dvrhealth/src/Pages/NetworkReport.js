import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiWifiOff } from 'react-icons/bi'
import { FaWifi } from 'react-icons/fa'
import { GiNetworkBars } from 'react-icons/gi'
import { Card } from 'antd';

const NetworkReport = () => {
    const [totalSites, setTotalSites] = useState(0)
    const [networkWorking, setNetworkWorking] = useState(0)
    const [networNotkWorking, setNetworkNotWorking] = useState(0)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/NetworkReportTotalSites`)
            .then(response => response.json())
            .then(data => setTotalSites(data.distinct_atmid_count))
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/NetworkReportWorkingCount`)
            .then(response => response.json())
            .then(data => setNetworkWorking(data.working_count_records))
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/NetworkReportWorkingCount`)
            .then(response => response.json())
            .then(data => setNetworkNotWorking(data.notworking_records))
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);

    return (
        <div>
            <div className='network' style={{ backgroundImage: "url('/network.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', height: '400px', width: '100%' }}>
                <div className='main-network'>
                    <Card
                        style={{
                            width: 330,
                            height: 130,
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div class="d-flex align-items-center mt-2">
                            <div>
                                <p class="mb-0 text-secondary">Total Sites</p>
                                <Link to='/admin/NetworkTotalSites' style={{ textDecoration: 'none' }}> <h4 class="my-1 text-info">{totalSites}</h4></Link>
                            </div>
                            <div class="widgets-icons-2 rounded-circle bg-gradient-blooker5 text-white ms-auto"><GiNetworkBars />
                            </div>
                        </div>
                    </Card>
                    <div className='networkp2'>
                        <Card
                            style={{
                                width: 330,
                                height: 130,
                                borderRadius: '15px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div class="d-flex align-items-center mt-2">
                                <div>
                                    <p class="mb-0 text-secondary">Working</p>
                                    <Link to='/admin/NetworkWorking' style={{ textDecoration: 'none' }}> <h4 class="my-1 text-info">{networkWorking}</h4></Link>
                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-blooker5 text-white ms-auto"><FaWifi/>
                                </div>
                            </div>
                        </Card>
                        <Card
                            style={{
                                width: 330,
                                height: 130,
                                borderRadius: '15px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div class="d-flex align-items-center mt-2">
                                <div>
                                    <p class="mb-0 text-secondary">Not Working</p>
                                    <Link to='/admin/NetworNotkWorking' style={{ textDecoration: 'none' }}> <h4 class="my-1 text-info">{networNotkWorking}</h4></Link>
                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-blooker5 text-white ms-auto"><BiWifiOff  />
                                </div>
                            </div>
                        </Card>
                    </div>


                </div>
            </div>



        </div>
    )
}

export default NetworkReport