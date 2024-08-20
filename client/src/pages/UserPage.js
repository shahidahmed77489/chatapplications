import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addToStore, addAdminUser } from "../utils/userSlice";
import { getUserInfo } from "../utils/getUserInfo";

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changeLoginAccess, setChangeLoginAccess] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    customId: "",
    password: "",
  });
  useEffect(() => {
    const userId = uuidv4();
    setUserData({ ...userData, customId: userId });
  }, []);
  const eventHandler = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const signUpHandler = (e) => {
    e.preventDefault();
    axios.post(
      "https://65d4a2e83f1ab8c63435a17e.mockapi.io/loginInfo",
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setChangeLoginAccess(!changeLoginAccess);
    setUserData({
      username: "",
      email: "",
      customId: "",
      password: "",
    });
  };
  const signInHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = await getUserInfo();
      const findUser = userInfo?.find(
        (item) =>
          item.email === userData.email && item.password === userData.password
      );
      dispatch(addAdminUser(findUser));
      const remainingUser = userInfo.filter((item) => item !== findUser);
      dispatch(addToStore(remainingUser));
      findUser ? navigate("/chatDashboard") : alert("password does not match");
    } catch (error) {
      throw error;
    }
  };
  return (
    <>
      <div className="flex justify-center items-center h-[100vh]">
        <form className="w-[40%] px-8 py-16 shadow-xl rounded">
          <h2 className="text-center font-bold text-3xl mb-8 text-red-400 italic">
            {changeLoginAccess ? "SignIn Page" : "SignUp Page"}
          </h2>
          {!changeLoginAccess && (
            <div className="mb-4">
              <input
                value={userData.username}
                name="username"
                className="w-full px-6 py-3 border-0 shadow-md rounded bg-[#f3f5ff] outline-none italic"
                type="text"
                placeholder="Enter UserName"
                onChange={(e) => eventHandler(e)}
              />
            </div>
          )}
          <div className="mb-4 ">
            <input
              value={userData.email}
              name="email"
              className="w-full px-6 py-3 border-0 shadow-md rounded bg-[#f3f5ff] outline-none italic"
              type="email"
              placeholder="Email"
              onChange={(e) => eventHandler(e)}
            />
          </div>
          {!changeLoginAccess && (
            <div className="mb-4 ">
              <input
                value={userData.customId}
                name="customId"
                className="w-full px-6 py-3 border-0 shadow-md rounded bg-[#f3f5ff] outline-none italic"
                type="text"
                placeholder="Generate Your Custom Id"
                onChange={(e) => eventHandler(e)}
                disabled
              />
            </div>
          )}
          <div className="mb-4 ">
            <input
              value={userData.password}
              name="password"
              className="w-full px-6 py-3 border-0 shadow-md rounded bg-[#f3f5ff] outline-none italic"
              type="text"
              placeholder={changeLoginAccess ? "Password" : "Create Password"}
              onChange={(e) => eventHandler(e)}
            />
          </div>
          <div className="mt-2 ">
            <button
              className="bg-[#f3f5ff] text-gray-500 shadow-md italic  px-8 rounded py-3 hover:bg-slate-200 duration-500 w-full"
              onClick={
                changeLoginAccess
                  ? (e) => signInHandler(e)
                  : (e) => signUpHandler(e)
              }
            >
              {changeLoginAccess ? "Sign In" : "Sign Up"}
            </button>
          </div>
          <p
            className="text-center mt-8 italic hover:text-red-400 cursor-pointer"
            onClick={() => setChangeLoginAccess(!changeLoginAccess)}
          >
            {changeLoginAccess
              ? "Create A New Account ?"
              : "Already Have An Account"}
          </p>
        </form>
      </div>
    </>
  );
};

export default UserPage;
