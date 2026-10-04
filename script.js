// --- rida-denah-script.js ---

// Data area dan opsi-opsinya
const HOTSPOTS_DATA = {
    'kandang-kiri': {
        charTop: '41%', charLeft: '28%', // Posisi tujuan karakter
        title: 'Kandang Kambing (Kiri)',
        options: [
            { label: '🔍 Lihat Detail Kandang', action: 'alert("Membuka Detail Kandang Kiri...")' },
            { label: '🐐 Cek Kondisi Ternak', action: 'alert("Kondisi Ternak: Sehat")' }
        ]
    },
    'kandang-kanan': {
        charTop: '41%', charLeft: '73%',
        title: 'Kandang Kambing (Kanan)',
        options: [
            { label: '🔍 Lihat Detail Kandang', action: 'alert("Membuka Detail Kandang Kanan...")' },
            { label: '🌾 Jadwal Makan', action: 'alert("Jadwal Makan: Pagi & Sore")' }
        ]
    },
    'papan-pengumuman': {
        charTop: '61%', charLeft: '50%',
        title: 'Papan Pengumuman',
        options: [
            { label: '📰 Baca Pengumuman', action: 'alert("Membaca pengumuman terbaru...")' },
            { label: '📅 Event Mendatang', action: 'alert("Event Mendatang: Festival Panen (Desember)")' }
        ]
    },
    'bale-bengong': {
        charTop: '78%', charLeft: '19%',
        title: 'Bale Bengong',
        options: [
            { label: '☕ Istirahat & Bersantai', action: 'alert("Duduk santai sambil minum kopi...")' },
            { label: 'ℹ️ Pusat Informasi', action: 'alert("Menampilkan Profil Ridafarm...")' }
        ]
    },
    'picnic-ground': {
        charTop: '23%', charLeft: '50%',
        title: 'Picnic Ground',
        options: [
            { label: '⛺ Booking Area', action: 'alert("Membuka form reservasi tempat...")' },
            { label: '📸 Lihat Galeri', action: 'alert("Membuka galeri foto piknik...")' }
        ]
    },
    'sungai': {
        charTop: '11%', charLeft: '50%',
        title: 'Area Sungai',
        options: [
            { label: '🎣 Aktivitas Air', action: 'alert("Melihat aktivitas memancing dan susur sungai...")' },
            { label: '💧 Cek Kualitas Air', action: 'alert("Kualitas Air: Jernih & Aman")' }
        ]
    }
};

const character = document.getElementById('rida-denah-character');
const popup = document.getElementById('rida-denah-action-popup');
const popupHeader = document.getElementById('rida-denah-popup-header');
const popupBody = document.getElementById('rida-denah-popup-body');
const hotspots = document.querySelectorAll('.rida-denah-hotspot');

let currentTimeout = null;

function moveCharacter(id) {
    const targetData = HOTSPOTS_DATA[id];
    if (!targetData) return;

    // Reset state & sembunyikan popup lama
    character.classList.remove('rida-denah-arrived');
    popup.classList.remove('rida-denah-show');
    clearTimeout(currentTimeout);

    // Mulai animasi berjalan
    character.classList.add('rida-denah-moving');
    
    // Perbarui posisi agar CSS transition men-trigger pergerakan
    character.style.top = targetData.charTop;
    character.style.left = targetData.charLeft;

    // Tunggu sampai transisi (pergerakan) selesai
    const onTransitionEnd = (e) => {
        // Kita pantau 'top' atau 'left'
        if (e.propertyName === 'top' || e.propertyName === 'left') {
            character.removeEventListener('transitionend', onTransitionEnd);
            handleArrival(targetData.charTop, targetData.charLeft, targetData);
        }
    };
    
    character.addEventListener('transitionend', onTransitionEnd);
    
    // Fallback jika tab browser tidak aktif dan transitionend telat
    currentTimeout = setTimeout(() => {
         character.removeEventListener('transitionend', onTransitionEnd);
         handleArrival(targetData.charTop, targetData.charLeft, targetData);
    }, 1100); 
}

function handleArrival(top, left, data) {
    character.classList.remove('rida-denah-moving');
    character.classList.add('rida-denah-arrived');
    
    // Render isi konten Popup Opsi
    popupHeader.innerText = data.title;
    popupBody.innerHTML = ''; // Kosongkan opsi lama
    
    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'rida-denah-popup-btn';
        btn.innerText = opt.label;
        btn.setAttribute('onclick', opt.action);
        popupBody.appendChild(btn);
    });

    // Posisikan popup di atas karakter
    let topVal = parseFloat(top);
    // Beri offset negatif sedikit ke atas kepala agar tidak menutupi karakter
    popup.style.top = (topVal - 6) + '%'; 
    popup.style.left = left;
    
    // Tampilkan popup
    popup.classList.add('rida-denah-show');
}

// Tambahkan event ke setiap elemen hotspot
hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', function(e) {
        // Hentikan event bubbling agar tidak menutup popup (ter-trigger dari wrapper)
        e.stopPropagation();
        
        // Atur state aktif
        hotspots.forEach(h => h.classList.remove('rida-denah-active'));
        this.classList.add('rida-denah-active');
        
        const id = this.getAttribute('data-id');
        moveCharacter(id);
    });
});

// Fitur tambahan: Klik di luar hotspot / karakter untuk menutup popup
document.getElementById('rida-denah-wrapper').addEventListener('click', function(e) {
    // Jika user mengklik elemen yang bukan hotspot dan bukan popup itu sendiri
    if (!e.target.closest('.rida-denah-hotspot') && !e.target.closest('#rida-denah-action-popup')) {
        popup.classList.remove('rida-denah-show');
        hotspots.forEach(h => h.classList.remove('rida-denah-active'));
    }
});
