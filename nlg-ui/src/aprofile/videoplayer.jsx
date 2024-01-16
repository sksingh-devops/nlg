import React, { useEffect, useState } from "react";
import { BsPlusCircleDotted } from "react-icons/bs";
import AddVideoModal from "./addvideo";
import toastr from "toastr";
import axios from "axios";
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import { DeleteOutlined } from "@ant-design/icons";
import { Empty } from "antd";
const VideoPlayer = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videos, setVideos] = useState([]); // State to store the added videos

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  async function fetchData() {
    try {
      toastr.clear();
      let userAPI = `${getBaseUrl()}/videos/${email}`;
      const response = await axios.get(userAPI, {});
      setVideos(response.data);
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

  const handleCreate = async (values) => {
    // Create a new video object with the provided title and videoFile
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("videoFile", values.video[0].originFileObj);
    // API
    const endpoint = `${getBaseUrl()}/add-video`;
    try {
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(endpoint, formData, {
        headers: {
          authorization: storedToken,
        },
      });

      toastr.success(response.data?.message || "Done");
      fetchData();
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    }
    setIsModalVisible(false);
  };
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isReadOnly, email } = props;
  const handleVideoSelect = (videoUrl, title) => {
    setSelectedVideo({
      path: `${getBaseUrl()}/${videoUrl}`,
      title: title,
    });
  };

  const thumbnailStyle = {
    cursor: "pointer",
    padding: "5px", // Smaller padding for the thumbnail
    border: "1px solid #ddd", // Add a border
    transition: "background-color 0.3s ease-in-out",
  };

  const selectedVideoStyle = {
    padding: "20px",
   
    textAlign: "center",
  };

  const videoStyle = {
    display: "block",
    margin: "0 auto",
    maxWidth: "100%",

    height: "auto",
    maxHeight:'400px',
};

  const thumbnailPlaceholderStyle = {
    backgroundColor: "rgba(0, 0, 0, .9)",
    width: "100%",
    height: "auto",
    paddingTop: "56.25%",
    position: "relative",
  };
  const tahtstyle = {
    color: "#256208",
    fontFamily: `"Roboto-Bold", Helvetica"`,
    fontSize: "40px",
    fontWeight: 700,
  };
  const deleteVideo = (id) => {
    const storedToken = localStorage.getItem("token");
    const endpoint = `${getBaseUrl()}/videos/delete/${id}`;
    axios
      .delete(endpoint, {
        headers: {
          authorization: storedToken,
        },
      })
      .then((response) => {
        toastr.success(response.data?.message || "VIDEO REMVOED");
        fetchData();
      })
      .catch((error) => {
        toastr.error(error?.response?.data?.message || "Something went wrong");
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    // Whenever selectedVideo changes, the video element will be re-rendered
  }, [selectedVideo]);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span style={tahtstyle}>VIDEOS</span>
          {!isReadOnly && (
            <BsPlusCircleDotted
              onClick={() => {
                showModal();
              }}
              style={{
                fontSize: "32px",
                verticalAlign: "text-bottom",
                marginLeft: "10px",
              }}
            />
          )}
          {!isReadOnly && (
            <AddVideoModal
              visible={isModalVisible}
              onCreate={handleCreate}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 col-sm-12">
          {videos?.length === 0 && (
            <Empty
              style={{
                textAlign: "left",
              }}
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={<span>No Videos Added</span>}
            ></Empty>
          )}

          {videos?.length > 0 && (
            <div
              className="selected-video"
              style={selectedVideoStyle}
              key={selectedVideo?.title}
            >
              {selectedVideo && selectedVideo?.path && (
                <div>
                  <video
                    controls
                    width="100%"
                    height="auto"

                    style={videoStyle}
                    key={selectedVideo.path}
                  >
                    <source src={selectedVideo.path} />
                    Your browser does not support the video tag.
                  </video>
                  <span
                    style={{
                      marginTop: "10px",
                      display: "block",
                      textAlign: "left",

                      color: "#000000",
                      fontFamily: '"Roboto-Bold", Helvetica',
                      fontSize: "30px",
                      fontWeight: 600,
                    }}
                  >
                    {selectedVideo?.title}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {videos?.length > 0 && (
          <div className="col-md-4 col-sm-12">
            <div
              className="video-selector"
              style={{
                maxHeight: "420px",
                overflowY: "auto",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            >
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="video-thumbnail"
                  style={thumbnailStyle}
                  onClick={() => handleVideoSelect(video.path, video.title)}
                >
               
                  <div style={thumbnailPlaceholderStyle}>
                  <svg
                    style={{
                        color: "white",
                        fontSize: "24px",
                        cursor: "pointer",
                        position: "absolute",
                        top: '23%',
                        left: '40%',
                        zIndex: 1000,
                      }}
                   
                    preserveAspectRatio="xMidYMid meet"
                    data-bbox="10 10 62 62"
                    viewBox="0 0 82 82"
                    height="82"
                    width="82"
                    xmlns="http://www.w3.org/2000/svg"
                    data-type="color"
                    role="presentation"
                    aria-hidden="true"
                    aria-label=""
                  >
                    <defs>
                      <style>
                        #comp-laliukg4 svg [data-color="1"] #comp-laliukg4 svg
                        [data-color="2"]{" "}
                      </style>
                    </defs>
                    <g>
                      <path
                        d="M41 10c-17.121 0-31 13.879-31 31 0 17.121 13.879 31 31 31 17.121 0 31-13.879 31-31 0-17.121-13.879-31-31-31zm2.008 35.268l-7.531 4.268V32.465l7.531 4.268L50.539 41l-7.531 4.268z"
                        fill="white"
                        data-color="1"
                      ></path>
                    </g>
                  </svg>
                    {!isReadOnly && (
                      <DeleteOutlined
                        onClick={() => {
                          deleteVideo(video._id);
                        }}
                        title="Delete"
                        size={32}
                        style={{
                          color: "red",
                          fontSize: "24px",
                          cursor: "pointer",
                          position: "absolute",
                          bottom: "6px",
                          right: "4px",
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="video-selected-title"
                    style={{
                      display: "block",
                      textAlign: "left",
                      color: "#000000",
                      fontFamily: '"Roboto-Bold", Helvetica',
                      fontSize: "14px",
                      marginTop: "5px",
                    }}
                  >
                    {video?.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
