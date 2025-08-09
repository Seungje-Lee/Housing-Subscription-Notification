import { auth, db } from "../firebase.js";
import {
  setDoc,
  doc,
  collection,
  where,
  query,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const realtyType = params.get("type");
const undoToListBtn = document.querySelector("#undo-to-list");
const undoToMapBtn = document.querySelector("#undo-to-map");
const listSubmitBtn = document.querySelector("#list-submit");
const logoutBtn = document.querySelector("#logout");
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

await auth.authStateReady();
const user = auth.currentUser;

// 왜 auth.currentUser를 체크하면 안되는거지? => 아마 await이 필요한듯
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

let map = L.map("map").setView([36.5, 127.8], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

drawMap();

// firestore에 저장된 데이터를 불러오는 작업, firestore에서 불러오고 localStorage에 set까지 해야 함
const docSnap = await getDoc(doc(db, "notificationList", user.uid));
const storedDistrict = docSnap.data()[realtyType];
(storedDistrict || "").forEach((item) => {
  const district = document.createElement("li");
  district.textContent = item;
  district.style.cssText = "text-align: start;";
  selectedDistrictList.appendChild(district);
});
localStorage.setItem("district", JSON.stringify(storedDistrict));

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

function zoomToFeature(e) {
  const name = e.target.feature.properties.name;
  const regionCode = getRegionCode(name);

  if (regionCode) {
    drawDetailedMap(regionCode);
  } else {
    alert(`${name}의 상세 페이지가 없습니다.`);
  }
}

function getRegionCode(name) {
  const mapCode = {
    서울특별시: "seoul",
    부산광역시: "busan",
    대구광역시: "daegu",
    인천광역시: "incheon",
    광주광역시: "gwangju",
    대전광역시: "daejeon",
    울산광역시: "ulsan",
    세종시: "sejong",
    경기도: "gyeonggi",
    강원도: "gangwon",
    충청북도: "chungbuk",
    충청남도: "chungnam",
    전라북도: "jeonbuk",
    전라남도: "jeonnam",
    경상북도: "gyeongbuk",
    경상남도: "gyeongnam",
    제주도: "jeju",
  };

  return mapCode[name];
}

function drawMap() {
  map.setView([36.5, 127.8], 7);
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Path) {
      map.removeLayer(layer);
    }
  });

  undoToMapBtn.style.display = "none";

  let currentLayer = null;

  fetch("mapdata/korea.json")
    .then((res) => res.json())
    .then((data) => {
      currentLayer = L.geoJSON(data, {
        style: {
          color: "#333",
          weight: 1,
          fillColor: "#ffcc66",
          fillOpacity: 0.6,
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: highlightStyle,
            mouseout: resetStyle,
            click: zoomToFeature,
          });
        },
      }).addTo(map);
    });
}

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

function drawDetailedMap(regionCode) {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker || layer instanceof L.Path) {
      map.removeLayer(layer);
    }
  });

  undoToMapBtn.style.display = "inline-block";

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
              },
            });
          }
        },
      }).addTo(map);

      map.fitBounds(layer.getBounds());
    })
    .catch(() => {
      alert("지도 데이터를 불러오는 데 실패했습니다.");
    });
}

function directToList() {
  if (!confirm("청약 유형별 알림 리스트로 돌아가시겠습니까?")) return;
  window.location.href = `list-display.html`;
}

async function submitList() {
  if (!confirm("선택한 지역에 대한 알림을 받아보시겠습니까?")) return;
  try {
    await updateDoc(doc(db, "notificationList", user.uid), {
      [realtyType]: JSON.parse(localStorage.getItem("district") || "[]"),
    });
    alert("선택한 지역 정보를 성공적으로 저장했습니다.");
  } catch (e) {
    alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

function handleLogout() {
  signOut(auth).then(() => {
    alert("로그아웃되었습니다.");
    window.location.href = `index.html`;
  });
}

undoToListBtn.addEventListener("click", directToList);
undoToMapBtn.addEventListener("click", drawMap);
listSubmitBtn.addEventListener("click", submitList);
logoutBtn.addEventListener("click", handleLogout);
