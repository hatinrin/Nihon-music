const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Sessiz çökmeleri engellemek için donanım hızlandırmasını kapatıyoruz
app.disableHardwareAcceleration();

console.log("1. Fowalink motoru ısınıyor...");

function createWindow () {
  console.log("2. Pencere yaratılıyor...");
  const win = new BrowserWindow({
    width: 450,
    height: 800,
    minWidth: 350,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/logo.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.setMenuBarVisibility(false);
  
  // --- YENİ EKLENEN KISIM: LİNKLERİ DIŞARIDA AÇMA ---
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Linki bilgisayarın varsayılan tarayıcısında (Chrome, Edge vb.) açar
    shell.openExternal(url);
    // Electron'un uygulamanın içinde yeni bir pencere açmasını engeller
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    // Sadece http veya https ile başlayan dış linkleri yakalar ve dışarı atar
    if (url.startsWith('http://') || url.startsWith('https://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  // --------------------------------------------------
  
  console.log("3. index.html yükleniyor...");
  win.loadFile('index.html').then(() => {
      console.log("4. Fowalink başarıyla açıldı!");
  }).catch(err => {
      console.error("HATA: index.html bulunamadı! Dosya adını kontrol et.", err);
  });
}

app.whenReady().then(() => {
    console.log("Sistem hazır!");
    createWindow();
}).catch(err => {
    console.error("Başlatma Hatası:", err);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});