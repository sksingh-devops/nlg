import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";
import Navbar from "../navbar/navbar";
import styles from "./chat.module.css";
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
const RecentChatEndPoint = `${baseUrl}/chat/recent`;
const SearchChatUser = `${baseUrl}/chat/search`;
const SendMessageEndPoint = `${baseUrl}/chat/send`;
const getHistoryChat = `${baseUrl}/chat/history`;
const markRead = `${baseUrl}/chat/mark-read`;
export default function Chat(props) {
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
  const [selectedUser, setSelecteduser] = useState({
    Id: "",
    name: "",
    email: "",
    profilePicture: "",
  });
  const [messageDetail, setMessageDetail] = useState([
    {
      userId: "",
      profilePicture: "",
      isLastMessageRead: false,
      senderId: "",
      senderName: "",
      recipientId: "",
      recieverName: "",
      message: "",
      timestamp: new Date(),
    },
  ]);
  const [searchUser, setSearchUser] = useState([
    {
      Id: "",
      profilePicture: "",
      email: "",
      name: "",
    },
  ]);
  const adminReply = "Thank You";
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

      let interactionsResponse = response.data.interactionsResponse;
      const currentUserId = response.data.currentUserId;
      interactionsResponse = interactionsResponse.filter((x)=> x.lastMessage?.sender  && x.lastMessage?.recipient )
      let updatedMessageDetail = interactionsResponse.map((interaction) => {
        const truncatedMessage =
          interaction.lastMessage.message.length > 10
            ? interaction.lastMessage.message.substring(0, 10) + "..."
            : interaction.lastMessage.message;
        if (
          selectedUser.Id &&
          interaction.lastMessage.sender &&
          interaction.lastMessage.sender._id === selectedUser?.Id
        ) {
          // call history api if ction.lastMessage
          if (new Date(interaction.lastMessage?.timestamp).getTime() > chatTS) {
            // Need to get new messages
            setTimeout(() => {
              GetHistoryMessage(selectedUser.Id);
            }, 10);
          }
        }
        return {
          userId: currentUserId,
          profilePicture:
            currentUserId === interaction?.lastMessage?.sender?._id
              ? interaction?.lastMessage?.recipient?.profilePictureLink
              : interaction.lastMessage?.sender?.profilePictureLink,
          isLastMessageRead: interaction.isLastMessageRead,
          senderId: interaction.lastMessage?.sender?._id,
          senderName:
            interaction.lastMessage?.sender?.name?.trim() ||
            interaction.lastMessage?.sender?.email,
          recipientId: interaction.lastMessage?.recipient?._id,
          recieverName:
            interaction.lastMessage?.recipient?.name?.trim() ||
            interaction.lastMessage?.recipient?.email,
          message: truncatedMessage,
          timestamp: interaction.lastMessage?.timestamp,
        };
      });
      updatedMessageDetail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMessageDetail(updatedMessageDetail);
    } catch (error) {
      console.log(error);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      //  toastr.error(`Users Data Not Found`);
    }
  };
  async function SearchChatData(value) {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(SearchChatUser, {
        headers: {
          authorization: storedToken,
        },
        params: {
          q: value,
        },
      });
      const searchoption = response.data.map((interaction) => {
        return {
          value: interaction._id,
          label: interaction.name.trim() || interaction.email,
        };
      });
      setOptions(searchoption);

      const user = response.data.map((user) => {
        return {
          Id: user._id,
          profilePicture: user.profilePictureLink,
          email: user.email,
          name: user.name.trim() || user.email,
        };
      });
      setSearchUser(user);
    } catch (error) {
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
      toastr.clear();
      toastr.error(`Users Data Not Found`);
    }
  }
  async function GetHistoryMessage(value) {
    try {
      const storedToken = localStorage.getItem("token");
      const chatEndpoint = `${getHistoryChat}/${value}`;
      const response = await axios.get(chatEndpoint, {
        headers: {
          authorization: storedToken,
        },
      });
      const chat = response.data.map((message) => {
        return {
          senderId: message.sender._id,
          message: message.message,
        };
      });
      setChatMessages(chat);
      setChatTS(Date.now());
      console.log(chat);
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
        },
        {
          headers: {
            authorization: storedToken,
          },
        }
      );
      await GetHistoryMessage(selectedUser.Id);
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

  // need to find another way for it
  const onChange = (value) => {
    // Find the option with the selected value and extract its label use for search
    setRecieverId(value);
    const selectedOption = options.find((option) => option.value === value);
    const selectedLabel = selectedOption ? selectedOption.label : "";
    SearchChatData(selectedLabel);
    // console.log(`selected ${selectedLabel}`);

    const user = searchUser.find((user) => user.Id === value);
    if (user) {
      setShowRightComponent(true);
    setShowLeftComponent(false)
      user.name = user.name.trim() || user.email;
      setSelecteduser(user);
      setChatMessages([]);
    }
  };
  const onSearch = (value) => {
    SearchChatData(value); //isme name se searh hota h
  };
  const [showRightComponent, setShowRightComponent] = useState(false);
  const [showLeftComponent, setShowLeftComponent] = useState(true);

  const triggerRightSide = (value) => {
    setShowRightComponent(true);
    setShowLeftComponent(false)
    setChatMessages([]);
    const user = searchUser.find((user) => user?.Id === value); //juggad instead of this use recepient ID
    if (user) {
      user.name = user.name.trim() || user.email;
      MarkReadMessage(user.Id);
      setSelecteduser(user);
      setRecieverId(user.Id);
      GetHistoryMessage(value);
    }
  };

  useEffect(() => {
    RecentChatData();
    SearchChatData("");
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
      <Navbar userdata={props.userdata} />
      <div className="" style={{ width: "100%", margin:"0px", padding:'0px' }}>
        <div className="col-md-12" style={{margin:'0px', padding:'0px'}}>
          <div id="chat3" style={{ borderRadius: "15px" }}>
            <div
              className="card-body row"
              style={{ margin: "0px", padding: "0px" }}
            >
                <div
                  className={`col-md-4   ${showLeftComponent ? styles.leftSideshow : styles.leftSide}`}
                >
                  <Select
                    className="custom-select-highlight"
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Select User..."
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={options}
                    allowClear
                  />

                  <div>
                    {/* all users are here for search */}
                    <div
                      className="scrollbar"
                      style={{
                        position: "relative",
                        height: "70vh",
                        overflowY: "auto",
                        marginTop: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                        cursor: "pointer",
                      }}
                    >
                      <ul className="list-unstyled">
                        {messageDetail?.map((message, index) => (
                          <>
                            {message.senderId === message.userId && (
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
                                  onClick={() =>
                                    triggerRightSide(message.recipientId)
                                  }
                                >
                                  <div>
                                    <Avatar
                                      name={message.recieverName}
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
                                      {message.recieverName}
                                    </p>
                                    <p className="fw-bold mb-0">
                                      {message.message}
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
                            )}

                            {message.senderId !== message.userId && (
                              <li
                                className={`p-2 ${styles.chatUsers}`}
                                key={index}
                                style={{
                                  backgroundColor:
                                    message.senderId === selectedUser?.Id
                                      ? "#F0F2F5"
                                      : "",
                                }}
                              >
                                <div
                                  className="d-flex flex-row "
                                  onClick={() =>
                                    triggerRightSide(message.senderId)
                                  }
                                >
                                  <div>
                                    <Avatar
                                      name={message.senderName}
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
                                      {message.senderName}
                                    </p>
                                    {!message.isLastMessageRead ? (
                                      <p
                                        className="fw mb-0"
                                        style={{ fontWeight: "bolder" }}
                                      >
                                        {message.message}
                                      </p>
                                    ) : (
                                      <p
                                        className="fw-bold mb-0"
                                        style={{ fontWeight: "normal" }}
                                      >
                                        {message.message}
                                      </p>
                                    )}
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
                            )}
                          </>
                        ))}
                        {/* Other list items */}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* RIght side hai ye bhai */}
                <div
                  className={`col-md-8   ${showRightComponent ? styles.show : styles.mainRightSideContainer}`}
                  style={{
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#EEEBE2",
                    margin: "0px",
                    padding: 0,
                    width:'100%',
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
                    {selectedUser && (
                      <Avatar
                        name={selectedUser.name}
                        src={selectedUser.profilePicture}
                        size="60"
                        round="50%"
                        style={{ marginRight: "10px" }}
                      />
                    )}
                    <div
                      className="pt-1"
                      style={{
                        marginLeft: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {selectedUser.name !== "" && (
                        <p className="fw-bold mb-0">{selectedUser?.name}</p>
                      )}
                      {selectedUser.name === "" && (
                        <div class="alert alert-info" role="alert">
                          Please select a user to start conversation
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    ref={chatBoxRef}
                    className="scrollbar"
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
                          message.senderId === currentUser
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
                            message.senderId === currentUser
                              ? styles["user-message"]
                              : styles["admin-message"]
                          }`}
                          style={{
                            backgroundColor:
                              message.senderId === currentUser
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

      <Footer />
    </>
  );
}
