/*
// 지도 초기화
let map = L.map('map').setView([36.5, 127.8], 7);

// 기본 타일 레이어
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentLayer = null;  // 현재 선택된 시도 레이어 저장
let subLayer = null;      // 하위 행정구역 레이어

// 시도 경계 GeoJSON 불러오기
fetch('mapdata/korea.json')
  .then(response => response.json())
  .then(data => {
    currentLayer = L.geoJSON(data, {
      style: defaultStyle,
      onEachFeature: onEachFeature
    }).addTo(map);
  });

// 기본 스타일
function defaultStyle(feature) {
  return {
    color: "#333",
    weight: 1,
    fillColor: "#ffcc66",
    fillOpacity: 0.6
  };
}

// 마우스오버 스타일
function highlightStyle(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 2,
    color: '#666',
    fillColor: '#ff9933',
    fillOpacity: 0.8
  });
  layer.bringToFront();
}

// 마우스아웃 스타일 복원
function resetStyle(e) {
  currentLayer.resetStyle(e.target);
}

// 클릭 이벤트로 하위 행정구역 불러오기
function zoomToFeature(e) {
  const feature = e.target.feature;
  const name = feature.properties.name;

  // 예: 서울특별시 -> 서울시의 시군구 지도 불러오기
  // 실제 파일명에 맞게 경로 지정 필요
  const url = getSubGeoJsonUrl(name);

  if (url) {
    // 기존 하위 레이어 제거
    if (subLayer) {
      map.removeLayer(subLayer);
    }

    fetch(url)
      .then(response => response.json())
      .then(geojson => {
        subLayer = L.geoJSON(geojson, {
          style: {
            color: "#0066cc",
            weight: 1,
            fillColor: "#99ccff",
            fillOpacity: 0.5
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(feature.properties.name);
            }
          }
        }).addTo(map);
        map.fitBounds(subLayer.getBounds());
      });
  } else {
    alert(`${name}의 하위 행정구역 데이터가 없습니다.`);
  }
}

// 각 feature에 이벤트 추가
function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }

  layer.on({
    mouseover: highlightStyle,
    mouseout: resetStyle,
    click: zoomToFeature
  });
}

// 시도 이름에 따른 하위 GeoJSON 경로 매핑
function getSubGeoJsonUrl(name) {
  // 실제 하위 경로에 맞게 설정 필요
  const map = {
    '서울특별시': 'mapdata/seoul.json',
    '부산광역시': 'mapdata/busan.json',
    '대구광역시': 'mapdata/daegu.json',
    '인천광역시': 'mapdata/incheon.json',
    '대전광역시': 'mapdata/daejeon.json',
    '광주광역시': 'mapdata/gwangju.json',
    '울산광역시': 'mapdata/ulsan.json',
    '세종특별자치시': 'mapdata/sejong.json',
    '경기도': 'mapdata/gyeonggi.json',
    '강원도': 'mapdata/gangwon.json',
    '충청북도': 'mapdata/chungbuk.json',
    '충청남도': 'mapdata/chungnam.json',
    '전라북도': 'mapdata/jeonbuk.json',
    '전라남도': 'mapdata/jeonnam.json',
    '경상북도': 'mapdata/gyeongbuk.json',
    '경상남도': 'mapdata/gyeongnam.json',
    '제주도': 'mapdata/jeju.json'
    // 필요한 시도 추가
  };

  return map[name];
}
*/

let map = L.map('map').setView([36.5, 127.8], 7);

// 타일 레이어
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentLayer = null;

fetch('mapdata/korea.json')
  .then(res => res.json())
  .then(data => {
    currentLayer = L.geoJSON(data, {
      style: {
        color: "#333",
        weight: 1,
        fillColor: "#ffcc66",
        fillOpacity: 0.6
      },
      onEachFeature: onEachFeature
    }).addTo(map);
  });

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
  currentLayer.resetStyle(event.target);
}

function zoomToFeature(e) {
  const name = e.target.feature.properties.name;
  const regionCode = getRegionCode(name);

  if (regionCode) {
    // 쿼리 파라미터로 detail.html 페이지로 이동
    window.location.href = `detail.html?region=${regionCode}`;
  } else {
    alert(`${name}의 상세 페이지가 없습니다.`);
  }
}

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }

  layer.on({
    mouseover: highlightStyle,
    mouseout: resetStyle,
    click: zoomToFeature
  });
}

// 시도 이름을 코드화
function getRegionCode(name) {
  const map = {
    '서울특별시': 'seoul',
    '부산광역시': 'busan',
    '대구광역시': 'daegu',
    '인천광역시': 'incheon',
    '광주광역시': 'gwangju',
    '대전광역시': 'daejeon',
    '울산광역시': 'ulsan',
    '세종시': 'sejong',
    '경기도': 'gyeonggi',
    '강원도': 'gangwon',
    '충청북도': 'chungbuk',
    '충청남도': 'chungnam',
    '전라북도': 'jeonbuk',
    '전라남도': 'jeonnam',
    '경상북도': 'gyeongbuk',
    '경상남도': 'gyeongnam',
    '제주도': 'jeju'
  };

  return map[name];
}