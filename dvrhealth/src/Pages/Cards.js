import React, { useState, useEffect } from 'react';
import { AiOutlineCamera } from 'react-icons/ai'
import { Link } from 'react-router-dom';

const Cards = () => {

    const [cameraNotWorking, setCameraNotWorking] = useState({
        cam1: 0,
        cam2: 0,
        cam3: 0,
        cam4: 0
    });

    useEffect(() => {
        fetch('http://localhost:8000/CameraNotWorking')
            .then(response => response.json())
            .then(data => {
                setCameraNotWorking({
                    cam1: data.cam1_count,
                    cam2: data.cam2_count,
                    cam3: data.cam3_count,
                    cam4: data.cam4_count
                });
            })
            .catch(error => console.error('Error fetching number of offline sites:', error));
    }, []);

    return (
        <div className='down'>
            <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4">
                <div class="col">
                    <div class="card radius-10 border-start border-0 border-3 border-info">

                        <div class="card-body with-gradient-border">
                            <div class="d-flex align-items-center">
                                <div>
                                    <p class="mb-0 text-secondary">Camera 1</p>
                                    <Link to='/admin/CameraOne' style={{ textDecoration: 'none' }}><h4 class="my-1 text-info">{cameraNotWorking.cam1}</h4></Link>
                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><AiOutlineCamera /></div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card radius-10 border-start border-0 border-3 border-danger">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div>
                                    <p class="mb-0 text-secondary">Camera 2</p>
                                    <Link to='/admin/CameraTwo' style={{ textDecoration: 'none' }}> <h4 class="my-1 text-danger">{cameraNotWorking.cam2}</h4></Link>


                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><AiOutlineCamera />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card radius-10 border-start border-0 border-3 border-success">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div>
                                    <p class="mb-0 text-secondary">Camera 3</p>
                                    <Link to='/admin/CameraThree' style={{ textDecoration: 'none' }}> <h4 class="my-1 text-success">{cameraNotWorking.cam3}</h4></Link>
                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto"><AiOutlineCamera />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card radius-10 border-start border-0 border-3 border-warning">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div>
                                    <p class="mb-0 text-secondary">Camera 4</p>
                                    <Link to='/admin/CameraFour' style={{ textDecoration: 'none' }}> <h4 class="my-1 text-warning">{cameraNotWorking.cam4}</h4></Link>
                                </div>
                                <div class="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto"><AiOutlineCamera />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cards