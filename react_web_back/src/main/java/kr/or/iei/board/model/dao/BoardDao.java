package kr.or.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.PageInfo;
import kr.or.iei.board.model.vo.Board;
import kr.or.iei.board.model.vo.BoardFile;

@Mapper
public interface BoardDao {

	int totalCount();

	List selectBoardList(PageInfo pi);

	int insertBoard(Board b);

	int insertBoardFile(BoardFile boardFile);

	Board selectOneBoard(int boardNo);

	List selectBoardFile(int boardNo);

	BoardFile getBoardFile(int boardFileNo);

	List<BoardFile> selectBoardFileList(int boardNo);

	int deleteBoard(int boardNo);

	List<BoardFile> selectDelBoardFileList(String[] delFileNo);

	int deleteBoardFile(String[] delFileNo);

	int updateBoard(Board b);

	int adminTotalCount();

	List adminBoardList(PageInfo pi);

	int changeStatus(Board b);

}
