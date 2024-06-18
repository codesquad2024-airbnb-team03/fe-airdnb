import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>에어비앤비 지원</h3>
        <ul>
          <li>도움말 센터</li>
          <li>안전 문제 관련 도움받기</li>
          <li>에어커버</li>
          <li>차별 반대</li>
          <li>장애인 지원</li>
          <li>예약 취소 옵션</li>
          <li>이웃 민원 신고</li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>호스팅</h3>
        <ul>
          <li>당신의 공간을 에어비앤비하세요</li>
          <li>호스트를 위한 에어커버</li>
          <li>호스팅 자료</li>
          <li>커뮤니티 포럼</li>
          <li>책임감 있는 호스팅</li>
          <li>무료 호스팅 클래스 참여하기</li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>에어비앤비</h3>
        <ul>
          <li>뉴스룸</li>
          <li>새로운 기능</li>
          <li>채용정보</li>
          <li>투자자 정보</li>
          <li>Airbnb 긴급 숙소</li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>
          © 2024 Airbnb, Inc. · 개인정보 처리방침 · 이용약관 · 사이트맵 · 한국의
          변경된 환불 정책 · 회사 세부정보
        </p>
        <p>
          웹사이트 제공자: Airbnb Ireland UC, private unlimited company, 8
          Hanover Quay Dublin 2, D02 DP23 Ireland | 이사: Dermot Clarke, Killian
          Pattwell, Andrea Finnegan | VAT 번호: IE9827384L | 사업자 등록 번호:
          IE 511825 | 연락처: terms@airbnb.com, 웹사이트, 080-822-0230 | 호스팅
          서비스 제공업체: 아마존 웹서비스 | 에어비앤비는 통신판매 중개자로
          에어비앤비 플랫폼을 통해 게스트와 호스트에게 예약된 숙소, 체험, 호스트
          서비스에 관한 의무와 책임은 해당 서비스를 제공하는 호스트에게
          있습니다.
        </p>
        <div className="footer-language-currency">
          <span>한국어 (KR)</span>
          <span>₩ KRW</span>
          <div className="social-icons">
            <a href="https://www.facebook.com">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.blog.com">
              <i className="fab fa-blog"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
