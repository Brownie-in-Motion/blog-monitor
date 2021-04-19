const fs = require('fs');

const parseBlog = require('./parse-blog');
const sendPost = require('./send-post');

const writeState = (state) => {
  fs.writeFileSync('./state.json', JSON.stringify(state));
}

const checkPosts = async (state, blogUrl, webhookUrl) => {
  const currentPosts = await parseBlog(blogUrl);
  currentPosts.reverse();
  for (const post of currentPosts) {
    if (! state.has(post.date)) {
      console.log(`New post found: ${post.date}`);
      sendPost(webhookUrl, post);
      state.add(post.date);
      writeState(Array.from(state));
      await new Promise(r => setTimeout(r, 1000));
    }
  }

};

const { blogUrl, webhookUrl } = require('./config.json');

(async () => {

  let state;
  try {
    const data = fs.readFileSync('./state.json');
    state = new Set(JSON.parse(data));
  } catch {
    const posts = (await parseBlog(blogUrl)).map(post => post.date)
    writeState(posts);
    state = new Set(posts);
  }

  setInterval(() => {
    checkPosts(state, blogUrl, webhookUrl)
  }, 60 * 60 * 1000);

})();
