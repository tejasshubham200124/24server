import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { BsRouter } from 'react-icons/bs'
import { MdOutlineHttp } from 'react-icons/md'
import { TbSdk } from 'react-icons/tb'
import { BiSolidVideoRecording } from 'react-icons/bi'
import { BsDisplayport } from 'react-icons/bs'
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
            <td style={{ fontWeight: 600, color: (users.http_port_status === 'Y' || users.http_port_status === 'O') ? 'green' : 'red' }}>
                {users.http_port_status === 'Y' || users.http_port_status === 'O' ? <MdOutlineHttp size={25} color="green" /> : <MdOutlineHttp size={25} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.sdk_port_status === 'Y' || users.sdk_port_status === 'O') ? 'green' : 'red' }}>
                {users.sdk_port_status === 'Y' || users.sdk_port_status === 'O' ? <BiSolidVideoRecording size={20} color="green" /> : <BiSolidVideoRecording size={20} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.router_port_status === 'Y' || users.router_port_status === 'O') ? 'green' : 'red' }}>
                {users.router_port_status === 'Y' || users.router_port_status === 'O' ? <TbSdk size={20} color="green" /> : <TbSdk size={20} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.rtsp_port_status === 'Y' || users.rtsp_port_status === 'O') ? 'green' : 'red' }}>
                {users.rtsp_port_status === 'Y' || users.rtsp_port_status === 'O' ? <BsRouter size={20} color="green" /> : <BsRouter size={20} color="red" />}
            </td>

            <td style={{ fontWeight: 700, color: (users.ai_port_status === 'Y' || users.ai_port_status === 'O') ? 'green' : 'red', fontWeight: 600, fontSize: '13px' }}>
                {users.ai_port_status === 'Y' || users.ai_port_status === 'O' ? <BsDisplayport size={20} color="green" /> : <BsDisplayport size={20} color="red" />}
            </td>

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
