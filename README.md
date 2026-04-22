# Turuncu Kepçe — QR Menü & Mini Yönetim Paneli (Proje Raporu)

Bu repo, **statik (backend’siz)** çalışan bir restoran **QR menü arayüzü** ve tarayıcı depolaması (Web Storage) üzerinden çalışan basit bir **yönetim (admin) ekranı** içerir.

## 2) Web sitesinin amacı ve hedef kullanıcıları

- **Amaç**: QR kod ile menüyü hızlıca görüntüleme; işletme tarafında (admin) menü ürünlerini tarayıcı üzerinden ekleyip güncelleyebilme.
- **Hedef kullanıcılar**:
  - **Müşteri**: Telefonda menüyü kategorilere göre hızlıca incelemek isteyen kullanıcı.
  - **İşletme personeli**: Menüye ürün eklemek/çıkarmak isteyen yönetici ya da yetkili personel.

## 6) Web sitesinin ana sayfaları (net açıklama)

- **`index.html` (Ana Menü / QR Menü)**:
  - Menü kategorilerini sekmelerle gösterir.
  - “Görüş Bildir” aksiyonu ile kullanıcıyı geri bildirim akışına yönlendirir.
  - Logo tıklaması üzerinden admin erişimi için PIN istemi açar.
- **`admin.html` (Yönetim Paneli)**:
  - Ürün ekleme arayüzü (modal/form) ile yeni ürünleri kaydeder.
  - Ürün görseli seçimi + görseli küçültme/sıkıştırma akışı bulunur.
- **`feedbacks.html` (Görüşler — lokal listeleme)**:
  - localStorage’a kaydedilmiş görüşleri listeler/siler.
  - Not: Ana akış Google Form’a yönleniyorsa bu sayfa çoğu senaryoda boş kalabilir (bkz. Bölüm 5 ve 8).

## Kullanılan teknolojiler

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
  - **Web Storage**: `localStorage` / `sessionStorage`
  - **File API**: `FileReader` (görsel okuma)
  - **Canvas**: görseli küçültme/sıkıştırma için `canvas.toDataURL`

### Harici bağımlılıklar (CDN)

- **Font Awesome 6.4.0** (ikonlar) — CDN üzerinden yüklenir.

## 3) CSS stil ve tasarım seçimleri

- **Yerleşim yaklaşımı**: Tek sayfa mantığında, kategori sekmeleri ile içerik gruplama (menüde hızlı tarama için).
- **Görsel hiyerarşi**: Ürün adı/fiyat gibi ana bilgiler öne çıkar; aksiyon butonları (ör. “Görüş Bildir”) belirgin konumlandırılır.
- **Tutarlılık**: Tüm sayfalarda tek bir `style.css` kullanılarak renkler, boşluklar ve buton stilleri aynı dilde tutulur.
- **Responsive hedefi**: Mobil öncelikli (QR menü senaryosu) bir kullanım hedeflendiği için küçük ekranlarda okunabilirlik ve dokunma alanları önemsenir.

### Tasarım sistemi (renkler, tipografi, ölçüler)

Aşağıdaki değerler doğrudan `style.css` içinden alınmıştır.

- **Renk paleti (CSS değişkenleri / `:root`)**
  - `--primary`: `#D35400`
  - `--secondary`: `#F39C12`
  - `--accent`: `#E67E22`
  - `--light`: `#FDEBD0`
  - `--dark`: `#7E5109`
  - `--success`: `#27ae60`
  - `--danger`: `#e74c3c`
- **Ek kullanılan sabit renkler**
  - Sayfa arka planı: `#f9f9f9`
  - Ana metin: `#333`
  - İkincil metin: `#666`
  - Form border: `#ddd`
  - İnce ayraç/border: `#eee`
  - QR placeholder arka plan: `#f1f1f1`
- **Arka plan/efekt**
  - Header gradient: `linear-gradient(135deg, var(--primary), var(--secondary))`
  - Sık kullanılan gölgeler: `rgba(0,0,0,0.08)` / `rgba(0,0,0,0.1)` / `rgba(0,0,0,0.2)`
- **Tipografi**
  - Font ailesi: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
  - Satır yüksekliği (body): `line-height: 1.6`
