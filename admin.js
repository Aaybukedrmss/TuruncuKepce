(function(){
    function isAdminSession(){
        try { return sessionStorage.getItem('cookie.admin') === '1'; } catch (e) { return false; }
    }
    function clearAdminSession(){
        try { sessionStorage.removeItem('cookie.admin'); } catch (e) {}
    }

    function isQuotaError(err) {
        if (!err) return false;
        // DOMException name varies by browser
        return err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED';
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
        try {
            localStorage.setItem('cookie.menu', JSON.stringify(data));
            return { ok: true };
        } catch (e) {
            return { ok: false, error: e };
        }
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
        return saveMenu(data);
    }

    function readFileAsDataUrl(file) {
        return new Promise(function(resolve, reject){
            var reader = new FileReader();
            reader.onload = function(){ resolve(reader.result); };
            reader.onerror = function(){ reject(reader.error || new Error('Dosya okunamadı.')); };
            reader.readAsDataURL(file);
        });
    }

    // Büyük resimler localStorage limitini hızla dolduruyor. Bu yüzden resmi küçültüp sıkıştırıyoruz.
    function compressImageDataUrl(dataUrl, opts) {
        opts = opts || {};
        var maxW = opts.maxW || 900;
        var maxH = opts.maxH || 900;
        var quality = typeof opts.quality === 'number' ? opts.quality : 0.72;
        var mime = opts.mime || 'image/jpeg';

        return new Promise(function(resolve){
            var img = new Image();
            img.onload = function () {
                var w = img.naturalWidth || img.width;
                var h = img.naturalHeight || img.height;
                if (!w || !h) return resolve(dataUrl);

                var scale = Math.min(maxW / w, maxH / h, 1);
                var nw = Math.max(1, Math.round(w * scale));
                var nh = Math.max(1, Math.round(h * scale));

                var canvas = document.createElement('canvas');
                canvas.width = nw;
                canvas.height = nh;
                var ctx = canvas.getContext('2d');
                if (!ctx) return resolve(dataUrl);

                ctx.drawImage(img, 0, 0, nw, nh);
                try {
                    var out = canvas.toDataURL(mime, quality);
                    resolve(out || dataUrl);
                } catch (e) {
                    // toDataURL bazı durumlarda hata verebilir (tainted canvas vs). Orijinali döndür.
                    resolve(dataUrl);
                }
            };
            img.onerror = function () { resolve(dataUrl); };
            img.src = dataUrl;
        });
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

        readFileAsDataUrl(file)
            .then(function (dataUrl) {
                return compressImageDataUrl(dataUrl, { maxW: 900, maxH: 900, quality: 0.72, mime: 'image/jpeg' });
            })
            .then(function (compressedDataUrl) {
                var result = upsertProduct({ title: title, desc: desc, price: price, image: compressedDataUrl, category: category });
                if (!result || result.ok !== true) {
                    if (result && isQuotaError(result.error)) {
                        alert('Kaydedilemedi: Depolama alanı dolu. Daha küçük bir görsel seçin (veya daha az ürün/görsel saklayın).');
                    } else {
                        alert('Kaydedilemedi: Tarayıcı depolaması yazılamadı.');
                    }
                    return;
                }
                alert('Ürün kaydedildi. Ana menüde görüntülenecek.');
                productForm.reset();
                closeModal();
            })
            .catch(function () {
                alert('Görsel okunamadı. Lütfen başka bir dosya deneyin.');
            });
    });
})();


