import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getAllMessageRoute, sendMessageRoute } from "../Utils/APIRoutes";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
// import {v4 as uuidv4 } from "uuid";

const ChatContainer = ({ currentchat, currentuser, socket }) => {
  const [messages, setmessages] = useState([]);

  const scrollRef = useRef();

  useEffect(() => {
    const getallmessages = async () => {

      const response = await axios.post(getAllMessageRoute, {
        from: currentuser._id,
        to: currentchat._id,
      });
      setmessages(response.data);
    };
    if(currentchat){
      getallmessages();
    }
  }, [currentchat]);

  
  const handleSendMsg = async (msg) => {
    
    setmessages([...messages, {
      fromSelf: true,
      message: msg,
    }]);

    await axios.post(sendMessageRoute, {
      from: currentuser._id,
      to: currentchat._id,
      message: msg,
    });
    socket.current.emit("send-msg",{
      to: currentchat._id,
      from: currentuser._id,
      message: msg,
    });

  };

  socket.current.on("msg-recieve",(messag)=>{
        
    setmessages([...messages,{
            fromSelf: false,
            message: messag
          }]);
        })

  // useEffect(() => {
  //   if(socket.current){
  //     socket.current.on("msg-recieve",(msg)=>{
  //       setarrivalMessage({
  //         fromSelf: false,
  //         message: msg
  //       });
  //   })
  //   }
  
  // }, [])

  // useEffect(() => {
    
  //   arrivalMessage && setmessages((prev)=> [...prev, arrivalMessage]);
  
  // }, [arrivalMessage])
  
  
  useEffect(() => {
    
    scrollRef.current?.scrollIntoView({behaviour:"smooth"});
  
  }, [messages])
  

  return (
    <Chatcontainer>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentchat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentchat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            // <div ref={scrollRef} key={uuidv4()}>
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Chatcontainer>
  );
};

const Chatcontainer = styled.div`
  height: 90vh;
  overflow: hidden;
  // padding-top: 1rem;
  .chat-header {
    background-color: #02163b; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    height: 72%;
    gap: 1rem;
    overflow: auto;
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        color: white;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
      }
    }
    .sended{
      justify-content: flex-end;
      .content{
        background-color: #4f04ff21;
      }
    }
    .recieved{
      justify-content: flex-start;
      .content{
        background-color: #9900ff20;
      }
    }

    scrollbar-width: thin;
    scrollbar-color: #e3e3e3 transparent;
    


    &::-webkit-scrollbar{
      width: 0.2rem;
      &-thumb{
        background-color: #e3e3e3;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
   
  }
`;

export default ChatContainer;
