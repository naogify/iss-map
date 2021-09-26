const map = new geolonia.Map('#map');
let marker;
let timeObj;

// ISS の画像をアニメーション
function moveISS(marker) {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(response => response.json())
    .then(data => {
      const cordinates = [data.longitude,data.latitude];
      marker.setLngLat(cordinates).addTo(map);
      map.flyTo({center: cordinates});
      console.log(cordinates)
      timeObj = timespace.getFuzzyLocalTimeFromPoint(Date.now(), cordinates);
    });
  setTimeout(function(){moveISS(marker)}, 5000);
}

// 地図を表示
map.on('load', () => {
  const container = document.querySelector('#iss');
  container.style.display = 'block';
  marker = new window.geolonia.Marker({
    element: container,
    offset: [-3,-28],
  })
  moveISS(marker);

  map.setStyle('mapbox://styles/mapbox/' + layerId);
});


function updateTime(selector, date) {
  const elm = document.querySelector(selector);
  elm.innerHTML = date
}

// タイムゾーンのリスト
const timeZoneList = {
}

// 時間を更新
const updateTimeCycle = () => {
  const UTC = new Date(Date.now() + (new Date().getTimezoneOffset() * 60 * 1000));
  const year = UTC.getFullYear();
  const month = `${UTC.getMonth() + 1}`.padStart(2, "0");
  const date = UTC.getDate();
  const hour = UTC.getHours()
  const min = UTC.getMinutes();
  const second = UTC.getSeconds();

  updateTime('.utc span', `${year}/${month}/${date} ${hour}:${min}:${second} GMT`);
  
  updateTime('.jst span',`${year}/${month}/${date} ${hour+9}:${min}:${second} GMT+0900`);

  let localTime = '';
  if (timeObj) {
    const currentTimeZone = timeObj._z.name
    const timeZoneOffset = timeZoneList[currentTimeZone];
    const timeZoneOffsetText = `${timeZoneOffset}`.padStart(2, "0");
    localTime = `${year}/${month}/${date} ${hour+timeZoneOffset}:${min}:${second} GMT${timeZoneOffsetText}00`;
  } else {
    localTime = 'Can not get local time because ISS fly over the sea.'
  }
  updateTime('.local span', localTime);

}
setInterval(updateTimeCycle, 1000);