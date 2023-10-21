import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { Link } from 'react-router-dom';
const TableRow = ({ users, index }) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '15px' }}>
                <Link
                    to={`/admin/DeviceHistory/${users.atmid}`}
                    style={{
                        textDecoration: 'none',  
                        color: 'darkblue',      
                        fontWeight: 'bold',    
                        fontSize: '15px',       
                    }}
                >
                    {users.atmid}
                </Link>
            </td>
            <td>{users.City}</td>
            <td>{users.State}</td>
            <td>{users.Zone}</td>
            <td>
                {users.login_status === 'working' ? (
                    <FiArrowUp style={{ color: 'green', fontSize: '20px' }} />
                ) : (
                    <FiArrowDown style={{ color: 'red', fontSize: '20px' }} />
                )}
            </td>
            <td>{users.last_communication}</td>
            <td style={{ color: users.hdd_status === 'working' ? 'green' : 'red', fontWeight: 'bold', fontSize: '15px' }}>
                {users.hdd_status}
            </td>
            <td style={{ color: 'skyblue', fontWeight: 'bold', fontSize: '15px' }}>{users.ip}</td>
            <td>{users.dvrtype}</td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            borderRadius: "20px",
                            backgroundColor: users.cam1 === 'working' ? 'green' : 'red',
                            marginRight: '5px',
                            paddingTop: "3px"
                        }}
                    ></div>
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            borderRadius: "20px",
                            backgroundColor: users.cam2 === 'working' ? 'green' : 'red',
                            marginRight: '5px',
                        }}
                    ></div>
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            borderRadius: "20px",
                            backgroundColor: users.cam3 === 'working' ? 'green' : 'red',
                            marginRight: '5px',
                        }}
                    ></div>
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            borderRadius: "20px",
                            backgroundColor: users.cam4 === 'working' ? 'green' : 'red',
                        }}
                    ></div>
                </div>
            </td>
            <td>{users.latency}</td>
        </tr>
    );
};

export default TableRow;