- **Önemli font boyutları (rem)**
  - Logo (`.logo`): `2.5rem`
  - Büyük buton (`.large-btn`): `1.05rem`
  - Standart buton (`.btn`): `1rem`
  - Küçük buton (`.btn.small`): `0.9rem`
  - Ürün başlığı (`.item-title`): `1.2rem`
  - Ürün açıklaması (`.item-desc`): `0.9rem`
  - Ürün fiyatı (`.item-price`): `1.1rem`
  - Admin ikon (`.admin-card i`): `2.5rem`
- **Yerleşim ve ölçüler (seçili)**
  - Konteyner genişliği (`.container`): `max-width: 1200px`
  - Ürün görsel yüksekliği (`.item-image`): `200px`
  - Grid kart min genişliği (menü): `minmax(300px, 1fr)`
  - QR alanı (`.qr-code`): `180px × 180px`
  - Mobil kırılım: `@media (max-width: 768px)` → menü ve admin grid tek kolona düşer

## 4) JavaScript kullanımı ve dinamik özellikler

- **Sekme/kategori etkileşimi**: Menü kategorileri arası geçiş dinamik olarak yönetilir.
- **Admin giriş koruması (istemci tarafı)**:
  - Ana sayfada logo tıklaması ile PIN sorulur.
  - Admin sayfasına doğrudan erişim için query parametresi desteklenir (bkz. “Admin” bölümü).
- **Ürün ekleme**:
  - Formdan alınan veriler doğrulanıp `localStorage`’a kaydedilir.
  - Görsel dosyası `FileReader` ile okunur, `canvas` ile yeniden boyutlandırılıp/sıkıştırılır; böylece depolama limitine takılma riski azaltılır.
- **Görüş listeleme/silme (lokal)**: `feedbacks.html` sayfası `localStorage`’daki görüş listesini okuyup UI’da gösterir ve silmeyi sağlar.

## 5) Veritabanı kullanımı veya veri işleme açıklaması

Bu projede **sunucu/veritabanı yoktur**. Kalıcılık tarayıcı üzerinden sağlanır:

- **Admin oturumu**: `sessionStorage` → `cookie.admin = "1"`
  - Sekme kapanınca temizlenir.
- **Menü verisi**: `localStorage` → `cookie.menu`
  - Tarayıcıda kalıcıdır (kullanıcı temizleyene kadar).
- **Görüşler (lokal)**: `localStorage` → `cookie.feedbacks`

Ek olarak, **harici Google Form** kullanılıyorsa görüşler tarayıcıya değil Google tarafına gider; bu durumda `cookie.feedbacks` alanı kullanılmayabilir.

## 7) Gezinme ve kullanıcı deneyimi (UX)

- **Basit gezinme**: Kullanıcı ana menüde kategori sekmeleriyle ilerler; sayfa içinde kaybolmadan içerik tarar.
- **Düşük öğrenme maliyeti**: QR menü senaryosunda kullanıcıdan uygulama indirimi ya da üyelik istenmez.
- **Hızlı aksiyonlar**:
  - “Görüş Bildir” butonu ile hızlı geri bildirim.
  - Admin tarafında ürün ekleme akışı tek ekranda tamamlanır.
- **Mobil öncelik**: Tipografi ve bileşen boyutları mobilde rahat kullanım hedefler.

## 8) Karşılaşılan zorluklar ve uygulanan çözümler

- **Tarayıcı depolama limiti (~5MB)**:
  - **Çözüm**: Ürün görselleri kaydedilmeden önce `canvas` ile küçültülüp/sıkıştırıldı.
  - **Etkisi**: localStorage limitine takılma ihtimali azaldı; yine de çok fazla ürün / yüksek çözünürlüklü görsel limit doldurabilir.
- **Gerçek kimlik doğrulama ihtiyacı**:
  - **Çözüm (demo kapsamı)**: PIN kontrolü istemci tarafında tutuldu.
  - **Not**: Üretim için backend + gerçek yetkilendirme gerekir.
