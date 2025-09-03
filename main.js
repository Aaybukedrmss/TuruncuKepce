// Kategori sekmeleri için işlevsellik
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Aktif sekme stilini değiştir
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // İlgili menü kategorisini göster
        const categoryId = button.getAttribute('data-category');
        document.querySelectorAll('.menu-category').forEach(category => {
            category.classList.remove('active');
        });
        document.getElementById(categoryId).classList.add('active');
    });
});

// Görüş formu gönderme
document.querySelector('.feedback-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Görüşünüz için teşekkür ederiz! En kısa sürede değerlendirilecektir.');
    this.reset();
});

// Görünüm yöneticisi ve ilk ziyaret akışı
(function () {
    const choiceView = document.getElementById('choice-view');
    const menuView = document.getElementById('menu-view');
    const feedbackView = document.getElementById('feedback-view');
    const resetBtn = document.getElementById('reset-choice');

    function show(view) {
        [choiceView, menuView, feedbackView].forEach(function (v) {
            if (v) v.classList.add('hidden');
        });
        if (view) view.classList.remove('hidden');
        if (view === choiceView) {
            if (resetBtn) resetBtn.classList.add('hidden');
        } else {
            if (resetBtn) resetBtn.classList.remove('hidden');
        }
    }

    function initTabs() {
        document.querySelectorAll('.tab-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                document.querySelectorAll('.tab-btn').forEach(function (btn) {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                var categoryId = button.getAttribute('data-category');
                document.querySelectorAll('.menu-category').forEach(function (category) {
                    category.classList.remove('active');
                });
                var target = document.getElementById(categoryId);
                if (target) target.classList.add('active');
            });
        });
    }

    function wireForms() {
        var form = document.querySelector('.feedback-form');
        if (!form) return;

        // Eski submit dinleyicilerini temizlemek için formu klonla
        var cloned = form.cloneNode(true);
        form.parentNode.replaceChild(cloned, form);
        form = cloned;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var fd = new FormData(form);
            var name = (fd.get('name') || (document.getElementById('name') || {}).value || '').toString();
            var email = (fd.get('email') || (document.getElementById('email') || {}).value || '').toString();
            var phone = (fd.get('phone') || (document.getElementById('phone') || {}).value || '').toString();
            var message = (fd.get('message') || (document.getElementById('message') || {}).value || '').toString();

            try {
                var list = JSON.parse(localStorage.getItem('cookie.feedbacks') || '[]');
                list.push({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    createdAt: Date.now()
                });
                localStorage.setItem('cookie.feedbacks', JSON.stringify(list));
            } catch (err) {
                console.warn('localStorage yazılamadı', err);
            }

            alert('Görüşünüz için teşekkür ederiz! En kısa sürede değerlendirilecektir.');
            form.reset();
        });
    }

    function persistChoice(choice) {
        try {
            localStorage.setItem('cookie.choice', choice);
        } catch (e) {
            console.warn('localStorage yazılamadı', e);
        }
    }

    function getPersistedChoice() {
        try {
            return localStorage.getItem('cookie.choice');
        } catch (e) {
            return null;
        }
    }

    function clearChoice() {
        try {
            localStorage.removeItem('cookie.choice');
        } catch (e) {
            console.warn('localStorage temizlenemedi', e);
        }
    }

    function routeTo(choice) {
        if (choice === 'menu') {
            show(menuView);
            initTabs();
            renderMenuFromStorage();
        } else if (choice === 'feedback') {
            show(feedbackView);
            wireForms();
        } else {
            show(choiceView);
        }
    }

    function init() {
        var saved = getPersistedChoice();
        if (saved === 'menu' || saved === 'feedback') {
            routeTo(saved);
        } else {
            show(choiceView);
        }

        var chooseFeedback = document.getElementById('choose-feedback');
        var chooseMenu = document.getElementById('choose-menu');

        if (chooseFeedback) {
            chooseFeedback.addEventListener('click', function () {
                console.log('Görüş bildir butonuna tıklandı');
                // Google Form'a yönlendirme
                var googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc8dJVLeKIKm_03bKs2J04H8gFPDJZ2Tg3CEQrKMrVnfPT_8Q/viewform?usp=headerT_8Q/viewform?usp=sharing&ouid=104837034450252506491'; // Buraya Google Form URL'nizi yazın
                window.open(googleFormUrl, '_blank');
            });
        }

        if (chooseMenu) {
            chooseMenu.addEventListener('click', function () {
                console.log('Menü butonuna tıklandı');
                persistChoice('menu');
                routeTo('menu');
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                clearChoice();
                routeTo();
            });
        }

        // Başlık ikonundan admin sayfasına geçiş (PIN: 2025)
        var logoEl = document.querySelector('header .logo');
        if (logoEl) {
            logoEl.addEventListener('click', function () {
                var pin = prompt('Yönetici PIN kodunu giriniz:');
                if (pin === '2025') {
                    try {
                        sessionStorage.setItem('cookie.admin', '1');
                    } catch (e) {
                        console.warn('sessionStorage yazılamadı', e);
                    }
                    window.location.href = 'admin.html';
                } else if (pin !== null) {
                    alert('Hatalı PIN.');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Menü öğelerini localStorage'dan yükleyip render etme
function renderMenuFromStorage() {
    var data;
    try {
        data = JSON.parse(localStorage.getItem('cookie.menu') || '{}');
    } catch (e) {
        data = {};
    }

    var categories = ['corbalar', 'anayemekler', 'aperatifler', 'icecekler', 'tatlilar'];
    categories.forEach(function (cat) {
        var container = document.querySelector('#' + cat + ' .menu-items');
        if (!container) return;

        // Var olan statik öğeleri koru, sadece ek veri render et
        // Eklenen öğeler için bir işaretçi kapsayıcı kullan
        var marker = container.querySelector('.dynamic-insert-marker');
        if (!marker) {
            marker = document.createElement('div');
            marker.className = 'dynamic-insert-marker';
            container.appendChild(marker);
        }
        // Önce önceki dinamikleri temizle
        marker.innerHTML = '';

        var items = Array.isArray(data[cat]) ? data[cat] : [];
        items.forEach(function (item) {
            var node = document.createElement('div');
            node.className = 'menu-item';
            node.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-info">
                    <h3 class="item-title">${item.title}</h3>
                    <p class="item-desc">${item.desc}</p>
                    <p class="item-price">${item.price} TL</p>
                </div>`;
            marker.appendChild(node);
        });
    });
}