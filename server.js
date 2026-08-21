const mineflayer = require('mineflayer');
const http = require('http');

// ----- MINECRAFT SUNUCU AYARLARI -----
const SUNUCU_IP = 'play.capenw.org'; 
const SUNUCU_PORT = 25565;          
const SIFRE = 'capew9289_fd3'; 

// Botların isim listesi
const HESAPLAR = [
    'AFK_Mosquitos7_1', 'AFK_Mosquitos7_2', 'AFK_Mosquitos7_3', 'AFK_Mosquitos7_4', 'AFK_Mosquitos7_5',
    'AFK_Mosquitos7_6', 'AFK_Mosquitos7_7', 'AFK_Mosquitos7_8', 'AFK_Mosquitos7_9', 'AFK_Mosquitos7_10'
];

function botOlustur(username) {
    const bot = mineflayer.createBot({
        host: SUNUCU_IP,
        port: SUNUCU_PORT,
        username: username,
        // Sürümü otomatik seçmeye bırakıyoruz (Sunucu lobisi kaç istiyorsa ona uyum sağlar)
        autoVersion: true, 
        // Gerçekçi görünmek için sunucu listesindeki ping verilerini simüle eder
        pingPackets: true 
    });

    bot.on('spawn', () => {
        console.log(`[BAŞARILI] ${username} sunucuya girdi.`);
        
        // Sunucu korumasını şüphelendirmemek için süre 5 saniyeye çıkarıldı
        setTimeout(() => {
            bot.chat(`/register ${SIFRE} ${SIFRE}`);
            bot.chat(`/login ${SIFRE}`); 
            console.log(`[KOMUT] ${username} şifre işlemleri yapıldı.`);
        }, 5000);
        
        // Anti-AFK zıplama mekanizması
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 35000);
    });

    bot.on('message', (jsonMsg) => {
        const mesaj = jsonMsg.toString().trim();
        if (mesaj) console.log(`[CHAT - ${username}]: ${mesaj}`);
    });

    // Bağlantı reddedilirse veya düşerse bekleme süresini 30 saniyeye çekiyoruz (IP ban yememek için)
    bot.on('end', (reason) => {
        console.log(`[AYRILDI] ${username} çıktı. Sebep: ${reason}. 30 saniye sonra denenecek...`);
        setTimeout(() => botOlustur(username), 30000);
    });

    bot.on('error', (err) => {
        console.log(`[HATA] ${username} bağlantı kuramadı: ${err.message}`);
    });
}

// Bot giriş aralığını 25 saniyeye çıkartarak sunucu korumasını (DDOS filtresini) bypass ediyoruz
HESAPLAR.forEach((hesap, index) => {
    setTimeout(() => {
        botOlustur(hesap);
    }, index * 25000); 
});

// Render Web sunucusu ayarı
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('CapeNW AFK Sistemi Aktif!\n');
}).listen(process.env.PORT || 3000);
