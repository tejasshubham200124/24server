import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai'
import { FaArrowLeft } from 'react-icons/fa'
import { removeUserSession } from '../Utils/Common';
import { Layout, theme } from 'antd';
import swal from 'sweetalert'
const { Header, Content, Footer } = Layout;


const App = () => {

    const navigate = useNavigate();


    const handleLogout = () => {
        swal({
            title: "Are you sure you want to log out?",
            text: "You will be logged out of your account.",
            icon: "warning",
            buttons: ["No, cancel", "Yes, log out"],
            dangerMode: true,
        })
            .then((willLogout) => {
                if (willLogout) {
                    removeUserSession();
                    navigate('/');
                }
            });
    };

    const handleGoBack = () => {
        navigate(-1);
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >


                <div className="logo-container">
                    <div className="heartbeat-animation">
                        <Link to="/admin">
                            <img src="/logo.jpg" alt="Logo" className="logo" />
                        </Link>
                    </div>
                </div>

                <button className="button" onClick={handleGoBack}>
                    <div className="button-box">
                        <span> 
                            <FaArrowLeft size={16} style={{ color: 'black' , marginBottom:'3px'}} />
                        </span>
                    </div>
                </button>

                <button className="Btn" onClick={handleLogout}>
                    <div className="sign">
                        <AiOutlineArrowRight size={24} color="white" />
                    </div>
                    <div className="text">Logout</div>
                </button>

            </Header>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    overflow: 'hidden'
                }}
            >
                <Outlet />
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
            </Footer>
        </Layout>
    );
};
export default App;