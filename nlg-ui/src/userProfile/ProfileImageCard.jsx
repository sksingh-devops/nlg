import React, { useRef, useState, useEffect } from "react";
import { FaGlobe, FaLinkedinIn } from "react-icons/fa";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import axios from "axios";
import toastr from "toastr";
import { Button } from "antd";
const baseUrl = getBaseUrl();
const ImageEndpoint = `${baseUrl}/profile/image`;
const ProfileImageCard = ( {data} ) => {
  const [imageData, setImageData] = useState(data.profilePicture);
  useEffect(() => {
    setImageData(data.profilePicture);
  }, [data.profilePicture]);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const storedToken = localStorage.getItem("token");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result
      try {
        // Send base64 data to the Express.js API
        await axios.post(
          ImageEndpoint,
          { pic: base64Data },
          {
            headers: {
              authorization: storedToken,
            },
          }
        );
        toastr.success("Profile Picture Uploaded");
        setImageData(base64Data);
      } catch (error) {
        console.error(error);
        toastr.clear();
        toastr.error(`Image Not Uploaded`);
      }finally{
        fileInputRef.current.value = null;
      }
    };

    reader.readAsDataURL(file);
  };
  return (
    <div className="card mb-4">
      <div className="card-body text-center">
        <div  >
          {!imageData && (<>
            <img
              src= {data.profilePictureLink || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"}
              alt="Upload"
              className="rounded-circle img-fluid"
              style={{ width: "150px" }}
            />
            </>
          )}
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            max="5000000"
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {imageData && (
            <div>
              <img
                src={imageData}
                alt="Uploaded"
                className=" img-fluid"
                style={{ width: "150px" }}
              />
              
            </div>
          )}
        </div>
            <Button style={{fontSize:'10px', marginTop:'10px'}} onClick={handleImageClick}>Change Picture</Button>
        <h5 className="my-3">{data.name}</h5>
        <span style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <FaGlobe style={{ marginTop: "5px", color: "orange" }} />
          <p className="text-muted mb-1">
            <a href={data.businessUrl} target="_blank" rel="noreferrer">
              {data.businessUrl}
            </a>
          </p>
        </span>
        <span style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <FaLinkedinIn style={{ marginTop: "5px", color: "blue" }} />
          <p className="text-muted mb-1">
            <a href={data.linkedUrl} target="_blank" rel="noreferrer">
              {data.linkedUrl}
            </a>
          </p>
        </span>
      </div>
    </div>
  );
};

export default ProfileImageCard;
