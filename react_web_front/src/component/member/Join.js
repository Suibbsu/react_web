import Input from "../util/InputFrm";
import { Button1, Button2, Button3 } from "../util/Buttons";
import "./join.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");
  const navigate = useNavigate();
  const idCheck = () => {
    const idReg = /^[a-zA-Z0-9]{4,8}$/;
    if (!idReg.test(memberId)) {
      //정규표현식 만족하지 못했을때
      setCheckIdMsg("아이디는 영어 대/소문자/숫자로 4~8글자 입니다.");
    } else {
      //정규표현식 만족했을 때 -> DB에 중복체크
      axios
        //.get("/member/checkId", { params: { memberId: memberId } })
        .get("/member/checkId/" + memberId)
        .then((res) => {
          if (res.data === 0) {
            //응답 객체에 data 속성이 Controller에서 리턴한 데이터
            setCheckIdMsg("");
          } else {
            setCheckIdMsg("이미 사용중인 아이디입니다.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
      setCheckIdMsg("ㅈㅇㅈㅇㅈㅇㅈㅇㅇㅈ");
    }
  };
  const pwCheck = () => {
    if (memberPw !== memberPwRe) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwMsg("");
    }
  };
  const join = () => {
    if (checkIdMsg === "" && checkPwMsg === "") {
      /*
      const member = {
        memberId: memberId,
        memberPw: memberPw,
        memberName: memberName,
        memberPhone: memberPhone,
      };
      */
      //앞뒤값(키,값)이 같을때는 아래방식으로 적용가능
      const member = { memberId, memberPw, memberName, memberPhone };
      axios
        //.get("/member/checkId/" + memberId)
        //post 전송은 2번째매개변수에 null , 세번째에 params
        .post("/member/join", member)
        .then((res) => {
          if (res.data === 1) {
            navigate("/login");
          } else {
            Swal.fire("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("입력값을 확인하세요");
    }
  };
  return (
    <div className="join-wrap">
      <div className="join-title">회원가입</div>
      <JoinInputWrap
        data={memberId}
        setData={setMemberId}
        type="text"
        content="memberId"
        label="아이디"
        checkMsg={checkIdMsg}
        blurEvent={idCheck}
      />
      <JoinInputWrap
        data={memberPw}
        setData={setMemberPw}
        type="password"
        content="memberPw"
        label="비밀번호"
      />
      <JoinInputWrap
        data={memberPwRe}
        setData={setMemberPwRe}
        type="password"
        content="memberPwRe"
        label="비밀번호 확인"
        checkMsg={checkPwMsg}
        blurEvent={pwCheck}
      />
      <JoinInputWrap
        data={memberName}
        setData={setMemberName}
        type="text"
        content="memberName"
        label="이름"
      />
      <JoinInputWrap
        data={memberPhone}
        setData={setMemberPhone}
        type="text"
        content="memberPhone"
        label="전화번호"
      />
      <div className="join-btn-box">
        <Button1 text="회원가입" clickEvent={join} />
      </div>
    </div>
  );
};
const JoinInputWrap = (props) => {
  const data = props.data;
  const setData = props.setData;
  const type = props.type;
  const content = props.content;
  const label = props.label;
  const blurEvent = props.blurEvent;
  const checkMsg = props.checkMsg;
  return (
    <div className="join-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={content}>{label}</label>
        </div>
        <div className="input">
          <Input
            type={type}
            data={data}
            setData={setData}
            content={content}
            blurEvent={blurEvent}
          />
        </div>
      </div>
      <div className="check-msg">{checkMsg}</div>
    </div>
  );
};
export default Join;
