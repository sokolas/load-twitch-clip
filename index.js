const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

async function loadClip(clipUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const video = new Promise((resolve, reject) => {
        page.on('request', (request) => {
            if (request.url().startsWith('https://production.assets.clips.twitchcdn.net')) {
                resolve(request.url());
            }
        })
    });
    await page.goto(clipUrl);
    const title = await page.title();
    const url = await video;
    console.log(url);
    const data = await fetch(url);
    const buffer = await data.buffer();
    await browser.close();
    return {title, buffer};
}

(async () => {
    const {title, buffer} = await loadClip('https://www.twitch.tv/billi777hard/clip/PoliteInquisitiveMageResidentSleeper-tCcbP3PtBNiHFp04');
    fs.writeFileSync(title + '.mp4', buffer);
})();