import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import "@/components/app/VortexCube/VortexCube1x.scss"
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import rightImg from "@/assets/app/VortexCube/cube1/cube1-01.webp";
import leftImg from "@/assets/app/VortexCube/cube1/cube1-11.webp";
import frontImg from "@/assets/app/VortexCube/cube1/cube1-06.webp";
import backImg from "@/assets/app/VortexCube/cube1/cube1-03.webp";
import bottomImg from "@/assets/app/VortexCube/cube1/cube1-08.webp";
import topImg from "@/assets/app/VortexCube/cube1/cube1-05.webp";

// Подключаем OrbitControls
extend({ OrbitControls });

// Компонент управления камерой
const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef(null);
  useFrame(() => controls.current && controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      enablePan={false}
      enableZoom={true}
      autoRotate={true}
      autoRotateSpeed={5}
    />
  );
};

// Куб с текстурами
const TextureBox = () => {
  const meshRef = useRef(null);

  // Загружаем текстуры через useLoader (правильный способ в R3F)
  const [textureRight, textureLeft, textureTop, textureBottom, textureFront, textureBack] = useLoader(THREE.TextureLoader, [
    String(rightImg),   // 0
    String(leftImg),    // 1
    String(frontImg),   // 2
    String(backImg),    // 3
    String(bottomImg),  // 4
    String(topImg)      // 5
  ]);

  const degreesToRadians = (degrees) => degrees * (Math.PI / 180); // Перевод градусов в радианы

  // Мемоизируем материалы с правильной ориентацией текстур
  const materials = useMemo(() => {
    const textures = [textureRight, textureLeft, textureTop, textureBottom, textureFront, textureBack];

    return textures.map((texture, index) => {
      // Настраиваем каждую текстуру
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;

      // Исправляем ориентацию для конкретных сторон
      if (index === 1) { // leftImg
        texture.center = new THREE.Vector2(0.5, 0.5);
        texture.rotation = degreesToRadians(90);
      }
      if (index === 0) { // rightImg
        texture.center = new THREE.Vector2(0.5, 0.5);
        texture.rotation = degreesToRadians(-90);
      }
      if (index === 3) { // backImg
        texture.center = new THREE.Vector2(0.5, 0.5);
        texture.rotation = degreesToRadians(180);
      }

      texture.needsUpdate = true;
      return new THREE.MeshBasicMaterial({ map: texture });
    });
  }, [textureRight, textureLeft, textureTop, textureBottom, textureFront, textureBack]);

  // Устанавливаем начальный наклон
  useEffect(() => {
    if (meshRef.current) {

      const euler = new THREE.Euler(
        degreesToRadians(90),   // 90 градусов по X
        degreesToRadians(20),   // 20 градусов по Y
        0                            // 0° поворот по Z
      );

      meshRef.current.setRotationFromEuler(euler);
    }
  }, []);

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
    </mesh>
  );
};

const VortexCube1x = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="vortex-cube-container">
      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{ fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping // Убираем tone mapping для ярких цветов
        }}
      >
        <perspectiveCamera makeDefault position={[4, 4, 4]} />
        <ambientLight intensity={1.2} />
        <TextureBox />
        <CameraControls />
      </Canvas>
    </div>
  );
});

VortexCube1x.displayName = "VortexCube1x";

export default VortexCube1x;