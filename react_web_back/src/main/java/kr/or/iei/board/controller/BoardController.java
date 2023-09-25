package kr.or.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.FileUtil;
import kr.or.iei.board.model.service.BoardService;
import kr.or.iei.board.model.vo.Board;
import kr.or.iei.board.model.vo.BoardFile;

@RestController
@RequestMapping(value = "/board")
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Autowired
	private FileUtil fileUtil;
	@Value("${file.root}")
	private String root;

	@GetMapping(value = "/list/{reqPage}")
	public Map list(@PathVariable int reqPage) {
		Map map = boardService.boardList(reqPage);
		return map;
	}

	@PostMapping(value = "/insert")
	public int insertBoard(@ModelAttribute Board b, @ModelAttribute MultipartFile thumbnail,
			@ModelAttribute MultipartFile[] boardFile, @RequestAttribute String memberId) {
		b.setMemberId(memberId);
		String savepath = root + "board/";
		if (thumbnail != null) {
			String filename = thumbnail.getOriginalFilename();
			String filepath = fileUtil.getFilepath(savepath, filename, thumbnail);
			b.setBoardImg(filepath);
		}
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if (boardFile != null) {
			for (MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.getFilepath(savepath, filename, file);
				BoardFile bf = new BoardFile();
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				fileList.add(bf);
			}
		}
		int result = boardService.insertBoard(b, fileList);
		return result;
	}

	@GetMapping(value = "/view/{boardNo}")
	public Board view(@PathVariable int boardNo) {
		return boardService.selectOneBoard(boardNo);
	}

	// 파일다운로드용 리턴타입
	@GetMapping(value = "/fileDown/{boardFileNo}")
	// Resource 어노 spring.core.io
	public ResponseEntity<Resource> filedown(@PathVariable int boardFileNo)
			throws FileNotFoundException, UnsupportedEncodingException {
		BoardFile boardFile = boardService.getBoardFile(boardFileNo);
		System.out.println(boardFile);
		String savepath = root + "board/";
		File file = new File(savepath + boardFile.getFilepath());
		Resource resouce = new InputStreamResource(new FileInputStream(file));
		String encodeFile = URLEncoder.encode(boardFile.getFilename(), "UTF-8");

		HttpHeaders header = new HttpHeaders();
		// filename="abc" 큰따음표 내부에 표현하려면 \문자 사용해야함 (\") =" 같음
		header.add("Content-Disposition", "attachment; filename=\"" + encodeFile + "\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expire", "0");
		return ResponseEntity.status(HttpStatus.OK).headers(header).contentLength(file.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(resouce);
	}

	@PostMapping(value = "/contentImg")
	public String contentImg(@ModelAttribute MultipartFile image) {
		String savepath = root + "board/editor/";
		String filename = image.getOriginalFilename();
		String filepath = fileUtil.getFilepath(savepath, filename, image);
		return "/board/editor/" + filepath;
	}

	@GetMapping(value = "/delete/{boardNo}")
	public int deleteBoard(@PathVariable int boardNo) {
		// 해당게시글 첨부파일 삭제를위해 파일목록을 결과로 받음
		List<BoardFile> fileList = boardService.delete(boardNo);
		if (fileList != null) {
			String savepath=root+"board/";
			for(BoardFile boardFile : fileList) {
				File file = new File(savepath+boardFile.getFilepath());
				file.delete();
			}
			return 1;
		} else {
			return 0;
		}
	}
	
	@PostMapping(value="/modify")
	public int modify(@ModelAttribute Board b, @ModelAttribute MultipartFile thumbnail,@ModelAttribute MultipartFile[] boardFile) {
		//Board table 업데이트, 
		//썸네일이 들어오면 -> 썸네일 교체, 썸네일없으면 기존 썸네일로 덮어쓰기
		//Board_file 테이블 업데이트 -> 삭제한게 있으면 삭제, 추가한게 있으면 insert
		//삭제한파일 있으면 파일 물리적 삭제
		if(b.getBoardImg().equals("null")) {
			b.setBoardImg(null);
		}
		String savepath = root+"board/";
		if(thumbnail != null) {
			String filepath = fileUtil.getFilepath(savepath, thumbnail.getOriginalFilename(), thumbnail);
			b.setBoardImg(filepath);
		}
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if(boardFile != null) {
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.getFilepath(savepath, filename, file);
				BoardFile bf = new BoardFile();
				bf.setBoardNo(b.getBoardNo());
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				fileList.add(bf);
			}
		}
		//db에서 삭제한파일이있으면 실제로도 삭제하기 위해서 
		List<BoardFile> delFileList = boardService.modify(b,fileList);
		if(delFileList != null) {
			for(BoardFile bf : delFileList) {
				File delFile = new File(savepath+bf.getFilepath());
				delFile.delete();
			}
			return 1;
		}else {
			return 0;
		}
	}
	//관리자페이지
	@GetMapping(value="/adminList/{reqPage}")
	public Map adminList(@PathVariable int reqPage) {
		return boardService.adminList(reqPage);
	}
	
	@PostMapping(value="/changeStatus")
	public int changeStatus(@RequestBody Board b) {
		return boardService.changeStatus(b);
	}

}
