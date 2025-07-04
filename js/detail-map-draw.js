// 쿼리 파라미터에서 지역 코드 추출
const params = new URLSearchParams(window.location.search);
const region = params.get('region');
const undoButton = document.querySelector("button");

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

  const map = L.map('map').setView(regionCenter.center, regionCenter.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch(`mapdata/${regionCode}.json`)
    .then(res => res.json())
    .then(data => {
      const layer = L.geoJSON(data, {
        style: {
          color: "#333",
          weight: 1,
          fillColor: "#ffcc66",
          fillOpacity: 0.5
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
          }

          ///// 새로 추가한 라인
          layer.on({
            mouseover: highlightStyle,
            mouseout: resetStyle
            // click: zoomToFeature
          });
          /////
        }
      }).addTo(map);

      map.fitBounds(layer.getBounds()); /*이 코드가 GeoJSON 레이어의 경계에 맞게 지도 중심과 줌 레벨을 자동 조정하기 때문에 getRegionCenter()로 설정한 초기 중심이 fitBounds()에 의해 무시되어 일단 주석 처리*/
    })
    .catch(() => {
      alert("지도 데이터를 불러오는 데 실패했습니다.");
    });
}

function highlightStyle(event) {
  const layer = event.target;
  layer.setStyle({
    weight: 2,
    color: '#666',
    fillColor: '#ff9933',
    fillOpacity: 0.8
  });
  layer.bringToFront();
}

function resetStyle(event) {
  const layer = event.target;
  layer.setStyle({
    weight: 1,
    color: '#333',
    fillColor: '#ffcc66',
    fillOpacity: 0.5
  });
  layer.bringToFront();
}

// 지역 중심좌표 및 줌 설정
function getRegionCenter(regionCode) {
  const centers = {
    // map.fitBounds()를 적용한 중심, 그런데 이게 지도를 자동으로 조정하기 떄문에
    // 여기에 설정한 center, zoom 값은 거의 의마가 없다.
    // 그래도 이게 화면 크기에 맞게 자동으로 조정해줄 테니 이 코드를 쓰는게 나을듯
    seoul: { center: [37.5665, 126.9780], zoom: 11 },
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
    chungnam: { center: [36.5184, 126.8000], zoom: 9 },
    jeonbuk: { center: [35.7167, 127.1442], zoom: 9 },
    jeonnam: { center: [34.8161, 126.4632], zoom: 9 },
    gyeongbuk: { center: [36.5760, 128.5056], zoom: 9 },
    gyeongnam: { center: [35.2773, 128.4046], zoom: 10 },
    jeju: { center: [33.4996, 126.5312], zoom: 11 }
  };

  return centers[regionCode];
}

function displayProvence() {
  window.location.href = `map.html`;
}

undoButton.addEventListener("click", displayProvence);