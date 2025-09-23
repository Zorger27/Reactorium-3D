import React, { forwardRef, useEffect, useMemo } from "react";
import '@/components/app/PictoCube/PictoCube1x.scss'
import { Euler } from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import rightImg from "@/assets/app/PictoCube/right.webp";
import leftImg from "@/assets/app/PictoCube/left.webp";
import frontImg from "@/assets/app/PictoCube/front.webp";
import backImg from "@/assets/app/PictoCube/back.webp";
import bottomImg from "@/assets/app/PictoCube/bottom.webp";
import topImg from "@/assets/app/PictoCube/top.webp";

// Подключаем OrbitControls
extend({ OrbitControls });

// Компонент управления камерой
const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = React.useRef(null);
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
const PictoBox = () => {
  const meshRef = React.useRef(null);

  // Загружаем текстуры через useLoader (правильный способ в R3F)
  const [textureRight, textureLeft, textureTop, textureBottom, textureFront, textureBack] = useLoader(THREE.TextureLoader, [
    rightImg,   // 0
    leftImg,    // 1
    frontImg,   // 2
    backImg,    // 3
    bottomImg,  // 4
    topImg      // 5
  ]);

  // Мемоизируем материалы с правильной ориентацией текстур
  const materials = useMemo(() => {
    const textures = [textureRight, textureLeft, textureTop, textureBottom, textureFront, textureBack];

    return textures.map((texture, index) => {
      // Настраиваем каждую текстуру
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;

      // Исправляем ориентацию для конкретных сторон
      if (index === 3) { // backImg
        texture.center.set(0.5, 0.5);
        texture.rotation = Math.PI;
      }
      if (index === 0) { // rightImg
        texture.center.set(0.5, 0.5);
        texture.rotation = -Math.PI / 2;
      }
      if (index === 1) { // leftImg
        texture.center.set(0.5, 0.5);
        texture.rotation = Math.PI / 2;
      }

      texture.needsUpdate = true;
      return new THREE.MeshBasicMaterial({ map: texture });
    });
  }, [textureRight, textureLeft, textureTop, textureBottom, textureFront, textureBack]);

  // Устанавливаем начальный наклон
  useEffect(() => {
    if (meshRef.current) {
      const euler = new Euler(Math.PI / 2, 0.35, 0);
      meshRef.current.setRotationFromEuler(euler);
    }
  }, []);

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
    </mesh>
  );
};

const PictoCube1x = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="picto-cube-container">
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
        <PictoBox />
        <CameraControls />
      </Canvas>
    </div>
  );
});

PictoCube1x.displayName = "PictoCube1x";

export default PictoCube1x;