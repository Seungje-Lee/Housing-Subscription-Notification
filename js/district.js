const seoul = document.getElementById("seoul");
const busan = document.getElementById("busan");
const daegu = document.getElementById("daegu");
const incheon = document.getElementById("incheon");
const daejeon = document.getElementById("daejeon");
const gwangjumet = document.getElementById("gwangjumet");
const ulsan = document.getElementById("ulsan");
const sejong = document.getElementById("sejong");
const gyeonggi = document.getElementById("gyeonggi");
const gangwon = document.getElementById("gangwon");
const chungbuk = document.getElementById("chungbuk");
const chungnam = document.getElementById("chungnam");
const jeonbuk = document.getElementById("jeonbuk");
const jeonnam = document.getElementById("jeonnam");
const gyeongbuk = document.getElementById("gyeongbuk");
const gyeongnam = document.getElementById("gyeongnam");
const jeju = document.getElementById("jeju");

const seoulUndoButton = document.getElementById("127");
const busanUndoButton = document.getElementById("147");
const daeguUndoButton = document.getElementById("160");
const incheonUndoButton = document.getElementById("181");
const daejeonUndoButton = document.getElementById("196");
const gwangjuUndoButton = document.getElementById("206");
const ulsanUndoButton = document.getElementById("216");
// const sejongUndoButton = document.getElementById("");
const gyeonggiUndoButton = document.getElementById("252");
const gangwonUndoButton = document.getElementById("279");
const chungbukUndoButton = document.getElementById("302");
const chungnamUndoButton = document.getElementById("326");
const jeonbukUndoButton = document.getElementById("345");
const jeonnamUndoButton = document.getElementById("373");
const gyeongbukUndoButton = document.getElementById("403");
const gyeongnamUndoButton = document.getElementById("429");
const jejuUndoButton = document.getElementById("443");

function displaySeoulSubdistrict() {
  const seoulSubdistrict = document.querySelectorAll("#seoul > span");
  const superDistrict = document.querySelectorAll("body > span:not(:first-child)"); // 상위 행정구역 선택
  
  seoulSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  seoulUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  // 여기서 서울특별시도 안 보이게 하고 싶은데 서울특별시에 CSS hidden을 적용시키면 그 하위 자식들까지 모두 숨겨져버리는 문제...
  
}

function displayBusanSubdistrict() {
  const busanSubdistrict = document.querySelectorAll("#busan > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(2))");

  busanSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  busanUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayDaeguSubdistrict() {
  const daeguSubdistrict = document.querySelectorAll("#daegu > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(3))");

  daeguSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  daeguUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayIncheonSubdistrict() {
  const incheonSubdistrict = document.querySelectorAll("#incheon > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(4))");

  incheonSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  incheonUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayDaejeonSubdistrict() {
  const daejeonSubdistrict = document.querySelectorAll("#daejeon > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(5))");

  daejeonSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  daejeonUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGwangjuSubdistrict() {
  const gwangjuSubdistrict = document.querySelectorAll("#gwangjumet > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(6))");

  gwangjuSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gwangjuUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayUlsanSubdistrict() {
  const ulsanSubdistrict = document.querySelectorAll("#ulsan > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(7))");

  ulsanSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  ulsanUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function showSejongSubdistrict() {

}

function displayGyeonggiSubdistrict() {
  const gyeonggiSubdistrict = document.querySelectorAll("#gyeonggi > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(9))");

  gyeonggiSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gyeonggiUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGangwonSubdistrict() {
  const gangwonSubdistrict = document.querySelectorAll("#gangwon > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(10))");

  gangwonSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gangwonUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayChungbukSubdistrict() {
  const chungbukSubdistrict = document.querySelectorAll("#chungbuk > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(11))");

  chungbukSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  chungbukUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayChungnamSubdistrict() {
  const chungnamSubdistrict = document.querySelectorAll("#chungnam > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(12))");

  chungnamSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  chungnamUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayJeonbukSubdistrict() {
  const jeonbukSubdistrict = document.querySelectorAll("#jeonbuk > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(13))");

  jeonbukSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  jeonbukUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayJeonnamSubdistrict() {
  const jeonnamSubdistrict = document.querySelectorAll("#jeonnam > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(14))");

  jeonnamSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  jeonnamUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGyeongbukSubdistrict() {
  const gyeongbukSubdistrict = document.querySelectorAll("#gyeongbuk > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(15))");

  gyeongbukSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gyeongbukUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function showGyeongnamSubdistrict() {
  const gyeongnamSubdistrict = document.querySelectorAll("#gyeongnam > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(16))");

  gyeongnamSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gyeongnamUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function showJejuSubdistrict() {
  const jejuSubdistrict = document.querySelectorAll("#jeju > span");
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(17))");

  jejuSubdistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  jejuUndoButton.classList.toggle("hidden");

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function focusOnDistrict(id) {
  const district = document.getElementById(id);
  district.style.cursor = "pointer";
  district.style["textDecoration"] = "underline";
}

function focusOutDistrict(id) {
  const district = document.getElementById(id);
  district.style.cursor = "default";
  district.style["textDecoration"] = "none";
}


seoul.addEventListener("click", displaySeoulSubdistrict);
seoul.addEventListener("mouseenter", () => focusOnDistrict("seoul"));
seoul.addEventListener("mouseleave", () => focusOutDistrict("seoul"));
seoulUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displaySeoulSubdistrict();
});

busan.addEventListener("click", displayBusanSubdistrict);
busan.addEventListener("mouseenter", () => focusOnDistrict("busan"));
busan.addEventListener("mouseleave", () => focusOutDistrict("busan"));
busanUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayBusanSubdistrict();
});

daegu.addEventListener("click", displayDaeguSubdistrict);
daegu.addEventListener("mouseenter", () => focusOnDistrict("daegu"));
daegu.addEventListener("mouseleave", () => focusOutDistrict("daegu"));
daeguUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayDaeguSubdistrict();
});

incheon.addEventListener("click", displayIncheonSubdistrict);
incheon.addEventListener("mouseenter", () => focusOnDistrict("incheon"));
incheon.addEventListener("mouseleave", () => focusOutDistrict("incheon"));
incheonUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayIncheonSubdistrict();
});

daejeon.addEventListener("click", displayDaejeonSubdistrict);
daejeon.addEventListener("mouseenter", () => focusOnDistrict("daejeon"));
daejeon.addEventListener("mouseleave", () => focusOutDistrict("daejeon"));
daejeonUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayDaejeonSubdistrict();
});

gwangjumet.addEventListener("click", displayGwangjuSubdistrict);
gwangjumet.addEventListener("mouseenter", () => focusOnDistrict("gwangjumet"));
gwangjumet.addEventListener("mouseleave", () => focusOutDistrict("gwangjumet"));
gwangjuUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayGwangjuSubdistrict();  
});

ulsan.addEventListener("click", displayUlsanSubdistrict);
ulsan.addEventListener("mouseenter", () => focusOnDistrict("ulsan"));
ulsan.addEventListener("mouseleave", () => focusOutDistrict("ulsan"));
ulsanUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayUlsanSubdistrict();
});

