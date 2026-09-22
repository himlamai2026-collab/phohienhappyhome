// phohienhappyhome.com — form đăng ký sớm + xem ảnh lớn.
// Form gửi về cùng Apps Script của ongchunoxh.com (tools/apps-script-nhan-lead.js): ghi Sheet + bắn Telegram.
(function () {
  var NOI_NHAN = 'https://script.google.com/macros/s/AKfycbwZN0KZv3CF1UcVUZpRk7nMPQrg6i9wns3EicIWlKLgX0s0lFxBUwI15aRygP-tziHKgQ/exec';
  var ZALO = '0879 388 988';

  // ── Chọn nhu cầu ──
  var nhuCau = 'Tìm hiểu dự án';
  var chon = document.querySelectorAll('.chon button');
  chon.forEach(function (b) {
    b.addEventListener('click', function () {
      chon.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      nhuCau = b.getAttribute('data-v');
    });
  });

  // ── Gửi form ──
  var form = document.getElementById('form-dk');
  var loi = document.getElementById('loi');
  var nut = document.getElementById('nut-gui');
  var thamSo = new URLSearchParams(location.search);
  var kenh = (thamSo.get('n') || '').replace(/[^\w-]/g, '').slice(0, 40);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    loi.textContent = '';
    var ten = form.ten.value.trim().replace(/\s+/g, ' ');
    var sdt = form.sdt.value.replace(/[\s.\-()]/g, '').replace(/^\+?84/, '0');
    if (ten.length < 2) { loi.textContent = 'Nhà mình điền giúp họ tên nhé.'; form.ten.focus(); return; }
    if (!/^0\d{9}$/.test(sdt)) { loi.textContent = 'Số điện thoại chưa đúng, nhà mình kiểm tra lại giúp (10 số, bắt đầu bằng 0).'; form.sdt.focus(); return; }

    var xong = function () {
      form.innerHTML = '<div class="xong"><p class="to">✅ Đã nhận thông tin của nhà mình</p>' +
        '<p>Mình sẽ liên hệ lại sớm nhất. Cần gấp thì nhắn Zalo <a href="https://zalo.me/0879388988" target="_blank" rel="noopener">' + ZALO + '</a>.</p></div>';
    };
    if (form.web.value) { xong(); return; } // bẫy máy spam

    var ghi = form.ghi.value.trim().slice(0, 500);
    var goi = {
      ten: ten.slice(0, 80),
      sdt: sdt,
      duAn: 'pho-hien',
      nhanVien: 'nam',
      nguon: 'phohienhappyhome.com' + (kenh ? ' · ' + kenh : ''),
      ketQua: '',
      phanLoai: nhuCau,
      tomTat: 'Nhu cầu: ' + nhuCau + (ghi ? '\nGhi thêm: ' + ghi : '') + '\nTrang: phohienhappyhome.com' + location.search,
      traLoi: '',
      thoiDiem: new Date().toISOString()
    };

    nut.disabled = true;
    nut.textContent = 'Đang gửi…';
    fetch(NOI_NHAN, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(goi)
    }).then(xong).catch(function () {
      nut.disabled = false;
      nut.textContent = 'Gửi thông tin';
      loi.textContent = 'Chưa gửi được. Kiểm tra mạng rồi thử lại, hoặc nhắn Zalo ' + ZALO + '.';
    });
  });

  // ── Xem ảnh lớn ──
  var hop = document.getElementById('xem-anh');
  if (hop && typeof hop.showModal === 'function') {
    var anh = hop.querySelector('img');
    document.querySelectorAll('a.mo-lon').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        anh.src = a.getAttribute('href');
        anh.alt = (a.querySelector('img') || {}).alt || '';
        hop.showModal();
      });
    });
    hop.addEventListener('click', function () { hop.close(); });
  }
})();
