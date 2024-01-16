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
  Slider,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "./athletetest.css";
import { useNavigate, useParams } from "react-router";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { act } from "react-dom/test-utils";

const baseUrl = getBaseUrl();
const testEndPoint = `${baseUrl}/tests`;
const levelScoreEndPoint = `${baseUrl}/update-score`;
const levelNotificationEndPoint = `${baseUrl}/level/allAdminNotification`;

const { Panel } = Collapse;

const AthleteTest = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  async function fetchData(id) {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(`${testEndPoint}/${id}`, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      setData(res.test);
      if (res.testResult.levelScore) {
        setActivekey([(res.testResult.levelScore.length + 1).toString()]);
      }
      setStartShotKey(["-1"]);
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
    sp: "Sam Puttlab",
    SpeedTest: "Speed Test",
    StrengthTraining: "Strength Training",
    Tournaments: "Tournaments",
    tc: "Trackman Combine",
  };
  useEffect(() => {
    fetchData(id);
    localStorage.setItem("attempt", 1);
  }, []);

  const [levelFormData, setLevelFormData] = useState();
  const [activeKey, setActivekey] = useState(["1"]);
  const [startShotKey, setStartShotKey] = useState([]);
  const [isChildFail, setIsChildFail] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const startchallengeHandler = () => {
    setStartShotKey(["0"]);
  };

  const sendDataToLevel = (
    value,
    index,
    levelId,
    minScore,
    totalShots,
    maxThreshold,
    minShots
  ) => {
    setLevelFormData({ level: index, value: value });

    const score = averageOfLevelTest(
      index,
      value,
      levelId,
      minScore,
      attempt,
      totalShots,
      maxThreshold,
      minShots
    );
  };

  const averageOfLevelTest = (
    index,
    value,
    levelId,
    minScore,
    attempt,
    totalShots,
    maxThreshold,
    minShots
  ) => {
    if (!value?.length) {
      return;
    }
    let averageScore = 0;
    let averagedistanceInches = 0;
    let averagedistanceFeet = 0;
    let totalScore = 0;
    let totaldistanceInches = 0;
    let totaldistanceFeet = 0;
    let totalshotTaken = 0;
    let correctshapeTaken = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i]?.fdata?.score) totalScore += value[i]?.fdata?.score;
      if (value[i]?.fdata?.distance?.inches)  totaldistanceInches += value[i].fdata.distance?.inches;
      if (value[i]?.fdata?.distance?.feet)  totaldistanceFeet += value[i].fdata.distance?.feet;
      if (value[i]?.fdata?.shotsTaken)  totalshotTaken += value[i].fdata?.shotsTaken;
      if (value[i]?.fdata?.correctshapeTaken)  correctshapeTaken += value[i].fdata?.correctshapeTaken;
    }
    totalScore = totalScore || 0;
    //  totalScore = value[index]?.fdata?.score || 0;

    if (data.testtype === "Putting") {
      if (totalshotTaken >= minShots) {
        levelScoreSubmit(
          maxThreshold,
          totalshotTaken,
          levelId,
          index - 1,
          totalScore,
          averagedistanceFeet,
          averagedistanceInches,
          data.testtype,
          0,
          0,
          0,
          correctshapeTaken,
          attempt
        );

        const nextActiveKey = index + 1;
        setActivekey([nextActiveKey.toString()]);
        setAttempt(1);
        setStartShotKey(["-1"]);
      } else {
        toastr.error(
          `You failed , you didn't pass the minimun shots ${minShots} ,  ${
            3 - attempt
          } attempt remaining`
        );

        setAttempt(attempt + 1);
        if (attempt == 3) {
          if (index == 1) {
            const nextActiveKey = index;
            setActivekey([nextActiveKey.toString()]);
          } else {
            const nextActiveKey = index - 1;
            setActivekey([nextActiveKey.toString()]);
          }
          setAttempt(1);
        }
        setIsChildFail(true);
      }
      return totalScore;
    } else if (data.testtype === "sp" || data.testtype === "tc") {
      if (totalScore >= minScore) {
        if (data.testtype === "sp") {
          const tendency = value[value.length - 1]?.fdata?.tendency;
          const timing = value[value.length - 1]?.fdata?.timing;
          const consistency = value[value.length - 1]?.fdata?.consistency;
          levelScoreSubmit(
            maxThreshold,
            totalshotTaken,
            levelId,
            index - 1,
            totalScore,
            averagedistanceFeet,
            averagedistanceInches,
            data.testtype,
            tendency,
            timing,
            consistency,
            correctshapeTaken,
            attempt
          );
        } else {
          levelScoreSubmit(
            maxThreshold,
            totalshotTaken,
            levelId,
            index - 1,
            totalScore,
            averagedistanceFeet,
            averagedistanceInches,
            data.testtype,
            0,
            0,
            0,
            correctshapeTaken,
            attempt
          );
        }

        const nextActiveKey = index + 1;
        setActivekey([nextActiveKey.toString()]);
        setAttempt(1);
        setStartShotKey(["-1"]);
      } else {
        toastr.error(
          `You Failed, you didn't clear the threshold ${minScore} ,  ${
            3 - attempt
          } attempt remaining`
        );

        setAttempt(attempt + 1);
        if (attempt == 3) {
          if (index == 1) {
            const nextActiveKey = index;
            setActivekey([nextActiveKey.toString()]);
          } else {
            const nextActiveKey = index - 1;
            setActivekey([nextActiveKey.toString()]);
          }
          setAttempt(1);
        }
        setIsChildFail(true);
      }
      return totalScore;
    } else {
      if (totalshotTaken >= minShots) {
        averageScore = totalScore;
        averagedistanceFeet = totaldistanceFeet;
        averagedistanceInches = totaldistanceInches;

        levelScoreSubmit(
          maxThreshold,
          totalshotTaken,
          levelId,
          index - 1,
          averageScore,
          averagedistanceFeet,
          averagedistanceInches,
          data.testtype,
          0,
          0,
          0,
          correctshapeTaken,
          attempt
        );
        const nextActiveKey = index + 1;
        setActivekey([nextActiveKey.toString()]);
        setAttempt(1);
        setStartShotKey(["-1"]);
      } else {
        toastr.error(
          `You Failed, you didn't clear the minimum Shots ${minShots} ,  ${
            3 - attempt
          } attempt remaining`
        );

        setAttempt(attempt + 1);
        if (attempt == 3) {
          if (index == 1) {
            const nextActiveKey = index;
            setActivekey([nextActiveKey.toString()]);
          } else {
            const nextActiveKey = index - 1;
            setActivekey([nextActiveKey.toString()]);
          }
          setAttempt(1);
        }
        setIsChildFail(true);
      }
      return averageScore;
    }
  };
  const levelScoreSubmit = async (
    maxThreshold,
    totalshotTaken,
    levelId,
    level,
    score,
    distanceInFeet,
    distanceInInches,
    testtype,
    tendency,
    timing,
    consistency,
    correctshapeTaken,
    attempt
  ) => {
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      // console.log("shappe and attempt",correctshapeTaken,attempt)
      const endPoint = `${levelScoreEndPoint}/${id}/${levelId}`;
      await axios.put(
        endPoint,
        {
          level,
          score,
          distanceInFeet,
          distanceInInches,
          testtype,
          tendency,
          timing,
          consistency,
          totalshotTaken,
          maxThreshold,
          correctshapeTaken,
          attempt,
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
    <>
      <Navbar userdata={props.userdata} />
      {!data && (
        <div className="alertDivClass">
          {" "}
          <Alert
            message="Loading Test"
            description="Test will appear here once it loads"
            type="warning"
            showIcon
          />
        </div>
      )}
      {data && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="collapseContainer">
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
                <Collapse
                  accordion
                  activeKey={activeKey}
                  className="level-accordion"
                >
                  <Panel
                    header={`LEVEL ${index + 1}`}
                    key={index + 1}
                    className={
                      index + 1 < parseInt(activeKey)
                        ? `level-panel-disable`
                        : `level-panel`
                    }
                  >
                    <div>
                      <p className="instructions">INSTRUCTIONS</p>
                      <p className="instructions-content">
                        {level.instruction}
                      </p>
                      {GolfOptions[data.testtype] === "Putting" && (
                        <p
                          className="instructions-content"
                          style={{ marginTop: "0px" }}
                        >
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            Threshold -{" "}
                          </span>{" "}
                          {level?.minScore}
                        </p>
                      )}
                      {GolfOptions[data.testtype] !== "Putting" && (
                        <p
                          className="instructions-content"
                          style={{ marginTop: "0px" }}
                        >
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            Threshold -{" "}
                          </span>{" "}
                          {level?.minScore}
                        </p>
                      )}
                       <p
                          className="instructions-content"
                          style={{ marginTop: "0px" }}
                        >
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            Minimum Shots -{" "}
                          </span>{" "}
                          {level?.minShots}
                        </p>
                      <hr />
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn startChallengeButton"
                          onClick={startchallengeHandler}
                        >
                          Start Challenge
                        </button>
                      </div>
                      <ShotAccordion
                        isChildFail={isChildFail}
                        minScore={level.minScore}
                        includeDistance={data.includeDistance}
                        includeTime={data.includeTime} //include time means shot shape
                        testtype={data.testtype}
                        timed={data.timed || 0}
                        activePanel={startShotKey}
                        totalShots={level.totalShots}
                        sendDataToLevel={(value) =>
                          sendDataToLevel(
                            value,
                            index + 1,
                            level._id,
                            level?.minScore,
                            level?.totalShots,
                            data?.isMaxthreshold,
                            level?.minShots
                          )
                        }
                      />
                    </div>
                  </Panel>
                </Collapse>
              </>
            ))}
          </div>
        </div>
      )}

      {activeKey > data?.levels?.length && (
        <Alert
          message="Test Completed"
          description={
            <>
              <span>
                This Test has completed. Click{" "}
                <a style={{ display: "inline", color: "blue" }} href="/leader">
                  here
                </a>{" "}
                to visit the leaderboard.
              </span>

              <p>
                Take Another{" "}
                <a style={{ display: "inline", color: "blue" }} href="/session">
                  {" "}
                  Test
                </a>
              </p>
            </>
          }
          type="success"
          showIcon
        />
      )}
      <Footer />
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

