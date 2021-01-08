module.exports = _usePuppeteer = async () => {
  let chrome = {};
  let puppeteer;

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    // running on the Vercel platform.
    chrome = require('chrome-aws-lambda');
    puppeteer = require('puppeteer-core');
  } else {
    // running locally.
    puppeteer = require('puppeteer');
  }

  if (!chrome) {
    chrome.args = {}
  }

  let browser = await puppeteer.launch({
    args: [...chrome.args || [], '--hide-scrollbars', '--disable-web-security', '--lang=pt-BR'],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true, // true for production
    ignoreHTTPSErrors: true,
    // product: 'chrome'
  });

  return browser;
}