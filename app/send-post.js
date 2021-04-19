const https = require('https');

const sendMessage = (url, message) => {
  const data = JSON.stringify(message)
  const request = https.request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  });
  request.end(data);
}

module.exports = (url, { date, body }) => {
  sendMessage(url, {
    'content': 'New Eric update! @everyone'
  });
  sendMessage(url, {
    'content': `**${date}**\n${body}\n`,
    'allowed_mentions': { 'parse': [] }
  });
};
