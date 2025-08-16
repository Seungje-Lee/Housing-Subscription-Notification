// 해당 firebase module들은 Firebase Admin SDK 쪽에서만 받아오는 등 통일을 해야 한다.
// 여기서는 server-side의 작업이므로 firebase-admin/ module들을 이용해야 했다.
// 데이터를 가져오는 문법도 둘이 조금 다르다.
// The client-side collection() function from firebase/firestore is designed to be chained off a DocumentReference or the root FirebaseFirestore instance itself.

// The Firebase Admin SDK, on the other hand, provides its own collection() method directly on the Firestore instance (db).
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger, setGlobalOptions } from "firebase-functions/v2";
import nodemailer from "nodemailer";
// import { collection, getDocs } from "firebase/firestore";
// import { onRequest } from "firebase-functions/v2/https";

initializeApp();
const db = getFirestore();

// Cloud Functions의 지역 설정
setGlobalOptions({ region: "asia-northeast3", maxInstances: 10 });

// serviceKey: 청약홈 데이터 API
const serviceKey = process.env.SERVICE_KEY;

const date = new Date();
const year = date.getFullYear();
const month =
  date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
// const day = (date.getDate() >= 10 ? date.getDate() : "0" + date.getDate());
const day = "09";

const urlList = {
  apt: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=01&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  prePrivate: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=09&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  newlyweds: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  office: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getUrbtyOfctlLttotPblancDetail?page=1&perPage=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  random: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=04&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  resupplyTorts: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=10&cond%5BHOUSE_SECD%3A%3AEQ%5D=06&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}-${month}-${day}&serviceKey=${serviceKey}`,

  // 공공지원민간임대 API의 날짜 형식이 살짝 다름
  publicRent: `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getPblPvtRentLttotPblancDetail?page=1&perPage=10&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=${year}${month}${day}&serviceKey=${serviceKey}`,

  // 임의공급 API도 날짜 형식이 살짝 다름
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
            <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${realtyInfo.HOUSE_SECD_NM} 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
            <ul>
              <li><strong>주택명:</strong> ${realtyInfo.HOUSE_NM}</li>
              <li><strong>주소:</strong> ${realtyInfo.HSSPLY_ADRES} (${realtyInfo.HSSPLY_ZIP})</li>
              <li><strong>공급규모:</strong> ${realtyInfo.TOT_SUPLY_HSHLDCO}세대</li>
              <li><strong>청약 접수 기간:</strong> ${realtyInfo.RCEPT_BGNDE} ~ ${realtyInfo.RCEPT_ENDDE}</li>
              <li><strong>홈페이지 주소:</strong> <a href="${realtyInfo.HMPG_ADRES}">${realtyInfo.HMPG_ADRES}</a></li>
            </ul>
            <br>
            <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
            <p>[청약홈에서 확인하기]</p>
            <a href="${realtyInfo.PBLANC_URL}">${realtyInfo.PBLANC_URL}</a>
            <br>
            <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
            <p>감사합니다.</p>
          </body>
        </html>
      `;

    case "office":
      return `
        <html>
          <body>
            <h1>주택 청약 공고 알림</h1>
            <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${realtyInfo.HOUSE_DTL_SECD_NM} 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
            <ul>
              <li><strong>주택명:</strong> ${realtyInfo.HOUSE_NM}</li>
              <li><strong>주소:</strong> ${realtyInfo.HSSPLY_ADRES} (${realtyInfo.HSSPLY_ZIP})</li>
              <li><strong>공급규모:</strong> ${realtyInfo.TOT_SUPLY_HSHLDCO}세대</li>
              <li><strong>청약 접수 기간:</strong> ${realtyInfo.SUBSCRPT_RCEPT_BGNDE} ~ ${realtyInfo.SUBSCRPT_RCEPT_ENDDE}</li>
              <li><strong>홈페이지 주소:</strong> <a href="${realtyInfo.HMPG_ADRES}">${realtyInfo.HMPG_ADRES}</a></li>
            </ul>
            <br>
            <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
            <p>[청약홈에서 확인하기]</p>
            <a href="${realtyInfo.PBLANC_URL}">${realtyInfo.PBLANC_URL}</a>
            <br>
            <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
            <p>감사합니다.</p>
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
            <p>귀하께서 관심지역으로 등록하신 지역(${addr})의 ${realtyInfo.HOUSE_SECD_NM} 신규 입주자모집공고가 청약홈에 게시되었습니다.</p>
            <ul>
              <li><strong>주택명:</strong> ${realtyInfo.HOUSE_NM}</li>
              <li><strong>주소:</strong> ${realtyInfo.HSSPLY_ADRES} (${realtyInfo.HSSPLY_ZIP})</li>
              <li><strong>공급규모:</strong> ${realtyInfo.TOT_SUPLY_HSHLDCO}세대</li>
              <li><strong>청약 접수 기간:</strong> ${realtyInfo.SUBSCRPT_RCEPT_BGNDE} ~ ${realtyInfo.SUBSCRPT_RCEPT_ENDDE}</li>
              <li><strong>홈페이지 주소:</strong> <a href="${realtyInfo.HMPG_ADRES}">${realtyInfo.HMPG_ADRES}</a></li>
            </ul>
            <br>
            <p>자세한 사항은 아래 청약홈 링크에서 확인하시기 바랍니다.</p>
            <p>[청약홈에서 확인하기]</p>
            <a href="${realtyInfo.PBLANC_URL}">${realtyInfo.PBLANC_URL}</a>
            <br>
            <p>문의사항이나 오류 제보는 본 메일로 회신 부탁드립니다.</p>
            <p>감사합니다.</p>
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

// 기본적으로는 UTC 시간대이기 때문에 UTC+9인 우리나라 환경을 고려
export const dailyInfoEmailing = onSchedule(
  { schedule: "everyday 21:45", timeZone: "Asia/Seoul" },
  async (event) => {
    try {
      // Firebase Admin을 이용하고 있기 때문에 로그인이 필요없음
      let userInfo = [];
      // const querySnapshot = await getDocs(collection(db, "notificationList"));
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

        // console.log(`Processing type: ${type}`);
        logger.log(`Processing type: ${type}`);

        // 여기에 async를 넣어야 하나?
        // data.data.forEach(async (realty))
        for (const realty of data.data) {
          const firstBlank = realty.HSSPLY_ADRES.indexOf(" ");
          const secondBlank = realty.HSSPLY_ADRES.indexOf(" ", firstBlank + 1);

          const dbAddr =
            realty.HSSPLY_ADRES.slice(0, firstBlank) === "세종특별자치시"
              ? realty.HSSPLY_ADRES.slice(0, firstBlank)
              : realty.HSSPLY_ADRES.slice(0, secondBlank);

          /*  forEach는 async를 기다려주는 문법이 아님
          userInfo.forEach(async (user) => {
            if (user[type].includes(dbAddr)) {
              // console.log(`Sending email to ${user.email} about ${dbAddr}`);
              logger.log(`Sending email to ${user.email} about ${dbAddr}`);
              await sendEmail(user.email, dbAddr, type, realty);
            }
          });
          */
          for (const user of userInfo) {
            if (user[type].includes(dbAddr)) {
              // console.log(`Sending email to ${user.email} about ${dbAddr}`);
              logger.log(`Sending email to ${user.email} about ${dbAddr}`);
              await sendEmail(user.email, dbAddr, type, realty);
            }
          }
        }
      }

      // console.log("Scheduled job finished successfully.");
      logger.log("Scheduled job finished successfully.");
      return null;
    } catch (error) {
      // console.error("Error in scheduled job:", error);
      logger.error("Error in scheduled job:", error);
      return null;
    }
  }
);

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