const ShotAccordion = ({
  minScore,
  includeDistance,
  includeTime,
  testtype,
  timed,
  activePanel,
  totalShots,
  sendDataToLevel,
}) => {
  const [activeKey, setActiveKey] = useState(activePanel);
  const resetShot = () => {
    setActiveKey(["0"]);
  };

  const [formDataFromChild, setFormDataFromChild] = useState([]);

  const handleFormSubmit = (formData) => {
    setFormDataFromChild((prevData) => [...prevData, formData]);
    const nextActiveKey = parseInt(activeKey[0]) + 1;
    setActiveKey([nextActiveKey.toString()]);
  };
  useEffect(() => {
    if (parseInt(activeKey[0]) === totalShots) {
      sendDataToLevel(formDataFromChild);
      setFormDataFromChild([]);
    }
  }, [formDataFromChild]);
  useEffect(() => {
    setActiveKey(activePanel);
  }, [activePanel]);
  return (
    <Collapse accordion activeKey={activeKey}>
      {Array.from({ length: totalShots }).map((_, index) => (
        <Panel
          className="shot-panel"
          header={`Shot ${index + 1}`}
          key={index}
          style={{
            backgroundColor: activeKey[0] == index ? "yellow" : "grey",
          }}
        >
          {timed > 0 && <Timer timerValue={timed} resetShot={resetShot} />}
          <ShotForm
            minScore={minScore}
            includeDistance={includeDistance}
            includeTime={includeTime}
            testtype={testtype}
            index={index + 1}
            onFormSubmit={handleFormSubmit}
            totalShots={totalShots}
          />
        </Panel>
      ))}
    </Collapse>
  );
};

