//import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { FirebaseError } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

console.log("HELLO", auth);
const bgImage = document.querySelector(".bg-image");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginForm = document.querySelector("#sign-in-form");
const notiMsg = document.querySelector(".notification-msg");
// const aptList = [
//   "acro-seoul-forest.webp",
//   "banpo-xi.webp",
//   "brighten-yeoido.webp",
//   "dogok-rexle.jpg",
//   "dogok-tower-palace.jpg",
//   "hyosung-chungdam-101.jpg",
//   "ipark-samsung.webp",
//   "raemian-daechi-palace.jpg",
//   "raemian-one-bailey.webp",
//   "signiel.jpg",
//   "sungsu-trimage.webp",
// ];

// function changeBgImage() {
//   const aptIndex = Math.floor(Math.random() * aptList.length);
//   const imgUrl = './apt-images/' + `${aptList[aptIndex]}`;
//   bgImage.style.backgroundImage = `url('${imgUrl}')`;
// }

// setInterval(changeBgImage, 5000);

async function handleAccountCreation(event) {
  event.preventDefault();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    notiMsg.innerHTML = "유효한 이메일 주소를 입력하세요";
    return;
  }
  notiMsg.innerHTML = "";
  console.log(email.value, password.value);

  await auth.authStateReady();

  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    try {
      const user = credentials.user;
      sendEmailVerification(user)
        .then(() => {
          notiMsg.innerHTML =
            "이메일로 전송된 계정 검증용 링크를 클릭하세요. 이메일을 수신하지 못했을 경우, 스팸메일함을 확인해주세요.";
        })
        .catch(() => {
          notiMsg.innerHTML = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        });
    } catch {
      notiMsg.innerHTML = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    console.log(credentials, email, password);
    // notiMsg.innerHTML =
    //   "계정을 생성했습니다. 잠시 후 로그인 페이지로 이동합니다.";
    // setTimeout(() => {
    //   window.location.href = `index.html`;
    // }, 3000);
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      notiMsg.innerHTML = "이미 사용 중인 이메일입니다.";
    } else if (e.code === "auth/weak-password") {
      notiMsg.innerHTML = "최소 6자 이상의 비밀번호를 입력해주세요.";
    } else {
      notiMsg.innerHTML = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  }

  // const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError("");
  //   if(isLoading || name === "" || email === "" || password === "") return;
  //   try {
  //     setLoading(true);
  //     const credentials = await createUserWithEmailAndPassword(auth, email, password);
  //     console.log(credentials.user);
  //     await updateProfile(credentials.user, {
  //       displayName: name,
  //     });
  //     navigate("/");
  //   } catch(e) {
  //     if(e instanceof FirebaseError) {
  //       setError(e.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  //   console.log(name, email, password);
  // }
}

loginForm.addEventListener("submit", handleAccountCreation);
