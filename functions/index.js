import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger, setGlobalOptions } from "firebase-functions/v2";
import nodemailer from "nodemailer";

initializeApp();
const db = getFirestore();

setGlobalOptions({ region: "asia-northeast3", maxInstances: 10 });

// serviceKey: 청약홈 데이터 API
const serviceKey = process.env.SERVICE_KEY;

const date = new Date();
// date.setDate(date.getDate() - 1); // 청약홈 API가 익일 반영되는 것을 고려
// -> 서버가 UTC 기준이라 1을 안빼도 됨, n일 08시 기준으로 서버는 n-1일 23시인 상태임, 굳이 날짜 안 바꿔도 괜찮다
const year = date.getFullYear();
const month =
  date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
logger.log(date);

const urlList = {
  apt: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=20&cond%5BHOUSE_SECD%3A%3AEQ%5D=01&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  prePrivate: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=20&cond%5BHOUSE_SECD%3A%3AEQ%5D=09&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  newlyweds: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=20&cond%5BHOUSE_SECD%3A%3AEQ%5D=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  office: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getUrbtyOfctlLttotPblancDetail?page=1&perPage=20&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  random: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=20&cond%5BHOUSE_SECD%3A%3AEQ%5D=04&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  resupplyTorts: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=20&cond%5BHOUSE_SECD%3A%3AEQ%5D=06&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  // 공공지원민간임대, 임의공굽 API의 날짜 형식이 살짝 다름
  publicRent: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getPblPvtRentLttotPblancDetail?page=1&perPage=20&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}${month}${day}&serviceKey=${serviceKey}`,

  voluntarySupply: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getOPTLttotPblancDetail?page=1&perPage=20&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}${month}${day}&serviceKey=${serviceKey}`,
};

