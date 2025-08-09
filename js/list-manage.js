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
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// 쿼리 파라미터에서 지역 코드 추출
//const params = new URLSearchParams(window.location.search);
//const region = params.get("region");
const logoutBtn = document.getElementById("logout");
//const selectedDistrictList = document.querySelector(".selected-info ul");

await auth.authStateReady();

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const user = auth.currentUser;

// let getQuery = query(
//   collection(db, "apt"),
//   // document 이름을 user.uid로 설정해둠
//   where("userId", "==", user?.uid)
// );

// const snapshot = await getDoc(getQuery);
// console.log(snapshot);

const realtyType = [
  "apt",
  "office",
  "publicRent",
  "random",
  "resupplyTorts",
  "prePrivate",
  "voluntarySupply",
];

const docSnap = await getDoc(doc(db, "notificationList", user.uid));

// console.log(docSnap.data().apt);

// 각 청약 유형별로 신청한 지역별 알림 정보를 보여줌
realtyType.forEach((realty) => {
  const selectedRealtyType = document.querySelector(`#${realty} ul`);
  const storedList = docSnap.data()[realty];

  storedList.forEach((item) => {
    const district = document.createElement("li");
    district.textContent = item;
    selectedRealtyType.appendChild(district);
  });
});

function handleLogout() {
  signOut(auth).then(() => {
    alert("로그아웃되었습니다.");
    window.location.href = `index.html`;
  });
}

logoutBtn.addEventListener("click", handleLogout);

function directToMap(type) {
  window.location.href = `maptest.html?type=${type}`;
}

realtyType.forEach(function (type) {
  const directToMapBtn = document.querySelector(`#${type} button`);
  directToMapBtn.addEventListener("click", () => {
    directToMap(type);
  });
});

// function districtSelect(regionCode, districtName) {
//   let selectedDistrict = [];

//   if (localStorage.getItem("district") == null) {
//     selectedDistrict.push(mapCode[regionCode] + " " + districtName);
//   } else {
//     selectedDistrict = JSON.parse(localStorage.getItem("district") || "[]");

//     // 이미 localStorage에 저장되어 있다면 제거하고, 없으면 넣는 과정
//     let index = selectedDistrict.indexOf(
//       mapCode[regionCode] + " " + districtName
//     );
//     if (index !== -1) {
//       selectedDistrict.splice(index, 1);
//     } else {
//       selectedDistrict.push(mapCode[regionCode] + " " + districtName);
//     }
//   }
//   selectedDistrict.sort();
//   localStorage.setItem("district", JSON.stringify(selectedDistrict));

//   // 지도 위에 띄우는 div에 선택한 영역 보여주는 부분
//   while (selectedDistrictList.firstChild)
//     selectedDistrictList.removeChild(selectedDistrictList.firstChild);

//   JSON.parse(localStorage.getItem("district") || "[]").map((item) => {
//     const district = document.createElement("li");
//     district.textContent = item;
//     district.style.cssText = "text-align: start;";
//     selectedDistrictList.appendChild(district);
//   });
// }

// JSON.parse(localStorage.getItem("district") || "[]").map((item) => {
//   const district = document.createElement("li");
//   district.textContent = item;
//   district.style.cssText = "text-align: start;";
//   selectedDistrictList.appendChild(district);});

// async function handleSubmit() {
//   const user = auth.currentUser;
//   const selectedDistrict = JSON.parse(localStorage.getItem("district"));
//   confirm("아래 지역 목록을 제출하시겠습니까?");
//   try {
//     await setDoc(doc(db, "notificationList", user.uid), {
//       selectedDistrict,
//     });
//     // await addDoc(collection(db, "notificationList"), {
//     //   selectedDistrict,
//     //   userId: user.uid,
//     // });
//     // console.log("제출됨");

//   // await setDoc(doc(db, "cities", "LA"), {
//   //   name: "Los Angeles",
//   //   state: "CA",
//   //   country: "USA"
//   // });

//     // const snapshot = await getDocs(tweetsQuery);
//     // const tweets = snapshot.docs.map((doc) => {
//     //   const { createdAt, tweet, userId, username } = doc.data();
//     //   return {
//     //     createdAt,
//     //     tweet,
//     //     userId,
//     //     username,
//     //     id: do xc.id,
//     //   };
//     // });

//     const getQuery = query(
//       collection(db, "notificationList"),
//       where("userId", "==", user?.uid)
//     );
//     //    const snapshot = await getDoc(getQuery);
//     //    console.log(snapshot);

//     const docSnap = await getDoc(doc(db, "notificationList", user.uid));

//     console.log(docSnap.data().selectedDistrict);

//     // snapshot.docs.map((doc) => {
//     //   const list = doc.data();
//     //   console.log(list)
//     // });

//     // console.log(
//     //   snapshot.docs[0]._document.data.value.mapValue.fields.selectedDistrict
//     //     .arrayValue.values[0].stringValue
//     // );

//     // const fetchTweets = async () => {
//     //   const querySnapshot = await getDocs(collection(db, "notificationList"));
//     //   console.log(querySnapshot);
//   } catch (e) {
//     console.log(e);
//   }
// }