sejong.addEventListener("click", showSejongSubdistrict);
sejong.addEventListener("mouseenter", () => focusOnDistrict("sejong"));
sejong.addEventListener("mouseleave", () => focusOutDistrict("sejong"));
// sejongUndoButton.addEventListener("click", sejongSeoulSubdistrict);

gyeonggi.addEventListener("click", displayGyeonggiSubdistrict);
gyeonggi.addEventListener("mouseenter", () => focusOnDistrict("gyeonggi"));
gyeonggi.addEventListener("mouseleave", () => focusOutDistrict("gyeonggi"));
gyeonggiUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayGyeonggiSubdistrict();
});

gangwon.addEventListener("click", displayGangwonSubdistrict);
gangwon.addEventListener("mouseenter", () => focusOnDistrict("gangwon"));
gangwon.addEventListener("mouseleave", () => focusOutDistrict("gangwon"));
gangwonUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayGangwonSubdistrict();
});

chungbuk.addEventListener("click", displayChungbukSubdistrict);
chungbuk.addEventListener("mouseenter", () => focusOnDistrict("chungbuk"));
chungbuk.addEventListener("mouseleave", () => focusOutDistrict("chungbuk"));
chungbukUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayChungbukSubdistrict();
});

chungnam.addEventListener("click", displayChungnamSubdistrict);
chungnam.addEventListener("mouseenter", () => focusOnDistrict("chungnam"));
chungnam.addEventListener("mouseleave", () => focusOutDistrict("chungnam"));
chungnamUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayChungnamSubdistrict();
});

jeonbuk.addEventListener("click", displayJeonbukSubdistrict);
jeonbuk.addEventListener("mouseenter", () => focusOnDistrict("jeonbuk"));
jeonbuk.addEventListener("mouseleave", () => focusOutDistrict("jeonbuk"));
jeonbukUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayJeonbukSubdistrict();
});

jeonnam.addEventListener("click", displayJeonnamSubdistrict);
jeonnam.addEventListener("mouseenter", () => focusOnDistrict("jeonnam"));
jeonnam.addEventListener("mouseleave", () => focusOutDistrict("jeonnam"));
jeonnamUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayJeonnamSubdistrict();
});

gyeongbuk.addEventListener("click", displayGyeongbukSubdistrict);
gyeongbuk.addEventListener("mouseenter", () => focusOnDistrict("gyeongbuk"));
gyeongbuk.addEventListener("mouseleave", () => focusOutDistrict("gyeongbuk"));
gyeongbukUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  displayGyeongbukSubdistrict();
});

gyeongnam.addEventListener("click", showGyeongnamSubdistrict);
gyeongnam.addEventListener("mouseenter", () => focusOnDistrict("gyeongnam"));
gyeongnam.addEventListener("mouseleave", () => focusOutDistrict("gyeongnam"));
gyeongnamUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  showGyeongnamSubdistrict();
});

jeju.addEventListener("click", showJejuSubdistrict);
jeju.addEventListener("mouseenter", () => focusOnDistrict("jeju"));
jeju.addEventListener("mouseleave", () => focusOutDistrict("jeju"));
jejuUndoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  showJejuSubdistrict();
});