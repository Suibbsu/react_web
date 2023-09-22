import { Route, Routes } from "react-router-dom";
import "./board.css";
import BoardList from "./BoardList";
import BoardWrite from "./BoardWrite";
import BoardView from "./BoardView";
import BoardModify from "./BoardModify";
const BoardMain = (props) => {
  const isLogin = props.isLogin;
  const setIsLogin = props.setIsLogin;
  return (
    <div className="board-all-wrap">
      <div className="board-title">BOARD</div>
      <Routes>
        <Route path="view" element={<BoardView isLogin={isLogin} />} />
        <Route path="write" element={<BoardWrite />} />
        <Route path="modify" element={<BoardModify />} />
        <Route path="*" element={<BoardList isLogin={isLogin} />} />
        {/* 서브라우팅에서 path="*"
             : default값임 = 가장 아래쪽에 써야함
                -> swith문에서 default 생각하면 편함
        */}
      </Routes>
    </div>
  );
};
export default BoardMain;
