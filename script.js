// ========================================================
// 🐳 1. ระบบดึงข้อมูลข่าวสาร (Fetch News) มาแสดงหน้าหลัก
// ========================================================
async function loadNewsContent() {
    const zone = document.getElementById('seo-content-zone');
    
    // ถ้าไม่มีกล่องให้ดึงข่าว ให้กระโดดไปจัดหน้าเลย
    if (!zone) {
        if (typeof initPaginationAndSharing === 'function') initPaginationAndSharing();
        return; 
    }

    try {
        const response = await fetch('at_news.html');
        if (response.ok) {
            const html = await response.text();
            zone.innerHTML = html; // แปะเนื้อหาลงเว็บ
            
            // 🚨 สำคัญมาก: ต้องแปะข่าวให้เสร็จก่อน ค่อยเรียกฟังก์ชันจัดหน้าเว็บ
            if (typeof initPaginationAndSharing === 'function') {
                initPaginationAndSharing(); 
            }
        }
    } catch (error) {
        console.error("ปลาวาฬโหลดหน้าข่าวไม่สำเร็จครับพี่คิม: ", error);
    }
}

// เมื่อเว็บโหลดเสร็จ ให้เรียกฟังก์ชันดูดข่าว และตั้งค่าบิลใบเสนอราคา
document.addEventListener('DOMContentLoaded', () => {
    loadNewsContent();
    initQuoter(); // รันวันที่และเลขที่บิล
});


// ========================================================
// 🔢 2. ระบบแบ่งหน้า + เสกปุ่มแชร์อัตโนมัติ (โค้ดดั้งเดิมของพี่คิม)
// ========================================================
const ITEMS_PER_PAGE = 4; 
let currentPage = 1;

function initPaginationAndSharing() {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return; 

    const allArticles = Array.from(newsContainer.querySelectorAll('.news-item'));
    
    allArticles.forEach((article, index) => {
        if (!article.id) {
            article.id = 'news-archive-' + index;
        }

        const titleText = article.querySelector('h2, h3, h4')?.innerText || "ข่าวสารจากอัชนัยแอร์ โคราช";
        
        // 🌟 แก้ไขจุดที่ 1: ตัดหางขยะจาก Facebook ออกให้หมด เพื่อให้ลิงก์สะอาด
        const cleanUrl = window.location.href.split('#')[0].split('?')[0];
        const pageUrl = cleanUrl + '#' + article.id;
        
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
            
            // 🌟 แก้ไขจุดที่ 2: หน่วงเวลาเพิ่มเป็น 800ms ให้ Facebook โหลดรูปเสร็จชัวร์ๆ ค่อยสไลด์
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

            }, 800); 
        } else {
            if (allArticles.length > 0) displayPage(1);
        }
    } else {
        if (allArticles.length > 0) displayPage(1);
    }
}


// ========================================================
// 📋 3. ระบบคำนวณใบเสนอราคา (กู้คืนครบถ้วน)
// ========================================================
let customItems = []; // กล่องเก็บรายการที่พิมพ์เพิ่มเอง

function initQuoter() {
    const docDateEl = document.getElementById('docDate');
    const docNumEl = document.getElementById('docNumber');
    if (docDateEl) {
        const now = new Date();
        // ตั้งวันที่ปัจจุบัน
        docDateEl.innerText = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        // สุ่มเลขที่เอกสาร QA-YYMMDD-XXXX
        docNumEl.innerText = "QA-" + now.getFullYear().toString().slice(-2) + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + "-" + Math.floor(1000 + Math.random() * 9000);
    }
    calculateTotal();
}

window.calculateTotal = function() {
    // 1. อัปเดตข้อมูลลูกค้า
    const cName = document.getElementById('clientName')?.value || '-';
    const cPhone = document.getElementById('clientPhone')?.value || '-';
    if(document.getElementById('previewClientName')) document.getElementById('previewClientName').innerText = cName;
    if(document.getElementById('previewClientPhone')) document.getElementById('previewClientPhone').innerText = cPhone;

    // 2. ดึงจำนวนรายการหลัก
    const wallQty = parseInt(document.getElementById('qtyWall')?.value) || 0;
    const ceilingQty = parseInt(document.getElementById('qtyCeiling')?.value) || 0;
    const cassetteQty = parseInt(document.getElementById('qtyCassette')?.value) || 0;

    let tbodyHTML = '';
    let subtotal = 0;

    // ฟังก์ชันช่วยสร้างแถวตาราง
    function addRow(name, price, qty) {
        if (qty > 0) {
            const total = price * qty;
            subtotal += total;
            tbodyHTML += `
                <tr class="border-b border-slate-100 text-slate-700">
                    <td class="p-3">${name}</td>
                    <td class="p-3 text-right">${price.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                    <td class="p-3 text-center">${qty}</td>
                    <td class="p-3 text-right font-bold">${total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                </tr>
            `;
        }
    }

    // ใส่รายการหลัก
    addRow('แอร์ติดผนัง (Wall Type)', 500, wallQty);
    addRow('แอร์แขวนใต้ฝ้า (Ceiling Type)', 800, ceilingQty);
    addRow('แอร์ฝังฝ้าสี่ทิศทาง (Cassette Type)', 1500, cassetteQty);

    // ใส่รายการที่เพิ่มเอง
    customItems.forEach(item => {
        addRow(item.name, item.price, item.qty);
    });

    const tableBody = document.getElementById('invoiceItemsTable');
    if(tableBody) tableBody.innerHTML = tbodyHTML;

    // 3. คำนวณ VAT และยอดรวม
    const vatToggle = document.querySelector('input[name="vatToggle"]:checked')?.value;
    let vat = 0;
    if (vatToggle === 'yes') {
        vat = subtotal * 0.07;
    }
    const total = subtotal + vat;

    // อัปเดตตัวเลขแสดงผล
    if(document.getElementById('valSubtotal')) document.getElementById('valSubtotal').innerText = subtotal.toLocaleString('th-TH', {minimumFractionDigits: 2});
    if(document.getElementById('valVat')) document.getElementById('valVat').innerText = vat.toLocaleString('th-TH', {minimumFractionDigits: 2});
    if(document.getElementById('valTotal')) document.getElementById('valTotal').innerText = total.toLocaleString('th-TH', {minimumFractionDigits: 2});
};

window.addCustomItem = function() {
    const name = document.getElementById('customName').value.trim();
    const price = parseFloat(document.getElementById('customPrice').value);
    const qty = parseInt(document.getElementById('customQty').value);

    if (name && !isNaN(price) && !isNaN(qty) && qty > 0) {
        customItems.push({ name, price, qty }); // บันทึกเข้ากล่อง
        
        // ล้างช่องกรอกเพื่อเตรียมพิมพ์อันใหม่
        document.getElementById('customName').value = '';
        document.getElementById('customPrice').value = '';
        document.getElementById('customQty').value = '1';
        
        calculateTotal(); // สั่งคำนวณใหม่
    } else {
        alert('🐳 รบกวนพี่คิมใส่ชื่อรายการ ราคา และจำนวนให้ครบถ้วนด้วยนะคะ!');
    }
};


// ========================================================
// ❌ 4. ปุ่มกากบาทปิดหน้าต่างโปรโมชั่นมุมขวาล่าง
// ========================================================
window.closePromo = function() {
    const promoBox = document.getElementById('floating-promo');
    if (promoBox) {
        promoBox.style.display = 'none';
    }
};
