(function(){
    function isAdminSession(){
        try { return sessionStorage.getItem('cookie.admin') === '1'; } catch (e) { return false; }
    }
    function clearAdminSession(){
        try { sessionStorage.removeItem('cookie.admin'); } catch (e) {}
    }

    // Guard: admin sayfasına doğrudan erişim engeli
    if (!isAdminSession()) {
        // PIN URL parametresiyle de kabul et (admin.html?admin=2025)
        var params = new URLSearchParams(window.location.search);
        var urlPin = params.get('admin');
        if (urlPin === '2025') {
            try { sessionStorage.setItem('cookie.admin', '1'); } catch (e) {}
        } else {
            alert('Yetkisiz erişim. Giriş ekranına yönlendiriliyorsunuz.');
            window.location.replace('index.html');
            return;
        }
    }

    // Çıkış
    var logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', function(){
        clearAdminSession();
        window.location.href = 'index.html';
    });

    // Header logo ana sayfaya döndürsün
    var logoEl = document.querySelector('header .logo');
    if (logoEl) logoEl.addEventListener('click', function(){
        window.location.href = 'index.html';
    });

    // Menü Yönetimi kartı modal açsın
    var menuCard = Array.prototype.find.call(document.querySelectorAll('.admin-card h3'), function(h){ return h.textContent.trim() === 'Menü Yönetimi'; });
    var productModal = document.getElementById('product-modal');
    var modalClose = document.getElementById('modal-close');
    var productForm = document.getElementById('product-form');

    function openModal(){ if (productModal) productModal.classList.remove('hidden'); }
    function closeModal(){ if (productModal) productModal.classList.add('hidden'); }

    if (menuCard) menuCard.parentElement.addEventListener('click', openModal);

    // Görüş Bildirimleri sayfasına geçiş - geçici olarak devre dışı
    /*
    var feedbackCard = Array.prototype.find.call(document.querySelectorAll('.admin-card h3'), function(h){ return h.textContent.trim() === 'Görüş Bildirimleri'; });
    if (feedbackCard) feedbackCard.parentElement.addEventListener('click', function(){
        window.location.href = 'feedbacks.html';
    });
    */
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (productModal) productModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

    function loadMenu(){
        try { return JSON.parse(localStorage.getItem('cookie.menu') || '{}'); } catch (e) { return {}; }
    }
    function saveMenu(data){
        try { localStorage.setItem('cookie.menu', JSON.stringify(data)); } catch (e) {}
    }

    function upsertProduct(item){
        var data = loadMenu();
        var category = item.category;
        if (!data[category]) data[category] = [];
        data[category].push({
            title: item.title,
            desc: item.desc,
            price: item.price,
            image: item.image
        });
        saveMenu(data);
    }

    if (productForm) productForm.addEventListener('submit', function(e){
        e.preventDefault();
        var title = document.getElementById('product-name').value.trim();
        var desc = document.getElementById('product-desc').value.trim();
        var price = parseInt(document.getElementById('product-price').value, 10);
        var fileInput = document.getElementById('product-image-file');
        var file = fileInput && fileInput.files && fileInput.files[0];
        var category = document.getElementById('product-category').value;
        if (!title || !desc || !file || !category || !(price >= 0)) return;

        var reader = new FileReader();
        reader.onload = function(){
            var imageDataUrl = reader.result; // base64 data URL
            upsertProduct({ title: title, desc: desc, price: price, image: imageDataUrl, category: category });
            alert('Ürün kaydedildi. Ana menüde görüntülenecek.');
            productForm.reset();
            closeModal();
        };
        reader.readAsDataURL(file);
    });
})();


