import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const StatusNode = ({ data }) => {
  return (
    <div className="status-node">
      <label>{data.label}</label>
      <Select defaultValue="Pending" style={{ width: 120 }}>
        <Option value="Pending">Pending</Option>
        <Option value="Approved">Approved</Option>
        <Option value="Canceled">Canceled</Option>
      </Select>
    </div>
  );
};

export default StatusNode;