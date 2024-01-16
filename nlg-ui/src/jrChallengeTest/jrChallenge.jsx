import React from "react";
import Navbar from "../navbar/navbar";
import { Col, Collapse, Row } from "antd";
import { Form, Input } from "antd";
import { useState } from "react";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import "./jrChallenge.css";
const baseUrl = getBaseUrl();

const levelScoreEndPoint = `${baseUrl}/jr-update-score`;
const JRChallenge = (props) => {
  const { Panel } = Collapse;
  const [activeKey , setActiveKey] = useState([]);
  const startchallengeHandler = () => {
    setActiveKey(["0"]);
  };
  
  const onSubmitHandler = (value ,index )=>{
    
    const nextActiveKey = parseInt(activeKey[0]) + 1;
    levelScoreSubmit(index,value.score, value.par,value.fairway_hit,value.carry_distance,value.gir,value.correct_leave)
    setActiveKey([nextActiveKey.toString()]);
  }
//   console.log({resArr});
const levelScoreSubmit = async (
   holeId, score, par,fairway_hit,carry_distance,gir,correct_leave
  ) => {
    try {
      toastr.clear();
      console.log({holeId});
      const storedToken = localStorage.getItem("token");
      const endPoint = `${levelScoreEndPoint}/${holeId}`;
      await axios.put(
        endPoint,
        {
            score:parseInt(score), par:parseInt(par),fairway_hit:parseInt(fairway_hit),carry_distance:parseInt(carry_distance),gir:parseInt(gir),correct_leave:parseInt(correct_leave)
        },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      toastr.success(" Test Submitted");
    } catch (error) {
      console.error("test failed:", error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error.response?.data?.message || "Unable to submit test");
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <Navbar userdata={props.userdata} />
      <Row
        style={{
          display: "flex",
          
          justifyContent: "center",
        }}
      >
        <Col
        className="form-col-junior"
          style={{
           
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontFamily: "sans-serif",
            }}
          >
            Scorecard
          </h1>
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn startChallengeButton"
              onClick={startchallengeHandler}
            >
              Start Challenge
            </button>
          </div>
          <Collapse accordion activeKey={activeKey}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Panel
                header={`Hole ${index + 1}`}
                key={index}
                style={{
                  backgroundColor: activeKey == index ? "green" : "grey",
                  color: activeKey == index ? "white" : "black",
                }}
              >
                <HoleForm onSubmitHandler={(value)=>onSubmitHandler(value, index+1)} />
              </Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export const HoleForm = ({onSubmitHandler}) => {
  const onFinish = (values) => {
    
    onSubmitHandler(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Form
        labelCol={{ span: 24 }} // Labels take full width
        wrapperCol={{ span: 24 }} // Input elements take full width
        // style={{
        //   maxWidth: 1000,
        // }}
        initialValues={{
          remember: true,
        }}
        labelAlign="top"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Par"
          name="par"
          //   rules={[
          //     {
          //       required: true,
          //       message: 'Please input your username!',
          //     },
          //   ]}
        >
          <Input required={true} placeholder="Enter Par" />
        </Form.Item>

        <Form.Item
          label="Score"
          name="score"
          //   rules={[
          //     {
          //       required: true,
          //       message: 'Please input your password!',
          //     },
          //   ]}
        >
          <Input required={true} placeholder="Enter Score" />
        </Form.Item>
        <Form.Item
          label="Fairway Hit"
          name="fairway_hit"
          //   rules={[
          //     {
          //       required: true,
          //       message: 'Please input your password!',
          //     },
          //   ]}
        >
          <Input placeholder="Enter Fairway Hit" />
        </Form.Item>
        <Form.Item
          label="Carry Distance"
          name="carry_distance"
          //   rules={[
          //     {
          //       required: true,
          //       message: 'Please input your password!',
          //     },
          //   ]}
        >
          <Input placeholder="Enter Carry Distance" />
        </Form.Item>
        <Form.Item
          label="GIR"
          name="gir"
          //   rules={[
          //     {
          //       required: true,
          //       message: 'Please input your password!',
          //     },
          //   ]}
        >
          <Input placeholder="Enter gir" />
        </Form.Item>
        <Form.Item
          label="Correct Leave"
          name="correct_leave"
          //   rules={[
          //     {
          //       required: true,
          //       message: 'Please input your password!',
          //     },
          //   ]}
        >
          <Input placeholder="Enter Correct Leave" />
        </Form.Item>
        <Form.Item>
          <button type="submit" className="button-submit">
            SUBMIT
          </button>
        </Form.Item>
      </Form>
    </>
  );
};
export default JRChallenge;
