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

const seoulSubDistricts = document.querySelectorAll("#seoul > span");
const busanSubDistricts = document.querySelectorAll("#busan > span");
const daeguSubDistricts = document.querySelectorAll("#daegu > span");
const incheonSubDistricts = document.querySelectorAll("#incheon > span");
const daejeonSubDistricts = document.querySelectorAll("#daejeon > span");
const gwangjuSubDistricts = document.querySelectorAll("#gwangjumet > span");
const ulsanSubDistricts = document.querySelectorAll("#ulsan > span");
const gyeonggiSubDistricts = document.querySelectorAll("#gyeonggi > span");
const gangwonSubDistricts = document.querySelectorAll("#gangwon > span");
const chungbukSubDistricts = document.querySelectorAll("#chungbuk > span");
const chungnamSubDistricts = document.querySelectorAll("#chungnam > span");
const jeonbukSubDistricts = document.querySelectorAll("#jeonbuk > span");
const jeonnamSubDistricts = document.querySelectorAll("#jeonnam > span");
const gyeongbukSubDistricts = document.querySelectorAll("#gyeongbuk > span");
const gyeongnamSubDistricts = document.querySelectorAll("#gyeongnam > span");
const jejuSubDistricts = document.querySelectorAll("#jeju > span");

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

function handleSeoulMouseEnter() {
  focusOnDistrict("seoul");
}

function handleSeoulMouseLeave() {
  focusOutDistrict("seoul");
}

function handleBusanMouseEnter() {
  focusOnDistrict("busan");
}

function handleBusanMouseLeave() {
  focusOutDistrict("busan");
}

function handleDaeguMouseEnter() {
  focusOnDistrict("daegu");
}

function handleDaeguMouseLeave() {
  focusOutDistrict("daegu");
}

function handleIncheonMouseEnter() {
  focusOnDistrict("incheon");
}

function handleIncheonMouseLeave() {
  focusOutDistrict("incheon");
}

function handleDaejeonMouseEnter() {
  focusOnDistrict("daejeon");
}

function handleDaejeonMouseLeave() {
  focusOutDistrict("daejeon");
}

function handleGwangjuMouseEnter() {
  focusOnDistrict("gwangjumet");
}

function handleGwangjuMouseLeave() {
  focusOutDistrict("gwangjumet");
}

function handleUlsanMouseEnter() {
  focusOnDistrict("ulsan");
}

function handleUlsanMouseLeave() {
  focusOutDistrict("ulsan");
}

function handleSejongMouseEnter() {
  focusOnDistrict("sejong");
}

function handleSejongMouseLeave() {
  focusOutDistrict("sejong");
}

function handleGyeonggiMouseEnter() {
  focusOnDistrict("gyeonggi");
}

function handleGyeonggiMouseLeave() {
  focusOutDistrict("gyeonggi");
}

function handleGangwonMouseEnter() {
  focusOnDistrict("gangwon");
}

function handleGangwonMouseLeave() {
  focusOutDistrict("gangwon");
}

function handleChungbukMouseEnter() {
  focusOnDistrict("chungbuk");
}

function handleChungbukMouseLeave() {
  focusOutDistrict("chungbuk");
}

function handleChungnamMouseEnter() {
  focusOnDistrict("chungnam");
}

function handleChungnamMouseLeave() {
  focusOutDistrict("chungnam");
}

function handleJeonbukMouseEnter() {
  focusOnDistrict("jeonbuk");
}

function handleJeonbukMouseLeave() {
  focusOutDistrict("jeonbuk");
}

function handleJeonnamMouseEnter() {
  focusOnDistrict("jeonnam");
}

function handleJeonnamMouseLeave() {
  focusOutDistrict("jeonnam");
}

function handleGyeongbukMouseEnter() {
  focusOnDistrict("gyeongbuk");
}

function handleGyeongbukMouseLeave() {
  focusOutDistrict("gyeongbuk");
}

function handleGyeongnamMouseEnter() {
  focusOnDistrict("gyeongnam");
}

function handleGyeongnamMouseLeave() {
  focusOutDistrict("gyeongnam");
}

function handleJejuMouseEnter() {
  focusOnDistrict("jeju");
}

function handleJejuMouseLeave() {
  focusOutDistrict("jeju");
}

function displaySeoulSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:first-child)"); // 상위 행정구역 선택
  
  if(event.target !== event.currentTarget) {
    return;
  }

  seoulSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  seoulUndoButton.classList.toggle("hidden");

  if(!seoulUndoButton.classList.contains("hidden")) {
    seoul.style.cursor = "default";
    seoul.style["textDecoration"] = "none";
    seoul.removeEventListener("mouseenter", handleSeoulMouseEnter);
    seoul.removeEventListener("mouseleave", handleSeoulMouseLeave);
    seoulSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    seoul.addEventListener("mouseenter", handleSeoulMouseEnter);
    seoul.addEventListener("mouseleave", handleSeoulMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  // 여기서 서울특별시도 안 보이게 하고 싶은데 서울특별시에 CSS hidden을 적용시키면 그 하위 자식들까지 모두 숨겨져버리는 문제...
}

function displayBusanSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(2))");

  if(event.target !== event.currentTarget) {
    return;
  }

  busanSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  busanUndoButton.classList.toggle("hidden");

  if(!busanUndoButton.classList.contains("hidden")) {
    busan.style.cursor = "default";
    busan.style["textDecoration"] = "none";
    busan.removeEventListener("mouseenter", handleBusanMouseEnter);
    busan.removeEventListener("mouseleave", handleBusanMouseLeave);
    busanSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    busan.addEventListener("mouseenter", handleBusanMouseEnter);
    busan.addEventListener("mouseleave", handleBusanMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayDaeguSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(3))");

  if(event.target !== event.currentTarget) {
    return;
  }

  daeguSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  daeguUndoButton.classList.toggle("hidden");

  if(!daeguUndoButton.classList.contains("hidden")) {
    daegu.style.cursor = "default";
    daegu.style["textDecoration"] = "none";
    daegu.removeEventListener("mouseenter", handleDaeguMouseEnter);
    daegu.removeEventListener("mouseleave", handleDaeguMouseLeave);
    daeguSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    daegu.addEventListener("mouseenter", handleDaeguMouseEnter);
    daegu.addEventListener("mouseleave", handleDaeguMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayIncheonSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(4))");

  if(event.target !== event.currentTarget) {
    return;
  }

  incheonSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  incheonUndoButton.classList.toggle("hidden");

  if(!incheonUndoButton.classList.contains("hidden")) {
    incheon.style.cursor = "default";
    incheon.style["textDecoration"] = "none";
    incheon.removeEventListener("mouseenter", handleIncheonMouseEnter);
    incheon.removeEventListener("mouseleave", handleIncheonMouseLeave);
    incheonSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    incheon.addEventListener("mouseenter", handleIncheonMouseEnter);
    incheon.addEventListener("mouseleave", handleIncheonMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayDaejeonSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(5))");

  if(event.target !== event.currentTarget) {
    return;
  }

  daejeonSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  daejeonUndoButton.classList.toggle("hidden");

  if(!daejeonUndoButton.classList.contains("hidden")) {
    daejeon.style.cursor = "default";
    daejeon.style["textDecoration"] = "none";
    daejeon.removeEventListener("mouseenter", handleDaejeonMouseEnter);
    daejeon.removeEventListener("mouseleave", handleDaejeonMouseLeave);
    daejeonSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    daejeon.addEventListener("mouseenter", handleDaejeonMouseEnter);
    daejeon.addEventListener("mouseleave", handleDaejeonMouseLeave);
  }
  
  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGwangjuSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(6))");

  if(event.target !== event.currentTarget) {
    return;
  }

  gwangjuSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gwangjuUndoButton.classList.toggle("hidden");

  if(!gwangjuUndoButton.classList.contains("hidden")) {
    gwangjumet.style.cursor = "default";
    gwangjumet.style["textDecoration"] = "none";
    gwangjumet.removeEventListener("mouseenter", handleGwangjuMouseEnter);
    gwangjumet.removeEventListener("mouseleave", handleGwangjuMouseLeave);
    gwangjuSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    gwangjumet.addEventListener("mouseenter", handleGwangjuMouseEnter);
    gwangjumet.addEventListener("mouseleave", handleGwangjuMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayUlsanSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(7))");

  if(event.target !== event.currentTarget) {
    return;
  }

  ulsanSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  ulsanUndoButton.classList.toggle("hidden");

  if(!ulsanUndoButton.classList.contains("hidden")) {
    ulsan.style.cursor = "default";
    ulsan.style["textDecoration"] = "none";
    ulsan.removeEventListener("mouseenter", handleUlsanMouseEnter);
    ulsan.removeEventListener("mouseleave", handleUlsanMouseLeave);
    ulsanSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    ulsan.addEventListener("mouseenter", handleUlsanMouseEnter);
    ulsan.addEventListener("mouseleave", handleUlsanMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displaySejongSubdistrict() {

}

function displayGyeonggiSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(9))");

  if(event.target !== event.currentTarget) {
    return;
  }

  gyeonggiSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gyeonggiUndoButton.classList.toggle("hidden");

  if(!gyeonggiUndoButton.classList.contains("hidden")) {
    gyeonggi.style.cursor = "default";
    gyeonggi.style["textDecoration"] = "none";
    gyeonggi.removeEventListener("mouseenter", handleGyeonggiMouseEnter);
    gyeonggi.removeEventListener("mouseleave", handleGyeonggiMouseLeave);
    gyeonggiSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    gyeonggi.addEventListener("mouseenter", handleGyeonggiMouseEnter);
    gyeonggi.addEventListener("mouseleave", handleGyeonggiMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGangwonSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(10))");

  if(event.target !== event.currentTarget) {
    return;
  }

  gangwonSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gangwonUndoButton.classList.toggle("hidden");

  if(!gangwonUndoButton.classList.contains("hidden")) {
    gangwon.style.cursor = "default";
    gangwon.style["textDecoration"] = "none";
    gangwon.removeEventListener("mouseenter", handleGangwonMouseEnter);
    gangwon.removeEventListener("mouseleave", handleGangwonMouseLeave);
    gangwonSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    gangwon.addEventListener("mouseenter", handleGangwonMouseEnter);
    gangwon.addEventListener("mouseleave", handleGangwonMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayChungbukSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(11))");

  if(event.target !== event.currentTarget) {
    return;
  }

  chungbukSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  chungbukUndoButton.classList.toggle("hidden");

  if(!chungbukUndoButton.classList.contains("hidden")) {
    chungbuk.style.cursor = "default";
    chungbuk.style["textDecoration"] = "none";
    chungbuk.removeEventListener("mouseenter", handleChungbukMouseEnter);
    chungbuk.removeEventListener("mouseleave", handleChungbukMouseLeave);
    chungbukSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    chungbuk.addEventListener("mouseenter", handleChungbukMouseEnter);
    chungbuk.addEventListener("mouseleave", handleChungbukMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayChungnamSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(12))");

  if(event.target !== event.currentTarget) {
    return;
  }

  chungnamSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  chungnamUndoButton.classList.toggle("hidden");

  if(!chungnamUndoButton.classList.contains("hidden")) {
    chungnam.style.cursor = "default";
    chungnam.style["textDecoration"] = "none";
    chungnam.removeEventListener("mouseenter", handleChungnamMouseEnter);
    chungnam.removeEventListener("mouseleave", handleChungnamMouseLeave);
    chungnamSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    chungnam.addEventListener("mouseenter", handleChungnamMouseEnter);
    chungnam.addEventListener("mouseleave", handleChungnamMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayJeonbukSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(13))");

  if(event.target !== event.currentTarget) {
    return;
  }

  jeonbukSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  jeonbukUndoButton.classList.toggle("hidden");

  if(!jeonbukUndoButton.classList.contains("hidden")) {
    jeonbuk.style.cursor = "default";
    jeonbuk.style["textDecoration"] = "none";
    jeonbuk.removeEventListener("mouseenter", handleJeonbukMouseEnter);
    jeonbuk.removeEventListener("mouseleave", handleJeonbukMouseLeave);
    jeonbukSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    jeonbuk.addEventListener("mouseenter", handleJeonbukMouseEnter);
    jeonbuk.addEventListener("mouseleave", handleJeonbukMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayJeonnamSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(14))");

  if(event.target !== event.currentTarget) {
    return;
  }

  jeonnamSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  jeonnamUndoButton.classList.toggle("hidden");

  if(!jeonnamUndoButton.classList.contains("hidden")) {
    jeonnam.style.cursor = "default";
    jeonnam.style["textDecoration"] = "none";
    jeonnam.removeEventListener("mouseenter", handleJeonnamMouseEnter);
    jeonnam.removeEventListener("mouseleave", handleJeonnamMouseLeave);
    jeonnamSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    jeonnam.addEventListener("mouseenter", handleJeonnamMouseEnter);
    jeonnam.addEventListener("mouseleave", handleJeonnamMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGyeongbukSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(15))");

  if(event.target !== event.currentTarget) {
    return;
  }

  gyeongbukSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gyeongbukUndoButton.classList.toggle("hidden");

  if(!gyeongbukUndoButton.classList.contains("hidden")) {
    gyeongbuk.style.cursor = "default";
    gyeongbuk.style["textDecoration"] = "none";
    gyeongbuk.removeEventListener("mouseenter", handleGyeongbukMouseEnter);
    gyeongbuk.removeEventListener("mouseleave", handleGyeongbukMouseLeave);
    gyeongbukSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    gyeongbuk.addEventListener("mouseenter", handleGyeongbukMouseEnter);
    gyeongbuk.addEventListener("mouseleave", handleGyeongbukMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayGyeongnamSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(16))");

  if(event.target !== event.currentTarget) {
    return;
  }

  gyeongnamSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  gyeongnamUndoButton.classList.toggle("hidden");

  if(!gyeongnamUndoButton.classList.contains("hidden")) {
    gyeongnam.style.cursor = "default";
    gyeongnam.style["textDecoration"] = "none";
    gyeongnam.removeEventListener("mouseenter", handleGyeongnamMouseEnter);
    gyeongnam.removeEventListener("mouseleave", handleGyeongnamMouseLeave);
    gyeongnamSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    gyeongnam.addEventListener("mouseenter", handleGyeongnamMouseEnter);
    gyeongnam.addEventListener("mouseleave", handleGyeongnamMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}

function displayJejuSubdistrict(event) {
  const superDistrict = document.querySelectorAll("body > span:not(:nth-child(17))");

  if(event.target !== event.currentTarget) {
    return;
  }

  jejuSubDistricts.forEach(function(element) {
    element.classList.toggle("hidden");
  });
  jejuUndoButton.classList.toggle("hidden");

  if(!jejuUndoButton.classList.contains("hidden")) {
    jeju.style.cursor = "default";
    jeju.style["textDecoration"] = "none";
    jeju.removeEventListener("mouseenter", handleJejuMouseEnter);
    jeju.removeEventListener("mouseleave", handleJejuMouseLeave);
    jejuSubDistricts.forEach((element) => {
      element.addEventListener("mouseenter", () => focusOnDistrict(element.id));
      element.addEventListener("mouseleave", () => focusOutDistrict(element.id));
    });
  } else {
    jeju.addEventListener("mouseenter", handleJejuMouseEnter);
    jeju.addEventListener("mouseleave", handleJejuMouseLeave);
  }

  superDistrict.forEach(function(element) {
    element.classList.toggle("hidden");
  });
}



seoul.addEventListener("click", displaySeoulSubdistrict);
seoul.addEventListener("mouseenter", handleSeoulMouseEnter);
seoul.addEventListener("mouseleave", handleSeoulMouseLeave);
seoulUndoButton.addEventListener("click", displaySeoulSubdistrict);


busan.addEventListener("click", displayBusanSubdistrict);
busan.addEventListener("mouseenter", handleBusanMouseEnter);
busan.addEventListener("mouseleave", handleBusanMouseLeave);
busanUndoButton.addEventListener("click", displayBusanSubdistrict);


daegu.addEventListener("click", displayDaeguSubdistrict);
daegu.addEventListener("mouseenter", handleDaeguMouseEnter);
daegu.addEventListener("mouseleave", handleDaeguMouseLeave);
daeguUndoButton.addEventListener("click", displayDaeguSubdistrict);


incheon.addEventListener("click", displayIncheonSubdistrict);
incheon.addEventListener("mouseenter", handleIncheonMouseEnter);
incheon.addEventListener("mouseleave", handleIncheonMouseLeave);
incheonUndoButton.addEventListener("click", displayIncheonSubdistrict);


daejeon.addEventListener("click", displayDaejeonSubdistrict);
daejeon.addEventListener("mouseenter", handleDaejeonMouseEnter);
daejeon.addEventListener("mouseleave", handleDaejeonMouseLeave);
daejeonUndoButton.addEventListener("click", displayDaejeonSubdistrict);


gwangjumet.addEventListener("click", displayGwangjuSubdistrict);
gwangjumet.addEventListener("mouseenter", handleGwangjuMouseEnter);
gwangjumet.addEventListener("mouseleave", handleGwangjuMouseLeave);
gwangjuUndoButton.addEventListener("click", displayGwangjuSubdistrict);

ulsan.addEventListener("click", displayUlsanSubdistrict);
ulsan.addEventListener("mouseenter", handleUlsanMouseEnter);
ulsan.addEventListener("mouseleave", handleUlsanMouseLeave);
ulsanUndoButton.addEventListener("click", displayUlsanSubdistrict);


sejong.addEventListener("click", displaySejongSubdistrict);
sejong.addEventListener("mouseenter", handleSejongMouseEnter);
sejong.addEventListener("mouseleave", handleSejongMouseLeave);
// sejongUndoButton.addEventListener("click", displaySejongSubdistrict);


gyeonggi.addEventListener("click", displayGyeonggiSubdistrict);
gyeonggi.addEventListener("mouseenter", handleGyeonggiMouseEnter);
gyeonggi.addEventListener("mouseleave", handleGyeonggiMouseLeave);
gyeonggiUndoButton.addEventListener("click", displayGyeonggiSubdistrict);


gangwon.addEventListener("click", displayGangwonSubdistrict);
gangwon.addEventListener("mouseenter", handleGangwonMouseEnter);
gangwon.addEventListener("mouseleave", handleGangwonMouseLeave);
gangwonUndoButton.addEventListener("click", displayGangwonSubdistrict);


chungbuk.addEventListener("click", displayChungbukSubdistrict);
chungbuk.addEventListener("mouseenter", handleChungbukMouseEnter);
chungbuk.addEventListener("mouseleave", handleChungbukMouseLeave);
chungbukUndoButton.addEventListener("click", displayChungbukSubdistrict);


chungnam.addEventListener("click", displayChungnamSubdistrict);
chungnam.addEventListener("mouseenter", handleChungnamMouseEnter);
chungnam.addEventListener("mouseleave", handleChungnamMouseLeave);
chungnamUndoButton.addEventListener("click", displayChungnamSubdistrict);

jeonbuk.addEventListener("click", displayJeonbukSubdistrict);
jeonbuk.addEventListener("mouseenter", handleJeonbukMouseEnter);
jeonbuk.addEventListener("mouseleave", handleJeonbukMouseLeave);
jeonbukUndoButton.addEventListener("click", displayJeonbukSubdistrict);


jeonnam.addEventListener("click", displayJeonnamSubdistrict);
jeonnam.addEventListener("mouseenter", handleJeonnamMouseEnter);
jeonnam.addEventListener("mouseleave", handleJeonnamMouseLeave);
jeonnamUndoButton.addEventListener("click", displayJeonnamSubdistrict);


gyeongbuk.addEventListener("click", displayGyeongbukSubdistrict);
gyeongbuk.addEventListener("mouseenter", handleGyeongbukMouseEnter);
gyeongbuk.addEventListener("mouseleave", handleGyeongbukMouseLeave);
gyeongbukUndoButton.addEventListener("click", displayGyeongbukSubdistrict);


gyeongnam.addEventListener("click", displayGyeongnamSubdistrict);
gyeongnam.addEventListener("mouseenter", handleGyeongnamMouseEnter);
gyeongnam.addEventListener("mouseleave", handleGyeongnamMouseLeave);
gyeongnamUndoButton.addEventListener("click", displayGyeongnamSubdistrict);


jeju.addEventListener("click", displayJejuSubdistrict);
jeju.addEventListener("mouseenter", handleJejuMouseEnter);
jeju.addEventListener("mouseleave", handleJejuMouseLeave);
jejuUndoButton.addEventListener("click", displayJejuSubdistrict);