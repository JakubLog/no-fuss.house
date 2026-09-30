import { BackSide, BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PointLight, Scene } from "three";

/**
 * `RoomEnvironment` z three r160 wywołany tak jak w legacy: `new RoomEnvironment()` bez renderera.
 * W r160 oznaczało to światło główne o natężeniu 5 (nie 900), więc ściany pokoju są prawie czarne,
 * a odbicia w literach to jasne panele na ciemnym tle (kontrastowy połysk). r186 ma zawsze 900
 * i pokój przesunięty o y = −3.5, co spłaszcza i rozjaśnia odbicia. Geometria 1:1 z r160.
 * Tylko do zapiekania mapy otoczenia (`bake-env.ts` → `public/three/env/room-pmrem.bin.gz`); runtime go nie ładuje.
 */
export class LegacyRoomEnvironment extends Scene {
  constructor() {
    super();
    const geometry = new BoxGeometry();
    geometry.deleteAttribute("uv");

    const roomMaterial = new MeshStandardMaterial({ side: BackSide });
    const boxMaterial = new MeshStandardMaterial();

    const mainLight = new PointLight(0xffffff, 5, 28, 2);
    mainLight.position.set(0.418, 16.199, 0.3);
    this.add(mainLight);

    const room = new Mesh(geometry, roomMaterial);
    room.position.set(-0.757, 13.219, 0.717);
    room.scale.set(31.713, 28.305, 28.591);
    this.add(room);

    const boxes = [
      [-10.906, 2.009, 1.846, -0.195, 2.328, 7.905, 4.651],
      [-5.607, -0.754, -0.758, 0.994, 1.97, 1.534, 3.955],
      [6.167, 0.857, 7.803, 0.561, 3.927, 6.285, 3.687],
      [-2.017, 0.018, 6.124, 0.333, 2.002, 4.566, 2.064],
      [2.291, -0.756, -2.621, -0.286, 1.546, 1.552, 1.496],
      [-2.193, -0.369, -5.547, 0.516, 3.875, 3.487, 2.986],
    ];
    for (const [x, y, z, ry, sx, sy, sz] of boxes) {
      const box = new Mesh(geometry, boxMaterial);
      box.position.set(x, y, z);
      box.rotation.set(0, ry, 0);
      box.scale.set(sx, sy, sz);
      this.add(box);
    }

    const lights = [
      [50, -16.116, 14.37, 8.208, 0.1, 2.428, 2.739],
      [50, -16.109, 18.021, -8.207, 0.1, 2.425, 2.751],
      [17, 14.904, 12.198, -1.832, 0.15, 4.265, 6.331],
      [43, -0.462, 8.89, 14.52, 4.38, 5.441, 0.088],
      [20, 3.235, 11.486, -12.541, 2.5, 2, 0.1],
      [100, 0, 20, 0, 1, 0.1, 1],
    ];
    for (const [intensity, x, y, z, sx, sy, sz] of lights) {
      const material = new MeshBasicMaterial();
      material.color.setScalar(intensity);
      const light = new Mesh(geometry, material);
      light.position.set(x, y, z);
      light.scale.set(sx, sy, sz);
      this.add(light);
    }
  }
}
