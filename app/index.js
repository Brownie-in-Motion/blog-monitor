const fs = require('fs');
const crypto = require('crypto');

const parseBlog = require('./parse-blog');
const { sendPost, sendUpdate } = require('./webhook');

const md5 = data => {
  return crypto.createHash('md5')
    .update(data).digest('hex');
};

const writeState = state => {
  fs.writeFileSync('./state.json', JSON.stringify([...state], null, 2));
};

const checkPosts = async (state, blogUrl, webhookUrl) => {
  const currentPosts = await parseBlog(blogUrl);
  currentPosts.reverse();
  for (const { date, body } of currentPosts) {
    if (state.get(date) === md5(body)) continue;
    if (!state.has(date)) {
      console.log(`New post found: ${date}`);
      await sendPost(webhookUrl, date, body);
    } else {
      console.log(`Update found: ${date}`);
      await sendUpdate(webhookUrl, date, body);
    }
    state.set(date, md5(body));
    writeState(state);
  }
};

const { blogUrl, webhookUrl, interval } = require('../config.json');

(async () => {

  let state;
  try {
    const data = fs.readFileSync('./state.json');
    state = new Map(JSON.parse(data));
  } catch {
    state = new Map((await parseBlog(blogUrl)).map(
      ({ date, body }) => [ date, md5(body) ]
    ));
    writeState(state);
  }

  checkPosts(state, blogUrl, webhookUrl);

  setInterval(() => {
    checkPosts(state, blogUrl, webhookUrl);
  }, interval ?? 60 * 60 * 1000);

})();
