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

// 기본적으로는 UTC 시간대이기 때문에 UTC+9인 우리나라 환경을 고려
export const dailyInfo = onSchedule(
  { schedule: "everyday 16:55", timeZone: "Asia/Seoul" },
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

      const date = new Date();
      const year = date.getFullYear();
      const month =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
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

        data.data.forEach((realty) => {
          const firstBlank = realty.HSSPLY_ADRES.indexOf(" ");
          const secondBlank = realty.HSSPLY_ADRES.indexOf(" ", firstBlank + 1);

          const dbAddr =
            realty.HSSPLY_ADRES.slice(0, firstBlank) === "세종특별자치시"
              ? realty.HSSPLY_ADRES.slice(0, firstBlank)
              : realty.HSSPLY_ADRES.slice(0, secondBlank);

          userInfo.forEach((user) => {
            if (user[type].includes(dbAddr)) {
              // 이메일 발송 로직 추가
              // console.log(`Sending email to ${user.email} about ${dbAddr}`);
              logger.log(`Sending email to ${user.email} about ${dbAddr}`);
              // TODO: 이메일 전송 함수 호출
              // 예: await sendEmail(user.email, emailTemplate);
            }
          });
        });
      }

      // console.log("Scheduled job finished successfully.");
      logger.log("Scheduled job finished successfully.");
      return null;
    } catch (error) {
      // console.error("Error in scheduled job:", error);
      logger.log("Error in scheduled job:", error);
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
