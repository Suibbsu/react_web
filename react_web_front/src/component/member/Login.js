import "./login.css";
import Input from "../util/InputFrm";
import { Link, useNavigate } from "react-router-dom";
import { Button1, Button2, Button3 } from "../util/Buttons";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Login = (props) => {
  const setIsLogin = props.setIsLogin;
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const navigate = useNavigate();
  const join = () => {
    navigate("/join");
  };
  const login = () => {
    const member = { memberId, memberPw };
    axios
      .post("/member/login", member)
      .then((res) => {
        if (res.data === "실패") {
          Swal.fire("아이디 또는 비밀번호를 확인하세요");
        } else {
          window.localStorage.setItem("token", res.data);
          setIsLogin(true);
          navigate("/");
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  return (
    <div className="login-wrap">
      <div className="login-title">LOGIN</div>
      <div className="input-wrap">
        <label htmlFor="memberId">아이디</label>
        <Input
          type="text"
          data={memberId}
          setData={setMemberId}
          content="memberId"
        />
      </div>
      <div className="input-wrap">
        <label htmlFor="memberPw">비밀번호</label>
        <Input
          type="password"
          data={memberPw}
          setData={setMemberPw}
          content="memberPw"
        />
      </div>
      <div className="search-box">
        <Link to="#">아이디 찾기</Link>
        <span className="material-icons">horizontal_rule</span>
        <Link to="#">비밀번호 찾기</Link>
      </div>
      <div className="login-btn-box">
        <Button2 text="로그인" clickEvent={login} />
      </div>
      <div className="login-btn-box">
        <Button3 text="회원가입" clickEvent={join} />
      </div>
    </div>
  );
};
export default Login;
