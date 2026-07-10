// ========================================================
// 🔢 ระบบแบ่งหน้า + เสกปุ่มแชร์อัตโนมัติสไตล์ WordPress สำหรับหน้าข่าวสาร (อัปเดตล่าสุด)
// ========================================================
const ITEMS_PER_PAGE = 4; // 🌟 แก้ไขตามใจพี่คิม: กำหนดให้แสดงผลหน้าละ 4 บทความเท่านั้นเพื่อความเร็วสูงสุด
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    // รันระบบแบ่งหน้าและสร้างปุ่มแชร์เมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
    initPaginationAndSharing();
});

function initPaginationAndSharing() {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return; // ถ้าไม่ใช่หน้าข่าวสาร ให้ข้ามฟังก์ชันนี้ไปเลย

    // ดักจับทุกโพสต์ข่าวสารเพื่อฝังปุ่มแชร์ส่วนกลาง
    const allArticles = Array.from(newsContainer.querySelectorAll('.news-item'));
    
    allArticles.forEach((article, index) => {
        // 🌟 ถ้าย้อนกลับไปเจอข่าวเก่ามากๆ ที่ยังไม่มี ID ระบบจะแอบสร้าง ID แบบถาวรจำลองให้
        if (!article.id) {
            article.id = 'news-archive-' + index;
        }

        // ค้นหาหัวข้อข่าวและสร้างลิงก์ Anchor ที่มีหางติดมาด้วย
        const titleText = article.querySelector('h2, h3, h4')?.innerText || "ข่าวสารจากอัชนัยแอร์ โคราช";
        const pageUrl = window.location.origin + window.location.pathname + '#' + article.id;
        
        // ตรวจสอบว่าในโพสต์นั้นยังไม่มีกล่องแชร์ เพื่อไม่ให้เกิดกล่องซ้ำซ้อน
        if (!article.querySelector('.social-share-box')) {
            const shareBox = document.createElement('div');
            shareBox.className = 'social-share-box no-print mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-sm text-slate-500';
            
            // โครงสร้างปุ่มแชร์ส่วนกลาง (Template ชุดเดียว ครอบคลุมทุกโพสต์ในอนาคต)
            shareBox.innerHTML = `
                <span class="font-medium mr-1">แชร์ความรู้นี้:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" class="share-btn fb bg-[#1877f2] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition">Facebook</a>
                <a href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}" target="_blank" class="share-btn line bg-[#06c755] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition">LINE</a>
                <button onclick="navigator.clipboard.writeText('${pageUrl}'); alert('🐳 คัดลอกลิงก์บทความเรียบร้อยแล้วค่ะพี่คิม!');" class="share-btn copy bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:bg-slate-300 transition">คัดลอกลิงก์</button>
            `;
            
            // นำกล่องแชร์ไปต่อท้ายล่างสุดของเนื้อหาในโพสต์นั้นๆ ทันที
            article.appendChild(shareBox);
        }

        // 🌟 [ระบบสั่งรีดไขมันเพิ่มความเร็วเว็บ] 
        const articleImg = article.querySelector('img');
        if (articleImg) {
            articleImg.setAttribute('loading', 'lazy');
        }
    });

    // ระบบจัดการคำนวณหน้าแบ่งผลผลิตข่าวสาร (Pagination Logic)
    const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);

    function displayPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // วนลูป ซ่อน/แสดง บทความตามหน้าปัจจุบัน
        allArticles.forEach((article, index) => {
            if (index >= startIndex && index < endIndex) {
                article.style.display = 'block'; // แสดงผลเฉพาะ 4 อันเด่นในหน้านั้น
            } else {
                article.style.display = 'none'; // ซ่อนตัวเก่าๆ ไว้หลังบ้าน ไม่ให้เปลืองพื้นที่
            }
        });

        // อัปเดตปุ่มควบคุมตัวเลขด้านล่าง
        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const paginationZone = document.querySelector('.pagination-zone');
        if (!paginationZone) return;

        let controlsHTML = '';
        
        // ปุ่มก่อนหน้า พร้อมเลื่อนจอขึ้นนิดนึง
        controlsHTML += `<button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="changeNewsPage(${currentPage - 1}); document.querySelector('.news-header-zone').scrollIntoView({ behavior: 'smooth' });">&lt;&lt; ก่อนหน้า</button>`;

        // แสดงตัวเลขหน้า
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                controlsHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changeNewsPage(${i}); document.querySelector('.news-header-zone').scrollIntoView({ behavior: 'smooth' });">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                controlsHTML += `<span class="page-dots">...</span>`;
            }
        }

        // ปุ่มถัดไป
        controlsHTML += `<button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changeNewsPage(${currentPage + 1}); document.querySelector('.news-header-zone').scrollIntoView({ behavior: 'smooth' });">ถัดไป &gt;&gt;</button>`;

        paginationZone.innerHTML = controlsHTML;
    }

    // สร้างฟังก์ชันผูกกับ Window เพื่อให้คลิกจาก HTML ได้ตามเดิม
    window.changeNewsPage = function(page) {
        if (page < 1 || page > totalPages) return;
        displayPage(page);
    };

    // 🌟 4. ระบบค้นหาข่าวเป้าหมาย (Anchor Routing) และทำไฮไลท์วิบวับเมื่อเปิดผ่านลิงก์แชร์ 🌟
    const hash = window.location.hash;
    if (hash) {
        // เช็คว่ามีเป้าหมาย Anchor มาจากลิงก์ที่แชร์ไว้หรือไม่
        const targetArticle = document.querySelector(hash);
        if (targetArticle) {
            // หาว่าข่าวนี้ซ่อนอยู่หน้าไหน แล้วสั่งเปิดหน้านั้นมารอเลย
            const index = allArticles.indexOf(targetArticle);
            const targetPage = Math.floor(index / ITEMS_PER_PAGE) + 1;
            displayPage(targetPage);
            
            // หน่วงเวลาเล็กน้อยให้หน้าเรนเดอร์เสร็จ แล้วค่อยๆ สไลด์จอลงไปหาเป้าหมาย
            setTimeout(() => {
                targetArticle.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 🪄 สร้างเอฟเฟกต์สีส้มพาสเทลวิบวับกระตุ้นสายตา 3 วินาที ให้ลูกค้าโฟกัสจุดหมาย
                const originalBg = targetArticle.style.backgroundColor;
                const originalBoxShadow = targetArticle.style.boxShadow;
                
                targetArticle.style.transition = 'all 0.5s ease';
                targetArticle.style.backgroundColor = '#fff7ed'; // พื้นหลังสีส้มอ่อนสบายตา
                targetArticle.style.border = '2px solid #ff7a00'; // ขอบสีส้มประจำร้าน
                targetArticle.style.boxShadow = '0 0 20px rgba(255, 122, 0, 0.4)';
                
                // คืนค่าสีเดิมหลังผ่านไป 3.5 วินาที
                setTimeout(() => {
                    targetArticle.style.backgroundColor = originalBg || '';
                    targetArticle.style.border = '1px solid #e5e7eb';
                    targetArticle.style.boxShadow = originalBoxShadow || '0 4px 6px rgba(0,0,0,0.02)';
                }, 3500);

            }, 400); // ดีเลย์เผื่อมือถือที่เน็ตไม่แรง
        } else {
            // กรณีลูกค้าพิมพ์หางเต่ามาผิด หรือลิงก์เสีย ให้แสดงผลหน้าแรกตามปกติ
            if (allArticles.length > 0) displayPage(1);
        }
    } else {
        // เริ่มต้นแสดงผลหน้าแรกสุดเป็นค่าเริ่มต้น ถ้าไม่มีการกระโดดหาข่าว
        if (allArticles.length > 0) displayPage(1);
    }
}