const { Option } = Select;
const ShotForm = ({
  minScore,
  includeDistance,
  includeTime,
  testtype,
  index,
  onFormSubmit,
  totalShots,
}) => {
  const [formData, setFormData] = useState({ shot: index, fdata: {} });
  const [yesShotMadeOpacity, setyesShotMadeOpacity] = useState(0.5);
  const [noShotMadeOpacity, setnoShotMadeOpacity] = useState(0.5);
  const [yesCorrectShapeOpacity, setyesCorrectShapeOpacity] = useState(0.5);
  const [noCorrectShapeOpacity, setnoCorrectShapeOpacity] = useState(0.5);
  const [isAnyButtonClicked, setIsAnyButtonClicked] = useState(false);
  const [isScoreVisible, setIsScoreVisible] = useState(false);
  const onFinish = (values) => {
    const { score, distance, consistency, tendency, timing } = values;

    setFormData({
      ...formData,
      fdata: {
        ...formData.fdata,
        score: score,
        distance: distance,
        consistency: consistency,
        tendency: tendency,
        timing: timing,
      },
    });
    if (testtype === "Putting") {
      onFormSubmit({
        ...formData,
        fdata: {
          ...formData.fdata,
          distance: distance,
          consistency: consistency,
          tendency: tendency,
          timing: timing,
        },
      });
    } else {
      onFormSubmit({
        ...formData,
        fdata: {
          ...formData.fdata,
          score: score,
          distance: distance,
          consistency: consistency,
          tendency: tendency,
          timing: timing,
        },
      });
    }
  };

  const handleShotMadeClick = (value) => {
    let score;
    if (value === "yes") {
      score = 1;
    } else {
      score = 0;
    }
    setIsScoreVisible(true);
    setFormData({
      ...formData,
      fdata: {
        ...formData.fdata,
        score: score,
        shotsTaken: score,
        shotMade: value,
      },
    });
    if (value === "yes") {
      setyesShotMadeOpacity(1);
      setnoShotMadeOpacity(0.5);
    } else {
      setnoShotMadeOpacity(1);
      setyesShotMadeOpacity(0.5);
    }
    setIsAnyButtonClicked(true);
  };

  const handleCorrectShotShapeClick = (value) => {
    let score;
    if (value === "yes") {
      score = 1;
    } else {
      score = 0;
    }
    setFormData({
      ...formData,
      fdata: {
        ...formData.fdata,
        correctShotShape: value,
        correctshapeTaken: score,
      },
    });
    if (value === "yes") {
      setyesCorrectShapeOpacity(1);
      setnoCorrectShapeOpacity(0.5);
    } else {
      setnoCorrectShapeOpacity(1);
      setyesCorrectShapeOpacity(0.5);
    }
    setIsAnyButtonClicked(true);
  };

  return (
    <Form
      name="shot_form"
      onFinish={onFinish}
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
              background: yesShotMadeOpacity === 1 ? "green" : "white",
              color: "black",
            }}
            onClick={() => handleShotMadeClick("yes")}
          >
            Yes
          </Button>
          <Button
            value="no"
            className="red-button"
            style={{
              background: noShotMadeOpacity === 1 ? "red" : "white",
              color: "black",
            }}
            onClick={() => handleShotMadeClick("no")}
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
                background: yesCorrectShapeOpacity === 1 ? "green" : "white",
                color: "black",
              }}
              onClick={() => handleCorrectShotShapeClick("yes")}
            >
              Yes
            </Button>
            <Button
              value="no"
              className="red-button"
              style={{
                background: noCorrectShapeOpacity === 1 ? "red" : "white",
                color: "black",
              }}
              onClick={() => handleCorrectShotShapeClick("no")}
            >
              No
            </Button>
          </Button.Group>
        </Form.Item>
      )}

      {testtype === "sp" && index === totalShots && isScoreVisible && (
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
        isScoreVisible && (
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
        isScoreVisible && (
          <Form.Item name="score" label={"Overall Score"}>
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
export default AthleteTest;
