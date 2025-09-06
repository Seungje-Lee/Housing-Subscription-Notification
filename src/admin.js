import { auth, db } from "../firebase.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");
const notiMsg = document.querySelector(".notification-msg");
const pwdDisplayBtn = document.querySelector("#pw_hide");
const viewPwdImg = document.querySelector("#pw_hide svg:first-child");
const hidePwdImg = document.querySelector("#pw_hide svg:last-child");

async function handleLogin(event) {
  event.preventDefault();

  // firebase에 auth/invalid-email이 있음에도 굳이 이메일 검증을 따로 한 이유는
  // gmail까지만 입력할 경우 invalid-email이 아닌 invalid-credential이 나오기 때문
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    notiMsg.textContent = "유효한 이메일 주소를 입력하세요";
    return;
  }
  notiMsg.textContent = "";

  await auth.authStateReady();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      notiMsg.textContent =
        "이메일 검증을 완료하지 않았습니다. 수신한 이메일을 확인해주세요.";
      return;
    }

    const docSnapshot = await getDoc(doc(db, "notificationList", user.uid));
    console.log(docSnapshot);
    if (!docSnapshot.exists()) {
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
    }

    notiMsg.textContent =
      "로그인에 성공하였습니다. 잠시 후 내 프로필로 이동합니다...";
    setTimeout(() => {
      window.location.href = `list-display.html`;
    }, 1000);
  } catch (e) {
    switch (e.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        notiMsg.textContent = "잘못된 이메일 또는 비밀번호입니다.";
        break;

      case "auth/too-many-requests":
        notiMsg.textContent =
          "단기간에 많은 로그인 시도가 감지되었습니다. 잠시 후 다시 시도해주세요.";

      // auth/internal-error,
      default:
        notiMsg.textContent = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  }
}

function handlePwdDisplay() {
  if (password.type === "password") {
    password.type = "text";
    viewPwdImg.classList.add("hidden");
    hidePwdImg.classList.remove("hidden");
  } else {
    password.type = "password";
    viewPwdImg.classList.remove("hidden");
    hidePwdImg.classList.add("hidden");
  }
}

function handlePasswordInput() {
  if (password.value === "") {
    viewPwdImg.classList.add("hidden");
    hidePwdImg.classList.add("hidden");
  } else if (
    viewPwdImg.classList.contains("hidden") &&
    hidePwdImg.classList.contains("hidden")
  ) {
    viewPwdImg.classList.remove("hidden");
  }
}

loginForm.addEventListener("submit", handleLogin);
pwdDisplayBtn.addEventListener("click", handlePwdDisplay);
password.addEventListener("input", handlePasswordInput);
