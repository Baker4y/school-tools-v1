export default {
  async fetch(request, env) {
    // 1. 从后台环境变量获取正确的密码
    const correctPassword = env.SCHOOL_PASSWORD;

    // 如果后台没设置密码变量，直接放行（防止你自己被锁在外面）
    if (!correctPassword) {
      return await env.ASSETS.fetch(request);
    }

    // 2. 获取浏览器发送的认证信息 (Authorization Header)
    const authHeader = request.headers.get("Authorization");

    // 3. 如果没有认证信息，或者认证格式不对，就告诉浏览器：“我要弹窗！”
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response("请登录", {
        status: 401, // 401 状态码会触发浏览器弹窗
        headers: {
          // 这个 Header 是触发弹窗的关键
          "WWW-Authenticate": 'Basic realm="School Admin Area"'
        }
      });
    }

    // 4. 解码用户输入的内容
    // 浏览器发过来的是 Base64 编码的 "用户名:密码" 字符串
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials); // 解码
    const [username, password] = credentials.split(":"); // 分割出用户名和密码

    // 5. 比对密码
    // 这里我们只检查密码，用户名随便填什么都行（或者你可以指定必须是 admin）
    if (password !== correctPassword) {
      return new Response("密码错误，请重试", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="School Admin Area"' }
      });
    }

    // 6. 密码正确，放行！
    return await env.ASSETS.fetch(request);
  }
};
