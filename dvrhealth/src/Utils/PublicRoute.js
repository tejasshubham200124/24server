import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getUserId } from '../Utils/Common';


function PublicRoute({ path, ...rest }) {
  return (
    <Route
      {...rest}
      element={getUserId() ? <Navigate to="/admin" /> : <Route {...rest} />}
    />
  );
}

export default PublicRoute;







