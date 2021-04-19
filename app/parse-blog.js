const https = require('https');

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      headers: { 'cache-control': 'no-cache' }
    }, (response) => {
      const data = [];
      response.on('data', (chunk) => { data.push(chunk); });
      response.on('end', () => { resolve(data.join('')); });
    });
    request.on('error', reject);
    request.end();
  });
}

const clean = (text) => {
  // extract body without newlines
  text = /<body>(.*)<\/body>/s.exec(text)[1]
    .replace(/<script>(.*)<\/script>/gs, '')
    .replace(/\n+/gs, ' ');

  // tag replacements
  [
    ['br', '\n'],
    ['li', '\n- '],
    ['.+?', '']
  ].forEach(([tag, value]) => {
    text = text.replace(new RegExp(
      `<${tag}> *`, 'g'
    ), value);
  });

  text = text.replace(/\n{2,}/g, '\n');

  return text;
}

const parsePosts = (text) => {
  const expression =
    /(\d{1,2}-\d{1,2}-\d{4})\s*(.+?)(?=(?:\s*\d{1,2}-\d{1,2}-\d{4})|$)/gs;
  const posts = [];
  let match; while (match = expression.exec(text)) {
    posts.push({
      date: match[1],
      body: match[2]
    });
  }
  return posts;
}

module.exports = async (url) => {
  const text = clean(await fetch(url));
  return parsePosts(text);
}
