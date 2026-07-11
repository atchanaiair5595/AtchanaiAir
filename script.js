// ========================================================
// 🐳 1. ระบบดึงข้อมูลข่าวสาร (Fetch News) มาแสดงหน้าสารบัญ
// ========================================================
async function loadNewsContent() {
    const zone = document.getElementById('seo-content-zone');
    
    // ถ้าไม่มีกล่องให้ดึงข่าว ให้กระโดดไปจัดหน้าเลย
    if (!zone) {
        return; 
    }

    try {
        const cacheBuster = new Date().getTime();
        const response = await fetch(`at_news.html?v=${cacheBuster}`);
        
        if (response.ok) {
            const html = await response.text();
            
            // 🐳 เครื่องมือจำลองการอ่าน HTML ของปลาวาฬ
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 🐳 หากล่องข่าวทั้งหมดในไฟล์ at_news.html
            const allArticles = doc.querySelectorAll('article.news-item');
            
            // 🐳 สั่งลบข่าวที่เกิน 5 อันดับแรกออก (ไม่ให้ไปแสดงบนหน้า index.html)
            allArticles.forEach((article, index) => {
                if (index >= 5) {
                    article.remove(); 
                }
            });

            // แปะเนื้อหาที่คัดกรองเหลือแค่ 5 ข่าวลงเว็บหลัก
            zone.innerHTML = doc.body.innerHTML; 
        }
    } catch (error) {
        console.error("ปลาวาฬโหลดหน้าสารบัญข่าวไม่สำเร็จครับพี่คิม: ", error);
    }
}

// เมื่อเว็บโหลดเสร็จ ให้เรียกฟังก์ชันดูดข่าว และตั้งค่าบิลใบเสนอราคา
document.addEventListener('DOMContentLoaded', () => {
    loadNewsContent();
    initQuoter(); // รันวันที่และเลขที่บิล
});

// ========================================================
// 📋 2. ระบบคำนวณใบเสนอราคา (คงไว้เหมือนเดิม 100% ไม่แตะต้องค่ะ)
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
// ❌ 3. ปุ่มกากบาทปิดหน้าต่างโปรโมชั่นมุมขวาล่าง
// ========================================================
window.closePromo = function() {
    const promoBox = document.getElementById('floating-promo');
    if (promoBox) {
        promoBox.style.display = 'none';
    }
};
