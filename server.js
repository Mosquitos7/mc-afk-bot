const mineflayer = require('mineflayer');
const http = require('http');

// ----- MINECRAFT SUNUCU AYARLARI -----
const SUNUCU_IP = 'play.capenw.org'; 
const SUNUCU_PORT = 25565;          
const SURUM = '1.20.1';             
const SIFRE = 'capew9289_fd3'; // Hesapların ortak şifresi

// AFK Kalacak 10 Hesabın Yeni İsim Listesi
const HESAPLAR = [
    'AFK_Mosquitos7_1', 'AFK_Mosquitos7_2', 'AFK_Mosquitos7_3', 'AFK_Mosquitos7_4', 'AFK_Mosquitos7_5',
    'AFK_Mosquitos7_6', 'AFK_Mosquitos7_7', 'AFK_Mosquitos7_8', 'AFK_Mosquitos7_9', 'AFK_Mosquitos7_10'
];

// ----- BOTLARI BAŞLATMA FONKSİYONU -----
function botOlustur(username) {
    const bot = mineflayer.createBot({
        host: SUNUCU_IP,
        port: SUNUCU_PORT,
        username: username,
        version: SURUM
    });

    bot.on('spawn', () => {
        console.log(`${username} başarıyla sunucuya bağlandı.`);
        
        // İlk kez girecekleri için oyuna adım attıktan 3 saniye sonra otomatik kayıt olurlar
        setTimeout(() => {
            bot.chat(`/register ${SIFRE} ${SIFRE}`);
            console.log(`${username} için /register komutu gönderildi.`);
        }, 3000);
        
        // Anti-AFK: Sunucudan atılmamak için her 30 saniyede bir zıplar
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 30000);
    });

    // Sunucudan gelen mesajları Render "Logs" panelinde canlı görmek için:
    bot.on('message', (jsonMsg) => {
        const mesaj = jsonMsg.toString().trim();
        if (mesaj) {
            console.log(`[SUNUCU ICI CHAT - ${username}]: ${mesaj}`);
        }
    });

    // Bot sunucudan düşerse otomatik geri bağlanır
    bot.on('end', () => {
        console.log(`${username} sunucudan düştü. 15 saniye sonra tekrar bağlanıyor...`);
        setTimeout(() => botOlustur(username), 15000);
    });

    bot.on('error', (err) => console.log(`${username} Hatası:`, err));
}

// 10 botun hepsini sırayla başlat
HESAPLAR.forEach((hesap, index) => {
    setTimeout(() => {
        botOlustur(hesap);
    }, index * 7000); // Sunucu bot korumasına takılmamak için 7'şer saniye arayla girerler
});

// Render platformunun kapanmaması için sahte web sunucusu
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('CapeNW AFK Botlari Aktif!\n');
}).listen(process.env.PORT || 3000);
