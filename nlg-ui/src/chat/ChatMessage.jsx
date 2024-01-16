import React from "react";
import { FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";

function ChatMessages() {
  return (
    <div className="container " style={{ backgroundColor: "#eee" , padding:'0px' }}>
      <div className="row justify-content-center">
        
          <div id="chat2" className="card" style={{ borderRadius: "15px" }}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
              <button className="btn btn-primary btn-sm">Let's Chat App</button>
            </div>
            <div className="card-body" style={{minHeight:'200px'}}>
              {/* ... Your chat messages here ... */}
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                alt="avatar 3"
                style={{ width: "45px", height: "100%" }}
              />
              <div className="input-group ms-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type message"
                  aria-label="Type message"
                />
                <div className="input-group-append">
                  <button className="btn btn-link text-muted">
                    <FaPaperclip />
                  </button>
                  <button className="btn btn-link text-muted">
                    <FaSmile />
                  </button>
                  <button className="btn btn-link">
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          </div>
        
      </div>
    </div>
  );
}

export default ChatMessages;
