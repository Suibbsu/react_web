import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import { Button1, Button2 } from "../util/Buttons";
import { useNavigate } from "react-router-dom";

const BoardList = (props) => {
  const isLogin = props.isLogin;
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({});
  useEffect(() => {
    axios
      .get("/board/list/" + reqPage)
      .then((res) => {
        console.log(res.data);
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pi);
      })
      .catch((res) => {
        console.log(res.response.status);
      });
  }, [reqPage]);
  const navigate = useNavigate();
  const write = () => {
    navigate("write");
  };
  return (
    <div>
      {isLogin ? (
        <div className="board-write-btn">
          <Button2 text="글쓰기" clickEvent={write} />
        </div>
      ) : (
        ""
      )}
      <div className="board-list-wrap">
        {boardList.map((board, index) => {
          return <BoardItem key={("board", index)} board={board} />;
        })}
      </div>
      <div className="board-page">
        <Pagination
          reqPage={reqPage}
          setReqPage={setReqPage}
          pageInfo={pageInfo}
        />
      </div>
    </div>
  );
};
const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  const boardView = () => {
    navigate("/board/view", { state: { boardNo: board.boardNo } });
  };
  return (
    <div className="board-item" onClick={boardView}>
      <div className="board-item-img">
        {board.boardImg === null ? (
          <img src="/Image/default.png" />
        ) : (
          <img src={"/board/" + board.boardImg} />
        )}
      </div>
      <div className="board-item-info">
        <div className="board-item-title">{board.boardTitle}</div>
        <div className="board-item-writer">{board.memberId}</div>
        <div className="board-item-date">{board.boardDate}</div>
      </div>
    </div>
  );
};
export default BoardList;
