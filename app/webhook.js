const https = require('https');
const { alert, update } = require('../config.json');

const sleep = time => {
  return new Promise(r => setTimeout(r, time));
}

const sendMessage = async (url, message) => {
  const data = JSON.stringify(message);
  const request = https.request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  request.end(data);
  await sleep(1000);
};

module.exports = {

  sendPost: async (url, date, body) => {
    if (alert) {
      await sendMessage(url, {
        content: alert,
      });
    }

    await sendMessage(url, {
      content: `**${date}**\n${body}\n`,
      allowed_mentions: { parse: [] },
    });
  },

  sendUpdate: async (url, date, body) => {
    if (update) {
      await sendMessage(url, {
        content: update,
      });
    }

    await sendMessage(url, {
      content: `**Update to ${date}**\n${body}\n`,
      allowed_mentions: { parse: [] },
    });
  },

}
