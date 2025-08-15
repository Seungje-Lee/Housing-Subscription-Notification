import { auth, db } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginForm = document.querySelector("#sign-in-form");
const notiMsg = document.querySelector(".notification-msg");

async function handleAccountCreation(event) {
  let credentials;
  event.preventDefault();
  notiMsg.textContent = "";

  // firebase 자체 이메일 검증을 이용해볼 것
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    notiMsg.textContent = "유효한 이메일 주소를 입력하세요";
    return;
  }

  await auth.authStateReady();
  try {
    // const credentials = await createUserWithEmailAndPassword(
    credentials = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      notiMsg.textContent = "이미 사용 중인 이메일입니다.";
    } else if (e.code === "auth/weak-password") {
      notiMsg.textContent = "최소 6자 이상의 비밀번호를 입력해주세요.";
    } else {
      notiMsg.textContent = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    return;
  }

  const user = credentials.user;
  sendEmailVerification(user)
    .then(() => {
      notiMsg.textContent =
        "이메일로 전송된 메일 검증 링크를 클릭하세요. 이메일을 수신하지 못했을 경우, 스팸메일함을 확인해주세요.";
      // 여기에 user.uid로 테이블 만들어주기
      setDoc(doc(db, "notificationList", user.uid), {
        email: email.value,
        apt: [],
        office: [],
        prePrivate: [],
        publicRent: [],
        random: [],
        resupplyTorts: [],
        voluntarySupply: [],
        newlyweds: [],
      });
    })
    .catch(() => {
      notiMsg.textContent = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    });
}

loginForm.addEventListener("submit", handleAccountCreation);
