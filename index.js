const LATEST_TOKEN_URL = "https://client-api.pump.fun/trades/latest";
const TOKEN_URL = "https://client-api.pump.fun/coins/";
const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1112248612420845728/MljNggyiyZWYPPf4QNMa4n6HI6fxZR_gMIbHzkc6il4cMY4r0yJs-EqJvN1lL5IT4P9j";
const DEV_DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1111165240537776149/GFqkG1WoPu7q5OJzDz6mKyJZA5BzZ2JXm-Uon6QI1VP5VqhKZ9FJFXM47jyuDKKYbRgA";

let prevToken = "";

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
    if (mint === prevToken) return console.log("No new mints");
    prevToken = mint;
    const mintResponse = await fetch(TOKEN_URL + mint);
    const mintData = await mintResponse.json();
    console.log(mintData);
    const { twitter_username, description, image_uri } = mintData;
    if (!checkDescription(description))
      return console.log(`No social presence for ${name} token`);
    const info = {
      name,
      symbol,
      mint,
      twitter,
      telegram,
      website,
      twitter_username,
      description,
      image_uri,
    };

    message(info);
  } catch (error) {
    console.log(error);
  }
};

const checkDescription = (description) => {
  const regex = /followers|following|follower|follow|tiktok|instagram/i;
  return regex.test(description);
};

const message = (info) => {
  const {
    symbol,
    mint,
    twitter,
    telegram,
    website,
    twitter_username,
    description,
    image_uri,
  } = info;

  const image = image_uri ? `![image](${image_uri})` : "";

  let socialsMessage = [];
  if (twitter) socialsMessage.push(`[Twitter](${twitter})`);
  if (telegram) socialsMessage.push(`[Telegram](${telegram})`);
  if (website) socialsMessage.push(`[Website](${website})`);

  const socialsString = socialsMessage.join("\n");

  const message = `
---
**${symbol}** token just minted!
description: ${description}
---
${
  twitter_username
    ? `[Creator: @${twitter_username}](https://twitter.com/${twitter_username})`
    : "Unknown creator"
}
${socialsString ? `${socialsString}` : "No socials"}
[Buy](https://pump.fun/${mint})
---
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

setInterval(getLatestMints, 5000);
