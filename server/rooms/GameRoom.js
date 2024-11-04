const { Room } = require('colyseus');

class GameRoom extends Room {
  onCreate(options) {
    // Define state and handle messages
    this.setState({
      players: {},
      shapes: {}
    });
    // Example message handlers
    this.onMessage("createShape", (client, shapeData) => {
      this.state.shapes[client.sessionId] = {
        ...shapeData,
        position: { x: 0, y: 0, z: 0 }
      };
      this.broadcast("shapeCreated", { clientId: client.sessionId, shapeData });
    });

    this.onMessage("moveShape", (client, position) => {
      if (this.state.shapes[client.sessionId]) {
        this.state.shapes[client.sessionId].position = position;
        this.broadcast("shapeMoved", { clientId: client.sessionId, position });
      }
    });
  }

  onJoin(client) {
    this.state.players[client.sessionId] = { connected: true };
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
  }
}

module.exports = GameRoom;
