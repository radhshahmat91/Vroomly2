const { Server } = require('socket.io');

let io = null;

/**
 * Called once from server.js after the HTTP server is created. Every
 * authenticated client joins a room named after their own user id right
 * after connecting, so the server can push a notification to exactly one
 * user with `io.to(userId).emit(...)`.
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      if (userId) socket.join(userId.toString());
    });

    socket.on('disconnect', () => {
      // no-op — rooms are cleaned up automatically by socket.io
    });
  });

  return io;
}

function getIO() {
  return io;
}

/** Safe to call even if socket.io hasn't been initialised (e.g. in tests). */
function emitToUser(userId, event, payload) {
  if (io && userId) {
    io.to(userId.toString()).emit(event, payload);
  }
}

module.exports = { initSocket, getIO, emitToUser };
