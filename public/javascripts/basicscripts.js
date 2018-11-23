function hideShow(ev) {
  let x = ev.target.nextSibling;
  if(x.style.display == 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}

function determinUsrLocation() {
  let x = document.getElementById("demo");
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browswer");
    }
  }
  function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude;
  }
  getLocation();
}

determinUsrLocation();
