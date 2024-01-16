import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { BsPlusCircleDotted } from "react-icons/bs";

const GolfDataForm = ({ onAdd }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onAdd(values);
        setVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <>
      <BsPlusCircleDotted
        onClick={() => {
          setVisible(true);
        }}
        style={{ fontSize: "32px",
        verticalAlign: "text-bottom"}}
      />
         
     
      <Modal
        visible={visible}
        title="Add Golf Data"
        okText="Add"
        cancelText="Cancel"
        onCancel={() => {
          form.resetFields();
          setVisible(false);
        }}
        onOk={handleCreate}
      >
        <Form form={form} layout="vertical" name="addGolfDataForm">
        <Form.Item
          name="year"
          label="Year"
          rules={[
            {
              required: true,
              message: 'Please enter the year',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker />
        </Form.Item>
        <Form.Item name="tournamentName" label="Tournament Name">
          <Input />
        </Form.Item>
        <Form.Item name="r1" label="Round 1">
          <Input />
        </Form.Item>
        <Form.Item name="r2" label="Round 2">
          <Input />
        </Form.Item>
        <Form.Item name="r3" label="Round 3">
          <Input />
        </Form.Item>
        <Form.Item name="r4" label="Round 4">
          <Input />
        </Form.Item>
        <Form.Item name="total" label="Total">
          <Input />
        </Form.Item>
        <Form.Item name="finalPOS" label="Final Position">
          <Input />
        </Form.Item>
        <Form.Item name="totalStrokes" label="Total Strokes">
          <Input />
        </Form.Item>
        <Form.Item name="totRounds" label="Total Rounds">
          <Input />
        </Form.Item>
        <Form.Item name="avgScore" label="Average Score">
          <Input />
        </Form.Item>
      </Form>
      </Modal>
    </>
  );
};

export default GolfDataForm;
