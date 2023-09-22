import "./pagination.css";
const Pagination = (props) => {
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  const pageInfo = props.pageInfo;
  const changePage = (e) => {
    const changePage = e.currentTarget.innerText;
    /*innerText로 꺼낸 값은 문자열이므로 숫자로 바꾸려면 downgrade */
    console.log(changePage);
    setReqPage(changePage);
  };
  //페이징 jsx가 저장될 배열
  const arr = new Array();
  //제일 앞으로 가는 버튼
  arr.push(
    <span
      onClick={() => {
        setReqPage(1);
      }}
      key="first-page"
      className="material-icons page-item"
    >
      first_page
    </span>
  );
  //이전페이지
  arr.push(
    <span
      onClick={() => {
        if (reqPage != 1) {
          setReqPage(Number(reqPage) - 1);
        }
      }}
      key="prev-page"
      className="material-icons page-item"
    >
      navigate_before
    </span>
  );
  //페이징 숫자
  let pageNo = pageInfo.pageNo;
  for (let i = 0; i < pageInfo.pageNaviSize; i++) {
    if (pageNo === Number(reqPage)) {
      arr.push(
        <span
          onClick={changePage}
          key={"page" + i}
          className="page-item active-page"
        >
          {pageNo}
        </span>
      );
    } else {
      arr.push(
        <span onClick={changePage} key={"page" + i} className="page-item">
          {pageNo}
        </span>
      );
    }
    pageNo++;
    if (pageNo > pageInfo.totalPage) {
      break;
    }
  }
  //다음페이지
  arr.push(
    <span
      onClick={() => {
        if (reqPage != pageInfo.totalPage) {
          setReqPage(Number(reqPage) + 1);
        }
      }}
      key="next-page"
      className="material-icons page-item"
    >
      navigate_next
    </span>
  );
  //제일 끝 페이지로 이동
  arr.push(
    <span
      onClick={() => {
        setReqPage(pageInfo.totalPage);
      }}
      key="last-page"
      className="material-icons page-item"
    >
      last_page
    </span>
  );
  return <div className="paging-wrap">{arr}</div>;
};

export default Pagination;
