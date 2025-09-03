(function(){
    function isAdminSession(){
        try { return sessionStorage.getItem('cookie.admin') === '1'; } catch (e) { return false; }
    }
    if (!isAdminSession()) {
        alert('Yetkisiz erişim.');
        window.location.replace('index.html');
        return;
    }

    function loadFeedbacks(){
        try { return JSON.parse(localStorage.getItem('cookie.feedbacks')||'[]'); } catch (e) { return []; }
    }
    function saveFeedbacks(list){
        try { localStorage.setItem('cookie.feedbacks', JSON.stringify(list)); } catch (e) {}
    }

    function formatDate(ts){
        try {
            var d = new Date(ts);
            return d.toLocaleString('tr-TR');
        } catch (e) { return ''; }
    }

    function render(){
        var tbody = document.querySelector('#feedback-table tbody');
        if (!tbody) return;
        var rows = '';
        var list = loadFeedbacks();
        list.slice().reverse().forEach(function(fb, idx){
            var id = list.length - 1 - idx; // orijinal index
            rows += '<tr>\
                <td>'+formatDate(fb.createdAt)+'</td>\
                <td>'+(fb.name||'')+'</td>\
                <td>'+(fb.email||'')+'</td>\
                <td>'+(fb.phone||'')+'</td>\
                <td>'+(fb.message||'')+'</td>\
                <td><button class="btn outline small" data-del="'+id+'">Sil</button></td>\
            </tr>';
        });
        tbody.innerHTML = rows || '<tr><td colspan="6">Henüz bir görüş yok.</td></tr>';

        // Silme butonları
        tbody.querySelectorAll('button[data-del]').forEach(function(btn){
            btn.addEventListener('click', function(){
                var idx = parseInt(btn.getAttribute('data-del'), 10);
                var list2 = loadFeedbacks();
                if (!isNaN(idx) && list2[idx]){
                    list2.splice(idx,1);
                    saveFeedbacks(list2);
                    render();
                    renderFeedbacksList();
                }
            });
        });
    }

    // Basit liste görünümü (kullanıcının verdiği render)
    function renderFeedbacksList(){
        var container = document.getElementById('feedback-list');
        if (!container) return;
        container.innerHTML = '';
        try {
            var list = loadFeedbacks();
            list.forEach(function(fb){
                var item = document.createElement('div');
                item.className = 'feedback-item';
                var when = fb.createdAt ? new Date(fb.createdAt).toLocaleString('tr-TR') : '';
                item.innerHTML = `
                    <p><strong>İsim:</strong> ${fb.name || '-'}</p>
                    <p><strong>Email:</strong> ${fb.email || '-'}</p>
                    <p><strong>Telefon:</strong> ${fb.phone || '-'}</p>
                    <p><strong>Mesaj:</strong> ${fb.message || '-'}</p>
                    <p><em>${when}</em></p>
                    <hr>`;
                container.appendChild(item);
            });
            if (!list.length) container.innerHTML = '<p>Henüz hiç görüş bulunmuyor.</p>';
        } catch (e) {
            container.innerHTML = '<p>Henüz hiç görüş bulunmuyor.</p>';
        }
    }

    document.getElementById('back-admin').addEventListener('click', function(){
        window.location.href = 'admin.html';
    });

    render();
    renderFeedbacksList();
})();


