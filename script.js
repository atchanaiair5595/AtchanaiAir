/* =========================================
   ไฟล์สคริปต์ควบคุมระบบ (JavaScript) - อัชนัยแอร์ 
   ========================================= */

// อาร์เรย์เก็บลิงก์รูปภาพทั้งหมดของหน้าผลงาน (Portfolio)
const portfolioImages = [
    "https://i.ibb.co/9Hkp38j0/20210228-102049.jpg", 
    "https://i.ibb.co/JFCstnDp/Untitled-1.jpg",      
    "https://i.ibb.co/Y7vhd4pK/20241201-101714.jpg", 
    "https://i.ibb.co/pc7whqv/20241201-101701.jpg",  
    "https://i.ibb.co/qYByfNJh/20241201-095426.jpg", 
    "https://i.ibb.co/rRMy6w6b/20241201-091229.jpg", 
    "https://i.ibb.co/7dswMpkV/20210228-130903.jpg", 
    "https://i.ibb.co/KpGDGksF/20210228-130522.jpg", 
    "https://i.ibb.co/wNkWdZ8P/20210228-130501.jpg", 
    "https://i.ibb.co/5gDqw9ML/20210228-130453.jpg", 
    "https://i.ibb.co/j9D6L7rH/20210228-104411.jpg", 
    "https://i.ibb.co/MxNhf0hv/20210228-103241.jpg", 
    "https://i.ibb.co/7tPpBx85/20210228-103059.jpg", 
    "https://i.ibb.co/N2P1XT0K/20210228-101954.jpg"  
];

let currentImageIndex = 0;

// ฟังก์ชันเปิดหน้าต่าง Pop-up สปริงตัวเร็วแสง ⚡
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    
    const lightbox = document.getElementById('customLightbox');
    if (lightbox) {
        lightbox.classList.remove('hidden');
        // สั่ง Fade-in นุ่มนวลภายใน 10ms
        setTimeout(() => { 
            lightbox.classList.remove('opacity-0'); 
        }, 10);
    }
    
    // ล็อคการเลื่อนหน้าจอเว็บหลัก
    document.body.style.overflow = 'hidden';
}

// ฟังก์ชันปิดหน้าต่าง Pop-up
function closeLightbox() {
    const lightbox = document.getElementById('customLightbox');
    if (lightbox) {
        lightbox.classList.add('opacity-0');
        // รอจังหวะ Effect 200ms แล้วค่อยซ่อนกล่อง
        setTimeout(() => { 
            lightbox.classList.add('hidden'); 
        }, 200);
    }
    
    // ปลดล็อคหน้าเว็บหลัก
    document.body.style.overflow = '';
}

// เลื่อนไปรูปถัดไป (ขวา)
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
    updateLightboxContent();
}

// ย้อนไปรูปก่อนหน้า (ซ้าย)
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
    updateLightboxContent();
}

// อัปเดตรูปภาพและตัวเลขสถานะหน้า
function updateLightboxContent() {
    const imgElement = document.getElementById('lightboxImg');
    const indexElement = document.getElementById('lightboxIndex');
    
    if(imgElement && indexElement) {
        imgElement.src = portfolioImages[currentImageIndex];
        indexElement.textContent = `${currentImageIndex + 1} / ${portfolioImages.length}`;
    }
}

// รองรับการใช้งานคีย์บอร์ด (Esc = ปิด, ลูกศร = เลื่อนรูป)
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('customLightbox');
    if (lightbox && !lightbox.classList.contains('hidden')) {
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'ArrowLeft') {
            prevImage();
        }
    }
});


// ========================================================
// 📋 ระบบคำนวณและออกใบเสนอราคาอัตโนมัติ (Auto-Quoter) ของพี่คิม
// ========================================================
let customItemsList = [];

