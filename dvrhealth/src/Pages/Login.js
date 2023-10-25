import React, { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import Card from 'react-bootstrap/Card';
import { VscUnlock } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom';
import { setUserSession } from '../Utils/Common';
function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleLogin = async () => {

    try {
      const response = await fetch('http://192.168.100.24:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
    
        setUserSession(
          data.id,
        );

        swal({
          title: 'Login Successful',
          text: 'You have successfully logged in!',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          navigate('/admin');
        });
      } else {
        setErrorMessage(data.error);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred during login');
      setSuccessMessage('');
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ paddingTop: "6rem" }}>
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
                <h5 style={{ textAlign: 'center' }}><strong>Login</strong></h5>
                <div className='mt-4'>
                  <input type="text" placeholder="Username" className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='mt-4'>
                  <input type="password" placeholder='Password' className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='login-button' style={{ textAlign: 'center' }}>
                  <button class="login-button2" onClick={handleLogin} >Submit</button>
                </div>
                <div className='d-flex flex-row justify-content-center align-items-center pt-2'>
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </div>
                <div className='d-flex flex-row justify-content-center align-items-center  register'>
                  <p>If you dont have an account?
                    <Link to="/SignUp" onClick={() => window.location.href = '/SignUp'}>
                      <span className='signup'>Register Here</span>
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;
