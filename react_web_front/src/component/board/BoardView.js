import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BoardView = (props) => {
  const isLogin = props.isLogin;
  const location = useLocation();
  const boardNo = location.state.boardNo;
  const [board, setBoard] = useState({});
  useEffect(() => {
    axios
      .get("/board/view/" + boardNo)
      .then((res) => {
        console.log(res.data);
        setBoard(res.data);
      })
      .catch((res) => {
        console.log(res.response.status);
      });
  }, []);
  return (
    <div className="board-view-wrap">
      <div className="board-view-title">{board.boardTitle}</div>
      <div className="board-view-info">
        <div>{board.memberId}</div>
        <div>{board.boardDate}</div>
      </div>
      <div className="board-view-file">
        {board.fileList
          ? board.fileList.map((file, index) => {
              return <FileItem key={("file", index)} file={file} />;
            })
          : ""}
      </div>
      <div className="board-view-thumbnail">
        {board.boardImg ? (
          <img src={"/board/" + board.boardImg} />
        ) : (
          <img src="/Image/default.png" />
        )}
      </div>

      <div
        className="board-view-detail"
        dangerouslySetInnerHTML={{ __html: board.boardDetail }}
      ></div>
    </div>
  );
};
/*
태그로 표시될때 아래처럼표시
      <div
        className="board-view-detail"
        dangerouslySetInnerHTML={{ __html: board.boardDetail }}
      ></div>

*/
const FileItem = (props) => {
  const file = props.file;
  const fileDown = () => {
    axios
      .get("/board/fileDown/" + file.boardFileNo, {
        //axios는 기본적으로 응답을 json -> 이 요청은 파일데이터를 받아야함
        //-> 일반적인 json으로 처리 불가능 -> 파일로받을게 라는 설정
        responseType: "blob",
      })
      .then((res) => {
        //서버에서 받은 데이터 바이너리데이터(0,1로 구성되어있는 데이터)
        //->blob형식으로 변환
        const blob = new Blob([res.data]);
        //blob데이터를 이용해서 데이터객체 URL 생성
        const fileObjectUrl = window.URL.createObjectURL(blob);

        //blob데이터 url을 다운로드할 링크를 생성
        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none"; //화면에 a태그 안보이게

        //파일명 디코딩하는 함수
        const downloadFilename = (data) => {
          const disposition = data.headers["content-disposition"];
          const filename = decodeURI(
            disposition
              .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
              .replace(/['"]/g, "")
          );
          return filename;
        };
        //다운로드할 파일 이름 지정
        link.download = downloadFilename(res);

        document.body.appendChild(link); //파일과 연결된 a태그를 문서에 추가
        link.click(); //a태그를 클릭해서 다운로드
        link.remove(); //다운로드 후 삭제
        window.URL.revokeObjectURL(fileObjectUrl); //파일링크삭제
      })
      .catch((res) => {
        console.log(res.response.status);
      });
  };
  return (
    <div className="board-file">
      <span onClick={fileDown} className="material-icons file-icon">
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};
export default BoardView;
