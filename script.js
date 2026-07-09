// ========================================================
// 🐳 ไฟล์กลไกหลัก script.js ของร้านอัชนัยแอร์ (ฉบับสมบูรณ์)
// ========================================================

// --------------------------------------------------------
// 🚀 1. ระบบดึงเนื้อหาหน้าเว็บอัตโนมัติ (One-Page Scroll & Lazy Load)
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // หาจุดที่ต้องการนำข่าวสารมาแสดง
    const seoZone = document.getElementById('seo-content-zone');
    
    if (seoZone) {
        // ใช้ Intersection Observer ดึงหน้าเว็บเมื่อลูกค้าเลื่อนมาใกล้ (โหลดเร็ว SEO ชอบ)
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadNewsContent(seoZone);
                    obs.disconnect(); // โหลดครั้งเดียวแล้วหยุดการทำงาน ประหยัดทรัพยากร
                }
            });
        }, { rootMargin: '300px' }); // เริ่มโหลดล่วงหน้า 300px ก่อนที่ลูกค้าจะเลื่อนไปถึง
        
        observer.observe(seoZone);
    }

    // สั่งให้ระบบใบเสนอราคาเซ็ตวันที่ปัจจุบันไว้ล่วงหน้า
    calculateTotal();
});

async function loadNewsContent(targetElement) {
    try {
        const response = await fetch('at_news.html');
        if (!response.ok) throw new Error('ไม่สามารถโหลดไฟล์ข่าวสารได้');
        
        const html = await response.text();
        targetElement.innerHTML = html; 
        
        // เมื่อดึงหน้าข่าวสารมาแปะเสร็จ ให้รันระบบแบ่งหน้าและปุ่มแชร์ทันที
        if (typeof initPaginationAndSharing === 'function') {
            initPaginationAndSharing();
        }
    } catch (error) {
        console.error("🐳 ข้อผิดพลาด: ", error);
    }
}

// --------------------------------------------------------
// 📋 2. ระบบใบเสนอราคาอัตโนมัติ (Auto-Quoter) สำหรับพี่คิม
// --------------------------------------------------------
let customItems = []; // กล่องเก็บรายการเพิ่มเติมที่พี่คิมพิมพ์เอง

function addCustomItem() {
    const name = document.getElementById('customName').value;
    const price = parseFloat(document.getElementById('customPrice').value) || 0;
    const qty = parseInt(document.getElementById('customQty').value) || 1;
    
    if(name && price > 0) {
        customItems.push({ name, price, qty });
        // ล้างช่องกรอกข้อมูลให้ว่างพร้อมพิมพ์ใหม่
        document.getElementById('customName').value = '';
        document.getElementById('customPrice').value = '';
        document.getElementById('customQty').value = '1';
        calculateTotal();
    }
}

function calculateTotal() {
    // 1. ดึงชื่อและเบอร์โทรไปแสดงที่เอกสาร
    document.getElementById('previewClientName').innerText = document.getElementById('clientName').value || '-';
    document.getElementById('previewClientPhone').innerText = document.getElementById('clientPhone').value || '-';
    
    // 2. รันเลขที่เอกสารและวันที่
    const now = new Date();
    document.getElementById('docDate').innerText = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // สร้างเลขบิลแบบสุ่มไม่ซ้ำ เช่น QT-202607-1234
    if(document.getElementById('docNumber').innerText === '-') {
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        document.getElementById('docNumber').innerText = `QT-${year}${month}-${rand}`;
    }

    let tbodyHTML = '';
    let subtotal = 0;

    // 3. คำนวณแอร์ติดผนัง
    const wallQty = parseInt(document.getElementById('qtyWall').value) || 0;
    if(wallQty > 0) {
        const total = wallQty * 500;
        subtotal += total;
        tbodyHTML += `<tr class="border-b border-slate-100"><td class="p-3 text-left">บริการล้างแอร์ติดผนัง (Wall Type)</td><td class="p-3 text-right">500.00</td><td class="p-3 text-center">${wallQty}</td><td class="p-3 text-right font-medium">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td></tr>`;
    }

    // 4. คำนวณแอร์แขวนใต้ฝ้า
    const ceilingQty = parseInt(document.getElementById('qtyCeiling').value) || 0;
    if(ceilingQty > 0) {
        const total = ceilingQty * 800;
        subtotal += total;
        tbodyHTML += `<tr class="border-b border-slate-100"><td class="p-3 text-left">บริการล้างแอร์แขวนใต้ฝ้า (Ceiling Type)</td><td class="p-3 text-right">800.00</td><td class="p-3 text-center">${ceilingQty}</td><td class="p-3 text-right font-medium">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td></tr>`;
    }

    // 5. คำนวณแอร์ฝังฝ้า
    const cassetteQty = parseInt(document.getElementById('qtyCassette').value) || 0;
    if(cassetteQty > 0) {
        const total = cassetteQty * 1500;
        subtotal += total;
        tbodyHTML += `<tr class="border-b border-slate-100"><td class="p-3 text-left">บริการล้างแอร์ฝังฝ้า 4 ทิศทาง (Cassette Type)</td><td class="p-3 text-right">1,500.00</td><td class="p-3 text-center">${cassetteQty}</td><td class="p-3 text-right font-medium">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td></tr>`;
    }

    // 6. เพิ่มรายการ Custom ที่พี่คิมคีย์เอง (เช่น งาน Home Service รอบ มทส.)
    customItems.forEach(item => {
        const total = item.price * item.qty;
        subtotal += total;
        tbodyHTML += `<tr class="border-b border-slate-100"><td class="p-3 text-left text-amber-900">${item.name}</td><td class="p-3 text-right">${item.price.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td><td class="p-3 text-center">${item.qty}</td><td class="p-3 text-right font-medium">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td></tr>`;
    });

    document.getElementById('invoiceItemsTable').innerHTML = tbodyHTML;

    // 7. คำนวณภาษี
    const vatMode = document.querySelector('input[name="vatToggle"]:checked').value;
    let vatAmount = 0;
    if(vatMode === 'yes') {
        vatAmount = subtotal * 0.07;
    }
    const grandTotal = subtotal + vatAmount;

    // แสดงผลตัวเลข
    document.getElementById('valSubtotal').innerText = subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
    document.getElementById('valVat').innerText = vatAmount.toLocaleString('th-TH', {minimumFractionDigits: 2});
    document.getElementById('valTotal').innerText = grandTotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
}

