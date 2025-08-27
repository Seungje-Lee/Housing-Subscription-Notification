import { auth, db } from "../firebase.js";
import {
  addDoc,
  setDoc,
  doc,
  collection,
  where,
  query,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const logoutBtn = document.getElementById("logout");

await auth.authStateReady();

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const user = auth.currentUser;

const realtyType = [
  "apt",
  "office",
  "publicRent",
  "random",
  "resupplyTorts",
  "prePrivate",
  "voluntarySupply",
  "newlyweds",
];

const docSnap = await getDoc(doc(db, "notificationList", user.uid));

// 각 청약 유형별로 신청한 지역별 알림 정보를 보여줌
realtyType.forEach((realty) => {
  const selectedRealtyType = document.querySelector(`#${realty} ul`);
  const storedList = docSnap.data()[realty];

  storedList.forEach((item, index) => {
    const district = document.createElement("li");
    district.textContent = item;
    if (index >= 5) {
      district.setAttribute("class", "hidden");
    }
    selectedRealtyType.appendChild(district);
  });
  if (storedList.length >= 6) {
    const ellipsis = document.createElement("li");
    ellipsis.textContent = "···";
    ellipsis.setAttribute("class", "ellipsis");
    selectedRealtyType.appendChild(ellipsis);
  }
});

function handleLogout() {
  signOut(auth).then(() => {
    alert("로그아웃되었습니다.");
    window.location.href = `index.html`;
  });
}

function directToMap(type) {
  window.location.href = `map.html?type=${type}`;
}

function toggleFullList(type) {
  // 더보기 textContent 수정
  // toggle로 바꿔줘야 함
  // 마지막 middot
  const realtyList = document.querySelectorAll(`#${type} li`);
  realtyList.forEach((item, index) => {
    if (index >= 5) item.classList.toggle("hidden");
  });

  const toggleBtn = document.querySelector(`#${type} .show-more`);
  const ellipsis = document.querySelector(`#${type} .ellipsis`);
  if (toggleBtn.textContent === "더보기") {
    toggleBtn.textContent = "간략히 보기";
    ellipsis.style.display = "none";
  } else {
    toggleBtn.textContent = "더보기";
    ellipsis.style.display = "list-item";
  }
}

logoutBtn.addEventListener("click", handleLogout);
realtyType.forEach((type) => {
  const directToMapBtn = document.querySelector(`#${type} button`);
  directToMapBtn.addEventListener("click", () => {
    directToMap(type);
  });

  const listToggleBtn = document.querySelector(`#${type} .show-more`);
  listToggleBtn.addEventListener("click", () => {
    toggleFullList(type);
  });
});
