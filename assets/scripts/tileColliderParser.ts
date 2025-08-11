import { _decorator, Component, JsonAsset, Node, PhysicsSystem2D, EPhysics2DDrawFlags, resources, TiledMap, BoxCollider2D, Vec2, CircleCollider2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("tileColliderParser")
export class tileColliderParser extends Component {
  protected onLoad(): void {
    // 显示碰撞体
    if (PhysicsSystem2D.instance) {
  // 显示所有碰撞体
    // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb 
    //                                         | EPhysics2DDrawFlags.Pair 
    //                                         | EPhysics2DDrawFlags.CenterOfMass 
    //                                         | EPhysics2DDrawFlags.Joint 
    //                                         | EPhysics2DDrawFlags.Shape
    // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape
    } 
  }

  start() {
    // 加载tsx碰撞信息
    resources.load("data/collisionData", JsonAsset, (err, jsonAsset) => {
      if (err) {
        console.error("Failed to load collision data:", err);
        return;
      }
      const collisionData = jsonAsset.json;
      console.log("Collision Data Loaded:", collisionData);
      this.generateTilesColliders(collisionData);
    });
  }

  update(deltaTime: number) {}

  generateTilesColliders(collisionData: Record<string, any>) {
    const tiledMap = this.node.getComponent(TiledMap); // 瓦片地图
    const tileMapSize = tiledMap.getMapSize()
    console.log("Tile Map Size:", tileMapSize);
    const tileSize = tiledMap.getTileSize(); // 瓦片大小
    console.log("Tile Size:", tileSize);
    const [mapPixelWidth, mapPixelHeight] = [tileMapSize.width * tileSize.width, tileMapSize.height * tileSize.height];
    const layer = tiledMap.getLayer("stone"); // 获取stone瓦片层
    console.log(layer);
    const layerSize = layer.getLayerSize(); // 获取横纵向瓦片数量

    // // ---测试---
    // const [testX, testY] = [0, 0];
    // const newCollider = layer.addComponent(BoxCollider2D);
    // newCollider.tag = 1;
    // newCollider.size = tileSize;
    // const [offsetX, offsetY] = [
    //   testX * tileSize.width + tileSize.width / 2 - mapPixelWidth / 2,
    //   mapPixelHeight / 2 - (testY * tileSize.height + tileSize.height / 2)
    // ];
    // newCollider.offset = new Vec2(offsetX, offsetY);
    // newCollider.apply();
    // // ---测试结束---
    
    // stone层碰撞体建立
    for (let x = 0; x < layerSize.width; x++) {
      for (let y = 0; y < layerSize.height; y++) {
        const tileGID = layer.getTileGIDAt(x, y);
        if ( tileGID === 456 ) {
          const newCollider = layer.addComponent(BoxCollider2D);
          newCollider.tag = 1;
          newCollider.size = tileSize;
          const [offsetX, offsetY] = [
            x * tileSize.width + tileSize.width / 2 - mapPixelWidth / 2,
            mapPixelHeight / 2 - (y * tileSize.height + tileSize.height / 2)
          ];
          newCollider.offset = new Vec2(offsetX, offsetY);
          newCollider.apply();
        }
      }
    }

    // interact层碰撞体建立
    const interactGroup = tiledMap.getObjectGroup("interact");
    console.log("Interact Group:", interactGroup);
    const END_TILENAME = "endPos"
    const endTile = interactGroup.getObject(END_TILENAME);
    console.log("End Tile:", endTile);
    {
      const {width, height, x, y} = endTile;
      const newCollider = this.addComponent(CircleCollider2D);
      newCollider.tag = 2;
      newCollider.sensor = true;
      newCollider.radius = Math.min(width, height) / 2 - 3; // sensor半径
      newCollider.offset = new Vec2(
        x - mapPixelWidth / 2 + width / 2, 
        y - mapPixelHeight / 2 + height / 2
      );
      newCollider.apply();
    }
  }
}
