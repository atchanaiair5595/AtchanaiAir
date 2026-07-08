// ========================================================
// 🐳 ไฟล์สคริปต์หลัก (script.js) - ร้านอัชนัยแอร์ โคราช
// รวดเร็ว ซื่อสัตย์ คุ้มค่า ได้มาตรฐาน | เรื่องแอร์...เรียกอัชนัยแอร์
// ========================================================

document.addEventListener("DOMContentLoaded", function() {
    // 1. 🌟 ระบบ Auto-Loader: ดึงหน้าข่าวสารและรีวิวมาต่อกันแบบ One-Page Scroll เพื่อพลัง SEO
    
    // โหลดหน้า ข่าวสาร (at_news.html)
    fetch('at_news.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            const seoZone = document.getElementById('seo-content-zone');
            if(seoZone) {
                seoZone.innerHTML = data;
                // เมื่อโหลด HTML เสร็จ ค่อยรันระบบแบ่งหน้าและปุ่มแชร์
                initPaginationAndSharing();
            }
        })
        .catch(err => console.log('🐳 ปลาวาฬหาไฟล์ข่าวไม่เจอค่ะ:', err));

    // โหลดหน้า รีวิว (at_review.html)
    fetch('at_review.html')
        .then(response => {
            if (response.ok) return response.text();
        })
        .then(data => {
            const reviewZone = document.getElementById('review-content-zone');
            if(reviewZone && data) reviewZone.innerHTML = data;
        })
        .catch(err => console.log('🐳 ปลาวาฬหาไฟล์รีวิวไม่เจอค่ะ:', err));

    // 2. 🌟 ระบบตั้งควันที่และเลขที่ใบเสนอราคาอัตโนมัติ
    const docDateEl = document.getElementById('docDate');
    if(docDateEl) {
        const today = new Date();
        docDateEl.innerText = today.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    const docNumEl = document.getElementById('docNumber');
    if(docNumEl) {
        const year = new Date().getFullYear().toString().substr(-2);
        const month = (new Date().getMonth()+1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        docNumEl.innerText = `QT${year}${month}${random}`;
    }
});


// ========================================================
// 📋 ระบบคำนวณใบเสนอราคาอัตโนมัติ (Auto-Quoter)
// ========================================================
let customItems = [];

// ฟังก์ชันเพิ่มรายการพิเศษ (เช่น ซ่อมรั่ว, เติมน้ำยา)
window.addCustomItem = function() {
    const name = document.getElementById('customName').value;
    const price = parseFloat(document.getElementById('customPrice').value);
    const qty = parseInt(document.getElementById('customQty').value);
    
    if(name && price > 0 && qty > 0) {
        customItems.push({ name, price, qty });
        document.getElementById('customName').value = '';
        document.getElementById('customPrice').value = '';
        document.getElementById('customQty').value = '1';
        calculateTotal();
    } else {
        alert('พี่คิมกรอกข้อมูลรายการเพิ่มเติมให้ครบก่อนนะคะ 🐳');
    }
};

// ฟังก์ชันลบรายการพิเศษ
window.removeCustomItem = function(index) {
    customItems.splice(index, 1);
    calculateTotal();
};

// ฟังก์ชันคำนวณเงินรวมทั้งหมด
window.calculateTotal = function() {
    // อัปเดตข้อมูลลูกค้าลงในใบพิมพ์
    const cName = document.getElementById('clientName')?.value || '-';
    const cPhone = document.getElementById('clientPhone')?.value || '-';
    if(document.getElementById('previewClientName')) document.getElementById('previewClientName').innerText = cName;
    if(document.getElementById('previewClientPhone')) document.getElementById('previewClientPhone').innerText = cPhone;

    // ดึงจำนวนแอร์แต่ละประเภท
    const qtyWall = parseInt(document.getElementById('qtyWall')?.value || 0);
    const qtyCeiling = parseInt(document.getElementById('qtyCeiling')?.value || 0);
    const qtyCassette = parseInt(document.getElementById('qtyCassette')?.value || 0);
    
    // เช็คว่าคิด VAT ไหม
    const isVat = document.querySelector('input[name="vatToggle"]:checked')?.value === 'yes';

    let tbody = '';
    let subtotal = 0;

    // ฟังก์ชันช่วยสร้างแถวตาราง
    function addRow(name, price, qty) {
        if(qty > 0) {
            const total = price * qty;
            subtotal += total;
            tbody += `
                <tr class="border-b border-slate-200">
                    <td class="p-3.5 text-slate-800">${name}</td>
                    <td class="p-3.5 text-right text-slate-600">${price.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="p-3.5 text-center text-slate-800">${qty}</td>
                    <td class="p-3.5 text-right font-bold text-slate-900">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                </tr>
            `;
        }
    }

    addRow('บริการล้างแอร์ติดผนัง (Wall Type)', 500, qtyWall);
    addRow('บริการล้างแอร์แขวนใต้ฝ้า (Ceiling Type)', 800, qtyCeiling);
    addRow('บริการล้างแอร์ฝังฝ้า (Cassette Type)', 1500, qtyCassette);

    // วนลูปเพิ่มรายการที่พี่คิมพิมพ์เอง
    customItems.forEach((item, index) => {
        const total = item.price * item.qty;
        subtotal += total;
        tbody += `
            <tr class="border-b border-slate-200 bg-amber-50/30">
                <td class="p-3.5 text-slate-800 flex justify-between items-center">
                    ${item.name} 
                    <button onclick="removeCustomItem(${index})" class="text-red-500 hover:text-red-700 text-[10px] no-print px-2 py-1 bg-red-50 rounded border border-red-200">ลบ</button>
                </td>
                <td class="p-3.5 text-right text-slate-600">${item.price.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                <td class="p-3.5 text-center text-slate-800">${item.qty}</td>
                <td class="p-3.5 text-right font-bold text-slate-900">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
        `;
    });

    if(document.getElementById('invoiceItemsTable')) document.getElementById('invoiceItemsTable').innerHTML = tbody;

    // คำนวณยอดสุทธิและภาษี
    let vat = isVat ? subtotal * 0.07 : 0;
    let grandTotal = subtotal + vat;

    if(document.getElementById('valSubtotal')) document.getElementById('valSubtotal').innerText = subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
    if(document.getElementById('valVat')) document.getElementById('valVat').innerText = vat.toLocaleString('th-TH', {minimumFractionDigits: 2});
    if(document.getElementById('valTotal')) document.getElementById('valTotal').innerText = grandTotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
};

// ========================================================
// 💬 ฟังก์ชันทั่วไปของหน้าเว็บ
// ========================================================

// ปิดปุ่มโปรโมชั่นเด้งดึ๋ง
window.closePromo = function() {
    const promo = document.getElementById('floating-promo');
    if(promo) promo.style.display = 'none';
};


// ========================================================
// 🔢 ระบบแบ่งหน้า + เสกปุ่มแชร์อัตโนมัติ สำหรับหน้าข่าวสาร
// ========================================================
const ITEMS_PER_PAGE = 4; // กำหนดให้แสดงหน้าละ 4 บทความเพื่อความเร็วสูงสุด
let currentPage = 1;

function initPaginationAndSharing() {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return; 

    const allArticles = Array.from(newsContainer.querySelectorAll('.news-item'));
    
    allArticles.forEach((article) => {
        const pageUrl = window.location.href; 
        
        // แอบฝังปุ่มแชร์โซเชียลอัตโนมัติให้ทุกข่าว
        if (!article.querySelector('.social-share-box') && !article.classList.contains('full-post')) {
            const shareBox = document.createElement('div');
            shareBox.className = 'social-share-box no-print mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-sm text-slate-500';
            shareBox.innerHTML = `
                <span class="font-medium mr-1">แชร์ความรู้นี้:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" class="share-btn fb bg-[#1877f2] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition">Facebook</a>
                <a href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}" target="_blank" class="share-btn line bg-[#06c755] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition">LINE</a>
                <button onclick="navigator.clipboard.writeText('${pageUrl}'); alert('คัดลอกลิงก์บทความเรียบร้อยแล้วค่ะพี่คิม!');" class="share-btn copy bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:bg-slate-300 transition">คัดลอกลิงก์</button>
            `;
            article.appendChild(shareBox);
        }

        // เสกให้รูปภาพโหลดแบบประหยัดเน็ต (Lazy Load)
        const articleImg = article.querySelector('img');
        if (articleImg) {
            articleImg.setAttribute('loading', 'lazy');
        }
    });

    const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);

    function displayPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        allArticles.forEach((article, index) => {
            if (index >= startIndex && index < endIndex) {
                article.style.display = 'block'; 
            } else {
                article.style.display = 'none'; 
            }
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const paginationZone = document.querySelector('.pagination-zone');
        if (!paginationZone) return;

        let controlsHTML = '';
        controlsHTML += `<button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="changeNewsPage(${currentPage - 1})">&lt;&lt; ก่อนหน้า</button>`;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                controlsHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changeNewsPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                controlsHTML += `<span class="page-dots">...</span>`;
            }
        }

        controlsHTML += `<button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeNewsPage(${currentPage + 1})">ถัดไป &gt;&gt;</button>`;
        paginationZone.innerHTML = controlsHTML;
    }

    // เมื่อกดปุ่มเปลี่ยนหน้า
    window.changeNewsPage = function(page) {
        if (page < 1 || page > totalPages) return;
        displayPage(page);
        // เลื่อนจอขึ้นไปตรงหัวข้อข่าวพอดีอย่างนุ่มนวล
        const headerZone = document.querySelector('.news-header-zone');
        if (headerZone) headerZone.scrollIntoView({ behavior: 'smooth' });
    };

    if (allArticles.length > 0) {
        displayPage(1);
    }
}
