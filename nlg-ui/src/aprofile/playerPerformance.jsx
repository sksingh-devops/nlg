import React from "react";
import "./playerPerformance.css";
import { Card } from "antd";
import toastr from "toastr";
import axios from "axios";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { useEffect } from "react";
import { useState } from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;
const PlayerPerformance = ({ email, name }) => {
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
  const [data, setData] = useState();
  useEffect(() => {
    fetchData();
  }, []);
  // async function fetchData() {
  //     try {
  //       toastr.clear();
  //       let userAPI = `${getBaseUrl()}/rank-current-user/${email}`;
  //       const response = await axios.get(userAPI, {
  //       });
  //       setData(response.data);
  //     } catch (error) {
  //       console.log(error);
  //       toastr.options = {
  //         positionClass: "toast-top-full-width",
  //         hideDuration: 300,
  //         timeOut: 60000,
  //       };
  //       toastr.clear();
  //       toastr.error(`User Data Not Found`);
  //     }
  //   }
  async function fetchData() {
    try {
      toastr.clear();
      let userAPI = `${getBaseUrl()}/athlete-performancehola/${email}`;
      console.log("heeer", userAPI);
      const response = await axios.get(userAPI, {});
      setData(response.data);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`User Data Not Found`);
    }
  }
  const tahtstyle = {
    color: "#256208",
    fontFamily: `"Roboto-Bold", Helvetica"`,
    fontSize: "40px",
    fontWeight: 700,
  };

  return (
    <div className="container">
      <div>
      <span style={tahtstyle}>Test Taken</span>
      </div>
      <div className="performcance-cardContainer">
     

        {/* {data?.map((test, index)=>( <Card
            key={index}
                bordered={false}
                style={{
                    marginLeft:'10px',
                  width: 300,
                  height: "auto",
                  textAlign: "left",
                  background: "#282525",
                  boxShadow: "0px 4px 19px 0px #000",
                }}
              >
              
                <p className="card-aws-date">{GolfOptions[test._id]}</p>
                <p className="card-aws-description">Best Score     {test.bestScore}</p>
                <p className="card-aws-description">Average Score     {test.averageScore}</p>
                <p className="card-aws-description">Latest Score     {test.latestScore}</p>
                <p className="card-aws-description"># Levels     {test.totalEntries}</p>
               
                  </Card>))} */}
        <Collapse accordion>
          {data?.map((test, index) => (
            <Panel
              className="performanceHeader"
              style={{ backgroundColor: "black", color: "white" }}
              key={index}
              header={`${test.testName} - Total Levels: ${test.totalLevels} - Completed Levels: ${test.details?.length}`}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={{
                  display: "flex",
                  // flexDirection: "column",
                  gap: "20px",
                }} >
                <span
                  className="badge badge-pill badge-dark p-2"
                  style={{ fontSize: "12px" }}
                >
                  {GolfOptions[test.testtype]}
                </span>
               {test.maxThreshold &&  <span
                  className="badge badge-pill badge-dark p-2"
                  style={{ fontSize: "12px" }}
                >
                  Strokes Gained
                </span>}
                </div>
                {test.details?.map((level, levelIndex) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                    key={levelIndex}
                  >
                    <p
                      style={{ fontWeight: "bold", fontSize: "20px" }}
                    >{`Level ${levelIndex + 1}`}</p>
                
               
                    <p>
                    <span style={{ fontWeight: "bold" }}> { `Shots Passed for threshold ` }</span>
                       {` ${level.minScore|| '  :  ' }`} {" "} <span style={{ fontWeight: "bold" }}>Score</span>
                      {` ${level.totalshotTaken || "-"}`}
                    </p>
                    <p>
                          <span style={{ fontWeight: "bold" }}>
                            Threshold :{" "}
                          </span>
                          {level.minScore|| '  :  ' }
                        </p>
                    <p>
                          <span style={{ fontWeight: "bold" }}>
                            Shots Taken (yes):{" "}
                          </span>
                          {` ${level.totalshotTaken || "-"}`}
                        </p>

                        { 
                           <p>
                           <span style={{ fontWeight: "bold" }}>
                             Shots Taken (No):{" "}
                           </span>
                           { (level.totalShots !== undefined || level.totalshotTaken !== undefined ) &&level.totalshotTaken>0 ?` ${level.totalShots - level.totalshotTaken }`:"-"}
                         </p>
                        }
                    {level?.attempts > 1 &&<p>
                          <span style={{ fontWeight: "bold" }}>
                            Attempts:{" "}
                          </span>
                          {` ${level.attempts || "-"}`}
                        </p>}
                        {test.includeTime &&<p>
                          <span style={{ fontWeight: "bold" }}>
                            Correct Shape Taken:{" "}
                          </span>
                          {level.correctshapeTaken !== undefined && level.correctshapeTaken !== null
      ? ` ${level.correctshapeTaken}`
      : "-"}

                        </p>}

                    <p>
                      {" "}
                      <span style={{ fontWeight: "bold" }}>Total Shots: </span>
                      {` ${level.totalShots}`}
                    </p>
                    {test.testtype !== "Putting" && (
                      <p>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Overall Score: </span>
                        {`  ${level.totalScore}`}
                      </p>
                    )}
                    {test.testtype == "sp" && (
                      <>
                        <p>
                          {" "}
                          <span style={{ fontWeight: "bold" }}>Tendency: </span>
                          {` ${level.tendency !== undefined && level.tendency !== null ? level.tendency : "-"}`}
                        </p>
                        <p>
                          {" "}
                          <span style={{ fontWeight: "bold" }}>Timing: </span>
                          {` ${level.timing !== undefined && level.timing !== null ? level.timing : "-"}`}

                        </p>
                        <p>
                          <span style={{ fontWeight: "bold" }}>
                            Consistency:{" "}
                          </span>
                          {` ${level.consistency !== undefined && level.consistency !== null ? level.consistency : "-"}`}

                        </p>
                      </>
                    )}

                    {/* Add other level details here */}
                    <div style={{ border: "1px solid black" }}></div>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default PlayerPerformance;
