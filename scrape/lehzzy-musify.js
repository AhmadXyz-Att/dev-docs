/*
 * Scraper LehzzMusify
 *
 * Base URL : https://lehzzmusify.vercel.app
 * Request  : Rasyad
 * Author   : AhmadXyz
 * Type     : Website API Scraper
 */

const axios = require('axios');
const readline = require('readline/promises');
const fs = require('fs/promises');
const path = require('path');

async function all() {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
const lehzz = 'https://lehzzmusify.vercel.app';
const fukunexora = 'https://api.fuku.eu.cc/api/ytmp3';
const apikeyawak = 'fukuxyzxxxx'; // ganti key ini dan ambil di https://api.fuku.eu.cc
const hasil = '/tmp/';
const abc = path.join(process.cwd(), 'lehzz-data');
const fav = path.join(abc, 'favorites.json');

const arts = [
    'The Weeknd', 'Taylor Swift', 'Billie Eilish',
    'Bruno Mars', 'Olivia Rodrigo', 'Tulus',
    'Sheila On 7', 'NIKI', 'Ed Sheeran', 'Hindia'
];
const albums = [
    'After Hours', 'Midnights', 'HIT ME HARD AND SOFT',
    '24K Magic', 'GUTS', 'Monokrom',
    'Kisah Klasik Untuk Masa Depan', 'Nicole',
    'Menari Dengan Bayangan'
];

const genres = [
    'Pop', 'Synth-Pop', 'Indie', 'R&B',
    'Pop Rock', 'Hits Indonesia', 'Lo-Fi Chill',
    'Akustik Santai'
];

const ask = async (question) => {
    return (await rl.question(question)).trim();
};

const request = async (url, params = {}) => {
    const { data } = await axios.get(url, {
        params,
        timeout: 30000,
        headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
    });

    return data;
};

const getTracks = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.tracks)) return data.tracks;
    if (Array.isArray(data?.result)) return data.result;
    return [];
};
const search = async (query) => {
    const data = await request(`${lehzz}/api/search`, { q: query });
    return getTracks(data);
};
const getFavorites = async () => {
    try {
        return JSON.parse(await fs.readFile(fav, 'utf8'));
    } catch {
        return [];
    }
};
const saveFavorites = async (favorites) => {
    await fs.writeFile(fav, JSON.stringify(favorites, null, 2));
};
const download = async (song) => {
    const youtubeId = song.youtubeId;
    const audioUrl = song.audioUrl;

    const url = youtubeId
        ? `https://www.youtube.com/watch?v=${youtubeId}`
        : audioUrl;

    if (!url) {
        console.log('URL lagu tidak tersedia.');
        return;
    }

    console.log('\nMemproses download...');

    const data = await request(fukunexora, {
        api: apikeyawak,
        url
    });

    if (!data.status || !data.result?.download) {
        console.log('Gagal mendapatkan link download.');
        return;
    }

    const filename = `${data.result.filename || 'audio'}.mp3`;
    const safeName = path.basename(filename).replace(/[<>:"/\\|?*]/g, '_');

    await fs.mkdir(hasil, { recursive: true });

    const response = await axios.get(data.result.download, {
        responseType: 'arraybuffer',
        timeout: 120000,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const buffer = Buffer.from(response.data);

    if (!buffer.length || buffer.toString('utf8', 0, 15).includes('<!DOCTYPE')) {
        console.log('File yang diterima bukan audio yang valid.');
        return;
    }
    const filePath = path.join(hasil, safeName);
    await fs.writeFile(filePath, buffer);

    console.log(`Berhasil disimpan: ${filePath}`);
};
const lyrics = async (song) => {
    const data = await request(`${lehzz}/api/lyrics`, {
        track: song.title,
        artist: song.artist,
        duration: Math.round(song.duration || 0)
    });
    const text = data.syncedLyrics || data.plainLyrics;

    console.log(text || 'Lirik tidak ditemukan.');
};
const trackMenu = async (song) => {
    while (true) {
        console.log('\n------------------');
        console.log(`Judul : ${song.title}`);
        console.log(`Artis : ${song.artist}`);
        console.log('--------------------');
        console.log('1. Download MP3');
        console.log('2. Lihat lirik');
        console.log('3. Tambahkan favorit');
        console.log('0. Kembali');

        const choice = await ask('Pilih: ');

        try {
            if (choice === '1') {
                await download(song);
            } else if (choice === '2') {
                await lyrics(song);
            } else if (choice === '3') {
                const favorites = await getFavorites();

                if (favorites.some(item => item.id === song.id)) {
                    console.log('Lagu sudah ada di favorit.');
                } else {
                    favorites.push(song);
                    await saveFavorites(favorites);
                    console.log('Berhasil ditambahkan ke favorit.');
                }
            } else if (choice === '0') {
                return;
            } else {
                console.log('Pilihan tidak valid.');
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
};

const showTracks = async (tracks) => {
    if (!tracks.length) {
        console.log('Lagu tidak ditemukan.');
        return;
    }

    console.log('');

    tracks.forEach((song, index) => {
        console.log(`${index + 1}. ${song.title} - ${song.artist}`);
    });

    const choice = await ask('\nPilih lagu (0 kembali): ');
    const index = Number(choice) - 1;

    if (choice === '0') return;

    if (!Number.isInteger(index) || index < 0 || index >= tracks.length) {
        console.log('Pilihan tidak valid.');
        return;
    }

    await trackMenu(tracks[index]);
};

const browse = async (type, items) => {
    console.log('');

    items.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
    });

    const choice = await ask('\nPilih (0 kembali): ');
    const index = Number(choice) - 1;

    if (choice === '0') return;

    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
        console.log('Pilihan tidak valid.');
        return;
    }

    const selected = items[index];

    console.log(`\nMencari ${type}: ${selected}`);

    const tracks = await search(selected);
    await showTracks(tracks);
};

const dailyFeed = async () => {
    const data = await request(`${lehzz}/api/feed`);

    console.log('\n1. Pagi');
    console.log('2. Siang');
    console.log('3. Sore');
    console.log('4. Malam');

    const choice = await ask('Pilih waktu: ');

    const slots = {
        '1': 'pagi',
        '2': 'siang',
        '3': 'sore',
        '4': 'malam'
    };

    const slot = slots[choice];

    if (!slot) {
        console.log('Pilihan tidak valid.');
        return;
    }

    await showTracks(data[slot] || []);
};

const searchMenu = async () => {
    const query = await ask('Masukkan judul lagu/artis: ');

    if (!query) return;

    console.log('Mencari lagu...');

    await showTracks(await search(query));
};

const favoritesMenu = async () => {
    const favorites = await getFavorites();

    if (!favorites.length) {
        console.log('Belum ada lagu favorit.');
        return;
    }

    await showTracks(favorites);
};

try {
    await fs.mkdir(abc, { recursive: true });
    await fs.mkdir(hasil, { recursive: true });

    while (true) {
        console.log('\n--------------------------');
        console.log('       LEHZZ MUSIFY CLI');
        console.log('-----------------');
        console.log('1. Rekomendasi harian');
        console.log('2. Cari lagu');
        console.log('3. Artis populer');
        console.log('4. Album populer');
        console.log('5. Genre & Mood');
        console.log('6. Favorit');
        console.log('7. Folder musik');
        console.log('0. Keluar');
        console.log('================================');

        const choice = await ask('Pilih menu: ');

        try {
            switch (choice) {
                case '1':
                    await dailyFeed();
                    break;
                case '2':
                    await searchMenu();
                    break;
                case '3':
                    await browse('Artis', arts);
                    break;
                case '4':
                    await browse('Album', albums);
                    break;
                case '5':
                    await browse('Genre', genres);
                    break;
                case '6':
                    await favoritesMenu();
                    break;
                case '7':
                    console.log(`\nLokasi: ${hasil}`);
                    console.log(await fs.readdir(hasil));
                    break;
                case '0':
                    console.log('Keluar dari LehzzMusify CLI.');
                    return;
                default:
                    console.log('Pilihan tidak valid.');
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
} finally {
    rl.close();
}

}

all();
