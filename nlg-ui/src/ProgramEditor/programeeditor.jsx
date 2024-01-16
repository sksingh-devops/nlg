import { Button, Input } from "antd";
import React, { useState, useEffect } from "react";
import { logPageView } from "../analytics";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import { getBaseUrl } from "../config/apiconfig";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import LoadingScreen from "../Loading/loading";
const baseUrl = getBaseUrl()
const programDataEndPoint = `${baseUrl}/programs`;

const Programeeditor = (props) => {
  const navigate = useNavigate();
  const [headingBKGColor, setheadingBKGColor] = useState("#000000");
  const [fontColor, setFontColor] = useState("#000000");
  const headingBKGColorHandler = (event) => {
    const newColor = event.target.value;
    setheadingBKGColor(newColor);
    setProgramData({
      ...programData,

      css: {
        ...programData.css,
        backgroundColor: newColor,
      },
    });
  };
  const [buttonBKGColor, setbuttonBKGColor] = useState("#000000");
  const buttonBKGColorHandler = (event) => {
    const newColor = event.target.value;
    setbuttonBKGColor(newColor);
    setProgramData({
      ...programData,

      css: {
        ...programData.css,
        buttonBackgroundColor: newColor,
      },
    });
  };
  const [heading, setheading] = useState("");
  const [content, setContent] = useState("");
  const [buttonDetails, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [programDataLoaded, setprogramDataLoaded] = useState(false);
  const { id } = useParams();
  var isNew = false;
  const [programData, setProgramData] = useState({});
  if (id == "nlg" || id == "junior") {
    isNew = true;
  }
  async function fetchData(id) {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(`${programDataEndPoint}/${id}`, {
        headers: {
          authorization: storedToken,
        },
      });

      const res = response.data;
      setProgramData(res);
      setheading(res.heading);
      setButtonText(res.buttonDetails);
      setContent(res.content);
      setFontColor(res.css?.color);
      setheadingBKGColor(res.css?.backgroundColor);
      setbuttonBKGColor(res.css?.buttonBackgroundColor);
      setButtonLink(res.buttonLink);
      setprogramDataLoaded(true);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Programs Not Found`);
    }
  }

  useEffect(() => {
    logPageView();
    fetchData(id);
  }, []);

  async function UpdateProgram() {
    try {
      var response;
      toastr.clear();
      const storedToken = localStorage.getItem("token");
      if (isNew) {
        response = await axios.post(
          `${programDataEndPoint}`,
          { ...programData },
          {
            headers: {
              authorization: storedToken,
            },
          }
        );
      } else {
        response = await axios.put(
          `${programDataEndPoint}/${programData._id}`,
          { ...programData },
          {
            headers: {
              authorization: storedToken,
            },
          }
        );
      }
      //TODO:handle validation for emao;

      toastr.success(response.data?.message || "Done");
      if (isNew) {
        navigate("/program");
      }
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "color",
  ];

  const momenceLinkHandler = (event) => {
    setProgramData({
      ...programData,
      buttonLink: event.target.value,
    });
  };

  const headingHandler = (html) => {
    setProgramData({
      ...programData,
      heading: html,
    });
    setheading(html);
  };
  const buttonTextHandler = (html) => {
    setProgramData({
      ...programData,
      buttonDetails: html,
    });
    setButtonText(html);
  };

  const handleEditorChange = (html) => {
    setProgramData({
      ...programData,
      content: html,
    });
    setContent(html);
  };
  return (
    <>
      <Navbar userdata={props.userdata} />
      {programDataLoaded ? (
        <>
          <div className="mx-auto" style={{ display: "flex", width: "80%" }}>
            <div style={{ flex: "5", marginBottom: "10px" }}>
              <h2 style={{ marginTop: "10px" }}>Heading </h2>
              <div>
                <label style={{ color: "green", fontWeight:'bold' }}>Heading Background</label>{" "}
                <input
                  type="color"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onChange={headingBKGColorHandler}
                  value={headingBKGColor}
                />
              </div>
              <div className="text-editor" style={{ width: "80%" }}>
                <ReactQuill
                  value={heading}
                  readOnly={false}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  onChange={(html) => headingHandler(html)}
                />
              </div>
              <h2 style={{ marginTop: "10px" }}>Content</h2>
              <div className="text-editor" style={{ width: "80%" }}>
                <ReactQuill
                  value={content}
                  readOnly={false}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  onChange={(html) => handleEditorChange(html)}
                />
              </div>
              <h2 style={{ marginTop: "10px" }}>Button Text</h2>
              <div>
                {" "}
                <label style={{ color: "green", fontWeight:'bold' }}>Button Background</label>
                <input
                  type="color"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onChange={buttonBKGColorHandler}
                  value={buttonBKGColor}
                />
              </div>
              <div className="text-editor" style={{ width: "80%" }}>
                <ReactQuill
                  value={buttonDetails}
                  readOnly={false}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  onChange={(html) => buttonTextHandler(html)}
                />
              </div>
              <div style={{ width: "80%" }}>
                <label style={{ marginTop: "10px" , fontWeight:"bold"}}>Momence Link</label>
                <Input
                  placeholder="Button Link"
                  defaultValue={buttonLink}
                  onChange={momenceLinkHandler}
                />
              </div>
              <Button
                type="primary"
                style={{ width: "80%", marginTop: "10px" }}
                onClick={UpdateProgram}
              >
                SAVE
              </Button>
            </div>
            <div className="row" style={{ flex: "3", margin: "15px" }}>
              <div className="col">
                <div
                  className="card "
                  style={{
                    width: "100%",
                    minHeight: "10vh",
                    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    className="card-header mx-auto d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: `${headingBKGColor}`,
                      width: "90%",
                      color: `${fontColor}`,
                    }}
                  >
                    <div
                      style={{ marginTop: "10px" }}
                      dangerouslySetInnerHTML={{ __html: heading }}
                    />
                  </div>
                  <div className="card-body">
                    <div className="quill-container ">
                      <div
                        style={{ marginTop: "10px" }}
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                  </div>
                  {/* Button disaable */}
                  <div className="card-footer ">
                    <button
                      style={{
                        width: "100%",
                        backgroundColor: `${buttonBKGColor}`,
                        color: `${fontColor}`,
                        border: "none",
                      }}
                    >
                      <h4 dangerouslySetInnerHTML={{ __html: buttonDetails }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingScreen />
      )}{" "}
      <Footer />
    </>
  );
};

export default Programeeditor;