document.addEventListener('DOMContentLoaded', () => {
    // ตั้งค่าวันที่เป็นแบบ พ.ศ. ปัจจุบันอัตโนมัติ
    const docDateEl = document.getElementById('docDate');
    if (docDateEl) {
        const now = new Date();
        const dateStr = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + (now.getFullYear() + 543);
        docDateEl.innerText = dateStr;
    }
    
    // สุ่มเลขที่ใบเสนอราคาเบื้องต้นแบบพรีเมียม
    const docNumberEl = document.getElementById('docNumber');
    if (docNumberEl) {
        const now = new Date();
        const randNum = Math.floor(1000 + Math.random() * 9000);
        docNumberEl.innerText = `QT-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}-${randNum}`;
    }

    // 🌟 ดึงข้อมูลแผ่นที่ 2 (at_news.html) มาแปะต่อแบบ One-Page Scroll และดึง snippet ดันอันดับ SEO
    const seoZone = document.getElementById('seo-content-zone');
    if (seoZone) {
        fetch('at_news.html')
            .then(res => { if(res.ok) return res.text(); })
            .then(html => { 
                if(html) {
                    seoZone.innerHTML = html;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const firstTitle = doc.querySelector('h2, h3, h4')?.innerText;
                    const firstDesc = doc.querySelector('p')?.innerText;
                    
                    const snippetTitle = document.getElementById('snippet-title');
                    const snippetDesc = document.getElementById('snippet-desc');
                    
                    if(firstTitle && snippetTitle) snippetTitle.innerText = "🔥 เรื่องเด่นอัปเดตวันนี้: " + firstTitle;
                    if(firstDesc && snippetDesc) snippetDesc.innerText = firstDesc.substring(0, 180) + "...";
                }
            })
            .catch(err => {
                const snippetTitle = document.getElementById('snippet-title');
                const snippetDesc = document.getElementById('snippet-desc');
                if (snippetTitle) snippetTitle.innerText = "🔥 เคล็ดลับล้างแอร์บ้าน สยบฝุ่น PM 2.5 โดยช่างแอร์โคราชมืออาชีพ";
                if (snippetDesc) snippetDesc.innerText = "แนะนำวิธีสังเกตแอร์ตัน แอร์ไม่เย็น น้ำหยด พร้อมเร่งอัปเดตคิวว่างงานล้างแอร์ทั่วไปและงานติดตั้งระบบเครื่องปรับอากาศในเขตอำเภอเมืองนครราชสีมาอย่างรวดเร็ว โดยร้านอัชนัยแอร์ครับ";
            });
    }

    // 🌟 ดึงข้อมูลแผ่นที่ 3 (at_review.html) มาต่อท้ายล่างสุดเพื่อความสมบูรณ์แบบ
    const reviewZone = document.getElementById('review-content-zone');
    if (reviewZone) {
        fetch('at_review.html')
            .then(res => { if(res.ok) return res.text(); })
            .then(html => { if(html) reviewZone.innerHTML = html; })
            .catch(err => console.log(err));
    }

    // คำนวณยอดครั้งแรกแบบ Default
    if (document.getElementById('invoiceItemsTable')) {
        calculateTotal();
    }
});

function closePromo() {
    const promoBox = document.getElementById('floating-promo');
    if (promoBox) promoBox.style.display = 'none';
}

function addCustomItem() {
    const nameField = document.getElementById('customName');
    const priceField = document.getElementById('customPrice');
    const qtyField = document.getElementById('customQty');

    if (!nameField || !priceField || !qtyField) return;

    const name = nameField.value.trim();
    const price = parseFloat(priceField.value) || 0;
    const qty = parseInt(qtyField.value) || 1;

    if (name === '') { alert('โปรดระบุชื่อรายการบริการก่อนค่ะ'); return; }
    if (price <= 0) { alert('โปรดใส่ราคาต่อหน่วยที่มากกว่า 0 บาทค่ะ'); return; }

    customItemsList.push({ name, price, qty });
    nameField.value = ''; priceField.value = ''; qtyField.value = '1';
    calculateTotal();
}

function removeCustomItem(index) {
    customItemsList.splice(index, 1);
    calculateTotal();
}

function calculateTotal() {
    const clientNameEl = document.getElementById('clientName');
    const clientPhoneEl = document.getElementById('clientPhone');
    const previewClientNameEl = document.getElementById('previewClientName');
    const previewClientPhoneEl = document.getElementById('previewClientPhone');
    const tableBody = document.getElementById('invoiceItemsTable');

    if (!tableBody) return;

    const cName = clientNameEl ? clientNameEl.value.trim() : '';
    const cPhone = clientPhoneEl ? clientPhoneEl.value.trim() : '';
    if (previewClientNameEl) previewClientNameEl.innerText = cName || '- ไม่ได้ระบุชื่อลูกค้า -';
    if (previewClientPhoneEl) previewClientPhoneEl.innerText = cPhone || '-';

    tableBody.innerHTML = '';
    let subtotal = 0; let hasItems = false;
    
    const standardServices = [
        { id: 'qtyWall', name: 'บริการล้างแอร์มาตรฐาน (ประเภทติดผนัง - Wall Type)', price: 500 },
        { id: 'qtyCeiling', name: 'บริการล้างแอร์มาตรฐาน (ประเภทแขวนใต้ฝ้า - Ceiling Type)', price: 800 },
        { id: 'qtyCassette', name: 'บริการล้างแอร์มาตรฐาน (ประเภทฝังฝ้าสี่ทิศทาง - Cassette Type)', price: 1500 }
    ];

    standardServices.forEach(srv => {
        const inputEl = document.getElementById(srv.id);
        const qty = inputEl ? (parseInt(inputEl.value) || 0) : 0;
        if (qty > 0) {
            hasItems = true; 
            const itemTotal = qty * srv.price; 
            subtotal += itemTotal;
            const row = document.createElement('tr');
            row.className = 'border-b border-slate-200/60 text-slate-700 hover:bg-slate-50/50 transition';
            row.innerHTML = `<td class="p-3.5 font-medium text-slate-800">\${srv.name}</td><td class="p-3.5 text-right font-mono">\${srv.price.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td><td class="p-3.5 text-center font-bold text-slate-900">\${qty}</td><td class="p-3.5 text-right font-semibold font-mono text-slate-900 tracking-wide">\${itemTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>`;
            tableBody.appendChild(row);
        }
    });

    customItemsList.forEach((item, index) => {
        hasItems = true; 
        const itemTotal = item.qty * item.price; 
        subtotal += itemTotal;
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-200/60 text-slate-700 hover:bg-slate-50/50 transition';
        row.innerHTML = `<td class="p-3.5 font-medium text-slate-800 flex items-center gap-2.5"><span>\${item.name}</span><button onclick="removeCustomItem(\${index})" class="no-print text-[10px] bg-red-100 hover:bg-red-200 text-red-600 font-bold px-2 py-0.5 rounded transition">ลบ</button></td><td class="p-3.5 text-right font-mono">\${item.price.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td><td class="p-3.5 text-center font-bold text-slate-900">\${item.qty}</td><td class="p-3.5 text-right font-semibold font-mono text-slate-900 tracking-wide">\${itemTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>`;
        tableBody.appendChild(row);
    });

    if (!hasItems) { 
        tableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-400 font-medium bg-slate-50/30">ยังไม่มีรายการงานแอร์ที่เลือก หรือกรอกข้อมูล</td></tr>`; 
    }
    
    const vatRadio = document.querySelector('input[name="vatToggle"]:checked');
    const vatCheck = vatRadio ? vatRadio.value : 'no';
    let vatAmount = 0; let finalTotal = 0;
    
    if (vatCheck === 'yes') { 
        vatAmount = subtotal * 0.07; 
        finalTotal = subtotal + vatAmount; 
    } else { 
        vatAmount = 0; 
        finalTotal = subtotal; 
    }
    
    const valSubtotalEl = document.getElementById('valSubtotal');
    const valVatEl = document.getElementById('valVat');
    const valTotalEl = document.getElementById('valTotal');

    if (valSubtotalEl) valSubtotalEl.innerText = subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
    if (valVatEl) valVatEl.innerText = vatAmount.toLocaleString('th-TH', {minimumFractionDigits: 2});
    if (valTotalEl) valTotalEl.innerText = finalTotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
}

