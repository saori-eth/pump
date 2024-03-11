const LATEST_TOKEN_URL = "https://api2.pump.fun/coins/latest";
const TOKEN_URL = "https://api2.pump.fun/coins/";
const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1112248612420845728/MljNggyiyZWYPPf4QNMa4n6HI6fxZR_gMIbHzkc6il4cMY4r0yJs-EqJvN1lL5IT4P9j";

let tokenCache = [];

const getLatestMints = async () => {
  try {
    const response = await fetch(LATEST_TOKEN_URL);
    const data = await response.json();
    const { mint } = data;
    if (tokenCache.includes(mint)) return console.log("no new mints");
    tokenCache.push(mint);
    const mintResponse = await fetch(TOKEN_URL + mint);
    const mintData = await mintResponse.json();
    const { twitter_username } = mintData;
    if (!twitter_username)
      return console.log(`No twitter username for mint ${mint}`);
    console.log("twitter user: ", twitter_username);
    const { name, symbol, twitter, telegram, website } = mintData;

    // create message for twitter/tg/website if they are not null
    const socialsMessage = `
    ${twitter ? `Twitter: ${twitter}` : ""}
    ${telegram ? `Telegram: ${telegram}` : ""}
    ${website ? `Website: ${website}` : ""}
  `
      .split("\n")
      .map((s) => s.trim())
      .join("\n");

    const message = `
    **${name} (${symbol})** just minted!
    ${socialsMessage}
    URL: https://pump.fun/${mint}
  `;

    console.log(message);
    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

const clearCache = () => {
  tokenCache = [];
  console.log("Cleared token cache");
};

setInterval(getLatestMints, 5000);
setInterval(clearCache, 1000 * 60 * 15);
