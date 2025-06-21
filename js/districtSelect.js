const submitButton = document.getElementById("submitButton");
let selectedDistrictId = [];

function districtSelect(districtId) {
  if(!selectedDistrictId.includes(districtId))
    selectedDistrictId.push(districtId);
  else {
    let index = selectedDistrictId.indexOf(districtId);
    if(index !== -1)
      selectedDistrictId.splice(index, 1);
  }
  console.log(selectedDistrictId);
}

function submitDistrict() {
  selectedDistrictId.sort();
  alert('아래 지역구를 선택하셨습니다.');
}

submitButton.addEventListener("click", submitDistrict);