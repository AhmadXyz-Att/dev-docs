/*
 * Scrape YouTube Downloader By AhmadXyz
 *
 * Base URL : https://lunee.lol/y
 * Author   : AhmadXyz
 * Language : JavaScript (Node.js)
 * Browser  : Google Chrome
 * Engine   : Puppeteer Real Browser
 *
 * Features:
 * - YouTube URL input
 * - Browser automation
 * - API request & response capture
 * - JSON result storage
 *
 * Requirements:
 * - Node.js
 * - puppeteer-real-browser
 * - Google Chrome
 *
 * Note:
 * - Tidak kompatibel langsung dengan konfigurasi default Vercel.
 * - Disarankan menggunakan VPS Linux.
 * - Gunakan sesuai ketentuan layanan situs terkait.
 *
 * Copyright (c) 2026 AhmadXyz
 */
const { connect } = require('puppeteer-real-browser');
const fs = require('fs');
const readline = require('readline/promises');

(async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let browser;

    try {
        const url = (await rl.question('Coba masukkan url yt: ')).trim();

        if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
            throw new Error('itu bukan url yutub');
        }

        rl.close();
        const { browser: connectedBrowser, page } = await connect({
            headless: false,
            turnstile: true,
            fingerprint: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        browser = connectedBrowser;

        let captured = null;
        let responseResult = null;

        page.on('request', req => {
            if (
                req.url().includes('/api/ytdl/info') &&
                req.method() === 'POST'
            ) {
                const headers = req.headers();

                captured = {
                    timestamp: headers['x-lune-timestamp'] || null,
                    signature: headers['x-lune-signature'] || null,
                    body: req.postData() || null
                };           
            }
        });

        page.on('response', async res => {
            if (res.url().includes('/api/ytdl/info')) {
                try {
                    const body = await res.text();

                    responseResult = {
                        status: res.status(),
                        ok: res.ok(),
                        body
                    };                   
                    console.log('Status:', responseResult.status);
                    console.log('hasill:', body.slice(0, 1000));
                } catch (err) {
                    console.log('eror wak:', err.message);
                }
            }
        });       
        await page.goto('https://lunee.lol/y', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });
        console.log('bntr lagi ada proses challenge');
        await page.waitForFunction(
            () =>
                !document.title.includes('Just a moment') &&
                !document.title.includes('Attention Required'),
            { timeout: 60000 }
        );        
        await new Promise(resolve => setTimeout(resolve, 3000));

        const inputSelector = await page.evaluate(() => {
            const inputs = Array.from(
                document.querySelectorAll('input')
            );

            const candidate = inputs.find(input =>
                ['url', 'text', 'search'].includes(input.type) &&
                /url|youtube|link|paste/i.test(input.placeholder || '')
            ) || inputs.find(input =>
                ['url', 'text', 'search'].includes(input.type)
            );

            if (!candidate) return null;

            candidate.setAttribute('data-autotest', '1');
            return 'input[data-autotest="1"]';
        });

        if (!inputSelector) {
            throw new Error('gk nemu.');
        }

        await page.locator(inputSelector).fill(url);
        await page.keyboard.press('Enter');
        for (let i = 0; i < 60; i++) {
            if (responseResult) break;

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!captured && !responseResult) {
            console.log('Request-nya gak ketankep.');
            return;
        }

        const hasil = {
            url,
            timestamp: captured?.timestamp || null,
            signature: captured?.signature || null,
            requestBody: captured?.body || null,
            response: responseResult,
            waktu: new Date().toISOString()
        };

        fs.writeFileSync(
            '/tmp/hasilnya.json',
            JSON.stringify(hasil, null, 2),
            'utf8'
        );

        console.log('\nBeres');
        console.log('File hasil: /tmp/hasilnya.json');

        if (!responseResult) {
            console.log('Request ketangkep, tapi responsnya belum diterima cuki.');
        } else {
            console.log('Status API:', responseResult.status);
        }

    } catch (err) {
        console.error('\nerorr:', err.message);
    } finally {
        rl.close();

        if (browser) {
            await browser.close().catch(() => {});
        }
    }
})();
