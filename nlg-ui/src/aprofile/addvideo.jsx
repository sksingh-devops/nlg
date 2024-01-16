import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddVideoModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setVideoFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Modal
      visible={visible}
      title="Add Video"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            
            onCreate({ ...values, videoFile });
            //setVideoFile(null);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="addVideoForm">
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please enter a title',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="video"
          label="Video File"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: 'Please upload a video file',
            },
          ]}
        >
          <Upload
            name="video"
            accept="video/*"
            customRequest={() => {}}
            showUploadList={false}
            onChange={handleVideoChange}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVideoModal;
