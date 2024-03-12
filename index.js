const LATEST_TOKEN_URL = "https://api2.pump.fun/coins/latest";
const TOKEN_URL = "https://api2.pump.fun/coins/";
const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1111165240537776149/GFqkG1WoPu7q5OJzDz6mKyJZA5BzZ2JXm-Uon6QI1VP5VqhKZ9FJFXM47jyuDKKYbRgA";

let tokenCache = [];

const testInfo = {
  name: "Test Token",
  symbol: "TEST",
  mint: "123456",
  twitter: "https://twitter.com/test",
  telegram: "https://t.me/test",
  website: "https://test.com",
  twitter_username: "test",
};

const getLatestMints = async () => {
  try {
    const response = await fetch(LATEST_TOKEN_URL);
    const data = await response.json();
    const { name, symbol, mint, twitter, telegram, website } = data;
    if (tokenCache.includes(mint)) return console.log("no new mints");
    tokenCache.push(mint);
    const mintResponse = await fetch(TOKEN_URL + mint);
    const mintData = await mintResponse.json();
    const { twitter_username } = mintData;
    if (!twitter_username && !twitter && !telegram && !website)
      return console.log(`No socials for ${name} token`);
    const info = {
      name,
      symbol,
      mint,
      twitter,
      telegram,
      website,
      twitter_username,
    };
    message(info);
  } catch (error) {
    console.log(error);
  }
};

const message = (info) => {
  const { symbol, mint, twitter, telegram, website, twitter_username } = info;
  let socialsMessage = [];
  if (twitter) socialsMessage.push(`Twitter: ${twitter}`);
  if (telegram) socialsMessage.push(`Telegram: ${telegram}`);
  if (website) socialsMessage.push(`Website: ${website}`);

  const socialsString = socialsMessage.join("\n");

  const message = `
  **${symbol}** token just minted!
  ${
    twitter_username
      ? `Twitter user: https://twitter.com/${twitter_username}`
      : ""
  }
  ${socialsString ? `${socialsString}` : ""}
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
};

const clearCache = () => {
  tokenCache = [];
  console.log("Cleared token cache");
};

setInterval(getLatestMints, 5000);
setInterval(clearCache, 1000 * 60 * 15);