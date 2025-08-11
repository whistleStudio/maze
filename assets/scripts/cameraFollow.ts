import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("cameraFollow")
export class cameraFollow extends Component {
  @property(Node)
  player: Node = null;

  private offset: Vec3 = new Vec3();

  start() {
    // 计算初始偏移量
    // if (this.player) {
    //   this.offset = this.node.position.subtract(this.player.position);
    //   console.log("Initial Offset:", this.offset);
    // } else {
    //   console.error("Player node is not assigned!");
    // }
  }

  update(deltaTime: number) {
    if (this.player) {
      // 更新摄像机位置，使其跟随玩家
      const newPosition = this.player.position;
      this.node.setPosition(newPosition);
      // console.log("Camera Position Updated:", newPosition);
    }
  }
}
