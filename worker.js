export default {
  async fetch(request, env) {
    // 这里的 ASSETS 是我们在 wrangler.toml 里定义的静态资源绑定
    // 它的作用是：直接返回 dist 目录下的网页文件
    return await env.ASSETS.fetch(request);
  }
};