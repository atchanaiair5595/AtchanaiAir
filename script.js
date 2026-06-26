/* =========================================
   ไฟล์สคริปต์ควบคุมระบบ (JavaScript) - อัชนัยแอร์ 
   ========================================= */

// อาร์เรย์เก็บลิงก์รูปภาพทั้งหมดของหน้าผลงาน
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
    lightbox.classList.remove('hidden');
    
    // สั่ง Fade-in นุ่มนวลภายใน 10ms
    setTimeout(() => { 
        lightbox.classList.remove('opacity-0'); 
    }, 10);
    
    // ล็อคการเลื่อนหน้าจอเว็บหลัก
    document.body.style.overflow = 'hidden';
}

// ฟังก์ชันปิดหน้าต่าง Pop-up
function closeLightbox() {
    const lightbox = document.getElementById('customLightbox');
    lightbox.classList.add('opacity-0');
    
    // รอจังหวะ Effect 200ms แล้วค่อยซ่อนกล่อง
    setTimeout(() => { 
        lightbox.classList.add('hidden'); 
    }, 200);
    
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