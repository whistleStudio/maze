import { _decorator, Component, input, Node, Input, EventKeyboard, KeyCode, Collider2D, Contact2DType, Vec2, RigidBody2D, Animation, TiledMap, UITransform, Vec3 } from "cc";
import { mapControl } from "./mapControl";
import { npc1Control } from "./npc1Control";
const { ccclass, property } = _decorator;

@ccclass("playerControl")
export class playerControl extends Component {
  @property(mapControl)
  private mapControl: mapControl = null;
  @property(npc1Control)
  private npc1Control: npc1Control = null;

  // 移动方向
  private dir: Vec2 = new Vec2();
  // 速度
  private speed: number = 1;
  // 玩家初始位置
  private initialPos: Vec3 = new Vec3(-189, -90, 0);
  // 玩家当前所处的瓦片位置
  private curPlayerTilePos: Vec2 = null;

  start() {
    this.node.setPosition(this.initialPos);
    console.log("Player Control Script Started");
    // 监听键盘事件
    input.on(Input.EventType.KEY_DOWN, this.onKeyChange, this);
    input.on(Input.EventType.KEY_UP, this.onKeyChange, this);

    let collider = this.node.getComponent(Collider2D);

    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    this.updatePlayerTilePos();

  }

  update(deltaTime: number) {
    const velocity = this.dir.clone().multiplyScalar(this.speed); // multiplyScalar会改变原数值，匀速需深拷贝
    this.getComponent(RigidBody2D).linearVelocity = velocity;
    this.updatePlayerTilePos(); // 更新玩家瓦片位置
    if (this.curPlayerTilePos) {
      this.mapControl.changeGrass(this.curPlayerTilePos);
      if (this.mapControl.isInLake(this.curPlayerTilePos)) {
        this.node.setPosition(this.initialPos); // 重置玩家位置
      }
    }
  }

  // 键盘按下/松开回调
  private onKeyChange(ev: EventKeyboard) {
    const ani = this.getComponent(Animation);
    let aniIdx = 0;
    // 方向键判断
    const isKeyDown = ev.type === Input.EventType.KEY_DOWN;
    this.dir.set(0, 0); // 重置方向
    switch (ev.keyCode) {
      case KeyCode.KEY_W:
        this.dir.y = isKeyDown ? 1 : 0; 
        aniIdx = 0;
        break;
      case KeyCode.KEY_S:
        this.dir.y = isKeyDown ? -1 : 0; 
        aniIdx = 1;
        break;
      case KeyCode.KEY_A:
        this.dir.x = isKeyDown ? -1 : 0; 
        aniIdx = 2;
        break;
      case KeyCode.KEY_D:
        this.dir.x = isKeyDown ? 1 : 0; 
        aniIdx = 3;
        break;
    }
    // 动画更新
    const aniName = ani.clips[aniIdx].name;
    if (isKeyDown) ani.play(aniName);
    else {
      const state = ani.getState(aniName);
      if (state) {
        state.time = 0;
        state.sample();
        state.stop();
      }
    }
    console.log("Current Direction:", this.dir);
    this.dir.normalize(); // 归一化方向向量
  }
  // 碰撞回调
  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    console.log("Collision detected between " + selfCollider.node.name + " and " + otherCollider.node.name);
    if (otherCollider.tag === 2) { // 碰到终点
      console.log("victory");
      this.scheduleOnce(() => { // 不能在碰撞回调里进行创建/销毁/启用组件、切换节点激活等操作；可放在下一帧执行（非回调内部）
        this.npc1Control.show(); // 显示NPC
      });
    }
  }
  // 更新玩家瓦片位置
  private updatePlayerTilePos() {
    if (!this.mapControl) return;
    const playerPos = this.node.getPosition();
    // console.log("Player Position:", playerPos);
    const tiledMap = this.mapControl.getComponent(TiledMap);
    const [mapWidth, mapHeight] = [this.mapControl.getComponent(UITransform).width, this.mapControl.getComponent(UITransform).height];
    const playerPosInMap = playerPos.add(new Vec3(mapWidth / 2, mapHeight / 2, 0));
    this.curPlayerTilePos = new Vec2(
      Math.floor(playerPosInMap.x / tiledMap.getTileSize().width),
      tiledMap.getMapSize().height - Math.floor(playerPosInMap.y / tiledMap.getTileSize().height) - 1
    );
  }
}
