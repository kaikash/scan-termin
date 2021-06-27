const sleep = require("sleep-promise");
const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");

const config = require("./config");

const bot = new TelegramBot(config.token, { polling: true });

const scan = async (date) => {
  let res = await fetch(
    "https://appointment.bmeia.gv.at/?fromSpecificInfo=True",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "ru,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        pragma: "no-cache",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="90", "Yandex";v="90"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "upgrade-insecure-requests": "1",
        // cookie: "ASP.NET_SessionId=ozkcdaxrglzws0fbs3wgpqbj",
      },
      referrer: "https://appointment.bmeia.gv.at/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: "Language=ru&Office=MOSKAU&CalendarId=181&PersonCount=1&Command=%D0%B4%D0%B0%D0%BB%D1%8C%D1%88%D0%B5",
      method: "POST",
      mode: "cors",
    }
  );
  let text = await res.text();
  return text.indexOf(date) > -1;
};

const run = async () => {
  let iter = 0;
  while (true) {
    if (iter++ % 100 == 0) {
      console.log(`Check iteration number ${iter}`);
    }
    if (await scan(config.date)) {
      console.log("found");
      await bot.sendMessage(
        config.chatId,
        `Found date ${config.date}, go to https://appointment.bmeia.gv.at/?Office=Moskau`
      );
    }
    await sleep(3000);
  }
};

run();
