module.exports = _useGoogleSearchAndGoto = async (page, searchStr, linkSelector) => {
  try {
    await page.goto(searchStr, { timeout: 0 });

    const link = await page.evaluate((linkSelector) => {
      const link = document.querySelector(linkSelector);

      return link.href
    }, linkSelector);

    console.log(`[NAVIGATING_TO]: ${link}`);

    await page.goto(link)

    return link;
  } catch (error) {
    console.log(`[INTERNAL_SERVER_ERROR]: ${error}`);

    return {};
  }
}