import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Form,
  Input,
  Upload,
  Button,
  message,
  Switch,
  Select,
  InputNumber,
  Collapse,
  Col,
  Row,
  Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./addtest.css";
const AddTestModal = ({ loading, visible, onCreate, onCancel }) => {
  const [selectedVideoName, setSelectedVideoName] = useState("");
  const [numLevels, setNumLevels] = useState(1);
  const { Option } = Select;
  const { Panel } = Collapse;
  const [form] = Form.useForm();
  const [apiloading, setLoading] = useState(loading);
  const [videoFile, setVideoFile] = useState(null);
  useEffect(() => {
    setLoading(loading);
  }, [loading]);
  const handleVideoChange = async (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setVideoFile(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    const maxFileNameLength = 20; // Adjust the maximum length as needed
    const fileName = info?.file?.name;
    if (fileName) {
      const displayName =
        fileName.length > maxFileNameLength
          ? fileName.slice(0, maxFileNameLength) + "..."
          : fileName;
      setSelectedVideoName(displayName);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const [timeTest, setTimeTest] = useState(false);
  const [distanceTest, setdistanceTest] = useState(false);
  const [includeTimeTest, setincludeTimeTest] = useState(false);
  const [isMaxthreshold, setIsMaxThreshold] = useState(false);
  const [testtype, settesttype] = useState();

  const handleSwitchChange = (checked) => {
    setTimeTest(checked);
  };
  const distanceTestHandler = (checked) => {
    setdistanceTest(checked);
  };
  const includeTimeTestHandler = (checked) => {
    setincludeTimeTest(checked);
  };
  const maxThresholdHandler = (checked) => {
    setIsMaxThreshold(checked);
  };
  const testtypeHandler = (value) => {
    settesttype(value);
  };
  // Generate the panels for each level
  // useEffect(() => {
  //     // Generate the panels for each level when numLevels changes
  //     const levelPanels = [];
  //     for (let i = 0; i < numLevels; i++) {
  //       levelPanels.push(
  //         <Panel header={`Level ${i + 1}`} key={i}>
  //           <Form.Item
  //             name={['levelsArr', i, 'instruction']}
  //             label={`Instruction for Level ${i + 1}`}
  //             rules={[{ required: false, message: 'Please enter instruction' }]}
  //           >
  //             <Input />
  //           </Form.Item>
  //           <Form.Item
  //             name={['levelsArr', i, 'totalShots']}
  //             label={`Total Shots for Level ${i + 1}`}
  //             rules={[{ required: false, message: 'Please enter total shots' }]}
  //           >
  //             <InputNumber min={1} />
  //           </Form.Item>
  //         </Panel>
  //       );
  //     }
  //     setLevelPanels(levelPanels);
  //   }, [numLevels]);

  return (
    <Modal
      open={visible}
      title="ADMIN TEST BUILDER"
      okText="Add"
      cancelText="Cancel"
      className="create-test-modal"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            setLoading(true);
            const levelsArr = [];
            for (let i = 0; i < numLevels; i++) {
              values.levelsArr = values.levelsArr || [];
              if (!values.levelsArr[i]) {
                values.levelsArr[i] = {
                  totalShots: 1,
                };
              }
              levelsArr.push({
                instruction: values.levelsArr[i]?.instruction,
                totalShots: values.levelsArr[i]?.totalShots || 1, // Default to 1 if not provided
                minShots: values.levelsArr[i]?.minShots || 1, // Default to 1 if not provided
                minScore: values.levelsArr[i]?.minScore || 1, // Default to 1 if not provided
              });
            }
            onCreate({
              ...values,
              videoFile,
              levelsArr,
              distanceTest,
              includeTimeTest,
              isMaxthreshold,
            });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      confirmLoading={loading}
    >
      <div className="create-test-div">CREATE NEW TEST</div>
      <Form
        form={form}
        layout="vertical"
        name="addVideoForm"
        initialValues={{
          testType: "Putting",
          totalShots: 1,
          levels: 1,
          levelArr: [{ instructions: "levle1", totalShots: 2 }],

          includeDistance: distanceTest,
          includeTime: includeTimeTest,
        }}
      >
        <Form.Item
          label="Type of challenge?"
          name="option"
          initialValue="challenge"
          required={false}
          rules={[
            {
              required: true,
              message: "Please select type of challenge",
            },
          ]}
        >
          <Radio.Group>
            <Row gutter={16}>
              <Col span={12}>
                <Radio value="practice">Practice</Radio>
              </Col>
              <Col span={12}>
                <Radio value="challenge">Challenge</Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          required={false} // Set required to false
          rules={[
            {
              required: true,
              message: "Please enter a name",
            },
          ]}
        >
          <Input placeholder="Test Name" />
        </Form.Item>
        <Form.Item
          name="video"
          label="Test Video File"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: false,
              message: "Please upload a video file",
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
            <Button icon={<UploadOutlined />}>Add Test Video</Button>
          </Upload>
        </Form.Item>
        {/* {selectedVideoName && (
        
          <span style={{}} title={selectedVideoName}>{selectedVideoName}</span>
        
      )} */}
        <Form.Item
          label="INSTRUCTIONS"
          name="title"
          required={false}
          rules={[{ required: true, message: "Instructions is required" }]}
        >
          <Input placeholder="Instructions" maxLength={250} />
        </Form.Item>
        <Form.Item
          label="What type of test?"
          name="testtype"
          initialValue="Putting"
          required={false}
          rules={[{ required: true, message: "Test type is required" }]}
        >
          <Select onChange={testtypeHandler}>
            <Option value="Putting">Putting</Option>
            <Option value="Wedges">Wedges</Option>
            <Option value="7IRON">7 IRON</Option>
            <Option value="Driver">Driver</Option>
            <Option value="sp">Sam Puttlab</Option>
            <Option value="SpeedTest">Speed Test</Option>
            <Option value="StrengthTraining">Strength Training</Option>
            <Option value="Tournaments">Tournaments</Option>
            <Option value="tc">Trackman Combine</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="How many levels?"
          name="levels"
          required={false}
          rules={[{ required: true, message: "Number of levels is required" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={100}
            onChange={(value) => setNumLevels(value)}
          />
        </Form.Item>
        {/* {(testtype === "Wedges" || testtype == "7IRON") && (
          <Form.Item name="maxThreshold" valuePropName="checked">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="bolders">Even Level</span>
              <Switch onChange={maxThresholdHandler} />
            </div>
          </Form.Item>
        )} */}
        {/* <Form.Item
          label="Total Shots Per Level?"
          name="totalShots"
          required={false}
          rules={[{ required: true, message: "Number of shots is required" }]}
        >
         <InputNumber style={{ width: "100%" }} min={1} max={100} />
        </Form.Item> */}
        <Alert
          message="Edit level description if needed. Each level will have 1 shot by default."
          type="info"
          showIcon
        />
        <div className="my-custom-collapse">
          <div className="ant-collapse-header">
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "7px",
              }}
            >
              Edit Levels
            </span>
          </div>
          <div className="ant-collapse-content">
            {Array.from({ length: numLevels }, (_, i) => (
              <div key={i.toString()}>
                <Form.Item
                  name={["levelsArr", i, "instruction"]}
                  label={`Instruction for Level ${i + 1}`}
                  rules={[
                    { required: false, message: "Please enter instruction" },
                  ]}
                >
                  <Input placeholder={`Level ${i + 1}`} />
                </Form.Item>
                <Form.Item
                  name={["levelsArr", i, "totalShots"]}
                  label={`Total Shots for Level ${i + 1}`}
                  rules={[
                    { required: false, message: "Please enter total shots" },
                  ]}
                >
                  <InputNumber placeholder={"Shots"} defaultValue={1} min={1} />
                </Form.Item>
                <Form.Item
                  name={["levelsArr", i, "minShots"]}
                  label={`Minimun Shots for Level ${i + 1}`}
                  rules={[
                    { required: false, message: "Please enter total shots" },
                  ]}
                >
                  <InputNumber placeholder={" Min Shots"} defaultValue={1} min={1} />
                </Form.Item>

                <Form.Item
                  name={["levelsArr", i, "minScore"]}
                  label={`Threshold required for Level ${i + 1}`}
                  rules={[
                    { required: false, message: "Please enter min Score" },
                  ]}
                >
                  <InputNumber placeholder="MinScore" defaultValue={1} />
                </Form.Item>
                <hr />
              </div>
            ))}
          </div>
        </div>
        <br />
        <hr />
        <br />
        <Form.Item name="timeTest" valuePropName="checked">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="bolders">Time This Test?</span>
            <Switch onChange={handleSwitchChange} />
          </div>
        </Form.Item>

        {/* Additional form item for picking time in seconds when "Time this test" is "On" */}
        {timeTest && ( // Display the input field only when timeTest is true
          <Form.Item
            label="Time in minutes"
            name="timed"
            required={false}
            rules={[
              {
                required: true,
                message: "Please enter the time in minutes",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} max={60} />
          </Form.Item>
        )}

        <div className="create-test-div">
          What do you want to include in the test?
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* <Form.Item name="includeAttempts" valuePropName="checked">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span className="bolders">Number of Attempts</span>
                            <Switch />
                        </div>
                    </Form.Item> */}

          <Form.Item name="includeDistance" valuePropName="checked">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="bolders">Distance to the Pin</span>
              <Switch value={distanceTest} onChange={distanceTestHandler} />
            </div>
          </Form.Item>
          {/* include time means shot shape */}
          <Form.Item name="includeTime" valuePropName="checked">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="bolders">Shot Shape</span>
              <Switch
                value={includeTimeTest}
                onChange={includeTimeTestHandler}
              />
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddTestModal;
