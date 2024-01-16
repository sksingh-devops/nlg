import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import qs from 'qs';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    
    render: (name) => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
  
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];
const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});
const TournamentTable = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
    const fetchData = () => {
      setLoading(true);
      fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
        .then((res) => res.json())
        .then(({ results }) => {
          setData(results);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: 200,
              // 200 is mock data, you should read it from server
              // total: data.totalCount,
            },
          });
        });
    };
  
    useEffect(() => {
      fetchData();
    }, []);
    const handleTableChange = (pagination) => {
      setTableParams({
        pagination,
     
      });
  
      // `dataSource` is useless since `pageSize` changed
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        setData([]);
      }
    };
    return (
        <div style={{textAlign:'center', width:'80%', margin:'auto', marginTop:'20px'}}>
            <h1 style={{marginBottom:'20px'}}>Tournament Finishes</h1>
      <Table
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      </div>
    );
  };
export default TournamentTable
