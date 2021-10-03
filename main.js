const map = new geolonia.Map('#map');
let marker;
let timeObj;
let currentCoordinates;
let lastHour = '';

// ISS の画像をアニメーション
function moveISS(marker) {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(response => response.json())
    .then(data => {
      const coordinates = [data.longitude,data.latitude];
      marker.setLngLat(coordinates).addTo(map);
      map.flyTo({center: coordinates});
      currentCoordinates = coordinates
      timeObj = timespace.getFuzzyLocalTimeFromPoint(Date.now(), coordinates);
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
'Asia/Taipei': +8,
'Indian/Christmas': +7,
'America/Merida': -6,
'America/Tegucigalpa': -6,
'America/El_Salvador': -6,
'America/Managua': -6,
'America/Managua': -6,
'America/Costa_Rica': -6,
'America/Panama': -5,
'America/Guayaquil': -5,
'America/Lima': -5,
'America/Eirunepe': -5,
'America/Rio_Branco': -5,
'America/La_Paz': -4,
'America/Asuncion': -4,
'America/Argentina/Cordoba': -3,
'America/Sao_Paulo': -3,
'America/Cancun': -5,
'America/Porto_Velho': -4,
'Indian/Mauritius': +4,
'Indian/Maldives': +5,
'Asia/Urumqi': +6,
'Asia/Chongqing': +8
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
  
  // 陸上の UTC との時差を取得
  let timeZoneOffset = '';
  if (timeObj) {
    const currentTimeZone = timeObj._z.name
    console.log(currentTimeZone)
    timeZoneOffset = timeZoneList[currentTimeZone];
    console.log(timeZoneOffset)
  }
  
  // 海上の UTC との時差を取得
  if (!timeObj && currentCoordinates) {
    const lng = currentCoordinates[0];
    timeZoneOffset = parseInt( 12 * lng / 180)
    console.log(timeZoneOffset)
  }

  function getLocalDateHour(timeZoneOffset, date, hour) {

    let localDate = date;
    let localHour = hour+timeZoneOffset;

    if (0 > hour+timeZoneOffset) {
      localDate = date -1
      localHour = 24 + (hour + timeZoneOffset)
    }

    if (24 <= hour+timeZoneOffset) {
      localDate = date + 1
      localHour = (hour + timeZoneOffset ) -24
    }

    return {localDate, localHour}

  }

  // 現地の日付と時間を取得
  const {localDate,localHour} = getLocalDateHour(timeZoneOffset, date, hour);

  // UTC との時差をテキストとして取得
  let timeZoneOffsetText = '';
  if (0 > timeZoneOffset) {
    timeZoneOffsetText = `${timeZoneOffset}`.slice(1).padStart(2, "0");
    timeZoneOffsetText = `-${timeZoneOffsetText}`
  } else {
    timeZoneOffsetText = `${timeZoneOffset}`.padStart(2, "0");
    timeZoneOffsetText = `+${timeZoneOffsetText}`
  }
  timeZoneOffsetText = `${timeZoneOffsetText}00`

  // 現地時間を取得
  const localTime = `${year}/${month}/${localDate} ${localHour}:${min}:${second} GMT${timeZoneOffsetText}`;
  updateTime('.local span', localTime);

    // 現地時間によって地図のデザインを切り替える
  if (localHour >= 6 && localHour < 18) {
    if (lastHour !== 'day') {
      // map.setStyle('https://raw.githubusercontent.com/geolonia/basic/master/style.json');
      lastHour = 'day'
    }
  } else if (localHour >= 18 || localHour < 6 ) {    if (lastHour !== 'night') {
      // map.setStyle('https://gist.githubusercontent.com/naogify/f8cfdf959f3a0208ac466a84c1972ce3/raw/b38b66d08217159d44a9105e8be3644a6067214a/late-night.json');
      lastHour = 'night'
    }
  }

}
setInterval(updateTimeCycle, 1000);