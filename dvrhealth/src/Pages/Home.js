import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import Cards from './Cards';
import { BsArrowBarUp } from 'react-icons/bs'
import { BsArrowBarDown } from 'react-icons/bs'
import { CgDanger } from 'react-icons/cg'
import { BiDisc } from 'react-icons/bi'
import Tables from './Tables';

const Home = () => {

  const [totalSites, setTotalSites] = useState(0);
  const [onlineSites, setOnlineSites] = useState(0);
  const [offlineSites, setOfflineSites] = useState(0);
  const [hddNotWorking, sethddNotWorking] = useState(0);
  const [neveron, setNeveron] = useState(0);

  
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

    fetch('http://localhost:8000/TotalSites')
      .then(response => response.json())
      .then(data => setTotalSites(data.atmCount))
      .catch(error => console.error('Error fetching total number of sites:', error));
  }, []);

  useEffect(() => {

    fetch('http://localhost:8000/OnlineSites')
      .then(response => response.json())
      .then(data => setOnlineSites(data.online_count))
      .catch(error => console.error('Error fetching number of online sites:', error));
  }, []);

  useEffect(() => {

    fetch('http://localhost:8000/OfflineSites')
      .then(response => response.json())
      .then(data => setOfflineSites(data.offline_count))
      .catch(error => console.error('Error fetching number of offline sites:', error));
  }, []);

  useEffect(() => {

    fetch('http://localhost:8000/hddnotworking')
      .then(response => response.json())
      .then(data => sethddNotWorking(data.non_ok_hdd_count))
      .catch(error => console.error('Error fetching number of offline sites:', error));
  }, []);
  useEffect(() => {

    fetch('http://localhost:8000/neveron')
      .then(response => response.json())
      .then(data => setNeveron(data.neveron))
      .catch(error => console.error('Error fetching number of offline sites:', error));
  }, []);
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
              backgroundSize: "cover",
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div class="d-flex align-items-center">
              <div>
                <p class="mb-0 text-secondary">Total Sites </p>
                <h4 class="my-1 text-info">{totalSites}</h4>
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
                    <h4 class="my-1 text-warning">{onlineSites}</h4>

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
                    <h4 class="my-1 text-warning">{offlineSites}</h4>

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
                    <h4 class="my-1 text-warning">{neveron}</h4>

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
                    <h4 class="my-1 text-warning">{hddNotWorking}</h4>

                  </div>
                  <div class="widgets-icons-2 rounded-circle bg-gradient-blooker3 text-white ms-auto"><BiDisc />
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