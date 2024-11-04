const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

let shapes = {};
const client = new Colyseus.Client('ws://localhost:3000');
let room;

async function init() {
    room = await client.joinOrCreate("game_room");

    room.onMessage("shapeCreated", ({ clientId, shapeData }) => {
        if (clientId !== room.sessionId) {
            const extrudedShape = create3DShape(shapeData.path, shapeData.height);
            shapes[clientId] = extrudedShape;
        }
    });

    room.onMessage("shapeMoved", ({ clientId, position }) => {
        if (shapes[clientId]) {
            shapes[clientId].position = new BABYLON.Vector3(position.x, position.y, position.z);
        }
    });
}

function create3DShape(path, height) {
    const shape = BABYLON.MeshBuilder.ExtrudePolygon("shape", { shape: path, depth: height }, scene);
    shape.position.y = height / 2;
    return shape;
}

function sendShapeData(path, height) {
    room.send("createShape", { path, height });
}

function sendMoveData(position) {
    room.send("moveShape", position);
}

scene.onPointerDown = function () {
    // Define 2D shape
    const path = [
        new BABYLON.Vector3(-1, 0, -1),
        new BABYLON.Vector3(1, 0, -1),
        new BABYLON.Vector3(1, 0, 1),
        new BABYLON.Vector3(-1, 0, 1)
    ];
    const height = 1;

    const extrudedShape = create3DShape(path, height);
    extrudedShape.position = new BABYLON.Vector3(0, height / 2, 0);
    shapes[room.sessionId] = extrudedShape;

    sendShapeData(path, height);
};

scene.onBeforeRenderObservable.add(() => {
    if (shapes[room.sessionId]) {
        const moveVector = new BABYLON.Vector3(0, 0, -0.02);
        shapes[room.sessionId].position.addInPlace(moveVector);
        sendMoveData(shapes[room.sessionId].position);
    }
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());

init();
