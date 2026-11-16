// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm  đổi giờ UTC 
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
// Lấy các phần tử trên trang 
const searchForm = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');
const statusEl = document.querySelector('#status');
const eventList = document.querySelector('#event-list');
// Câu 2a: tạo chuỗi hiển thị số chỗ
const formatSeats = (event) => {
  const left = event.capacity - event.registeredCount;
  return left > 0 ? `Còn ${left}/${event.capacity} chỗ` : 'Hết chỗ';
};
//tạo 1 thẻ card từ 1 sự kiện
const createEventCard = (event) => {
  // tạo card
  const card = document.createElement('article');
  card.className = 'card';
// ảnh  
  const img = document.createElement('img');
  img.setAttribute('src', 'img/event.svg');
  img.setAttribute('alt', `Hình minh hoạ sự kiện ${event.name}`);
//sự kiện là liên kết
  const title = document.createElement('h2');
  title.className = 'card-title';
  const link = document.createElement('a');
  link.setAttribute('href', `event-detail.html?id=${encodeURIComponent(event.id)}`);
  link.textContent = event.name;
  title.append(link);
// thời gian
  const timeP = document.createElement('p');
  timeP.className = 'card-time';
  const time = document.createElement('time');
  time.setAttribute('datetime', event.startTime);
  time.textContent = formatDateTime(event.startTime);
  timeP.append(time);

  const location = document.createElement('p');
  location.className = 'card-location';
  //địa chỉ
  location.textContent = event.location;

  const seats = document.createElement('p');
  seats.className = 'card-seats';
  const seatInfo = formatSeats(event);
  if (seatInfo === 'Hết chỗ') {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = seatInfo;   // "Hết chỗ"
    seats.append(badge);
  } else {
    seats.textContent = seatInfo;   // "Còn 12/40 chỗ"
  }
//trả về
  card.append(img, title, timeP, location, seats);
  return card;
};
//hiện tất cả lên trang
const renderEvents = (events) => {
  const cards = events.map(createEventCard);
  eventList.replaceChildren(...cards);
};
// thông báo đang tải 
const loadEvents = async (keyword = '') => {
  statusEl.textContent = 'Đang tải…';
//chuỗi truy vấn
  const params = new URLSearchParams({ pageSize: '50' });
  const q = keyword.trim();
  if (q !== '') params.set('q', q);
//Gọi API
  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) {
      throw new Error(`Máy chủ trả về lỗi ${response.status}`);
    }
    const data = await response.json();
//hiển thị kết quả
    renderEvents(data.items);
    statusEl.textContent = data.items.length === 0
      ? 'Không có sự kiện nào khớp từ khoá.'
      : `Tìm thấy ${data.totalCount} sự kiện`;
  }
  //Xử lý lỗi trong catch 
  catch (error) {
    console.error(error);
    renderEvents([]);
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};
// Tìm kiếm 
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value.trim());
});

loadEvents('');