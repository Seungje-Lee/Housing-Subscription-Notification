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
const params = new URLSearchParams(window.location.search);
const region = params.get("region");
const undoButton = document.querySelector("button");
const logOutBtn = document.getElementById("logout");
const listSubmitBtn = document.getElementById("listSubmit");
const selectedDistrictList = document.querySelector(".selected-info ul");
const mapCode = {
  seoul: "서울특별시",
  busan: "부산광역시",
  daegu: "대구광역시",
  incheon: "인천광역시",
  gwangju: "광주광역시",
  daejeon: "대전광역시",
  ulsan: "울산광역시",
  sejong: "세종시",
  gyeonggi: "경기도",
  gangwon: "강원도",
  chungbuk: "충청북도",
  chungnam: "충청남도",
  jeonbuk: "전라북도",
  jeonnam: "전라남도",
  gyeongbuk: "경상북도",
  gyeongnam: "경상남도",
  jeju: "제주도",
};

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

function districtSelect(regionCode, districtName) {
  let selectedDistrict = [];

  if (localStorage.getItem("district") == null) {
    selectedDistrict.push(mapCode[regionCode] + " " + districtName);
  } else {
    selectedDistrict = JSON.parse(localStorage.getItem("district") || "[]");

    // 이미 localStorage에 저장되어 있다면 제거하고, 없으면 넣는 과정
    let index = selectedDistrict.indexOf(
      mapCode[regionCode] + " " + districtName
    );
    if (index !== -1) {
      selectedDistrict.splice(index, 1);
    } else {
      selectedDistrict.push(mapCode[regionCode] + " " + districtName);
    }
  }
  selectedDistrict.sort();
  localStorage.setItem("district", JSON.stringify(selectedDistrict));

  // 지도 위에 띄우는 div에 선택한 영역 보여주는 부분
  while (selectedDistrictList.firstChild)
    selectedDistrictList.removeChild(selectedDistrictList.firstChild);

  JSON.parse(localStorage.getItem("district") || "[]").map((item) => {
    const district = document.createElement("li");
    district.textContent = item;
    district.style.cssText = "text-align: start;";
    selectedDistrictList.appendChild(district);
  });
}

if (!region) {
  alert("유효하지 않은 지역입니다.");
} else {
  drawMap(region);
}

