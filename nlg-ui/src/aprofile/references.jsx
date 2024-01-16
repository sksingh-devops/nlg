import React, { useState } from 'react';
import "react-quill/dist/quill.snow.css";
const References = (props) => {
  const {content} = props 
  const tahtstyle = {
    color: '#256208',
    fontFamily: `"Roboto-Bold", Helvetica"`,
    fontSize: "40px",
    fontWeight: 700,
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span style={tahtstyle}>REFERENCES</span>
        </div>
      </div>
      <div className="row">
        <div className="quill-container ">
        <div className="col-md-12">
          <div
            style={{ marginTop: "10px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default References;
