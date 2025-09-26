import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import '@/components/app/PictoCube/PictoCube1x.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber';
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

const degreesToRadians = (degrees) => degrees * (Math.PI / 180); // Перевод градусов в радианы

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
const PictoBox = () => {
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

const PictoCube1x = forwardRef((props, ref) => {
  // responsive inline-стили
  const canvasStyle = useResponsiveStyle({
    default: {
      height: 'calc(100vh - 225px)',
      width: '100%',
      marginTop: '0rem',
      marginLeft: '0rem',
    },
    "1020": {
      height: 'calc(100vh - 218px)',
      width: '100%',
      marginTop: '0rem',
      marginLeft: '0rem',
    },
    "768": {
      height: 'calc(100vh - 206px)',
      width: '100%',
      marginTop: '0rem',
      marginLeft: '0rem',
    }
  });

  return (
    <div ref={ref} className="picto-cube-container">
      <Canvas
        // style={{ height: '100%', width: '100%' }}
        style={canvasStyle} // responsive inline-стили
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