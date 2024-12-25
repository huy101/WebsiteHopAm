const WebSocket = require('ws');

module.exports = function(server) {
  // Tạo WebSocket server với đối tượng server
  const wss = new WebSocket.Server({ server });

  // Khi có client kết nối, thực thi đoạn mã dưới đây
  wss.on('connection', (ws) => {
    console.log('A client connected');
    
    // Lắng nghe các thông điệp từ client
    ws.on('message', (message) => {
      console.log('Received: %s', message);
      
      // Kiểm tra nếu message có chứa @Admin
      if (message.includes('@Admin')) {
        // Gửi thông báo tới client
        ws.send(JSON.stringify({ message: 'A comment mentions @Admin!' }));
      }
    });

    // Gửi thông báo khi client kết nối
    ws.send(JSON.stringify({ message: 'Welcome to WebSocket Server!' }));
  });
};
