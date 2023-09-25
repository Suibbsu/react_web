package kr.or.iei.member.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;

import kr.or.iei.JwtUtil;
import kr.or.iei.PageInfo;
import kr.or.iei.Pagination;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.vo.Member;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	@Value("${jwt.secret}")
	private String secretKey;
	private long expiredMs;
	@Autowired
	private Pagination pagination;

	public MemberService() {
		super();
		expiredMs = 1000 * 60 * 60l;
	}

	public Member selectOneMember(String memberId) {
		// TODO Auto-generated method stub
		return memberDao.selectOneMember(memberId);
	}

	@Transactional
	public int insertMember(Member member) {
		return memberDao.insertMember(member);

	}

	public String login(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		// bCrypt~ . matches(평문패스워드 , 암호화패스워드)
		if (m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return jwtUtil.createToken(member.getMemberId(), secretKey, expiredMs);
		} else {
			return "실패";
		}
	}

	@Transactional
	public int changePhone(Member member) {
		// TODO Auto-generated method stub
		return memberDao.changePhone(member);
	}

	@Transactional
	public int deleteMember(String memberId) {
		// TODO Auto-generated method stub
		return memberDao.deleteMember(memberId);
	}

	public int pwChk(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		// bCrypt~ . matches(평문패스워드 , 암호화패스워드)
		if (m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
		} else {
			return 0;
		}
	}

	@Transactional
	public int changePwMember(Member member) {
		return memberDao.changePwMember(member);

	}

	public Map memberList(int reqPage) {
		int totalCount =memberDao.totalCount();
		int numPerPage = 10;
		int pageNaviSize = 5;
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List memberList = memberDao.memberList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("list", memberList);
		map.put("pi",pi);
		return map;
	}
	
	@Transactional
	public int changeType(Member member) {
		// TODO Auto-generated method stub
		return memberDao.changeType(member);
	}

}
