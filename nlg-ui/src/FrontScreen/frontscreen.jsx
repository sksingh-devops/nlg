import React, { useRef, useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import styles from "./frontscreen.module.css";
import { useNavigate } from "react-router";
import Footer from "../footer/footer";
import { Button, Input, Modal } from "antd";
import ChatMessages from "../chat/ChatMessage";
import { ReactSVG } from "react-svg";
import { getBaseUrl } from "../config/apiconfig";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import toastr from "toastr";
import axios from "axios";
import ReplyForm from "./ReplyForm";
const baseUrl = getBaseUrl();
const Frontscreen = (props) => {
  const [newMessage, setNewMessage] = useState("");
  const videoRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const chatBoxRef = useRef(null);
  const [chatVisible, setChatvisible] = useState(false);
  const sendButtonRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const isiOS =
      /iPad|iPhone|iPod|Safari|/.test(navigator.userAgent) && !window.MSStream;
    if (isiOS) {
      videoRef2?.current?.pause();
    } else {
      videoRef?.current?.play();
    }
  }, []);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (usually line break)
      sendButtonRef.current.click(); // Programmatically trigger click event
    }
  };
  const viewProgramHandler = () => {
    navigate("/program");
  };
  const autoScrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const viewStaffHandler = () => {
    navigate("/staff");
  };
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handlePlayPause1 = () => {
    const video = videoRef1.current;

    if (!videoPlaying) {
      video.play();
    } else {
      video.pause();
    }

    setVideoPlaying(!videoPlaying);
  };

  const [videoPlaying2, setVideoPlaying2] = useState(false);

  const handlePlayPause2 = () => {
    const video = videoRef2.current;

    if (!videoPlaying2) {
      video.play();
    } else {
      video.pause();
    }

    setVideoPlaying2(!videoPlaying2);
  };
  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default right-click behavior
  };
  const [modal1Open, setModal1Open] = useState(false);
  const [emailForm, setEmailForm] = useState(false);
  // const messages = [
  //   { id: 1, text: "Hello!", sender: true },
  //   { id: 2, text: "Hi there!", sender: false },
  //   { id: 3, text: "How are you?", sender: true },
  //   { id: 4, text: "I'm good, thanks!", sender: false },
  // ];
  const [messages, setMessages] = useState([]);
  const [replyForm, setReplyForm] = useState(false);
  const [replySent, setReplySent] = useState(false);
  // const handleMessageSubmit = (message) => {
  //   setMessages([...messages, { text: message, type: 'user' }]);
  //   setReplyForm(true);
  // };
  const openingChat = () => {
    setModal1Open(true);
    let vid = localStorage.getItem("vid");
    if (vid) {
      GetHistoryMessage();
      //loicalstorage email
      // true then send msg visitor
      const vEmail = localStorage.getItem("vEmail");
      if (!vEmail) {
        console.log("email please send");
        // render
        setReplyForm(true);
      } else {
        //chat
      }
    } else {
      // let uniqueId = uuidv4();
      // localStorage.setItem('vid', uniqueId);
      // vid = uniqueId;
    }
  };
  const postMessage = async (vid, email, message) => {
    try {
      const visitorChat = `${baseUrl}/vchat/send/admin`;
      const response = await axios.post(visitorChat, {
        vid: vid,
        email: email,
        message: message,
      });
      GetHistoryMessage();
    } catch (error) {
      console.log(error);
    }
  };
  const addVisitor = async (vid, email, name) => {
    try {
      const visitorChat = `${baseUrl}/vchat/addvisitor`;
      const response = await axios.post(visitorChat, {
        vid: vid,
        email: email,
        name: name,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const getHistoryChat = `${baseUrl}/vchat/history`;
  async function GetHistoryMessage() {
    try {
      const vid = localStorage.getItem("vid");
      const chatEndpoint = `${getHistoryChat}/admin/${vid}`;
      const response = await axios.get(chatEndpoint, {});
      const chat = response.data.map((message) => {
        return {
          type: message.recipient === "admin" ? "user" : "bot",
          text: message.message,
        };
      });
      setMessages(chat);
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

  const sendChat = async () => {
   
    if(!replyForm){
    let vid = localStorage.getItem("vid");
    //input text ki value
    //api call add visitor
    if (!vid || vid === "undefined") {
      // let uniqueId = uuidv4();

      const res = await addVisitor();
      let uniqueId = res?.data?._id;
      if (!uniqueId) {
        return;
      }
      localStorage.setItem("vid", uniqueId);
      vid = uniqueId;
    }
    const vEmail = localStorage.getItem("vEmail");
    if (vEmail) {
      //send message
      postMessage(vid, vEmail, newMessage);
    } else {
      // ask for email
      //reciver render wala with form
      //array append karna hai
      setReplyForm(true);
      // semd mesg
      postMessage(vid, "", newMessage);
      console.log("email please send");
    }
    setMessages([...messages, { text: newMessage, type: "user" }]);
    setNewMessage("");}
    else{
      toastr.error(`Please fill the form`)
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 60000,
      };
    setTimeout(()=>{
      toastr.clear()
    },2000)  
      
    }
    
  };
  useEffect(() => {
    // Call the autoScrollToBottom function whenever a new message is received or sent
    autoScrollToBottom();
  }, [messages]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      let vid = localStorage.getItem("vid");
      if (vid && modal1Open) {
        GetHistoryMessage();
      }
    }, 10000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [messages, modal1Open]);

  const handleReplySubmit = async (formData) => {
   
  
    setReplyForm(false);
    const { name, email } = formData;
    const vid = localStorage.getItem("vid");
    await addVisitor(vid, email, name);
    localStorage.setItem("vEmail", email);
  };
  return (
    <div>
      <Navbar
        userdata={props.userdata}
        tokenStateChangehandler={props.tokenStateChangehandler}
      />

      <div className={styles.videoContainer}>
        <video
          onContextMenu={handleContextMenu}
          ref={videoRef}
          src="/videos/homeVideo.mp4"
          className={styles.mainVideo}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline
          preload="metadata"
        ></video>
        <div
          className={styles.overlay}
          onClick={() => {
            videoRef?.current.play();
          }}
        ></div>

        <div className={styles.imageText}>
          <p>LOUIS SAUER</p>
          <p>GOLF IS NOW</p>
          <p>NEXT-LEVEL-GOLF</p>
          <button className={styles.imageButton} onClick={viewProgramHandler}>
            VIEW PROGRAMS
          </button>
        </div>
      </div>
      {/* <div className={styles.miniContainer}>
        <p>NEXT LEVEL GOLF</p>
        <div style={{ border: "1px solid white", height: "67px" }}></div>
        <p>Are you ready to reach the next level?</p>
        <button onClick={viewProgramHandler}>START NOW</button>
      </div> */}
      <div className={styles.container3}>
        <div className={styles.container3image}>
          {!videoPlaying && (
            <svg
              className={styles.container3videoSvg}
              onClick={handlePlayPause1}
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
          )}
          <video
            onClick={handlePlayPause1}
            ref={videoRef1}
            src="/videos/video2.mp4"
            className={styles.container3Video}
            loop
            tabIndex="-1"
            playsInline
            webkit-playsinline="true"
            poster="/image/videoImage.webp"
          ></video>
        </div>
        <div className={styles.container3text}>
          <h2>COLLEGE RECRUITING IS STRESSFUL & </h2>
          <h2>TIME CONSUMING. </h2>
          <div className={styles.container3blankdiv}></div>
          <p
            style={{ marginTop: "30px", wordSpacing: "0.3em", marginLeft: "0" }}
          >
            After assisting 120+ families, we are uniquely equipped to help you
            prepare for the college golf recruiting process. Next Level Golf is
            designed to help elite junior golfers promote themselves to coaches,
            refine their mindset and fitness, and optimize their course strategy
            to perform when it matters most.
          </p>
        </div>
      </div>
      <div className={styles.MainCardContainer}>
        <div className={styles.MainCardtext}>
          <h2>NEXT LEVEL GOLF PROVIDES AN ADVANTAGE FOR </h2>
          <h2>PLAYERS LIKE YOU</h2>
        </div>
        <div className={`row ${styles.cardOverImage}`}>
          <div className={`card ${styles.cardContainer}`}>
            <div className={` d-flex ${styles.cardSvgContainer}`}>
              <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="7.2 4.5 85.7 91"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="7.2 4.5 85.7 91"
                height="90"
                width="100"
                data-type="color"
                role="presentation"
                aria-hidden="true"
              >
                <g>
                  <path
                    fill="#D8E91D"
                    d="M35.1 62.9c0-4.4-2.9-7.4-7-7.4s-7 3.1-7 7.4c0 4.6 3.1 8.3 7 8.3s7-3.7 7-8.3Zm-11 0c0-2.7 1.6-4.4 4-4.4s4 1.7 4 4.4c0 2.9-1.8 5.3-4 5.3s-4-2.4-4-5.3ZM68 17H34c-.8 0-1.5.7-1.5 1.5S33.2 20 34 20h34c.8 0 1.5-.7 1.5-1.5S68.9 17 68 17Zm19.3-5.5h-6.5V8c0-1.9-1.6-3.5-3.5-3.5H24.7c-1.9 0-3.5 1.6-3.5 3.5v39.7c-8.2 2.9-14 10.7-14 19.8 0 9.1 5.8 16.9 14 19.7V92c0 1.9 1.6 3.5 3.5 3.5h52.7c1.9 0 3.5-1.6 3.5-3.5v-2.5h2.5c3 0 5.5-2.5 5.5-5.5V45.9l3.5-3.3c.3-.3.5-.7.5-1.1V17c-.1-3-2.5-5.5-5.6-5.5ZM16.2 80.6v.3c-3.7-3.3-6-8-6-13.3 0-9.9 8-17.9 17.9-17.9 9.9 0 17.9 8 17.9 17.9 0 5.3-2.3 10.1-6 13.3-.8-5-5.2-8-12-8-6.6 0-10.9 2.8-11.8 7.7Zm2.8 2.3c0-.7.1-1.6.1-1.9.8-4.3 5.3-5.2 9-5.2 2.5 0 8.5.6 9 5.7v1.3c-2.7 1.6-5.8 2.5-9.1 2.5-3.2.1-6.3-.8-9-2.4ZM77.9 92c0 .3-.2.5-.5.5H24.7c-.3 0-.5-.2-.5-.5v-3.9c1.3.2 2.6.4 3.9.4 4.1 0 7.9-1.2 11.1-3.2.1-.1.3-.1.4-.2 5.7-3.7 9.4-10.2 9.4-17.5 0-11.5-9.4-20.9-20.9-20.9-1.3 0-2.6.1-3.9.4V8c0-.3.2-.5.5-.5h52.7c.3 0 .5.2.5.5v84Zm11.9-51.1-3.5 3.3c-.3.3-.5.7-.5 1.1V84c0 1.4-1.1 2.5-2.5 2.5h-2.5v-72h6.5c1.4 0 2.5 1.1 2.5 2.5v23.9ZM68 24.5H47c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h21c.8 0 1.5-.7 1.5-1.5s-.6-1.5-1.5-1.5Z"
                    data-color="1"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="card-body">
              <p className={styles.cardBodyText}>Online Profile Player</p>
              <p className={styles.cardBodyText2}>
                NLG will highlight your profile with a 360-degree of your
                academics, tournaments, practice, and performance history to
                college recruiters.
              </p>
            </div>
          </div>
          <div className={`card ${styles.cardContainer}`}>
            <div className={` d-flex ${styles.cardSvgContainer}`}>
              <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="0 -0.021 91 91.021"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -0.021 91 91.021"
                height="91"
                width="91"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                aria-labelledby="svgcid--lsmgox-43bodj"
              >
                <title id="svgcid--lsmgox-43bodj"></title>
                <g>
                  <g clip-path="url(#svgcid-dooxp5-88aa0u)">
                    <path
                      fill="#D8E91D"
                      d="M54.031 25.594H68.25c3.128 0 5.688-2.56 5.688-5.688 0-3.128-2.56-5.687-5.688-5.687-.71-3.84-4.55-6.399-8.39-5.546-2.985.57-5.118 2.702-5.687 5.546h-.142c-3.128 0-5.687 2.56-5.687 5.687 0 3.128 2.56 5.688 5.687 5.688Zm0-8.532c.285 0 .711 0 .996.143.71.284 1.564-.142 1.848-.853 0-.143.142-.427.142-.57v-.141c0-2.418 1.849-4.266 4.266-4.266s4.265 1.848 4.265 4.266v.284c0 .853.57 1.422 1.28 1.564.142 0 .427 0 .569-.142 1.422-.569 3.128.142 3.697 1.564.569 1.422-.142 3.128-1.564 3.697-.427.142-.853.142-1.28.142H54.031a2.852 2.852 0 0 1-2.843-2.844 2.852 2.852 0 0 1 2.843-2.843Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M19.906 17.063h14.219c.853 0 1.422-.57 1.422-1.422 0-.854-.569-1.422-1.422-1.422H19.906a2.852 2.852 0 0 1-2.843-2.844 2.852 2.852 0 0 1 2.843-2.844c.427 0 .711 0 .996.142.71.285 1.564 0 1.848-.853v-.71c0-2.417 1.848-4.265 4.266-4.265 2.417 0 4.265 1.848 4.265 4.265v.285c0 .853.569 1.422 1.422 1.422.142 0 .427 0 .569-.143 1.564-.426 3.128.285 3.555 1.849.142.284.142.569.142.853 0 .853.569 1.422 1.422 1.422s1.422-.569 1.422-1.422c0-3.128-2.56-5.688-5.688-5.688h-.142c-.711-3.839-4.55-6.398-8.39-5.545-2.843.569-4.976 2.702-5.545 5.545-3.128 0-5.687 2.418-5.83 5.546-.141 3.128 2.56 5.83 5.688 5.83Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M34.836 45.642c-.711-.284-1.564-.142-1.849.569-.284.284-.284.427-.284.71v34.126c0 2.417 2.56 4.266 5.688 4.266 3.128 0 5.687-1.849 5.687-4.266s-2.56-4.266-5.687-4.266c-.996 0-1.991.142-2.844.569V61.994l13.508-6.683c.71-.284.995-1.138.71-1.849a1.713 1.713 0 0 0-.71-.71l-14.22-7.11Zm3.555 33.983c1.706 0 2.843.853 2.843 1.422s-1.137 1.422-2.843 1.422c-1.707 0-2.844-.853-2.844-1.422s1.137-1.422 2.844-1.422Zm-2.844-20.76v-9.668l9.669 4.834-9.67 4.835Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M89.578 51.188h-7.11v-2.844h4.266c.854 0 1.422-.569 1.422-1.422v-.427L82.47 29.433c-.285-.711-.996-1.138-1.849-.853-.426.142-.71.426-.853.853L74.08 46.495c-.285.711 0 1.564.71 1.849h4.693v2.843H78.06c-7.252 0-15.499 4.408-25.025 9.527-4.55 2.417-9.1 4.834-13.934 6.967-.711.285-1.138 1.138-.711 1.849.284.71 1.137.995 1.848.71h.142c4.977-2.132 9.527-4.692 14.077-7.109 9.242-4.834 17.204-9.1 23.745-9.1h9.953v34.125H2.844V76.781H14.36c4.976 0 9.81-.71 14.503-2.133.711-.142 1.138-.995.995-1.706-.142-.71-.995-1.137-1.706-.995-4.55 1.28-9.242 1.99-13.934 1.99h-2.844v-2.843h4.266c.853 0 1.421-.569 1.421-1.422 0-.142 0-.284-.142-.427l-5.687-17.062c-.285-.711-.995-1.138-1.849-.853-.426.142-.71.426-.853.853L2.844 69.245c-.285.711.142 1.564.853 1.849H8.53v2.844H1.42c-.85 0-1.42.567-1.42 1.421v14.22C0 90.43.569 91 1.422 91h88.156c.853 0 1.422-.569 1.422-1.422V52.61c0-.71-.569-1.422-1.422-1.422Zm-8.531-16.779L84.744 45.5H77.35l3.697-11.09ZM9.953 57.16l3.697 11.09H6.256l3.697-11.09Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M1.422 36.969c24.172 0 47.348 1.137 65.975 13.934.569.427 1.564.285 1.99-.284.427-.569.285-1.564-.284-1.99C49.766 35.262 26.02 34.124 1.422 34.124c-.853 0-1.422.569-1.422 1.422s.569 1.422 1.422 1.422Z"
                      data-color="1"
                    ></path>
                  </g>
                  <defs fill="none">
                    <clipPath id="svgcid-dooxp5-88aa0u">
                      <path fill="#ffffff" d="M91 0v91H0V0h91z"></path>
                    </clipPath>
                  </defs>
                </g>
              </svg>
            </div>
            <div className="card-body">
              <p className={styles.cardBodyText}>Data Driven Strategy</p>
              <p className={styles.cardBodyText2}>
                {" "}
                NLG will teach you how to understand your strengths as a player
                and guide golf course strategies through data and analysis.
              </p>
            </div>
          </div>
          <div className={`card ${styles.cardContainer}`}>
            <div className={` d-flex ${styles.cardSvgContainer}`}>
              <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="0 0 89 91"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 89 91"
                height="91"
                width="89"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                aria-labelledby="svgcid--euyxc-7dl6lv"
              >
                <title id="svgcid--euyxc-7dl6lv"></title>
                <g>
                  <g clip-path="url(#svgcid-h1cc09-icq2uv)">
                    <path
                      fill="#D8E91D"
                      d="M87.492 19.717H53.098c1.66-2.124 2.716-4.702 2.716-7.584C55.814 5.46 50.384 0 43.746 0S31.678 5.46 31.678 12.133c0 2.882 1.056 5.46 2.715 7.584H1.508c-.905 0-1.508.606-1.508 1.516C0 27.148 4.676 31.85 10.56 31.85h18.1v18.2c0 2.882.905 5.612 2.564 7.887L10.861 88.573c-.302.455-.302 1.062-.15 1.517.3.455.753.758 1.357.758h12.068c.452 0 .905-.303 1.206-.606L42.992 63.7h18.855v25.783c0 .91.604 1.517 1.509 1.517h10.56c.904 0 1.508-.607 1.508-1.517v-31.85c0-4.246-3.319-7.583-7.543-7.583H57.322v-18.2h21.119C84.324 31.85 89 27.148 89 21.233c0-.91-.603-1.516-1.508-1.516ZM43.745 3.033c4.978 0 9.05 4.095 9.05 9.1 0 3.337-1.81 6.219-4.374 7.735-2.866 1.669-6.486 1.669-9.202 0-2.715-1.516-4.374-4.55-4.374-7.735-.151-5.005 3.922-9.1 8.9-9.1ZM23.38 87.967h-8.447l18.252-27.755c1.81 1.516 3.922 2.73 6.336 3.185l-16.14 24.57Zm55.06-59.15H55.814c-.906 0-1.509.606-1.509 1.516V50.05h-9.05v3.033h22.626c2.564 0 4.525 1.972 4.525 4.55v30.334h-7.543V62.183c0-.91-.603-1.516-1.508-1.516H42.237c-5.883 0-10.559-4.702-10.559-10.617V30.333c0-.91-.603-1.516-1.509-1.516H10.56c-3.62 0-6.637-2.579-7.391-6.067h34.695c1.659.91 3.77 1.517 5.883 1.517 2.112 0 4.073-.607 5.883-1.517h36.203c-.754 3.488-3.771 6.067-7.391 6.067Z"
                      data-color="1"
                    ></path>
                  </g>
                  <defs fill="none">
                    <clipPath id="svgcid-h1cc09-icq2uv">
                      <path fill="#ffffff" d="M89 0v91H0V0h89z"></path>
                    </clipPath>
                  </defs>
                </g>
              </svg>
            </div>
            <div className="card-body">
              {" "}
              <p className={styles.cardBodyText}>Mind + Body + Speed</p>
              <p className={styles.cardBodyText2}>
                NLG will prepare you in mindfulness, increase your golf fitness
                and more importantly...SPEED.{" "}
              </p>
            </div>
          </div>
          <div className={`card ${styles.cardContainer}`}>
            <div className={` d-flex ${styles.cardSvgContainer}`}>
              <svg
                preserveAspectRatio="xMidYMid meet"
                data-bbox="0 0 70 94"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 70 94"
                height="94"
                width="70"
                data-type="color"
                role="presentation"
                aria-hidden="true"
                aria-labelledby="svgcid-x1vn2t-g4t6en"
              >
                <title id="svgcid-x1vn2t-g4t6en"></title>
                <g>
                  <g clip-path="url(#svgcid--71ddf0-bq50ua)">
                    <path
                      fill="#D8E91D"
                      d="M48.65 55.743H22.944v2.65H48.65v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M39.62 40.377H22.945v2.649H39.62v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M56.51 25.01H22.944v2.65H56.51v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M37.496 69.52H22.944v2.65h14.552v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M60.334 3.71h-5.842v2.649h5.842c3.824 0 7.01 3.073 7.01 6.994v58.18h-17.42c-.743 0-1.38.636-1.38 1.378v18.44H8.391a5.705 5.705 0 0 1-5.736-5.723V12.081a5.704 5.704 0 0 1 5.736-5.722h7.116v4.556h2.656V0h-2.656v3.71H8.392C3.824 3.71 0 7.417 0 12.08v73.547C0 90.185 3.718 94 8.392 94h55.022C67.026 94 70 91.033 70 87.43V13.353c-.106-5.299-4.355-9.644-9.666-9.644Zm-9.135 70.473h14.234L51.199 88.807V74.183Zm16.04 13.246c0 2.12-1.806 3.922-3.931 3.922H52.473l14.871-15.155-.106 11.234Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M18.589 25.01H12.64v2.65h5.949v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M18.589 40.377H12.64v2.649h5.949v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M18.589 55.743H12.64v2.65h5.949v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M18.589 69.52H12.64v2.65h5.949v-2.65Z"
                      data-color="1"
                    ></path>
                    <path
                      fill="#D8E91D"
                      d="M47.694 3.71H21.35v2.649h26.343v4.556h2.655V0h-2.655v3.71Z"
                      data-color="1"
                    ></path>
                  </g>
                  <defs fill="none">
                    <clipPath id="svgcid--71ddf0-bq50ua">
                      <path fill="#ffffff" d="M70 0v94H0V0h70z"></path>
                    </clipPath>
                  </defs>
                </g>
              </svg>
            </div>
            <div className="card-body">
              <p className={styles.cardBodyText}>Personalized Golf Plan </p>
              <p className={styles.cardBodyText2}>
                NLG coaches will customize a golf plan based on your strengths,
                and test your progress.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* container 5 */}
      <div className={styles.container5}>
        <div className={styles.container5LeftDiv}>
          <p className={styles.container5HeadingText}>
            COLLEGE COACHES WILL SEE A 360° VIEW OF YOU & YOUR GAME
          </p>

          <div className={styles.container5blankdiv}></div>
          <p className={styles.container5Text}>
            The Online Player Profile is a comprehensive view of your
            development as a player. Each year you will have an opportunity to
            participate in 6 performance tests, supervised by an NLG coach.
            These tests will showcase your level of commitment to your game and
            the work you put behind it. In addtion, college coaches will have
            access to your academic performance, videos of your swing, and
            community involvement.
          </p>
          <button className={styles.image5Button} onClick={viewProgramHandler}>
            START TODAY
          </button>
        </div>
        <div className={styles.container5image}>
          {!videoPlaying2 && (
            <svg
              onClick={handlePlayPause2}
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
          )}
          <video
            onClick={handlePlayPause2}
            ref={videoRef2}
            className={styles.container5Video}
            src="/videos/video3.mp4"
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline
            preload="metadata"
          ></video>
        </div>
      </div>

      <div className={styles.container6}>
        <div className={styles.container6image}>
          <img
            src="/image/coach.jpg"
            className={styles.container6Video}
            alt="img"
          />
        </div>
        <div className={styles.container6RightDiv}>
          <p className={styles.container6HeadingText}>
            A COACHING STAFF THAT IS DEDICATED TO HELPING YOU GET RECRUITED
          </p>

          <div className={styles.container6blankdiv}></div>
          <p className={styles.container6Text}>
            The NLG Coaching Staff is ready to get to work! They have coached
            Illinois’s top junior talent for over a decade, and understand golf
            at the highest level. Each coach comes with their own unique
            perspective of training and approach to the game. No matter who you
            work with, their mission to get you recruited.
          </p>
          <button className={styles.image5Button} onClick={viewStaffHandler}>
            MEET THE STAFF
          </button>
        </div>
      </div>
      {!props.userdata.isLoggedIn && (
        <div className={styles.nlgChatContainer}>
          <Button
            style={{
              backgroundColor: "black",
              color: "white",
              height: "56px",
              borderRadius: "30px",
              width: "200px",
              fontSize: "20px",
              border: "1px solid green",
            }}
            onClick={openingChat}
          >
            <svg
              width="30"
              height="30"
              style={{
                marginRight: "10px",
                width: "26px",
                height: "26px",
                marginBottom: "5px",
              }}
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.133 16.933a1.4 1.4 0 11.001-2.8 1.4 1.4 0 010 2.8m-4.667 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m-5.6 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m18.904-3.656c-1.013-5.655-5.753-10.22-11.528-11.105-4.343-.667-8.642.627-11.807 3.547-3.168 2.917-4.763 7.043-4.38 11.318.59 6.582 6.08 11.952 12.768 12.487 1.153.095 2.303.05 3.428-.13a14.12 14.12 0 002.428-.612.59.59 0 01.364-.006l3.714 1.167c.785.246 1.588-.331 1.588-1.144l-.002-3.517c0-.17.086-.301.157-.38a14.028 14.028 0 001.58-2.147c1.705-2.862 2.29-6.14 1.69-9.478"
                fill="currentColor"
                fill-rule="nonzero"
              ></path>
            </svg>
            NLG Chat
          </Button>
        </div>
      )}
      {props.userdata.isLoggedIn && (
        <div
          style={{
            position: "fixed",
            top: "90%",
            right: "20px",
          }}
        >
          <Button
            style={{
              backgroundColor: "black",
              color: "white",
              height: "56px",
              borderRadius: "30px",
              width: "200px",
              fontSize: "20px",
              border: "1px solid green",
            }}
            onClick={() => navigate("/chat")}
          >
            <svg
              width="30"
              height="30"
              style={{
                marginRight: "10px",
                width: "26px",
                height: "26px",
                marginBottom: "5px",
              }}
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.133 16.933a1.4 1.4 0 11.001-2.8 1.4 1.4 0 010 2.8m-4.667 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m-5.6 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m18.904-3.656c-1.013-5.655-5.753-10.22-11.528-11.105-4.343-.667-8.642.627-11.807 3.547-3.168 2.917-4.763 7.043-4.38 11.318.59 6.582 6.08 11.952 12.768 12.487 1.153.095 2.303.05 3.428-.13a14.12 14.12 0 002.428-.612.59.59 0 01.364-.006l3.714 1.167c.785.246 1.588-.331 1.588-1.144l-.002-3.517c0-.17.086-.301.157-.38a14.028 14.028 0 001.58-2.147c1.705-2.862 2.29-6.14 1.69-9.478"
                fill="currentColor"
                fill-rule="nonzero"
              ></path>
            </svg>
            Member Chat
          </Button>
        </div>
      )}
      {modal1Open && (
        <div className={`card border-rounded ${styles.modalChat}`}>
          <div className={`card-header ${styles.customModalHeader}`}>
            <div className={styles.modalLeftSide}>
              <ReactSVG
                style={{ cursor: "pointer", marginRight: "10px" }}
                src="/logo.svg"
                wrapper="span"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-class-name");
                  svg.setAttribute("style", "width: 55px");
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: "20px",
                    margin: "0px",
                    fontWeight: "bold",
                  }}
                >
                  NLG Chat
                </p>
                <p style={{ fontSize: "14px", margin: "0px" }}>
                  We'll reply as soon as we can{" "}
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "15px", cursor: "pointer" }}
              onClick={() => setModal1Open(false)}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.077 6l.923.923L12.923 12 18 17.077l-.923.923L12 12.923 6.923 18 6 17.077 11.076 12 6 6.923 6.923 6 12 11.077 17.077 6z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
            {/* <p style={{fontSize:'22px', marginRight:'15px', cursor:'pointer'}} onClick={ ()=> setModal1Open(false)} > X</p> */}
          </div>
          <div
            className={`card-body ${styles.cardBody}`}
            ref={chatBoxRef}
            style={{ backgroundColor: "#E3E2E2" }}
          >
            <div className={styles.messagesContainer}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${
                    message.type === "user" ? styles.user : styles.bot
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            {replyForm && !replySent && (
              <>
                <div className={`${styles.message} ${styles.bot}`}>
                  <p>
                    Hey there, please leave your details so we can contact you
                    even if you are no longer on the site.
                  </p>
                </div>
                <div className={`${styles.message} ${styles.bot}`}>
                  <ReplyForm onSubmit={handleReplySubmit} />
                </div>
              </>
            )}
          </div>

          <div className="card-footer">
            <Input
              placeholder="Type Your message..."
              style={{ height: "55px" }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              suffix={
                <a
                  className="ms-1 text-muted"
                  href="#!"
                  onClick={sendChat}
                  ref={sendButtonRef}
                >
                  <FaPaperPlane fontSize={"24px"} />
                </a>
              }
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Frontscreen;
