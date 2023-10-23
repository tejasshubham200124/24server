import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { Link } from 'react-router-dom';
const TableRow = ({ users, index }) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }}>
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
            <td>
                {users.login_status === 'working' ? (
                    <FiArrowUp style={{ color: 'green', fontWeight: 600, fontSize: '18px' }} />
                ) : (
                    <FiArrowDown style={{ color: 'red', fontWeight: 600, fontSize: '18px' }} />
                )}
            </td>
            <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.cdate}</td>
            <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.City}</td>
            <td style={{ fontWeight: 600, fontSize: '13px' }}> {users.State}</td>
            <td style={{ fontWeight: 600, fontSize: '13px' }}>{users.Zone}</td>
            <td style={{ color: users.hdd_status === 'working' ? 'green' : 'red', fontWeight: 'bold', fontSize: '14px' }}>
                {users.hdd_status}
            </td>
            <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.last_communication}</td>

            <td style={{ color: 'skyblue', fontWeight: 'bold', fontSize: '13px' }}>{users.ip}</td>
            <td style={{ color: 'orange', fontWeight: 600, fontSize: '13px' }}>{users.dvrtype}</td>
            
            <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: '13px',
                            height: '13px',
                            borderRadius: "17px",
                            backgroundColor: users.cam1 === 'working' ? 'green' : 'red',
                            marginRight: '5px',
                            paddingTop: "5px"
                        }}
                    ></div>
                    <div
                        style={{
                            width: '13px',
                            height: '13px',
                            borderRadius: "17px",
                            backgroundColor: users.cam2 === 'working' ? 'green' : 'red',
                            marginRight: '5px',
                            paddingTop: "5px"
                        }}
                    ></div>
                    <div
                        style={{
                            width: '13px',
                            height: '13px',
                            borderRadius: "17px",
                            backgroundColor: users.cam3 === 'working' ? 'green' : 'red',
                            marginRight: '5px',
                            paddingTop: "5px"
                        }}
                    ></div>
                    <div
                        style={{
                            width: '13px',
                            height: '13px',
                            borderRadius: "17px",
                            backgroundColor: users.cam4 === 'working' ? 'green' : 'red',
                            paddingTop: "5px"
                        }}
                    ></div>
                </div>
            </td>
            <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.recording_from}</td>
            <td style={{ color: 'maroon', fontWeight: 600, fontSize: '13px' }}>{users.recording_to}</td>
        </tr>
    );
};

export default TableRow;
