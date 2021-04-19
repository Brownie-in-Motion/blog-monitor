const https = require('https');
const { alert } = require('../config.json');

const sendMessage = (url, message) => {
  const data = JSON.stringify(message);
  const request = https.request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  request.end(data);
};

module.exports = async (url, { date, body }) => {
  if (alert) {
    sendMessage(url, {
      content: 'New Eric update! @everyone',
    });
  }
  await new Promise(r => setTimeout(r, 1000));
  sendMessage(url, {
    content: `**${date}**\n${body}\n`,
    allowed_mentions: { parse: [] },
  });
};
