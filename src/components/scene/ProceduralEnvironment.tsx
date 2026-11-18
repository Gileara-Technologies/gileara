"use client";

/**
 * Reflections for the glass, baked once from a handful of glowing
 * panels with three's PMREMGenerator. Replaces drei's <Environment>,
 * which statically imports the HDR/EXR file loaders (a large share of
 * the scene chunk) even when, as here, no file is ever loaded.
 */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ICE, TEAL } from "./materials";

interface Panel {
  color: string;
  intensity: number;
  position: [number, number, number];
  rotationY: number;
  size: [number, number];
}

const PANELS: Panel[] = [
  { color: ICE, intensity: 3, position: [0, 5, -6], rotationY: 0, size: [10, 2] },
  { color: TEAL, intensity: 2, position: [-6, 1, 0], rotationY: Math.PI / 2, size: [8, 3] },
  { color: TEAL, intensity: 1.5, position: [6, -1, 2], rotationY: -Math.PI / 2, size: [8, 3] },
  { color: ICE, intensity: 2, position: [0, 0, 8], rotationY: Math.PI, size: [4, 4] },
];

export default function ProceduralEnvironment({ resolution }: { resolution: number }) {
  // The store getter, not the scene itself: the scene is mutated below,
  // and this repo's lint rules forbid mutating a value returned by a hook.
  const get = useThree((s) => s.get);

  useEffect(() => {
    const { gl, scene } = get();
    const room = new THREE.Scene();
    room.background = new THREE.Color("#020607");
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    for (const panel of PANELS) {
      const geometry = new THREE.PlaneGeometry(panel.size[0], panel.size[1]);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(panel.color).multiplyScalar(panel.intensity),
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...panel.position);
      mesh.rotation.y = panel.rotationY;
      mesh.lookAt(0, 0, 0);
      room.add(mesh);
      geometries.push(geometry);
      materials.push(material);
    }

    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.04, 0.1, 100, { size: resolution });
    const previous = scene.environment;
    scene.environment = target.texture;

    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    pmrem.dispose();

    return () => {
      scene.environment = previous;
      target.dispose();
    };
  }, [get, resolution]);

  return null;
}
