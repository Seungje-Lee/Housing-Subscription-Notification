import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger, setGlobalOptions } from "firebase-functions/v2";
import nodemailer from "nodemailer";

initializeApp();
const db = getFirestore();

setGlobalOptions({ region: "asia-northeast3", maxInstances: 10 });

// serviceKey: 청약홈 데이터 API
const serviceKey = process.env.SERVICE_KEY;

const date = new Date();
date.setDate(date.getDate() - 1); // 청약홈 API가 익일 반영되는 것을 고려
const year = date.getFullYear();
const month =
  date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();

const urlList = {
  apt: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=01&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  prePrivate: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=09&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  newlyweds: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  office: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getUrbtyOfctlLttotPblancDetail?page=1&perPage=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  random: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=04&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  resupplyTorts: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=06&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  // 공공지원민간임대, 임의공굽 API의 날짜 형식이 살짝 다름
  publicRent: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getPblPvtRentLttotPblancDetail?page=1&perPage=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}${month}${day}&serviceKey=${serviceKey}`,

  voluntarySupply: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getOPTLttotPblancDetail?page=1&perPage=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}${month}${day}&serviceKey=${serviceKey}`,
};

function createEmailTemplate(addr, realtyType, realtyInfo) {
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

const sendEmail = async (toEmail, addr, realtyType, realtyInfo) => {
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
    from: process.env.EMAIL_ADDR,
    to: toEmail,
    subject: `[부동산 청약 알림] ${addr} ${typeToKorean[realtyType]}`,
    html: createEmailTemplate(addr, realtyType, realtyInfo),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.log(`Email sent successfully to ${toEmail}`);
  } catch (error) {
    logger.error(`Failed to send email to ${toEmail}:`, error);
  }
};

// onSchedule이 기본적으로는 UTC 시간대이기 때문에 UTC+9인 우리나라 환경을 고려, timeZone을 세팅해야 함
// 청약홈 API는 익일 00 ~ 02시에 업데이트됨, 따라서 n일 정보를 n+1일 아침에 보내주기
export const dailyInfoEmailing = onSchedule(
  { schedule: "everyday 13:30", timeZone: "Asia/Seoul" },
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

          const dbAddr =
            realty.HSSPLY_ADRES.slice(0, firstBlank) === "세종특별자치시"
              ? realty.HSSPLY_ADRES.slice(0, firstBlank)
              : realty.HSSPLY_ADRES.slice(0, secondBlank);

          // 이메일을 보낼 때 Promise.all 과 map을 이용해 병렬로 보내도록 업데이트
          for (const user of userInfo) {
            if (user[type].includes(dbAddr)) {
              logger.log(`Sending email to ${user.email} about ${dbAddr}`);
              await sendEmail(user.email, dbAddr, type, realty);
            }
          }
        }
      }

      logger.log("Scheduled job finished successfully.");
      return null;
    } catch (error) {
      logger.error("Error in scheduled job:", error);
      return null;
    }
  }
);
