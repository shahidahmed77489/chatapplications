import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import avatar from "../assets/images/user-circle.png";
import { useSelector } from "react-redux";
import axios from "axios";
const ChatApp = () => {
  // const socket = useMemo(() => io("http://localhost:8080"), []);
  const socket = useMemo(
    () => io("https://chatapplications-46nt.onrender.com/"),
    []
  );
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [allUserID, setallUserID] = useState([]);
  const [newUser, setNewUser] = useState([]);
  const [myMsg, setMyMsg] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [idMatch, setIdMatch] = useState("");
  const { data } = useSelector((state) => state.userData);
  const { loginUser } = useSelector((state) => state.userData);
  const [userMessage, setUserMessage] = useState({});
  const [storeMyMessage, setStoreMyMessage] = useState([]);

  const [isCustomId, setCustomId] = useState("");
  const [storeSenderMessage, setStoreSenderMessage] = useState([]);
  // console.log(data);
  // console.log(loginUser?.id);
  console.log(storeMyMessage);

  //
  const addSessionId = async (obj) => {
    try {
      await axios.put(
        `https://65d4a2e83f1ab8c63435a17e.mockapi.io/loginInfo/${loginUser?.id}`,
        obj,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setNewUser(socket.id);
      const sessionUserObj = {
        sessionId: socket.id,
      };
      addSessionId(sessionUserObj);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setAllMessages((prevMessages) => [...prevMessages, data]);
    });
    socket.on("connected-users", (connectedSocketIds) => {
      setallUserID(connectedSocketIds);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  //
  const sendingMessageHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMyMsg((prevData) => [...prevData, message]);
    setMessage(" ");
    setUserMessage({
      customId: isCustomId,
      message: message,
    });
    setStoreMyMessage((prev) => [...prev, userMessage]);
  };

  const userIdHandler = async (user) => {
    setCustomId(user?.customId);
    setAllMessages([]);
    setMyMsg([]);
    setStoreMyMessage([]);
    try {
      const response = await axios.get(
        `https://65d4a2e83f1ab8c63435a17e.mockapi.io/loginInfo/${user?.id}`
      );
      if (response?.data) {
        setIdMatch(response?.data);
        setRoom(response?.data?.sessionId);
        setShowMessage(true);
      }
    } catch (error) {
      throw error;
    }

    if (loginUser) {
      var updateUser = JSON.parse(JSON.stringify(loginUser));
      updateUser.sender = [...updateUser.sender, storeMyMessage];
    }
    if (storeMyMessage.length > 1) {
      // setStoreSenderMessage(storeMyMessage);
      await axios.put(
        `https://65d4a2e83f1ab8c63435a17e.mockapi.io/loginInfo/${updateUser.id}`,
        updateUser
      );
    }
  };
  // console.log(storeSenderMessage);
  // console.log(storeMyMessage);
  useEffect(() => {}, [allUserID, allMessages]);
  useEffect(() => {}, [newUser, idMatch]);
  return (
    <div className="flex">
      <div className="w-[25%] bg-[#f3f5ff] h-screen ">
        <div className="flex items-center gap-3 mx-10 py-5">
          <div className="w-14">
            <img src={avatar} alt="error" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{loginUser?.username}</h3>
            <p className="font-light text-gray-600">My Account </p>
          </div>
        </div>
        <hr />
        <div className="mx-10 mt-6">
          <h2 className="text-blue-500 font-semibold mt-6 text-lg">Message</h2>
          {data?.map((item, index) => {
            return (
              <div
                onClick={() => userIdHandler(item)}
                key={index}
                className="flex items-center py-4 border-b border-gray-300"
              >
                <div className="flex items-center cursor-pointer">
                  <div>
                    <img src={avatar} alt="error" width={40} height={40} />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-xxl">{item?.username}</h3>
                    <p className="text-sm font-light text-gray-600">
                      {"Online"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        {showMessage && (
          <div className="w-full h-screen bg-white flex flex-col items-center ">
            <div className="w-[95%] bg-[#f3f5ff] h-[80px] my-4 rounded flex px-14 items-center">
              <div className="cursor-pointor">
                <img src={avatar} alt="error" width={40} height={40} />
              </div>
              <div className="ml-4 mr-auto">
                <h3 className="font-semibold  text-xxl">{idMatch?.username}</h3>
                <p className="text-sm font-light text-gray-600">Online</p>
              </div>
              <div className="cursor-pointer">
                <span>
                  <i className="fa-solid fa-phone-flip"></i>
                </span>
              </div>
            </div>
            <div className="h-[75%] w-full overflow-scroll overflow-x-hidden shadow-md">
              <div className="p-4">
                {myMsg.map((msg, index) => {
                  return (
                    <div
                      className="max-w-[25%]  rounded-b-xl rounded-tl-xl bg-blue-500 ml-auto text-white p-4 mb-2 text-sm"
                      key={index}
                    >
                      {msg}
                    </div>
                  );
                })}
              </div>
              <div className="p-4">
                {allMessages?.map((msg, index) => {
                  return (
                    <div
                      className="max-w-[25%]  bg-[#f3f5ff] rounded-b-xl rounded-tr-xl p-4 mb-2 text-sm"
                      key={index}
                    >
                      {msg}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=" w-full mr-auto flex items-center ">
              <div className="w-full">
                <form onSubmit={sendingMessageHandler}>
                  <div className="mt-2">
                    <input
                      className="w-full px-6 py-3 border-0 shadow-md rounded bg-[#f3f5ff] outline-none italic"
                      value={message}
                      type="text"
                      placeholder="Enter New Message"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="w-full px-6 py-3 border-0 shadow-md rounded bg-[#f3f5ff] outline-none italic"
                      value={room}
                      type="text"
                      placeholder="Enter Room ID"
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#f3f5ff] text-gray-500 italic  px-8 rounded py-2 my-2 w-full"
                  >
                    <span>
                      <i className="fa-regular fa-paper-plane"></i>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatApp;
