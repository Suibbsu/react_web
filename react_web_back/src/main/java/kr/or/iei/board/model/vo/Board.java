package kr.or.iei.board.model.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
public class Board {
	private int boardNo;
	private String boardTitle;
	private String boardImg;
	private String boardDetail;
	private int boardWriter;
	private String memberId; //화면처리를 위한 게시글 작성자
	private int boardStatus;
	private String boardDate;
	private List fileList;	//해당 게시글의 첨부파일 리스트
	private String delFileNo; //파일 삭제 시 저장할 변수
}
