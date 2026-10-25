/* Scrape Downr.org By AhmadXyz
* Free Media Downloader
* Base Url: https://downr[.]org/
* Author: AhmadXyz
*/
const axios = require('axios');
const fs = require('fs');

async function downOrg(url) {
    const a = './cokuser.txt';
    const b = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://downr.org/'
    };
    try {
        await axios.post(
            'https://downr.org/.netlify/functions/analytics',
            null,
            { headers: b, withCredentials: true }
        );
        const c = await axios.post(
            'https://downr.org/.netlify/functions/bbc',
            { url },
            { headers: b }
        );

 
        
                      return c.data;
    } catch (e) {
        throw new Error(
            e.response?.data?.message ||
            e.message
        );
    } finally {
        if (fs.existsSync(a)) fs.unlinkSync(a);
    }
}

module.exports = downOrg;
