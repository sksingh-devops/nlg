import React from 'react'

const HighSchoolPlaying = ({data}) => {
  return (
    <div className="card mb-4">
    <div className="card-header d-flex"
        style={{
          justifyContent: "space-between",
          color: "greenyellow",
          
          backgroundColor: "black",
          fontSize: "20px",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
      <h2 style={{fontSize:'25px'}}>High School Playing Experience</h2>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col-md-3">
          <p className="mb-0 font-weight-bold">{data?.highSchoolPlayingExperience}</p>
        </div>
        <div className="col-md-9">
          <p className="text-muted mb-0 font-weight-bold">{data?.highSchoolYearExperience?.join(" - ")}</p>
        </div>
      </div>
     
    
     
     
    </div>
  </div>
  )
}

export default HighSchoolPlaying
