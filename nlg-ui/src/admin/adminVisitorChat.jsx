import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";
import Navbar from "../navbar/navbar";
import styles from "./vistor.module.css";
import Footer from "../footer/footer";
import { Input, Select, message } from "antd";
import { getBaseUrl } from "../config/apiconfig";
import moment from "moment";
import "toastr/build/toastr.min.css";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Avatar from "react-avatar";
import toastr from "toastr";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const baseUrl = getBaseUrl();
const markRead = `${baseUrl}/vchat/mark-read`;

const RecentChatEndPoint = `${baseUrl}/vchat/recent`;
const SendMessageEndPoint = `${baseUrl}/vchat/send`;
const getHistoryChat = `${baseUrl}/vchat/history`;
export default function AdminVisitorChat(props) {
  const currentUser = localStorage.getItem("UserId");
  const { Search } = Input;
  const [chatMessages, setChatMessages] = useState([]);
  const [chatTS, setChatTS] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null);
  const [options, setOptions] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [selectedUser, setSelecteduser] = useState();
  const [messageDetail, setMessageDetail] = useState([]);
  const [searchUser, setSearchUser] = useState([
    {
      Id: "",
      profilePicture: "",
      email: "",
      name: "",
    },
  ]);
  let [RecieverId, setRecieverId] = useState("");
  const sendButtonRef = useRef(null);
  const handleSendMessage = () => {
    newMessage.trim() && SendChatMessage(newMessage.trim());
  };

  const autoScrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    // Call the autoScrollToBottom function whenever a new message is received or sent
    autoScrollToBottom();
  }, [chatMessages]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (usually line break)
      sendButtonRef.current.click(); // Programmatically trigger click event
    }
  };

  const RecentChatData = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(RecentChatEndPoint, {
        headers: {
          authorization: storedToken,
        },
      });
      //set message Deatil from response to show recent
      let recentDetail = response.data.map((message) => {
        return {
          vname: message?.vname,
          lastMessage: message?.lastMessage,
          timestamp: message?.timestamp,
          _id: message?._id,
          visitor: message?.visitor,
          vid:message?.visitorInfo?.vid,
        };
      });
      recentDetail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMessageDetail(recentDetail);
    } catch (error) {
      console.log(error);
    }
  };
  async function GetHistoryMessage(recipientId, vid) {
    try {
      const storedToken = localStorage.getItem("token");
      const chatEndpoint = `${getHistoryChat}/admin/${recipientId}`;
      const response = await axios.get(chatEndpoint, {
        headers: {
          authorization: storedToken,
        },
      });
      const chat = response.data.map((message) => {
        return {
          message: message.message,
          sender: message.sender,

        };
      });
      console.log(chat);

      setChatMessages(chat);
      setChatTS(Date.now());
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      //toastr.error(`Users Data Not Found`);
    }
  }
  async function SendChatMessage(text) {
    try {
      const storedToken = localStorage.getItem("token");
      const chatEndpoint = `${SendMessageEndPoint}/${RecieverId}`;
      const response = await axios.post(
        chatEndpoint,
        {
          message: text,
          vid : RecieverId,
          email: "", // TODO selectedUser.email
        },
      );
      await GetHistoryMessage(RecieverId);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Try again, unable to send message`);
    }
  }
  async function MarkReadMessage(senderId) {
    try {
      const storedToken = localStorage.getItem("token");
      const ReadEndpoint = `${markRead}/${senderId}`;
      const response = await axios.put(
        ReadEndpoint,
        {},
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      //toastr.error(`Users Data Not Found`);
    }
  }
  const [showRightComponent, setShowRightComponent] = useState(false);
  const [showLeftComponent, setShowLeftComponent] = useState(true);

  // need to find another way for it
  const triggerRightSide = (value) => {
    setShowRightComponent(true);
    setShowLeftComponent(false)
    setChatMessages([]);
    const user = messageDetail.find((user) => user?._id === value); //juggad instead of this use recepient ID
    console.log(user);
    if (user){
    user.vname = user.vname.trim() || user.email
    // MarkReadMessage(user.Id);
    setSelecteduser(user);
    setRecieverId(user._id);
    GetHistoryMessage(user.visitor, user?.visitorInfo?.vid);
    }
  };

  useEffect(() => {
    RecentChatData();
    // 1 minute
    const intervalId = setInterval(() => {
      RecentChatData();
    }, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [RecieverId]);
  const mediaScreenLeftandRightHandler = ()=>{

    setShowLeftComponent(true);
    setShowRightComponent(false);
  }
  return (
    <>
      <div className="row" style={{ width: "100%" }}>
        <div className="col-md-12">
          <div id="chat3" style={{ borderRadius: "15px" }}>
            <div
              className="card-body row"
              style={{ margin: "0px", padding: "0px" }}
            >
              
              <div
                  className={`col-md-4   ${showLeftComponent ? styles.leftSideshow : styles.leftSide}`}
                >
                  <div>
                    {/* all users are here for search */}
                    <div
                      className="scrollbar"
                      style={{
                        position: "relative",
                        height: "70vh",
                        overflowY: "auto",

                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                        cursor: "pointer",
                      }}
                    >
                      {/* profile picture ki jagah recieverId chahiye */}
                      <ul className="list-unstyled">
                        {messageDetail && messageDetail.length === 0 && (
                          <li>
                            <p
                              class="alert alert-info"
                              role="alert"
                              style={{ textAlign: "center" }}
                            >
                              No Recent Chat
                            </p>
                          </li>
                        )}
                        {messageDetail?.map((message, index) => (
                          <>
                            <li
                              className={`p-2 ${styles.chatUsers}`}
                              key={index}
                              style={{
                                backgroundColor:
                                  message.recipientId === selectedUser?.Id
                                    ? "#F0F2F5"
                                    : "",
                              }}
                            >
                              <div
                                className="d-flex flex-row "
                                onClick={() => triggerRightSide(message?._id)}
                              >
                                <div>
                                  <Avatar
                                    name={message.vname}
                                    src={message.profilePicture}
                                    size="60"
                                    round="50%"
                                    style={{ marginRight: "10px" }}
                                  />
                                </div>
                                <div
                                  className="flex-grow-1"
                                  style={{ marginLeft: "20px" }}
                                >
                                  <p className="fw-bold mb-0">
                                    {message?.vname}
                                  </p>
                                  <p className="fw-bold mb-0">
                                    {message?.lastMessage}
                                  </p>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <p style={{ fontSize: "12px" }}>
                                    {moment(message.timestamp).fromNow()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          </>
                        ))}
                        {/* Other list items */}
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                   className={`col-md-8   ${showRightComponent ? styles.show : styles.mainRightSideContainer}`}
                  style={{
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#EEEBE2",
                    margin: "0px",
                    padding: 0,
                  }}
                >
                  {/* RIght side User Info Section */}
                  <div
                    className="p-3  rounded d-flex "
                    style={{
                      marginBottom: "10px",
                      border: "1px solid lightgrey",
                      boxShadow: "0 0px 4px rgba(0, 0, 0, 0.3)",
                      backgroundColor: "#F0F2F5",
                    }}
                  >
                     <div className={styles.backIcon}>
                    <IoMdArrowRoundBack onClick={mediaScreenLeftandRightHandler}style={{fontSize:'30px'}}/>
                    </div>
                      <Avatar
                        name={selectedUser?.vname}
                        src={selectedUser?.profilePicture}
                        size="60"
                        round="50%"
                        style={{ marginRight: "10px" }}
                      />
                    
                    <div
                      className="pt-1"
                      style={{
                        marginLeft: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {selectedUser?.vname !== "" && (
                        <p className="fw-bold mb-0">{selectedUser?.vname}</p>
                      )}
                      {(selectedUser?.vname === "" || !selectedUser) && (
                        <div class="alert alert-info" role="alert">
                          Please select a user to start conversation
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="scrollbar"
                    ref={chatBoxRef}
                    style={{
                      position: "relative",
                      height: "50vh",
                      overflowY: "auto",
                    }}
                  >
                    {/* Chat messages */}
                    {chatMessages?.map((message, index) => (
                      <div
                        key={index}
                        className={`d-flex ${
                          message.sender === "admin"
                            ? "justify-content-end"
                            : "justify-content-start"
                        } mb-2`}
                        style={{
                          paddingLeft: "10px", // Adjust as needed
                          paddingRight: "10px", // Adjust as needed
                        }}
                      >
                        <div
                          className={`message-bubble p-2 rounded-3 ${
                            message.sender === "admin"
                              ? styles["user-message"]
                              : styles["admin-message"]
                          }`}
                          style={{
                            backgroundColor:
                              message.sender === "admin"
                                ? "#D8FCD3"
                                : "#FFFFFF",
                            color: "black",
                          }}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                    {/* <input
                        type="text"
                        className="form-control form-control-lg"
                        id="exampleFormControlInput2"
                        placeholder="Type message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      /> */}
                    <Input
                      placeholder="Type a message"
                      style={{ height: "55px" }}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      suffix={
                        <a
                          className="ms-1 text-muted"
                          href="#!"
                          onClick={handleSendMessage}
                          ref={sendButtonRef}
                        >
                          <FaPaperPlane fontSize={"24px"} />
                        </a>
                      }
                    />
                  </div>
                </div>
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
