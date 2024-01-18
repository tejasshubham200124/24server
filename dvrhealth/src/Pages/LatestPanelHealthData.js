// DataPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

const LatestPanelHealthData = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const perPage = 50;

  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://103.141.218.26:8080/Hitachi/api/get_panel_health_pnb_cts_data.php?page=${pageNumber + 1}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const displayData = data.slice(0, perPage);

  const pageCount = Math.ceil(data.length / perPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div>
      <Table className='custom-tablepanel mt-4'>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            <th>Column 4</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item, index) => (
            <tr key={index}>
              {/* Render your table rows here */}
              <td>{item.column1}</td>
              <td>{item.column2}</td>
              <td>{item.column3}</td>
              <td>{item.column4}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

    </div>
  );
};

export default LatestPanelHealthData;
