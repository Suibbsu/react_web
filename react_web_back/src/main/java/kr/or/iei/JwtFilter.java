package kr.or.iei;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
	private String secretKey;
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String auth = request.getHeader(HttpHeaders.AUTHORIZATION); // 헤더정보 중 인증키가 전달되는 값을 추출
		System.out.println("filter/auth : " + auth);
		// 1. 인증토큰이 없거나 or 잘못보냈거나 한경우
		if (auth == null || !auth.startsWith("Bearer ") || auth.indexOf("null") != -1) {
			System.out.println("인증이 없거나, 잘못됨");
			filterChain.doFilter(request, response);
			return;
		}
		// token값만 꺼냄
		String token = auth.split(" ")[1];
		System.out.println("filter/token : " + token);
		// 2. 인증토큰이 정상이나 만료된경우
		if (jwtUtil.isExpired(token, secretKey)) {
			System.out.println("인증 시간 만료");
			filterChain.doFilter(request, response);
			return;
		}
		// 3. 아이디를 꺼내서 컨트롤러에 전달
		String memberId = jwtUtil.getMemberId(token, secretKey);
		System.out.println("filter/memberId : " + memberId);
		request.setAttribute("memberId", memberId);
		// 인증허가코드
		ArrayList<SimpleGrantedAuthority> list = new ArrayList<SimpleGrantedAuthority>();
		list.add(new SimpleGrantedAuthority("USER"));// 인증 허가된 사용자에게 USER등급 부여
		// 회원 등급부여 및 암호화 토큰 생성
		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(memberId, null, list);
		authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		// 해당 request에 대해서 인증을 허용(지금 들어온 요청)
		SecurityContextHolder.getContext().setAuthentication(authToken);

		filterChain.doFilter(request, response);
	}

}
