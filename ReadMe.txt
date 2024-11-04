This is a multiplayer game built with BabylonJS and ColyseusJS where players can:
    Draw 2D shapes.
    Extrude those shapes into 3D objects.
    Move these 3D objects around a shared space.
    See other players' shapes and movements in real-time.

How It Works
    Client-Side:
        Uses BabylonJS to create a 3D environment where users can draw and extrude 2D shapes.
        Connects to the Colyseus server to send and receive updates on each player’s shape and position.

    Server-Side:
        ColyseusJS manages rooms and synchronizes player states across clients.
        ShapeRoom.js defines the game logic for handling player connections, shape creation, and movement.

Project Files

    server/index.js: Main server file that sets up the Express server, initializes Colyseus, and defines the game room (ShapeRoom).
    server/rooms/ShapeRoom.js: Colyseus room for handling player shapes and movement updates.
    client/index.html: HTML file to load the BabylonJS and Colyseus client libraries and initialize the game.
    client/js/main.js: Entry point for initializing the client game environment. BabylonJS setup for 3D scene, shapes, and player movements.