- **Görüş akışının iki parçalı olması (Google Form vs lokal liste)**:
  - **Çözüm (mevcut durum)**: Google Form hızlı entegrasyon; lokal `feedbacks.html` ise alternatif/demo akış.
  - **Öneri**: Tek bir yaklaşım seçilip birleştirilmeli (tamamen Google Form veya tamamen lokal/DB tabanlı).

## Dosya yapısı

- **`index.html`**: Ana ekran (QR menü arayüzü)
- **`style.css`**: Tüm sayfaların stilleri
- **`main.js`**: Ana ekran etkileşimleri (sekme/menü/Google Form yönlendirmesi, admin giriş prompt’u)
- **`admin.html`**: Yönetim paneli (ürün ekleme modalı)
- **`admin.js`**: Admin guard + ürün ekleme ve `localStorage` kaydı (görsel sıkıştırma dahil)
- **`feedbacks.html`**: Görüş bildirimleri listeleme ekranı
- **`feedbacks.js`**: Görüşleri `localStorage`’dan okuma / silme

## Uygulamayı çalıştırma

### Yöntem 1 (en basit): Dosyayı aç

1. `index.html` dosyasını tarayıcıda aç.

> Not: Bazı tarayıcılarda yerel dosyadan açınca (`file://`) bazı yollar/istekler beklenmedik davranabilir. Bu durumda aşağıdaki lokal sunucu yöntemini kullan.

### Yöntem 2: Lokal sunucu ile çalıştır (önerilir)

Windows’ta proje klasöründe terminal açıp:

```bash
python -m http.server 5500
```

Sonra tarayıcıdan:

- `http://localhost:5500/index.html`

## Özellikler (mevcut)

### Menü görüntüleme

- Kategoriler sekmelerle gösterilir.
- Admin ekranından eklenen ürünler **sayfa yenilense bile** menüde görünür (tarayıcı depolamasına kaydedilir).

### Admin (Yönetim Paneli)

- **Admin PIN**: `2025`
- Giriş davranışı:
  - Ana sayfada üstteki logo tıklanınca PIN sorulur.
  - Doğrudan admin sayfasına girmek için: `admin.html?admin=2025`
- Ürün ekleme:
  - Ürünler `localStorage` içinde **`cookie.menu`** anahtarında tutulur.
  - Görseller cihazdan seçilir, **küçültülüp/sıkıştırılarak** kaydedilir (depolama limitine takılmamak için).

### Görüş bildirme

- Ana ekrandaki “Görüş Bildir” butonu şu an bir **Google Form** sayfasını yeni sekmede açacak şekilde ayarlı olabilir.
- `feedbacks.html` ekranı ise `localStorage` anahtarındaki **`cookie.feedbacks`** listesini okur; Google Form’a yönlendirilen senaryoda bu liste çoğu durumda boş kalabilir.

## Bilinen eksikler / teknik borçlar

- **Gerçek kimlik doğrulama yok**: PIN kontrolü tamamen istemci tarafında.
  - Üretim için uygun değildir; backend + gerçek auth gerekir.
- **Depolama limiti**:
  - `localStorage` genelde ~5MB civarında sınırlıdır.
  - Çok fazla ürün veya yüksek çözünürlüklü görsel yine limiti doldurabilir (uyarı verilir).
- **Görsellerin bir kısmı harici URL olabilir**:
  - İnternet yoksa bazı görseller görünmeyebilir.

## 9) GitHub kullanıcı adı ve herkese açık depo bağlantısı

- **GitHub kullanıcı adı**: `<BURAYA_GITHUB_KULLANICI_ADIN>`
- **Repo (public) linki**: `<BURAYA_REPO_LINKI>`

## 10) Genel organizasyon, dil kalitesi ve manuel gönderim notu

- Bu README, proje raporu formatında istenen maddeleri (2–10) karşılayacak şekilde düzenlenmiştir.
- Manuel teslim için:
  - Repoyu public yapıp linki yukarıya ekleyin.
  - `index.html` üzerinden çalıştığını (menü + admin ürün ekleme) kısa bir demo ile doğrulayın.

## Güvenlik notu

Bu proje bir demo/ödev yapısında olduğu için **admin PIN’i kod içinde açık** durur. Yayına alınacak bir projede bu yaklaşım kullanılmamalıdır.
