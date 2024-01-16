import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
const PersonalInfo = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        <h2 style={{ fontSize: '25px' }}>Personal Information</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </div>
      <div className={`card-body ${isCollapsed ? "collapse" : ""}`}>
        <div className="row" style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Full Name</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.name}</p>
          </div>
        </div>
        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Phone</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data?.phone}</p>
          </div>
        </div>
        

        <div
          className="row"
          style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}
        >
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Birth Date</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.birthDate}</p>
          </div>
        </div>

        <div
          className="row"
          style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}
        >
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Graduation Date</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.graduationDate}</p>
          </div>
        </div>

        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Email</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.email}</p>
          </div>
        </div>

        <div
          className="row"
          style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}
        >
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Business URL</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.businessUrl}</p>
          </div>
        </div>

        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Linkedin URL</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.linkedUrl}</p>
          </div>
        </div>

        <div
          className="row"
          style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}
        >
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Role</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.role}</p>
          </div>
        </div>

        <div className="row" style={{ height: "50px" }}>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Height</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.height}</p>
          </div>
        </div>

        <div
          className="row"
          style={{ backgroundColor: "rgb(96 211 109 / 50%)", height: "50px" }}
        >
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center font-weight-bold">Weight</p>
          </div>
          <div className="col-sm-5 d-flex align-items-center">
            <p className="mb-0 text-center">{data.weight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