// ========================================================
// 🔢 ระบบแบ่งหน้าอัจฉริยะ (Pagination System) สไตล์ WordPress สำหรับหน้า at_news.html
// ========================================================
const ITEMS_PER_PAGE = 5; // กำหนดให้แสดงผลหน้าละ 5 บทความเพื่อความเร็วสูงสุด
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    // รันระบบแบ่งหน้าเมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
    initPagination();
});

function initPagination() {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return; // ถ้าไม่ใช่หน้าข่าวสาร ให้ข้ามฟังก์ชันนี้ไปเลย

    // ดึงบทความทั้งหมดที่ระบบแอดมินส่งมา (ดักจับจาก Tag <!-- NEWS_ITEM_START -->)
    const allArticles = Array.from(newsContainer.querySelectorAll('.news-item'));
    const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);

    function displayPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // วนลูป ซ่อน/แสดง บทความตามหน้าปัจจุบัน
        allArticles.forEach((article, index) => {
            if (index >= startIndex && index < endIndex) {
                article.style.display = 'block'; // แสดงผล
            } else {
                article.style.display = 'none'; // ซ่อนไว้หลังบ้าน
            }
        });

        // อัปเดตปุ่มควบคุมตัวเลขด้านล่าง
        renderPaginationControls(totalPages);
        
        // เมื่อกดเปลี่ยนหน้า ให้หน้าจอเลื่อนกลับไปด้านบนสุดของโซนข่าวสารอย่างนุ่มนวล
        const headerZone = document.querySelector('.news-header-zone');
        if (headerZone) headerZone.scrollIntoView({ behavior: 'smooth' });
    }

    function renderPaginationControls(totalPages) {
        const paginationZone = document.querySelector('.pagination-zone');
        if (!paginationZone) return;

        let controlsHTML = '';
        
        // ปุ่มก่อนหน้า
        controlsHTML += `<button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="changeNewsPage(${currentPage - 1})">&lt;&lt; ก่อนหน้า</button>`;

        // แสดงตัวเลขหน้า (ถ้าหน้าเยอะเกินไปจะแสดงจุดไข่ปลาให้ดูพรีเมียม)
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                controlsHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changeNewsPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                controlsHTML += `<span class="page-dots">...</span>`;
            }
        }

        // ปุ่มถัดไป
        controlsHTML += `<button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeNewsPage(${currentPage + 1})">ถัดไป &gt;&gt;</button>`;

        paginationZone.innerHTML = controlsHTML;
    }

    // สร้างฟังก์ชันผูกกับ Window เพื่อให้คลิกจาก HTML ได้
    window.changeNewsPage = function(page) {
        if (page < 1 || page > totalPages) return;
        displayPage(page);
    };

    // เริ่มต้นแสดงผลหน้าแรกสุดเป็นค่าเริ่มต้น
    if (allArticles.length > 0) {
        displayPage(1);
    }
}

// ========================================================
// 🌐 ระบบแชร์บทความ (Social Share) สำหรับกระดานข่าว
// ========================================================
function shareToFacebook(e) { ... }
function shareToLine(e) { ... }
function copyPageLink() { ... }
