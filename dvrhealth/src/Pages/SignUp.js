import React, { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import Card from 'react-bootstrap/Card';
import { VscUnlock } from 'react-icons/vsc';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function SignUp() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    const newUser = { username, email, password };
    axios.post('http://localhost:8000/register', newUser)
      .then(response => {
        console.log(response.data.message);
        if (response.status === 201) {
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error registering user:', error);
      });
  };

  return (

    <MDBContainer fluid className='d-flex align-items-center justify-content-center vh-100'>
      <MDBCard className='card-container'>
        <MDBCardBody>
          <ul className='background'>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className='login-form'>
            <Card>
              <Card.Body style={{ width: '600px' }}>
                <div className="login-container">
                  <h5 className="login-heading">
                    <strong>
                      <VscUnlock className="login-icon" />
                    </strong>
                  </h5>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                    <defs>
                      <linearGradient id="gradient" gradientTransform="rotate(90)">
                        <stop offset="0%" stopColor="#0851a6" />
                        <stop offset="100%" stopColor="#021b79" />
                      </linearGradient>
                      <mask id="gradient-mask">
                        <rect className="gradient-rect" x="0" y="0" width="100%" height="100%" />
                      </mask>
                    </defs>
                  </svg>
                </div>
                <h5 style={{ textAlign: 'center' }}><strong>Sign Up</strong></h5>
                <div className='mt-4'>
                  <input type="text" placeholder="Username" className="form-control"
                    value={username} onChange={e => setUsername(e.target.value)}
                  />
                </div>

                <div className='mt-4'>
                  <input type="text" placeholder="Email" className="form-control"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className='mt-4'>
                  <input type="password" placeholder='Password' className="form-control"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className='login-button' style={{ textAlign: 'center' }}>
                  <button class="login-button2" onClick={handleRegister} >Submit</button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default SignUp;
