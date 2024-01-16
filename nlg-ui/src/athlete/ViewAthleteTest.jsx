import React, { useEffect, useState } from "react";
import {
  Collapse,
  Form,
  Input,
  Button,
  Space,
  Radio,
  Select,
  Row,
  InputNumber,
  Alert,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "./viewAthlete.css";
import { useNavigate, useParams } from "react-router";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { act } from "react-dom/test-utils";

const baseUrl = getBaseUrl();
const testEndPoint = `${baseUrl}/tests`;
const levelScoreEndPoint = `${baseUrl}/update-score`;
const { Panel } = Collapse;

const ViewAthleteTest = ({ id }) => {
  const navigate = useNavigate();
  const [apniid, setApniId] = useState(id);
  const [data, setData] = useState();
  async function fetchData() {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(`${testEndPoint}/${apniid}`, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      setData(res.test);
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(` Test Not Found`);
      navigate("/session");
    }
  }
  const GolfOptions = {
    Putting: "Putting",
    Wedges: "Wedges",
    "7IRON": "7 IRON",
    Driver: "Driver",
    sp:"Sam Puttlab",
    SpeedTest: "Speed Test",
    StrengthTraining: "Strength Training",
    Tournaments: "Tournaments",
    tc: "Trackman Combine",
  };
  useEffect(() => {
    setApniId(id);
    
  }, [id]);
  useEffect(() => {
    fetchData();
    
  }, [apniid]);

  return (
    <>
     
      {data && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="viewcollapseContainer">
            <p className="text-maregin-left" style={{ fontWeight: "bold" }}>
              {data.name}
            </p>
            <video controls className="levelVideo">
              <source
                src={`${getBaseUrl()}/${data.videoPath}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p className="instructions text-maregin-left">INSTRUCTIONS</p>
            <p
              className="instructions-content text-maregin-left"
              style={{ marginTop: "0px" }}
            >
              {data?.title}
            </p>
            <br />
            <div>
              <p
                className="instructions"
                style={{
                  textAlign: "center",
                  marginTop: "0px",
                  fontSize: "18px",
                }}
              >
                {" "}
                {GolfOptions[data.testtype]}
              </p>
            </div>
            {data?.levels?.map((level, index) => (
              <>
                <Collapse accordion className="level-accordion">
                  <Panel
                    header={`LEVEL ${index + 1}`}
                    key={index + 1}
                    className={`level-panel`}
                  >
                    <div>
                      <p className="instructions">INSTRUCTIONS</p>
                      <p className="instructions-content">
                        {level.instruction}
                      </p>
                      <hr />
                      
                      <ShotAccordion minScore={level.minScore}
                      includeDistance={data.includeDistance}
                      includeTime={data.includeTime} //include time means shot shape
                      testtype = {data.testtype}
                      timed = {data.timed || 0}
                        
                        totalShots={level.totalShots}
                        
                         
                        />
                    </div>
                  </Panel>
                </Collapse>
              </>
            ))}
          </div>
        </div>
      )}


    </>
  );
};

const Timer = ({ timerValue, resetShot }) => {
  // Timer logic can be implemented here
  const initialTime = timerValue * 60; // 3 minutes in seconds
  const [time, setTime] = useState(initialTime);

  // Function to format seconds into minutes and seconds
  const formatTime = (remainingTime) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    let timer = null;
    if (time === 0) {
      setTime(initialTime);
      resetShot();
    }
    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [time]);

  return <div>{timerValue > 0 && <h2>Timer: {formatTime(time)}</h2>}</div>;
};

const ShotAccordion = ({minScore, includeDistance, includeTime, testtype, timed, activePanel, totalShots, sendDataToLevel }) => {
  return (
    <Collapse accordion>
      {Array.from({ length: totalShots }).map((_, index) => (
        <Panel
          className="shot-panel"
          header={`Shot ${index + 1}`}
          key={index}
          style={{
            backgroundColor: "yellow",
          }}
        >
          {timed > 0 && <Timer timerValue={timed} />}
          <ShotForm minScore={minScore}includeDistance={includeDistance}
                      includeTime={includeTime} testtype={testtype}index={index + 1} totalShots={totalShots}/>
        </Panel>
      ))}
    </Collapse>
  );
};

const { Option } = Select;
const ShotForm = ({minScore,includeDistance, includeTime , testtype,index, onFormSubmit , totalShots }) => {

 
  

 

  return (
    <Form
    name="shot_form"
   
    autoComplete="off"
    initialValues={{
      shotMade: "no",
      correctShotShape: "no",
      score: "",
      distance: { feet: "", inches: "" },
    }}
    labelCol={{ span: 24 }} // Labels take full width
    wrapperCol={{ span: 24 }} // Input elements take full width
  >
    <Form.Item
      name="shotMade"
      label="Did you make a shot?"
      rules={[
        {
          validator: (rule, value) => {
            if (!value) {
              return Promise.reject(
                "Please select an option for making a shot."
              );
            } else {
              return Promise.resolve();
            }
          },
        },
      ]}
    >
      <Button.Group required="true" className="custom-button-group">
        <Button
          value="yes"
          className="green-button"
          style={{
            background: "green" ,
            color: "black",
          }}
        
        >
          Yes
        </Button>
        <Button
          value="no"
          className="red-button"
          style={{
            background: "red" ,
            color: "black",
          }}
         
        >
          No
        </Button>
      </Button.Group>
    </Form.Item>

    {includeDistance && (
      <Form.Item label="Distance to the pin">
        <div className="inch-feet-container">
          <Form.Item name={["distance", "feet"]} noStyle>
            <InputNumber
              required={true}
              placeholder="Feet"
              style={{ width: "100%" }}
              min={0}
              step={1}
            />
          </Form.Item>

          <Form.Item name={["distance", "inches"]} noStyle>
            <InputNumber
              required={true}
              placeholder="Inches"
              style={{ width: "100%" }}
              min={0}
              max={12}
              step={1}
            />
          </Form.Item>
        </div>
      </Form.Item>
    )}

    {includeTime && (
      <Form.Item name="correctShotShape" label="Correct shot shape?">
        <Button.Group required="true" className="custom-button-group">
          <Button
            value="yes"
            className="green-button"
            style={{
              background: "green" ,
              color: "black",
            }}
           
          >
            Yes
          </Button>
          <Button
            value="no"
            className="red-button"
            style={{
              background: "red" ,
              color: "black",
            }}
            
          >
            No
          </Button>
        </Button.Group>
      </Form.Item>
    )}

    {testtype === "sp" && index === totalShots  && (
      <>
        <Form.Item name="tendency" label="Tendency">
          <InputNumber
            required={true}
            placeholder="Tendency"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="timing" label="Timing">
          <InputNumber
            required={true}
            placeholder="Timing"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="consistency" label="Consistency">
          <InputNumber
            required={true}
            placeholder="Consistency" 
            style={{ width: "100%" }}
          />
        </Form.Item>
      </>
    )}

    {(testtype === "sp" || testtype === "tc") &&
      index === totalShots &&
       (
        <Form.Item name="score" label={"Overall Score"}>
          <InputNumber
         
            required={false}
            placeholder={"Enter Score"}
            style={{ width: "100%" }}
          />
        </Form.Item>
      )}
    {testtype !== "Putting" &&
      testtype !== "sp" &&
      testtype !== "tc" &&
       index === totalShots &&
       (
        <Form.Item
          name="score"
          label={"Overall Score"}
         
        >
          <InputNumber
                      required={false}
            placeholder={"Enter Score"}
            style={{ width: "100%" }}
          />
        </Form.Item>
      )}
    <Form.Item>
      <button type="submit" className="button-submit">
        SUBMIT
      </button>
    </Form.Item>
  </Form>
  );
};
export default ViewAthleteTest;