function createRealtyEmailTemplate(addr, realtyType, realtyInfo) {
  switch (realtyType) {
    case "apt":
    case "newlyweds":
    case "prePrivate":
      return `
        <html>
          <body>
            <h1>주택 청약 공고 알림</h1>
            <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${
        realtyInfo.HOUSE_SECD_NM
      } 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
            <ul>
              <li><strong>주택명:</strong> ${realtyInfo.HOUSE_NM}</li>
              <li><strong>주소:</strong> ${realtyInfo.HSSPLY_ADRES} (${
        realtyInfo.HSSPLY_ZIP
      })</li>
              <li><strong>공급규모:</strong> ${
                realtyInfo.TOT_SUPLY_HSHLDCO
              }세대</li>
              <li><strong>청약 접수 기간:</strong> ${
                realtyInfo.RCEPT_BGNDE
              } ~ ${realtyInfo.RCEPT_ENDDE}</li>
              <li><strong>당첨자 발표일: </strong> ${
                realtyInfo.PRZWNER_PRESNATN_DE
              }</li>
              <li><strong>입주 예정월:</strong> ${
                realtyInfo.MVN_PREARNGE_YM
              }</li>
              <li><strong>홈페이지 주소:</strong> 
              ${
                realtyInfo.HMPG_ADRES
                  ? `<a href="${realtyInfo.HMPG_ADRES}">${realtyInfo.HMPG_ADRES}</a>`
                  : "X"
              }</li>
            </ul>
            <br>
            <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
            <p>[청약홈에서 확인하기]</p>
            <a href="${realtyInfo.PBLANC_URL}">${realtyInfo.PBLANC_URL}</a>
            <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
            <br>
            <p><strong>※ 본 메일은 청약홈의 공공 API를 활용하여 제공되는 비공식 알림 서비스입니다.</strong></p>
            <p>청약 정보는 청약홈의 데이터에 기반하며, 일부 정보는 변동 또는 오류가 있을 수 있습니다. 정확한 사항은 반드시 <a href="https://www.applyhome.co.kr" target="_blank">청약홈 공식 홈페이지</a>를 참고해주시기 바랍니다.</p>
          </body>
        </html>
      `;

    case "office":
      return `
        <html>
          <body>
            <h1>주택 청약 공고 알림</h1>
            <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${
        realtyInfo.HOUSE_DTL_SECD_NM
      } 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
            <ul>
              <li><strong>주택명:</strong> ${realtyInfo.HOUSE_NM}</li>
              <li><strong>주소:</strong> ${realtyInfo.HSSPLY_ADRES} (${
        realtyInfo.HSSPLY_ZIP
      })</li>
              <li><strong>공급규모:</strong> ${
                realtyInfo.TOT_SUPLY_HSHLDCO
              }세대</li>
              <li><strong>청약 접수 기간:</strong> ${
                realtyInfo.SUBSCRPT_RCEPT_BGNDE
              } ~ ${realtyInfo.SUBSCRPT_RCEPT_ENDDE}</li>
              <li><strong>당첨자 발표일: </strong> ${
                realtyInfo.PRZWNER_PRESNATN_DE
              }</li>
              <li><strong>입주 예정월:</strong> ${
                realtyInfo.MVN_PREARNGE_YM
              }</li>
              <li><strong>홈페이지 주소:</strong> 
              ${
                realtyInfo.HMPG_ADRES
                  ? `<a href="${realtyInfo.HMPG_ADRES}">${realtyInfo.HMPG_ADRES}</a>`
                  : "X"
              }</li>
            </ul>
            <br>
            <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
            <p>[청약홈에서 확인하기]</p>
            <a href="${realtyInfo.PBLANC_URL}">${realtyInfo.PBLANC_URL}</a>
            <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
            <br>
            <p><strong>※ 본 메일은 청약홈의 공공 API를 활용하여 제공되는 비공식 알림 서비스입니다.</strong></p>
            <p>청약 정보는 청약홈의 데이터에 기반하며, 일부 정보는 변동 또는 오류가 있을 수 있습니다. 정확한 사항은 반드시 <a href="https://www.applyhome.co.kr" target="_blank">청약홈 공식 홈페이지</a>를 참고해주시기 바랍니다.</p>
          </body>
        </html>
      `;

    case "random":
    case "resupplyTorts":
    case "publicRent":
    case "voluntarySupply":
      return `
        <html>
          <body>
            <h1>주택 청약 공고 알림</h1>
            <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${
        realtyInfo.HOUSE_SECD_NM
      } 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
            <ul>
              <li><strong>주택명:</strong> ${realtyInfo.HOUSE_NM}</li>
              <li><strong>주소:</strong> ${realtyInfo.HSSPLY_ADRES} (${
        realtyInfo.HSSPLY_ZIP
      })</li>
              <li><strong>공급규모:</strong> ${
                realtyInfo.TOT_SUPLY_HSHLDCO
              }세대</li>
              <li><strong>청약 접수 기간:</strong> ${
                realtyInfo.SUBSCRPT_RCEPT_BGNDE
              } ~ ${realtyInfo.SUBSCRPT_RCEPT_ENDDE}</li>
              <li><strong>당첨자 발표일: </strong> ${
                realtyInfo.PRZWNER_PRESNATN_DE
              }</li>
              <li><strong>입주 예정월:</strong> ${
                realtyInfo.MVN_PREARNGE_YM
              }</li>
              <li><strong>홈페이지 주소:</strong> 
              ${
                realtyInfo.HMPG_ADRES
                  ? `<a href="${realtyInfo.HMPG_ADRES}">${realtyInfo.HMPG_ADRES}</a>`
                  : "X"
              }</li>
            </ul>
            <br>
            <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
            <p>[청약홈에서 확인하기]</p>
            <a href="${realtyInfo.PBLANC_URL}">${realtyInfo.PBLANC_URL}</a>
            <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
            <br>
            <p><strong>※ 본 메일은 청약홈의 공공 API를 활용하여 제공되는 비공식 알림 서비스입니다.</strong></p>
            <p>청약 정보는 청약홈의 데이터에 기반하며, 일부 정보는 변동 또는 오류가 있을 수 있습니다. 정확한 사항은 반드시 <a href="https://www.applyhome.co.kr" target="_blank">청약홈 공식 홈페이지</a>를 참고해주시기 바랍니다.</p>
          </body>
        </html>
      `;
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDR,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendRealtyInfoEmail = async (toEmail, addr, realtyType, realtyInfo) => {
  const typeToKorean = {
    apt: "아파트",
    newlyweds: "신혼희망타운",
    prePrivate: "민간사전청약",
    office: "오피스텔/도시형/민간임대/생활숙박시설",
    random: "무순위청약",
    resupplyTorts: "불법행위재공급",
    publicRent: "공공지원민간임대",
    voluntarySupply: "임의공급",
  };

  const mailOptions = {
    from: {
      name: "부동산 청약 알리미",
      address: process.env.EMAIL_ADDR,
    },
    to: toEmail,
    subject: `[부동산 청약 알림] ${addr} ${typeToKorean[realtyType]}`,
    html: createRealtyEmailTemplate(addr, realtyType, realtyInfo),
  };

  try {
    transporter.sendMail(mailOptions);
    logger.log(`Email sent successfully to ${toEmail}`);
  } catch (error) {
    logger.error(`Failed to send email to ${toEmail}:`, error);
  }
};

function zipToProvince(firstThreeZip) {
  if (firstThreeZip >= 10 && firstThreeZip <= 12) return "서울특별시 강북구";
  else if (firstThreeZip <= 15) return "서울특별시 도봉구";
  else if (firstThreeZip <= 19) return "서울특별시 노원구";
  else if (firstThreeZip <= 23) return "서울특별시 중랑구";
  else if (firstThreeZip <= 26) return "서울특별시 동대문구";
  else if (firstThreeZip <= 29) return "서울특별시 성북구";
  else if (firstThreeZip <= 32) return "서울특별시 종로구";
  else if (firstThreeZip <= 35) return "서울특별시 은평구";
  else if (firstThreeZip <= 38) return "서울특별시 서대문구";
  else if (firstThreeZip <= 42) return "서울특별시 마포구";
  else if (firstThreeZip <= 44) return "서울특별시 용산구";
  else if (firstThreeZip <= 46) return "서울특별시 중구";
  else if (firstThreeZip <= 48) return "서울특별시 성동구";
  else if (firstThreeZip <= 51) return "서울특별시 광진구";
  else if (firstThreeZip <= 54) return "서울특별시 강동구";
  else if (firstThreeZip <= 59) return "서울특별시 송파구";
  else if (firstThreeZip <= 64) return "서울특별시 강남구";
  else if (firstThreeZip <= 68) return "서울특별시 서초구";
  else if (firstThreeZip <= 71) return "서울특별시 동작구";
  else if (firstThreeZip <= 74) return "서울특별시 영등포구";
  else if (firstThreeZip <= 78) return "서울특별시 강서구";
  else if (firstThreeZip <= 81) return "서울특별시 양천구";
  else if (firstThreeZip <= 84) return "서울특별시 구로구";
  else if (firstThreeZip <= 86) return "서울특별시 금천구";
  else if (firstThreeZip <= 89) return "서울특별시 관악구";
  else if (firstThreeZip >= 100 && firstThreeZip <= 101) return "경기도 김포시";
  else if (firstThreeZip <= 107) return "경기도 고양시";
  else if (firstThreeZip <= 109) return "경기도 파주시";
  else if (firstThreeZip <= 110) return "경기도 연천군";
  else if (firstThreeZip <= 112) return "경기도 포천시";
  else if (firstThreeZip <= 113) return "경기도 동두천시";
  else if (firstThreeZip <= 115) return "경기도 양주시";
  else if (firstThreeZip <= 118) return "경기도 의정부시";
  else if (firstThreeZip <= 119) return "경기도 구리시";
  else if (firstThreeZip <= 123) return "경기도 남양주시";
  else if (firstThreeZip <= 124) return "경기도 가평군";
  else if (firstThreeZip <= 125) return "경기도 양평군";
  else if (firstThreeZip <= 126) return "경기도 여주시";
  else if (firstThreeZip <= 128) return "경기도 광주시";
  else if (firstThreeZip <= 130) return "경기도 하남시";
  else if (firstThreeZip <= 137) return "경기도 성남시";
  else if (firstThreeZip <= 138) return "경기도 과천시";
  else if (firstThreeZip <= 141) return "경기도 안양시";
  else if (firstThreeZip <= 143) return "경기도 광명시";
  else if (firstThreeZip <= 148) return "경기도 부천시";
  else if (firstThreeZip <= 151) return "경기도 시흥시";
  else if (firstThreeZip <= 157) return "경기도 안산시";
  else if (firstThreeZip <= 159) return "경기도 군포시";
  else if (firstThreeZip <= 161) return "경기도 의왕시";
  else if (firstThreeZip <= 167) return "경기도 수원시";
  else if (firstThreeZip <= 172) return "경기도 용인시";
  else if (firstThreeZip <= 174) return "경기도 이천시";
  else if (firstThreeZip <= 176) return "경기도 안성시";
  else if (firstThreeZip <= 180) return "경기도 평택시";
  else if (firstThreeZip <= 181) return "경기도 오산시";
  else if (firstThreeZip <= 187) return "경기도 화성시";
  else if (firstThreeZip >= 210 && firstThreeZip <= 212)
    return "인천광역시 계양구";
  else if (firstThreeZip <= 214) return "인천광역시 부평구";
  else if (firstThreeZip <= 218) return "인천광역시 남동구";
  else if (firstThreeZip <= 220) return "인천광역시 연수구";
  else if (firstThreeZip <= 222) return "인천광역시 미추홀구";
  else if (firstThreeZip <= 224) return "인천광역시 중구";
  else if (firstThreeZip <= 225) return "인천광역시 동구";
  else if (firstThreeZip <= 229) return "인천광역시 서구";
  else if (firstThreeZip <= 230) return "인천광역시 강화군";
  else if (firstThreeZip <= 231) return "인천광역시 옹진군";
  else if (firstThreeZip === 240) return "강원특별자치도 철원군";
  else if (firstThreeZip <= 241) return "강원특별자치도 화천군";
  else if (firstThreeZip <= 244) return "강원특별자치도 춘천시";
  else if (firstThreeZip <= 245) return "강원특별자치도 양구군";
  else if (firstThreeZip <= 246) return "강원특별자치도 인제군";
  else if (firstThreeZip <= 247) return "강원특별자치도 고성군";
  else if (firstThreeZip <= 249) return "강원특별자치도 속초시";
  else if (firstThreeZip <= 250) return "강원특별자치도 양양군";
  else if (firstThreeZip <= 251) return "강원특별자치도 홍천군";
  else if (firstThreeZip <= 252) return "강원특별자치도 횡성군";
  else if (firstThreeZip <= 253) return "강원특별자치도 평창군";
  else if (firstThreeZip <= 256) return "강원특별자치도 강릉시";
  else if (firstThreeZip <= 258) return "강원특별자치도 동해시";
  else if (firstThreeZip <= 259) return "강원특별자치도 삼척시";
  else if (firstThreeZip <= 260) return "강원특별자치도 태백시";
  else if (firstThreeZip <= 261) return "강원특별자치도 정선군";
  else if (firstThreeZip <= 262) return "강원특별자치도 영월군";
  else if (firstThreeZip <= 265) return "강원특별자치도 원주시";
  else if (firstThreeZip === 270) return "충청북도 단양군";
  else if (firstThreeZip <= 272) return "충청북도 제천시";
  else if (firstThreeZip <= 275) return "충청북도 충주시";
  else if (firstThreeZip <= 277) return "충청북도 음성군";
  else if (firstThreeZip <= 278) return "충청북도 진천군";
  else if (firstThreeZip <= 279) return "충청북도 증평군";
  else if (firstThreeZip <= 280) return "충청북도 괴산군";
  else if (firstThreeZip <= 288) return "충청북도 청주시";
  else if (firstThreeZip <= 289) return "충청북도 보은군";
  else if (firstThreeZip <= 290) return "충청북도 옥천군";
  else if (firstThreeZip <= 291) return "충청북도 영동군";
  else if (firstThreeZip >= 300 && firstThreeZip <= 301)
    return "세종특별자치시";
  else if (firstThreeZip >= 310 && firstThreeZip <= 313)
    return "충청남도 천안시";
  else if (firstThreeZip <= 316) return "충청남도 아산시";
  else if (firstThreeZip <= 318) return "충청남도 당진시";
  else if (firstThreeZip <= 320) return "충청남도 서산시";
  else if (firstThreeZip <= 321) return "충청남도 태안군";
  else if (firstThreeZip <= 323) return "충청남도 홍성군";
  else if (firstThreeZip <= 324) return "충청남도 예산군";
  else if (firstThreeZip <= 326) return "충청남도 공주시";
  else if (firstThreeZip <= 327) return "충청남도 금산군";
  else if (firstThreeZip <= 328) return "충청남도 계룡시";
  else if (firstThreeZip <= 330) return "충청남도 논산시";
  else if (firstThreeZip <= 332) return "충청남도 부여군";
  else if (firstThreeZip <= 333) return "충청남도 청양군";
  else if (firstThreeZip <= 335) return "충청남도 보령시";
  else if (firstThreeZip <= 336) return "충청남도 서천군";
  else if (firstThreeZip >= 340 && firstThreeZip <= 342)
    return "대전광역시 유성구";
  else if (firstThreeZip <= 344) return "대전광역시 대덕구";
  else if (firstThreeZip <= 347) return "대전광역시 동구";
  else if (firstThreeZip <= 351) return "대전광역시 중구";
  else if (firstThreeZip <= 354) return "대전광역시 서구";
  else if (firstThreeZip >= 360 && firstThreeZip <= 361)
    return "경상북도 영주시";
  else if (firstThreeZip <= 362) return "경상북도 봉화군";
  else if (firstThreeZip <= 363) return "경상북도 울진군";
  else if (firstThreeZip <= 364) return "경상북도 영덕군";
  else if (firstThreeZip <= 365) return "경상북도 영양군";
  else if (firstThreeZip <= 367) return "경상북도 안동시";
  else if (firstThreeZip <= 368) return "경상북도 예천군";
  else if (firstThreeZip <= 370) return "경상북도 문경시";
  else if (firstThreeZip <= 372) return "경상북도 상주시";
  else if (firstThreeZip <= 373) return "경상북도 의성군";
  else if (firstThreeZip <= 374) return "경상북도 청송군";
  else if (firstThreeZip <= 379) return "경상북도 포항시";
  else if (firstThreeZip <= 382) return "경상북도 경주시";
  else if (firstThreeZip <= 383) return "경상북도 청도군";
  else if (firstThreeZip <= 387) return "경상북도 경산시";
  else if (firstThreeZip <= 389) return "경상북도 영천시";
  else if (firstThreeZip >= 391 && firstThreeZip <= 394)
    return "경상북도 구미시";
  else if (firstThreeZip <= 397) return "경상북도 김천시";
  else if (firstThreeZip <= 399) return "경상북도 칠곡군";
  else if (firstThreeZip <= 400) return "경상북도 성주군";
  else if (firstThreeZip <= 401) return "경상북도 고령군";
  else if (firstThreeZip <= 402) return "경상북도 울릉군";
  else if (firstThreeZip >= 410 && firstThreeZip <= 413)
    return "대구광역시 동구";
  else if (firstThreeZip <= 416) return "대구광역시 북구";
  else if (firstThreeZip <= 418) return "대구광역시 서구";
  else if (firstThreeZip <= 419) return "대구광역시 중구";
  else if (firstThreeZip <= 423) return "대구광역시 수성구";
  else if (firstThreeZip <= 425) return "대구광역시 남구";
  else if (firstThreeZip <= 428) return "대구광역시 달서구";
  else if (firstThreeZip <= 430) return "대구광역시 달성군";
  else if (firstThreeZip <= 431) return "대구광역시 군위군";
  else if (firstThreeZip >= 440 && firstThreeZip <= 441)
    return "울산광역시 동구";
  else if (firstThreeZip <= 443) return "울산광역시 북구";
  else if (firstThreeZip <= 445) return "울산광역시 중구";
  else if (firstThreeZip <= 448) return "울산광역시 남구";
  else if (firstThreeZip <= 451) return "울산광역시 울주군";
  else if (firstThreeZip >= 460 && firstThreeZip <= 461)
    return "부산광역시 기장군";
  else if (firstThreeZip <= 464) return "부산광역시 금정구";
  else if (firstThreeZip <= 466) return "부산광역시 북구";
  else if (firstThreeZip <= 468) return "부산광역시 강서구";
  else if (firstThreeZip <= 470) return "부산광역시 사상구";
  else if (firstThreeZip <= 474) return "부산광역시 부산진구";
  else if (firstThreeZip <= 476) return "부산광역시 연제구";
  else if (firstThreeZip <= 479) return "부산광역시 동래구";
  else if (firstThreeZip <= 481) return "부산광역시 해운대구";
  else if (firstThreeZip <= 483) return "부산광역시 수영구";
  else if (firstThreeZip <= 486) return "부산광역시 남구";
  else if (firstThreeZip <= 488) return "부산광역시 동구";
  else if (firstThreeZip <= 489) return "부산광역시 중구";
  else if (firstThreeZip <= 491) return "부산광역시 영도구";
  else if (firstThreeZip <= 492) return "부산광역시 서구";
  else if (firstThreeZip <= 495) return "부산광역시 사하구";
  else if (firstThreeZip === 500) return "경상남도 함양군";
  else if (firstThreeZip <= 501) return "경상남도 거창군";
  else if (firstThreeZip <= 502) return "경상남도 합천군";
  else if (firstThreeZip <= 503) return "경상남도 창녕군";
  else if (firstThreeZip <= 504) return "경상남도 밀양시";
  else if (firstThreeZip <= 507) return "경상남도 양산시";
  else if (firstThreeZip <= 510) return "경상남도 김해시";
  else if (firstThreeZip <= 519) return "경상남도 창원시";
  else if (firstThreeZip <= 520) return "경상남도 함안군";
  else if (firstThreeZip <= 521) return "경상남도 의령군";
  else if (firstThreeZip <= 522) return "경상남도 산청군";
  else if (firstThreeZip <= 523) return "경상남도 하동군";
  else if (firstThreeZip <= 524) return "경상남도 남해군";
  else if (firstThreeZip <= 525) return "경상남도 사천시";
  else if (firstThreeZip <= 528) return "경상남도 진주시";
  else if (firstThreeZip <= 529) return "경상남도 고성군";
  else if (firstThreeZip <= 531) return "경상남도 통영시";
  else if (firstThreeZip <= 533) return "경상남도 거제시";
  else if (firstThreeZip >= 540 && firstThreeZip <= 542)
    return "전북특별자치도 군산시";
  else if (firstThreeZip <= 544) return "전북특별자치도 김제시";
  else if (firstThreeZip <= 547) return "전북특별자치도 익산시";
  else if (firstThreeZip <= 552) return "전북특별자치도 전주시";
  else if (firstThreeZip <= 553) return "전북특별자치도 완주군";
  else if (firstThreeZip <= 554) return "전북특별자치도 진안군";
  else if (firstThreeZip <= 555) return "전북특별자치도 무주군";
  else if (firstThreeZip <= 556) return "전북특별자치도 장수군";
  else if (firstThreeZip <= 558) return "전북특별자치도 남원시";
  else if (firstThreeZip <= 559) return "전북특별자치도 임실군";
  else if (firstThreeZip <= 560) return "전북특별자치도 순창군";
  else if (firstThreeZip <= 562) return "전북특별자치도 정읍시";
  else if (firstThreeZip <= 563) return "전북특별자치도 부안군";
  else if (firstThreeZip <= 564) return "전북특별자치도 고창군";
  else if (firstThreeZip === 570) return "전라남도 영광군";
  else if (firstThreeZip <= 571) return "전라남도 함평군";
  else if (firstThreeZip <= 572) return "전라남도 장성군";
  else if (firstThreeZip <= 574) return "전라남도 담양군";
  else if (firstThreeZip <= 575) return "전라남도 곡성군";
  else if (firstThreeZip <= 576) return "전라남도 구례군";
  else if (firstThreeZip <= 578) return "전라남도 광양시";
  else if (firstThreeZip <= 580) return "전라남도 순천시";
  else if (firstThreeZip <= 581) return "전라남도 화순군";
  else if (firstThreeZip <= 583) return "전라남도 나주시";
  else if (firstThreeZip <= 584) return "전라남도 영암군";
  else if (firstThreeZip <= 585) return "전라남도 무안군";
  else if (firstThreeZip <= 587) return "전라남도 목포시";
  else if (firstThreeZip <= 588) return "전라남도 신안군";
  else if (firstThreeZip <= 589) return "전라남도 진도군";
  else if (firstThreeZip <= 590) return "전라남도 해남군";
  else if (firstThreeZip <= 591) return "전라남도 완도군";
  else if (firstThreeZip <= 592) return "전라남도 강진군";
  else if (firstThreeZip <= 593) return "전라남도 장흥군";
  else if (firstThreeZip <= 594) return "전라남도 보성군";
  else if (firstThreeZip <= 595) return "전라남도 고흥군";
  else if (firstThreeZip <= 598) return "전라남도 여수시";
  else if (firstThreeZip >= 610 && firstThreeZip <= 613)
    return "광주광역시 북구";
  else if (firstThreeZip <= 615) return "광주광역시 동구";
  else if (firstThreeZip <= 618) return "광주광역시 남구";
  else if (firstThreeZip <= 621) return "광주광역시 서구";
  else if (firstThreeZip <= 625) return "광주광역시 광산구";
  else if (firstThreeZip >= 630 && firstThreeZip <= 634)
    return "제주특별자치도 제주시";
  else if (firstThreeZip <= 636) return "제주특별자치도 서귀포시";
}

// onSchedule이 기본적으로는 UTC 시간대이기 때문에 UTC+9인 우리나라 환경을 고려, timeZone을 세팅해야 함
// 청약홈 API는 익일 00 ~ 02시에 업데이트됨, 따라서 n일 정보를 n+1일 아침에 보내주기
export const dailyInfoEmailing = onSchedule(
  // at minute 0 / at 8 am / every day of the month / every month / tue-sat
  { schedule: "0 8 * * 2-6", timeZone: "Asia/Seoul" },
  async (event) => {
    try {
      // Firebase Admin을 이용하고 있기 때문에 로그인이 필요없음
      let userInfo = [];
      const notificationListRef = db.collection("notificationList");
      const querySnapshot = await notificationListRef.get();
      querySnapshot.forEach((doc) =>
        userInfo.push({
          email: doc.data().email,
          apt: doc.data().apt,
          office: doc.data().office,
          prePrivate: doc.data().prePrivate,
          publicRent: doc.data().publicRent,
          random: doc.data().random,
          resupplyTorts: doc.data().resupplyTorts,
          voluntarySupply: doc.data().voluntarySupply,
          newlyweds: doc.data().newlyweds,
        })
      );

      // Promise.all을 사용해 모든 API 호출을 병렬로 처리
      const fetchPromises = Object.entries(urlList).map(async ([type, url]) => {
        // Robust fetch: Use Promise.allSettled to make the API calls more resilient to individual failures.
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status} for ${type}`);
        }
        const data = await response.json();
        return { type, data };
      });

      const apiResults = await Promise.all(fetchPromises);

      // 병렬로 처리된 결과를 순회하며 로직 실행
      for (const { type, data } of apiResults) {
        if (!data.data) continue; // 데이터가 없는 경우 스킵
        logger.log(`Processing type: ${type}`);

        for (const realty of data.data) {
          const firstBlank = realty.HSSPLY_ADRES.indexOf(" ");
          const secondBlank = realty.HSSPLY_ADRES.indexOf(" ", firstBlank + 1);

          const dbAddr = zipToProvince(Number(realty.HSSPLY_ZIP.slice(0, 3)));

          // 이메일을 보낼 때 Promise.all 과 map을 이용해 병렬로 보내도록 업데이트
          for (const user of userInfo) {
            if (user[type].includes(dbAddr)) {
              logger.log(`Sending email to ${user.email} about ${dbAddr}`);
              await sendRealtyInfoEmail(user.email, dbAddr, type, realty);
            }
          }
        }
      }

      logger.log("Scheduled job finished successfully.");
      // Node.js에서 Cloud Firestore 이벤트와 같은 이벤트 기반 함수는 비동기 함수입니다. 콜백 함수는 null, 객체, Promise 중 하나를 반환해야 한다
      return null;
    } catch (error) {
      logger.error("Error in scheduled job:", error);
      return null;
    }
  }
);

const sendIntroEmail = async (toEmail) => {
  const mailOptions = {
    from: {
      name: "부동산 청약 알리미",
      address: process.env.EMAIL_ADDR,
    },
    to: toEmail,
    subject: "🏠부동산 청약 알리미 서비스 소개",
    html: `
        <html>
          <body>
            <p>부동산 청약 알리미 서비스에 가입하신 것을 진심으로 환영합니다.🎉 관심 지역의 자세한 청약 정보를 이메일로 간편하게 받아보세요.</p>
            <p>본 서비스는 청약홈의 <a href="https://www.applyhome.co.kr/cu/cuc/selectSubscrptAllimiView.do">청약알리미 서비스</a>가 가지고 있는 몇 가지 제한점을 개선하여, 더 편리하게 정보를 받아보실 수 있도록 만들었습니다.</p>
            <h3>✅부동산 청약 알리미를 선택해야 하는 이유</h3>
            <ul>
              <li>🔔지역 제한 없이 알림 받기:<br>청약홈은 최대 10개의 시 단위 지역까지만 알림 설정이 가능하지만, 본 서비스는 <strong>지역 개수 제한 없이</strong> 원하는 만큼 설정할 수 있습니다.</li>
              <br>
              <li>🗺️지도로 간편하게 관심 지역 선택하기:<br>지도를 통해 <strong>직관적으로 관심 지역을 선택</strong>할 수 있습니다. 더 이상 수십 개의 행정구역 목록에서 관심 지역을 찾지 마세요.</li>
              <br>
              <li>👀다양한 유형의 청약 정보:<br><strong>"아파트, 민간사전청약, 신혼희망타운, 오피스텔, 무순위청약, 불법행위 재공급, 공공지원민간임대, 임의공급"</strong> 8개의 청약 유형에 대해 관심 있는 유형만 골라서 알림을 받아보세요.</li>
            </ul>
            <h3>‼️서비스 이용 시 유의사항</h3>
            <ul>
              <li>🙅청약홈의 공식 서비스가 아니에요:<br>본 서비스는 청약홈의 공공 API를 활용해 제공하는 비공식 알림 서비스이며, 청약홈 또는 관계 기관과 어떠한 공식적인 관련이 없습니다. 시스템 오류로 제때 정보를 받아보지 못하거나 정보에 오류가 있을 수 있으니, 최종적인 청약 정보는 반드시 청약홈 공식 홈페이지에서 확인하시기 바랍니다.</li>
              <br>
              <li>📅공고를 다음날 보내드려요:<br>청약홈의 데이터 처리로 인해 업데이트된 공고를 당일에 바로 보내드리기 어렵습니다. 월요일부터 금요일까지 업데이트된 공고 내용은 익일(화요일~토요일) 오전 8시에 이메일로 보내드립니다.</li>
              <br>
              <li>🚫비정상적인 행위는 제지해요:<br>본 서비스는 사용량에 비례하는 구글의 유료 요금제 계정으로 제공되고 있습니다. 하지만 무료로 제공하고 있는 서비스인만큼 과도한 비용 청구의 원인이 될 수 있는 비정상적인 행위가 탐지될 경우 사전 통지 없이 차단될 수 있습니다.</li>
            </ul>
          <p>문의사항이나 오류 제보, 개선했으면 하는 점이 있다면 언제든지 이 메일로 회신 부탁드립니다.</p>
          <p>앞으로도 더 나은 서비스를 제공하기 위해 노력하겠습니다.<br>감사합니다.</p>
          </body>
        </html>
      `,
  };

  try {
    transporter.sendMail(mailOptions);
    logger.log(`[Intro] Email sent successfully to ${toEmail}`);
  } catch (error) {
    logger.error(`[Intro] Failed to send email to ${toEmail}:`, error);
  }
};

export const sendNotiToNewcomer = onDocumentCreated(
  // onDocumentCreated parameter에 대한 이해가 더 필요

  // Listens for new messages added to /messages/:documentId/original
  // and saves an uppercased version of the message
  // to /messages/:documentId/uppercase
  // exports.makeuppercase = onDocumentCreated("/messages/{documentId}"
  // firebase guide에서 위와 같이 했으니 notificationList에 대한 변화를 듣도록 설정함

  "notificationList/{documentID}",
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        throw new Error("No data associated with the event");
      }
      const data = snapshot.data();
      await sendIntroEmail(data.email);
      logger.log("Sending notification email finished successfully.");
      // Node.js에서 Cloud Firestore 이벤트와 같은 이벤트 기반 함수는 비동기 함수입니다. 콜백 함수는 null, 객체, Promise 중 하나를 반환해야 한다
      return null;
    } catch (error) {
      logger.error("Error in sending notification email:", error);
      return null;
    }
  }
);
