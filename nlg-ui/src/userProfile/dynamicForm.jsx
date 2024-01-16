import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Space, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const DynamicForm = ({ onSubmit }) => {
    const [form] = Form.useForm();
    const [formItems, setFormItems] = useState([]);
  const [team, setteam] = useState("");
  const [dateMe,setDateMe] = useState(null); 
    const handleAddFormItem = () => {
      setFormItems([...formItems, {}]);
    };
  
    const handleRemoveFormItem = (index) => {
      const updatedFormItems = formItems.filter((_, i) => i !== index);
      setFormItems(updatedFormItems);
    };
  
    const handleSubmit = () => {
      // Process the submitted values here (e.g., store in an array)
      const formItemData = formItems.map((item, index) => ({
        highSchoolTeamName: team ,
        highSchoolYearExperience: dateMe,
      }));
      onSubmit(formItemData);
      
    };
  
    return (
        <Form
        form={form}
      >
        {formItems.map((item, index) => (
          <Row key={index} gutter={16} style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '10px' }}>
            <Col>
              <Form.Item style={{ marginBottom: '30px' }} label="High School Team Name" name={`highSchoolPlayingExperience_${index}`} rules={[{ required: true }]}>
                <Input placeholder="High School Team Name" onChange={(e)=> setteam(e.target.value)} />
              </Form.Item>
  
              <Form.Item
                label="High School Experience"
                name={`highSchoolYearExperience_${index}`}
                labelAlign="top"
                rules={[
                  {
                    validator: (_, value) =>
                      value && value.length === 2
                        ? Promise.resolve()
                        : Promise.reject("Please select the date range"),
                  },
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker.RangePicker style={{ width: '100%' }}  onChange={(dates) => setDateMe(dates)} />
              </Form.Item>
  
              <Button
                type="danger"
                onClick={() => handleRemoveFormItem(index)}
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Form.Item>
          <Button type="dashed" onClick={handleAddFormItem} block icon={<PlusOutlined />}>
            Add Field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary"onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default DynamicForm;
  