import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
const PersonalRefrences = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="card mb-4">
      <div
        className="card-header d-flex"
        style={{
          justifyContent: "space-between",
          color: "greenyellow",
         
          backgroundColor: "black",

          
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
        onClick={toggleCollapse}
      >
        <h2 style={{fontSize:'25px'}}>Personal References</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </div>
      <div className={`card-body ${isCollapsed ? "collapse" : ""}`}>
        {data.personalRefrences?.map((personalRefrences, index) => (
          <>
            <div
              className="row"
              style={{
                backgroundColor: index % 2 === 0 ? "white" : "rgb(96 211 109 / 50%)",
                height: '50px'
              }}
              key={index}
            >
              <div className="col">
                <p className="font-weight-bold">{personalRefrences}</p>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default PersonalRefrences;
