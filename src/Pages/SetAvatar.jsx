import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import loader from "../assets/loading.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../Utils/APIRoutes";
import { Buffer } from "buffer";

const SetAvatar = () => {
  const Avatar_api = "https://api.multiavatar.com";

  const navigate = useNavigate();

  const [avatars, setavatars] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [selectedAvatar, setselectedAvatar] = useState(undefined);
    
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };


  useEffect(() => {
    
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login");
    }
    
  }, [])
  

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    }
    else{
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));

      console.log(user)

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image: avatars[selectedAvatar]
      })
      
      if(data.isSet){
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/")
      }
      else{
        toast("Error setting avatar, Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    const avatar_data = async () => {
      const data = [];

      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${Avatar_api}/${Math.round(Math.random() * 10000)}`
        );

        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }

      setavatars(data);
      setisLoading(false);
    };

    avatar_data();
  }, []);

  return (
    <>
      {isLoading ? (
        <AvatarContainer>
          <div className="loader">
            <div className="container">
              <span className="one"></span>
              <span className="two"></span>
              <span className="three"></span>
              <span className="four"></span>
            </div>
          </div>
        </AvatarContainer>
      ) : (
        <AvatarContainer>
          <div className="title_container">
            <h1>Pick an avatar as your Profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => {
                      setselectedAvatar(index);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <button className="submitbtn" onClick={setProfilePicture}>
            {" "}
            Set as Profile Picture
          </button>
        </AvatarContainer>
      )}
      <ToastContainer />
    </>
  );
};

const AvatarContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader{
        background: #012;
        height: 100vh;
        width: 100vw;
        display: grid;
        place-items: center;

        .container {
            position: relative;
            width: 200px;
            height: 200px;
          }
          span {
            position: absolute;
            display: block;
            width: 40%;
            height: 40%;
            border-radius: 50%;
            animation: speed 2s infinite ease-in-out;
          }
          .one {
            background: #4285f4;
            animation-delay: 1.5s;
          }
          .two {
            background: #ea4335;
            animation-delay: 1s;
          }
          .three {
            background: #fbbc05;
            animation-delay: 0.5s;
          }
          .four {
            background: #34a853;
          }
          @keyframes speed {
            0% {
              transform: translate(0%);
              border-radius: 50%;
            }
            25% {
              transform: translate(150%) scale(0.5);
              border-radius: 0%;
            }
            50% {
              transform: translate(150%, 150%);
              border-radius: 50%;
            }
            75% {
              transform: translate(0, 150%) scale(0.5);
              border-radius: 0%;
            }
          }
          
    }


    .title_container{
        h1{
            color: white;
        }
    }

    .avatars{
        display: flex;
        gap: 2rem;

        .avatar{
            border: 0.5rem solid transparent;
            padding: 0.5rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.3s ease-in-out;
            img{
                height: 6rem;
            }
        }
        .avatar:hover{
            transform scale(1.2);
        }

        .selected{
            border: 0.5rem solid #4e0eff;
        }
    }

    .submitbtn{
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover{
          background-color: #4e3eff;
        }
      }


`;

export default SetAvatar;
