import { auth } from "../firebase.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// 왜 auth.currentUser를 체크하면 안되는거지?
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

let map = L.map("map").setView([36.5, 127.8], 7);

// 타일 레이어
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let currentLayer = null;

// 대한민국 지도 GeoJSON 데이터 불러오기
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
        /*layer.bindTooltip(feature.properties.name, {
          permanent: true, // 항상 보이게
          direction: 'center', // 정중앙에 위치
          // 이렇게 center를 잡으면 아마 multipolygon인 지역들은 이상한 곳 위에 뜨는데,
          // multipolygon 순서를 바꿔서 다른 위치에 올릴 수 있을듯
          className: 'district-label' // 스타일 지정 가능
        });*/ // 이렇게 하니까 뭔가 이상한 정중앙에 올라가는데?
        layer.on({
          mouseover: highlightStyle,
          mouseout: resetStyle,
          click: zoomToFeature,
        });
      },
    }).addTo(map);
  });

// ul에 localStorage에 있는 지역구 목록 추가하기
const selectedDistrictList = document.querySelector(".selected-info ul");

JSON.parse(localStorage.getItem("district") || "[]").map((item) => {
  const district = document.createElement("li");
  district.textContent = item;
  district.style.cssText = "text-align: start;";
  selectedDistrictList.appendChild(district);
});

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
  currentLayer.resetStyle(event.target);
}

function zoomToFeature(e) {
  const name = e.target.feature.properties.name;
  const regionCode = getRegionCode(name);

  if (regionCode) {
    window.location.href = `detailed-map.html?region=${regionCode}`;
  } else {
    alert(`${name}의 상세 페이지가 없습니다.`);
  }
}

// 시도 이름을 코드화
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

const logOutBtn = document.getElementById("logout");

function handleLogOut() {
  signOut(auth).then(() => {
    alert("로그아웃되었습니다.");
    window.location.href = `index.html`;
  });
}

logOutBtn.addEventListener("click", handleLogOut);