function drawMap(regionCode) {
  const regionCenter = getRegionCenter(regionCode);

  if (!regionCenter) {
    alert("지도 중심 정보를 찾을 수 없습니다.");
    return;
  }

  const map = L.map("map").setView(regionCenter.center, regionCenter.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  fetch(`mapdata/${regionCode}.json`)
    .then((res) => res.json())
    .then((data) => {
      let selectedDistrict = JSON.parse(
        localStorage.getItem("district") || "[]"
      );

      const layer = L.geoJSON(data, {
        style: {
          color: "#333",
          weight: 1,
          fillColor: "#ffcc66",
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          //원래 코드
          /*if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
          }*/

          layer.bindTooltip(feature.properties.name, {
            permanent: true, // 항상 보이게
            direction: "center", // 정중앙에 위치
            // 이렇게 center를 잡으면 multipolygon인 지역들은 이상한 곳 위에 뜨는데,
            // GeoJSON 내 multipolygon 순서를 바꿔서 다른 위치에 올릴 수 있을듯
            className: "district-label", // 스타일 지정 가능
          });

          // 이미 localStorage에서 선택되어 있던 영역이라면
          //console.log(map[String(regionCode)]);
          if (
            selectedDistrict.indexOf(
              mapCode[regionCode] + " " + feature.properties.name
            ) !== -1
          ) {
            layer.setStyle(
              {
                weight: 2,
                color: "#666",
                fillColor: "#ff9933",
                fillOpacity: 0.8,
              },
              layer.bringToFront()
            );
            layer.on({
              click: function () {
                districtSelect(regionCode, feature.properties.name);
                // layer.off로 mouesover가 제거된 상테
                if (layer._events.mouseover === undefined) {
                  layer.on({
                    mouseover: highlightStyle,
                    mouseout: resetStyle,
                  });
                } else {
                  layer.off("mouseover");
                  layer.off("mouseout");
                }
              },
            });
          } else {
            layer.on({
              mouseover: highlightStyle,
              mouseout: resetStyle,
              click: function () {
                districtSelect(regionCode, feature.properties.name);
                // layer.off로 mouseover가 제거된 상태
                if (layer._events.mouseover === undefined) {
                  layer.on({
                    mouseover: highlightStyle,
                    mouseout: resetStyle,
                  });
                } else {
                  layer.off("mouseover");
                  layer.off("mouseout");
                }
                //layer.off("mouseover");
                //layer.off("mouseon");
                //console.log(layer._events.mouseover);
                // ->mouseover, mouseout event가 있음
                // 없는 상태에서 console.log하면 undefined

                // layer.off하니까 mouseover 이벤트만 사라짐
              },
            });
          }
        },
      }).addTo(map);

      /* 이 코드가 GeoJSON 레이어의 경계에 맞게 지도 중심과 줌 레벨을 자동 조정하기 때문에 
      getRegionCenter()로 설정한 초기 중심이 fitBounds()에 의해 무시되어 일단 주석 처리 */
      map.fitBounds(layer.getBounds());
    })
    .catch(() => {
      alert("지도 데이터를 불러오는 데 실패했습니다.");
    });

  JSON.parse(localStorage.getItem("district") || "[]").map((item) => {
    const district = document.createElement("li");
    district.textContent = item;
    district.style.cssText = "text-align: start;";
    selectedDistrictList.appendChild(district);
  });
}

function highlightStyle(event) {
  const layer = event.target;
  layer.setStyle({
    weight: 2,
    color: "#666",
    fillColor: "#ff9933",
    fillOpacity: 0.8,
  });
  layer.bringToFront();
}

function resetStyle(event) {
  const layer = event.target;
  layer.setStyle({
    weight: 1,
    color: "#333",
    fillColor: "#ffcc66",
    fillOpacity: 0.5,
  });
  layer.bringToFront();
}

// 지역 중심좌표 및 줌 설정
function getRegionCenter(regionCode) {
  const centers = {
    // map.fitBounds()를 적용한 중심, 그런데 이게 지도를 자동으로 조정하기 떄문에
    // 이쪽에 설정한 center, zoom 값은 의마가 없다.
    // 그래도 map.fitBounds()를 하면 GeoJSON 크기에 맞게 자동으로 조정해줄 테니 이 코드를 쓰는게 나을듯
    // 이 줄은 GeoJSON 레이어의 경계에 맞게 지도 중심과 줌 레벨을 자동 조정합니다.
    // 즉, getRegionCenter()로 설정한 초기 중심이 fitBounds()에 의해 무시되는 것입니다.
    seoul: { center: [37.5665, 126.978], zoom: 11 },
    busan: { center: [35.1796, 129.0756], zoom: 11 },
    daegu: { center: [35.8714, 128.6014], zoom: 11 },
    incheon: { center: [37.4563, 126.7052], zoom: 11 },
    gwangju: { center: [35.1595, 126.8526], zoom: 11 },
    daejeon: { center: [36.3504, 127.3845], zoom: 11 },
    ulsan: { center: [35.5384, 129.3114], zoom: 11 },
    sejong: { center: [36.4801, 127.289], zoom: 11 },
    gyeonggi: { center: [37.4138, 127.5183], zoom: 9 },
    gangwon: { center: [37.8228, 128.1555], zoom: 9 },
    chungbuk: { center: [36.6357, 127.4917], zoom: 9 },
    chungnam: { center: [36.5184, 126.8], zoom: 9 },
    jeonbuk: { center: [35.7167, 127.1442], zoom: 9 },
    jeonnam: { center: [34.8161, 126.4632], zoom: 9 },
    gyeongbuk: { center: [36.576, 128.5056], zoom: 9 },
    gyeongnam: { center: [35.2773, 128.4046], zoom: 10 },
    jeju: { center: [33.4996, 126.5312], zoom: 11 },
  };

  return centers[regionCode];
}

function displayProvince() {
  window.location.href = `map.html`;
}

function handleLogOut() {
  signOut(auth).then(() => {
    alert("로그아웃되었습니다.");
    window.location.href = `index.html`;
  });
}

async function handleSubmit() {
  const user = auth.currentUser;
  const selectedDistrict = JSON.parse(localStorage.getItem("district"));
  confirm("아래 지역 목록을 제출하시겠습니까?");
  try {
    await setDoc(doc(db, "notificationList", user.uid), {
      selectedDistrict,
    });
    // await addDoc(collection(db, "notificationList"), {
    //   selectedDistrict,
    //   userId: user.uid,
    // });
    // console.log("제출됨");

    /*await setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA"
});*/

    // const snapshot = await getDocs(tweetsQuery);
    // const tweets = snapshot.docs.map((doc) => {
    //   const { createdAt, tweet, userId, username } = doc.data();
    //   return {
    //     createdAt,
    //     tweet,
    //     userId,
    //     username,
    //     id: do xc.id,
    //   };
    // });

    const getQuery = query(
      collection(db, "notificationList"),
      where("userId", "==", user?.uid)
    );
    //    const snapshot = await getDoc(getQuery);
    //    console.log(snapshot);

    const docSnap = await getDoc(doc(db, "notificationList", user.uid));

    console.log(docSnap.data().selectedDistrict);

    // snapshot.docs.map((doc) => {
    //   const list = doc.data();
    //   console.log(list)
    // });

    // console.log(
    //   snapshot.docs[0]._document.data.value.mapValue.fields.selectedDistrict
    //     .arrayValue.values[0].stringValue
    // );

    // const fetchTweets = async () => {
    //   const querySnapshot = await getDocs(collection(db, "notificationList"));
    //   console.log(querySnapshot);
  } catch (e) {
    console.log(e);
  }
}

undoButton.addEventListener("click", displayProvince);
logOutBtn.addEventListener("click", handleLogOut);
listSubmitBtn.addEventListener("click", handleSubmit);
