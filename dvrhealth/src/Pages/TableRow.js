import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { BsRouter } from 'react-icons/bs'
import { LiaInternetExplorer } from 'react-icons/lia'
import { TbSdk } from 'react-icons/tb'
import { BiSolidVideoRecording } from 'react-icons/bi'
import { FaRaspberryPi } from 'react-icons/fa'
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
            <td style={{ color: 'teal', fontWeight: 600, fontSize: '13px' }}>{users.Bank}</td>
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
            <td style={{ color: '#9C4CFF', fontWeight: 600, fontSize: '13px' }}>{users.dvrtype}</td>
            <td style={{ fontWeight: 600, color: (users.http_port_status === 'Y') ? 'green' : (users.http_port_status === 'O') ? 'orange' : 'red' }}>
                {users.http_port_status === 'Y' ? <LiaInternetExplorer size={22} color="green" /> : (users.http_port_status === 'O') ? <LiaInternetExplorer size={22} color="orange" /> : <LiaInternetExplorer size={22} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.rtsp_port_status === 'Y') ? 'green' : (users.rtsp_port_status === 'O') ? 'orange' : 'red' }}>
                {users.rtsp_port_status === 'Y' ? <BiSolidVideoRecording size={20} color="green" /> : (users.rtsp_port_status === 'O') ? <BiSolidVideoRecording size={20} color="orange" /> : <BsRouter size={20} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.router_port_status === 'Y') ? 'green' : (users.router_port_status === 'O') ? 'orange' : 'red' }}>
                {users.router_port_status === 'Y' ? <BsRouter size={20} color="green" /> : (users.router_port_status === 'O') ? <BsRouter size={20} color="orange" /> : <TbSdk size={20} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.sdk_port_status === 'Y') ? 'green' : (users.sdk_port_status === 'O') ? 'orange' : 'red' }}>
                {users.sdk_port_status === 'Y' ? <TbSdk size={20} color="green" /> : (users.sdk_port_status === 'O') ? <TbSdk size={20} color="orange" /> : <BiSolidVideoRecording size={20} color="red" />}
            </td>
            <td style={{ fontWeight: 700, color: (users.ai_port_status === 'Y') ? 'green' : (users.ai_port_status === 'O') ? 'orange' : 'red', fontWeight: 600, fontSize: '13px' }}>
                {users.ai_port_status === 'Y' ? <FaRaspberryPi size={20} color="green" /> : (users.ai_port_status === 'O') ? <FaRaspberryPi size={20} color="orange" /> : <FaRaspberryPi size={20} color="red" />}
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
