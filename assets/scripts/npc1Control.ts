import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("npc1Control")
export class npc1Control extends Component {
  private speed: number = 3.5;
  private direction: Vec2 = new Vec2(1, 0);
  private initialPos: Vec3 = new Vec3(-420, 77, 0);
  private limitX: number = -220; // NPC移动范围限制
  private ani: Animation = null;
  private isEndPlay: boolean = false;

  protected onLoad(): void {
    this.ani = this.getComponent(Animation);

  }
  start() {
    this.node.setPosition(this.initialPos);
    // this.ani = this.getComponent(Animation);
    this.node.active = false; // 初始隐藏NPC
  }

  update(deltaTime: number) {
    if (!this.ani) return;
    console.log("-----")
    // 移动NPC
    let velocity = Vec2.ZERO;
    if (this.node.position.x < this.limitX) {
      velocity = this.direction.clone().multiplyScalar(this.speed);
      // console.log("NPC is moving:", velocity);
    } else {
      if (!this.isEndPlay) this.ani.play("npc1Wave");
      this.isEndPlay = true;
    }
    this.getComponent(RigidBody2D).linearVelocity = velocity;
  }

  show () {
    this.node.active = true; // 显示NPC
    console.log("NPC is now visible");
    this.getComponent(RigidBody2D).wakeUp();
  }
}
