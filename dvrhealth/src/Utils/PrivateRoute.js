import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getUserId } from '../Utils/Common';


function PrivateRoute({ path, ...rest }) {
  return (
    <Route
      {...rest}
      element={getUserId() ? <Route {...rest} /> : <Navigate to="/" />}
    />
  );
}

export default PrivateRoute;

