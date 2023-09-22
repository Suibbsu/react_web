import { useState } from "react";
import { Button1 } from "../util/Buttons";
import Input from "../util/InputFrm";
import TextEditor from "../util/TextEditor";

const BoardFrm = (props) => {
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const boardDetail = props.boardDetail;
  const setBoardDetail = props.setBoardDetail;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const boardFile = props.boardFile;
  const setBoardFile = props.setBoardFile;
  const boardImg = props.boardImg;
  const setBoardImg = props.setBoardImg;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const buttonEvent = props.buttonEvent;
  const type = props.type;
  //새첨부파일 출력용 state
  const [newFileList, setNewFileList] = useState([]);
  const thumbnailChange = (e) => {
    const files = e.currentTarget.files;
    if (files.length !== 0 && files[0] != 0) {
      setThumbnail(files[0]); //썸네일 파일 전송을위한 state에 값 파일객체 저장
      //화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setBoardImg(reader.result);
      };
    } else {
      setThumbnail({});
      setBoardImg("");
    }
  };
  const changeFile = (e) => {
    const files = e.currentTarget.files;
    setBoardFile(files);
    const arr = new Array();
    for (let i = 0; i < files.length; i++) {
      arr.push(files[0].name);
    }
    setNewFileList(arr);
  };
  return (
    <div className="board-frm-wrap">
      <div className="board-frm-top">
        <div className="board-thumbnail">
          {boardImg === "" ? (
            <img src="/Image/default.png" />
          ) : (
            <img src={boardImg} />
          )}
        </div>
        <div className="board-info">
          <table className="board-info-tbl">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="boardTitle">제목</label>
                </td>
                <td>
                  <Input
                    type="text"
                    data={boardTitle}
                    setData={setBoardTitle}
                    content="boardTitle"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="thumbnail">대표이미지</label>
                </td>
                <td>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={thumbnailChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="boardFile">첨부파일</label>
                </td>
                <td>
                  <input type="file" onChange={changeFile} multiple />
                </td>
              </tr>
              <tr className="file-list">
                <td>첨부파일 목록</td>
                <td>
                  <div className="file-zone">
                    {newFileList.map((item, index) => {
                      return (
                        <p key={"newFile" + index}>
                          <span className="filename">{item}</span>
                        </p>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="board-content-box">
        <TextEditor
          data={boardDetail}
          setData={setBoardDetail}
          url="/board/contentImg"
        />
      </div>
      <div className="board-btn-box">
        <Button1 text="작성하기" clickEvent={buttonEvent} />
      </div>
    </div>
  );
};
export default BoardFrm;
