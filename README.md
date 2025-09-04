# Housing Subscription Notification Service

## Project URL

https://housing-subscription-noti.web.app/

## Purpose

https://www.applyhome.co.kr/cu/cuc/selectSubscrptAllimiView.do

<img width="735" height="384" alt="청약홈 알리미 서비스" src="https://github.com/user-attachments/assets/ee2a7026-2223-4693-a66d-a2c06bdbc3d8" />

청약홈에서 제공하는 관심지역/관심공고 청약알리미 서비스는 아파트, 공공지원민간임대, 무순위청약, 불법행위재공급 등 전 유형의 청약을 통틀어 최대 10개 지역까지만 알림을 받을 수 있는 제한이 있습니다.

본 서비스는 이러한 개수 제한 없이 다양한 유형의 청약 정보를 보다 편리하게 이메일로 받아볼 수 있도록 하였습니다.
또한, 지도를 이용한 청약 알림 희망 지역 선택 기능을 제공하여 기존의 가나다순 목록에서 원하는 지역을 찾기 어려웠던 점 및 알림 설정 후 1년 동안만 청약 알림을 받을 수 있는 제약을 개선했습니다.

## Features

- 청약 유형별 분리를 통한 가시성:
  - APT, 민간사전청약, 신혼희망타운
  - 오피스텔/생활숙박시설/도시형생활주택
  - 무순위청약, 불법행위 재공급, 공공지원민간임대, 임의공급
- 지도 기반 알림 희망 지역 선택
- 주요 정보를 담은 템플릿 기반의 HTML 이메일 알림

청약홈 분양정보 조회 서비스 API는 익일 00\~02시 사이에 업데이트되기에 알림 신청을 하실 경우 월요일\~금요일에 업데이트되는 내용을 익일인 화요일\~토요일에 받아볼 수 있습니다.

## Notification Template

모든 데이터명은 청약홈 API에서 제공하는 데이터를 기준으로 했으나, 일부 주택 청약 유형의 경우 차이가 있을 수 있습니다.

  <h4>주택 청약 공고 알림</h4>
  <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${HOUSE_SECD_NM} 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
  <ul>
    <li><strong>주택명:</strong> ${HOUSE_NM}</li>
    <li><strong>주소:</strong> ${HSSPLY_ADRES} (${HSSPLY_ZIP})</li>
    <li><strong>공급규모:</strong> ${TOT_SUPLY_HSHLDCO}세대</li>
    <li><strong>청약 접수 기간:</strong> ${RCEPT_BGNDE} ~ ${RCEPT_ENDDE}</li>
    <li><strong>당첨자 발표일: </strong> ${PRZWNER_PRESNATN_DE}</li>
    <li><strong>홈페이지 주소:</strong> ${HMPG_ADRES || "X"}</li>
  </ul>
  <br>
  <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
  <p>[청약홈에서 확인하기]</p>
  <a href="${PBLANC_URL}">${PBLANC_URL}</a>
  <br>
  <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
  <p><strong>※ 본 메일은 청약홈의 공공 API를 활용하여 제공되는 비공식 알림 서비스입니다.</strong></p>
  <p>청약 정보는 청약홈의 데이터에 기반하며, 일부 정보는 변동 또는 오류가 있을 수 있습니다. 정확한 사항은 반드시 <a href="https://www.applyhome.co.kr" target="_blank">청약홈 공식 홈페이지</a>를 참고해주시기 바랍니다.</p>

### Sample Image

<img width="829" height="473" alt="Screenshot 2025-09-04 at 5 47 17 PM" src="https://github.com/user-attachments/assets/e02b3383-8186-4b02-981f-b87542b2b0ff" />

## Tech Stack

<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/html.png" alt="HTML" title="HTML"/>
<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/css.png" alt="CSS" title="CSS"/>
<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/javascript.png" alt="JavaScript" title="JavaScript">
<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/firebase.png" alt="Firebase" title="Firebase">
<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/gcp.png" alt="GCP" title="GCP">

## Reference

### Map Source(GeoJSON data)

- 전국 지도 GeoJSON data source  
  https://github.com/southkorea/southkorea-maps/tree/master/kostat/2018/json

- 지역구 지도 GeoJSON data source  
  https://github.com/southkorea/southkorea-maps/tree/master/kostat/2013/json
  - 행정구역 참고 사항
    - 2014년 청주시-청원시 통합
    - 2023년 군위군의 대구광역시 편입
    - 2026년 07월 01일 인천광역시 행정체제 개편 예정

### ZIP Code

https://www.koreapost.go.kr/

## Disclamer

본 서비스는 <a href="https://www.applyhome.co.kr">청약홈</a>에서 제공하는 공공 API를 기반으로 구현된 비공식 알림 서비스입니다. 제공되는 정보는 청약홈의 API 데이터를 바탕으로 자동 수집 및 가공된 결과이며, 청약홈의 시스템 변경, 데이터 오류 또는 API의 일시적인 장애 등에 따라 실제 정보와 차이가 있을 수 있습니다.

따라서 본 서비스를 통해 제공되는 청약 정보는 참고용으로만 활용해 주시고, 정확하고 최신의 청약 정보는 반드시 청약홈 공식 홈페이지에서 확인하시기 바랍니다.

이 프로젝트는 청약홈 또는 관계 기관과 어떠한 공식적인 관련이 없으며, 본 서비스를 이용하여 발생하는 직·간접적인 손해에 대해 일절 책임을 지지 않습니다.
