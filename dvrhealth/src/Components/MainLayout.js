import React from 'react';
import { Outlet, useNavigate , Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io'
import { removeUserSession } from '../Utils/Common';
import { Layout, theme } from 'antd';
const { Header, Content, Footer } = Layout;


const App = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        removeUserSession();
        navigate('/');
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


                <button className="button" onClick={handleLogout}>
                    <div className="button-box">
                        <span className="button-elem">
                            <IoMdArrowRoundBack size={24} style={{ color: 'white' }} />
                        </span>
                    </div>
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