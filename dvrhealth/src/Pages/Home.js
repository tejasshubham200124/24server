import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import Cards from './Cards';
import { BsArrowBarUp } from 'react-icons/bs'
import { BsArrowBarDown } from 'react-icons/bs'
import { CgDanger } from 'react-icons/cg'
import { BiDisc } from 'react-icons/bi'
import Tables from './Tables';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const Home = () => {

  const [totalSites, setTotalSites] = useState(0);
  const [onlineSites, setOnlineSites] = useState(0);
  const [offlineSites, setOfflineSites] = useState(0);
  const [hddNotWorking, sethddNotWorking] = useState(0);
  const [neveron, setNeveron] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hddcalllog, setHddCallLog] = useState([]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const cardStyle = {
    width: 320,
    height: 120,
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '8px',
  };
  const rowStyle = {
    marginBottom: '16px',
  }

  const firstRowColStyle = {
    marginBottom: '8px',
  }

  useEffect(() => {

    fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/TotalSites`)
      .then(response => response.json())
      .then(data => setTotalSites(data.atmCount))
      .catch(error => console.error('Error fetching total number of sites:', error));
  }, []);

  useEffect(() => {

    fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/OnlineSites`)
      .then(response => response.json())
      .then(data => setOnlineSites(data.online_count))
      .catch(error => console.error('Error fetching number of online sites:', error));
  }, []);

  useEffect(() => {

    fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/OfflineSites`)
      .then(response => response.json())
      .then(data => setOfflineSites(data.offline_count))
      .catch(error => console.error('Error fetching number of offline sites:', error));
  }, []);

  useEffect(() => {

    fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/hddnotworking`)
      .then(response => response.json())
      .then(data => sethddNotWorking(data.non_ok_hdd_count))
      .catch(error => console.error('Error fetching number of offline sites:', error));
  }, []);
  useEffect(() => {

    fetch(`${process.env.REACT_APP_DVRHEALTH_API_URL}/neveron`)
      .then(response => response.json())
      .then(data => setNeveron(data.neveron))
      .catch(error => console.error('Error fetching number of offline sites:', error));
  }, []);


  useEffect(() => {
    const fetchData = () => {
      axios.get(`${process.env.REACT_APP_DVRHEALTH_API_URL}/todayshddstatuschange`)
        .then((response) => {
          console.log('Data from API:', response.data);
          setHddCallLog(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    fetchData();
  }, []);

  // console.log('State after useEffect:', hddcalllog);

  return (
    <div>
      <div className='dashboard' >
        <div className='first-part'>
          <Card
            style={{
              width: 460,
              height: 300,
              borderRadius: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              backgroundImage: 'url(/bargraph.png)',
              backgroundSize: '100% 100%',
              // backgroundRepeat: 'no-repeat',
            }}
          >
            <div class="d-flex align-items-center">
              <div>
                <p class="mb-0 text-secondary">Total Sites </p>
                <Link to='/admin/SiteTable' style={{ textDecoration: "none" }}><h4 class="my-1 text-info">{totalSites}</h4></Link>

              </div>
            </div>
          </Card>
        </div>
        <div className='second-part'>
          <Row gutter={16} style={rowStyle}>
            <Col span={12} style={firstRowColStyle}>
              <Card style={cardStyle}>
                <div class="d-flex align-items-center">
                  <div>
                    <p class="mb-0 text-secondary">Online</p>
                    <Link to='/admin/OnlineSiteTable' style={{ textDecoration: 'none' }}><h4 class="my-1 onlinesi">{onlineSites}</h4></Link>
                  </div>
                  <div class="widgets-icons-2 rounded-circle bg-gradient-blooker4 text-white ms-auto"><BsArrowBarUp />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={12} style={firstRowColStyle}>
              <Card style={cardStyle}>
                <div class="d-flex align-items-center">
                  <div>
                    <p class="mb-0 text-secondary">Offline</p>
                    <Link to='/admin/OfflineSiteTable' style={{ textDecoration: 'none' }}> <h4 class="my-1 offlinesi">{offlineSites}</h4></Link>
                  </div>
                  <div class="widgets-icons-2 rounded-circle bg-gradient-blooker5 text-white ms-auto"><BsArrowBarDown />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={rowStyle}>
            <Col span={12} style={firstRowColStyle}>
              <Card style={cardStyle}>
                <div class="d-flex align-items-center">
                  <div>
                    <p class="mb-0 text-secondary">Never On</p>
                    <Link to='/admin/NeverOn' style={{ textDecoration: 'none' }}><h4 class="my-1 neveronsi">{neveron}</h4>
                    </Link>
                  </div>
                  <div class="widgets-icons-2 rounded-circle bg-gradient-blooker2 text-white ms-auto"><CgDanger />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={12} style={firstRowColStyle}>
              <Card style={cardStyle}>
                <div class="d-flex align-items-center">
                  <div>
                    <p class="mb-0 text-secondary">HDD</p>
                    <Link to='/admin/HddNotWorking' style={{ textDecoration: 'none' }}>   <h4 class="my-1 hddsi">{hddNotWorking}</h4></Link>
                    <div className='d-flex flex-row align-items-center justify-content-center'>
                      <Link to='/admin/FormattedData' style={{ textDecoration: 'none' }}>  <p style={{ color: 'red', fontWeight: 'bold' }} >See Formatted Data</p></Link>

                      <p
                        className='ml-3'
                        style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={handleOpenModal}
                      >
                        call log
                      </p>

                      <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>HDD Call Log </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>ATM ID</th>
                                <th>Previous Status</th>
                                <th>Current Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hddcalllog.map((item) => (
                                <tr key={item.atmid}>
                                  <td style={{ color: 'darkblue', fontWeight: 'bold', fontSize: '13px' }} >{item.atmid}</td>
                                  <td style={{ color: 'green', fontWeight: 'bold', fontSize: '13px' }}>{item.previous_status}</td>
                                  <td  style={{ color: 'red', fontWeight: 'bold', fontSize: '13px' }}>{item.current_status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                  <div class="widgets-icons-2 rounded-circle bg-gradient-blooker3 text-white ms-auto mb-5"><BiDisc />
                  </div>
                </div>

              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className='down'>
        <Cards />
      </div>
      <div className='down'>
        <Tables />
      </div>
    </div>
  )
}

export default Home