// --------------------------------------------------------
// 🎁 ปิดป้ายโปรโมชั่น
// --------------------------------------------------------
function closePromo() { 
    const promo = document.getElementById('floating-promo');
    if(promo) promo.style.display = 'none'; 
}


// --------------------------------------------------------
// 🔢 3. ระบบแบ่งหน้า + ปุ่มแชร์สไตล์ WordPress สำหรับหน้าข่าวสาร
// --------------------------------------------------------
const ITEMS_PER_PAGE = 4; // โชว์หน้าละ 4 ข่าว
let currentPage = 1;

function initPaginationAndSharing() {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return;

    const allArticles = Array.from(newsContainer.querySelectorAll('.news-item'));
    
    allArticles.forEach((article, index) => {
        if (!article.id) article.id = 'news-archive-' + index;

        const pageUrl = window.location.origin + window.location.pathname + '#' + article.id;
        
        if (!article.querySelector('.social-share-box')) {
            const shareBox = document.createElement('div');
            shareBox.className = 'social-share-box no-print mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-sm text-slate-500';
            shareBox.innerHTML = `
                <span class="font-medium mr-1">แชร์ความรู้นี้:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" class="share-btn fb bg-[#1877f2] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition">Facebook</a>
                <a href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}" target="_blank" class="share-btn line bg-[#06c755] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition">LINE</a>
                <button onclick="navigator.clipboard.writeText('${pageUrl}'); alert('🐳 คัดลอกลิงก์บทความเรียบร้อยแล้วค่ะพี่คิม!');" class="share-btn copy bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:bg-slate-300 transition">คัดลอกลิงก์</button>
            `;
            article.appendChild(shareBox);
        }

        const articleImg = article.querySelector('img');
        if (articleImg) articleImg.setAttribute('loading', 'lazy');
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
        controlsHTML += `<button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="changeNewsPage(${currentPage - 1}); document.querySelector('.news-header-zone').scrollIntoView({ behavior: 'smooth' });">&lt;&lt; ก่อนหน้า</button>`;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                controlsHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changeNewsPage(${i}); document.querySelector('.news-header-zone').scrollIntoView({ behavior: 'smooth' });">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                controlsHTML += `<span class="page-dots">...</span>`;
            }
        }

        controlsHTML += `<button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeNewsPage(${currentPage + 1}); document.querySelector('.news-header-zone').scrollIntoView({ behavior: 'smooth' });">ถัดไป &gt;&gt;</button>`;
        paginationZone.innerHTML = controlsHTML;
    }

    window.changeNewsPage = function(page) {
        if (page < 1 || page > totalPages) return;
        displayPage(page);
    };

    const hash = window.location.hash;
    if (hash) {
        const targetArticle = document.querySelector(hash);
        if (targetArticle) {
            const index = allArticles.indexOf(targetArticle);
            const targetPage = Math.floor(index / ITEMS_PER_PAGE) + 1;
            displayPage(targetPage);
            
            setTimeout(() => {
                targetArticle.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const originalBg = targetArticle.style.backgroundColor;
                const originalBoxShadow = targetArticle.style.boxShadow;
                
                targetArticle.style.transition = 'all 0.5s ease';
                targetArticle.style.backgroundColor = '#fff7ed';
                targetArticle.style.border = '2px solid #ff7a00';
                targetArticle.style.boxShadow = '0 0 20px rgba(255, 122, 0, 0.4)';
                
                setTimeout(() => {
                    targetArticle.style.backgroundColor = originalBg || '';
                    targetArticle.style.border = '1px solid #e5e7eb';
                    targetArticle.style.boxShadow = originalBoxShadow || '0 4px 6px rgba(0,0,0,0.02)';
                }, 3500);

            }, 400); 
        } else {
            if (allArticles.length > 0) displayPage(1);
        }
    } else {
        if (allArticles.length > 0) displayPage(1);
    }
}
