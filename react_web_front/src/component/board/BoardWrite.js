import { useState } from "react";
import BoardFrm from "./BoardFrm";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BoardWrite = () => {
  //제목, 썸네일 , 내용, 첨부파일 -> 전송용 데이터를 담은 state
  const [boardTitle, setBoardTitle] = useState("");
  const [thumbnail, setThumbnail] = useState({});
  const [boardDetail, setBoardDetail] = useState("");
  const [boardFile, setBoardFile] = useState([]);
  //boardImg -> 썸네일 미리보기용, fileList -> 첨부파일 목록 출력용
  const [boardImg, setBoardImg] = useState("");
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  //글쓰기 버튼 클릭시 동작할 함수(서버에 insert요청 함수)
  const write = () => {
    console.log(boardTitle);
    console.log(thumbnail);
    console.log(boardDetail);
    console.log(boardFile);
    if (boardTitle !== "" && boardDetail !== "") {
      //기본적인 문자열 또는 숫자데이터를 전송하는경우 json을 전송
      //파일이 포함되어있는경우 => FormData를 사용
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardDetail", boardDetail);
      form.append("thumbnail", thumbnail); //첨부파일을 전송하는경우 File객체를 전송
      //첨부파일이 여러개인경우(multiple인 경우 -> 같은이름으로 첨부파일이 여러개인경우)
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }
      const token = window.localStorage.getItem("token");
      axios
        .post("/board/insert", form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data > 0) {
            navigate("/board");
          }
        })
        .catch((res) => {
          console.log(res.response.status);
        });
    } else {
      Swal.fire("입력값을 확인하세요.");
    }
  };
  return (
    <div>
      <div className="board-frm-title">게시글 작성</div>
      <BoardFrm
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardDetail={boardDetail}
        setBoardDetail={setBoardDetail}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        boardFile={boardFile}
        setBoardFile={setBoardFile}
        boardImg={boardImg}
        setBoardImg={setBoardImg}
        fileList={fileList}
        setFileList={setFileList}
        buttonEvent={write}
        type="write"
      />
    </div>
  );
};

export default BoardWrite;
