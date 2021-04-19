const https = require('https');

module.exports = (url, { date, body }) => {
  const data = JSON.stringify({
    'content': `**${date}**\n${body}\n`,
    'allowed_mentions': { 'parse': [] }
  });
  const request = https.request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  });
  request.write(data);
  request.end();
};
