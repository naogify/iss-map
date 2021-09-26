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
});


function updateTime(selector, date) {
  const elm = document.querySelector(selector);
  elm.innerHTML = date
}

// タイムゾーンのリスト
const timeZoneList = {
'Africa/Johannesburg': +2,
'Africa/Lagos': +1,
'Africa/Windhoek': +1,
'America/Adak': -10,
'America/Anchorage': -9,
'America/Argentina/Buenos_Aires': -3,
'America/Bogota': -5,
'America/Caracas': -4.5,
'America/Chicago': -6,
'America/Denver': -7,
'America/Godthab': -3,
'America/Guatemala': -6,
'America/Halifax': -4,
'America/Los_Angeles': -8,
'America/Montevideo': -3,
'America/New_York': -5,
'America/Noronha': -2,
'America/Phoenix': -7,
'America/Santiago': -4,
'America/Santo_Domingo': -4,
'America/St_Johns': -3.5,
'Asia/Baghdad': +3,
'Asia/Baku': +4,
'Asia/Beirut': +2,
'Asia/Dhaka': +6,
'Asia/Dubai': +4,
'Asia/Irkutsk': +9,
'Asia/Jakarta': +7,
'Asia/Kabul': +4.5,
'Asia/Kamchatka': +12,
'Asia/Karachi': +5,
'Asia/Kathmandu': +5.75,
'Asia/Kolkata': +5.5,
'Asia/Krasnoyarsk': +8,
'Asia/Omsk': +7,
'Asia/Rangoon': +6.5,
'Asia/Shanghai': +8,
'Asia/Tehran': +3.5,
'Asia/Tokyo': +9,
'Asia/Vladivostok': +11,
'Asia/Yakutsk': +10,
'Asia/Yekaterinburg': +6,
'Atlantic/Azores': -1,
'Atlantic/Cape_Verde': -1,
'Australia/Adelaide': +9.5,
'Australia/Brisbane': +10,
'Australia/Darwin': +9.5,
'Australia/Eucla': +8.75,
'Australia/Lord_Howe': +10.5,
'Australia/Sydney': +10,
'Etc/GMT+12': -12,
'Europe/Berlin': +1,
'Europe/London': +0,
'Europe/Moscow': +4,
'Pacific/Apia': +13,
'Pacific/Auckland': +12,
'Pacific/Chatham': +12.75,
'Pacific/Easter': -6,
'Pacific/Gambier': -9,
'Pacific/Honolulu': -10,
'Pacific/Kiritimati': +14,
'Pacific/Majuro': +12,
'Pacific/Marquesas': -9.5,
'Pacific/Norfolk': +11.5,
'Pacific/Noumea': +11,
'Pacific/Pago_Pago': -11,
'Pacific/Pitcairn': -8,
'Pacific/Tongatapu':　+13,
'UTC': +0,
'Asia/Taipei': +8
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
    console.log(currentTimeZone)
    const timeZoneOffset = timeZoneList[currentTimeZone];
    const timeZoneOffsetText = `${timeZoneOffset}`.padStart(2, "0");
    localTime = `${year}/${month}/${date} ${hour+timeZoneOffset}:${min}:${second} GMT${timeZoneOffsetText}00`;
  } else {
    localTime = 'Can not get local time because ISS fly over the sea.'
  }
  updateTime('.local span', localTime);

}
setInterval(updateTimeCycle, 1000);
