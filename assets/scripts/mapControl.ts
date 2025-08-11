import { _decorator, Component, Node, TiledMap, UI, Vec2, Vec3, UITransform, EventTouch, TiledLayer } from "cc";
const { ccclass, property } = _decorator;

@ccclass("mapControl")
export class mapControl extends Component {

  // 草地预设
  private GRASS_GID: number = 8;
  private GRASS_GID_ACTIVE: number = 927;
  private preActiveGrassPos: Vec2 = null;
  private grassPosList: Vec2[] = [];
  // 湖泊预设
  private LAKE_BOUND_BOX: [number, number] = [2, 17];

  private tiledMap: TiledMap = null;
  private layer: TiledLayer = null;

  protected onLoad(): void {
    this.tiledMap = this.node.getComponent(TiledMap);
    this.layer = this.tiledMap.getLayer("bg");
    const layerSize = this.layer.getLayerSize(); // 获取横纵向瓦片数量
    for (let x = 0; x < layerSize.width; x++) {
      for (let y = 0; y < layerSize.height; y++) {
        const tileGID = this.layer.getTileGIDAt(x, y);
        if (tileGID === this.GRASS_GID) {
          this.grassPosList.push(new Vec2(x, y)); // 添加草地位置
        }
      }
    }
  }
  start() {
    this.node.on(Node.EventType.TOUCH_START, (ev: EventTouch) => {console.log("TOUCH_START: ", ev.getUILocation())}, this);
  }

  update(deltaTime: number) {}

  // 草地交互
  changeGrass(playerTilePos: Vec2) {
    if (JSON.stringify(this.preActiveGrassPos) !== JSON.stringify(playerTilePos)) { // 激活草地位置与玩家位置不同
      if (this.preActiveGrassPos) {
        this.layer.setTileGIDAt(this.GRASS_GID, this.preActiveGrassPos.x, this.preActiveGrassPos.y);
        this.preActiveGrassPos = null;
      }
      if (this.grassPosList.some(pos => pos.equals(playerTilePos))) {
        this.layer.setTileGIDAt(this.GRASS_GID_ACTIVE, playerTilePos.x, playerTilePos.y);
        this.preActiveGrassPos = playerTilePos.clone();
      }
    }
  }

  // 湖泊交互
  isInLake(playerTilePos: Vec2) {
    const [lakeX, lakeY] = this.LAKE_BOUND_BOX;
    return playerTilePos.x <= lakeX && playerTilePos.y >= lakeY;
  }
}
