import React, {forwardRef, useEffect, useRef} from "react";
import '@/components/app/ChromaCube/ChromaCube1x.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three';
import * as THREE from "three";

import small2Cube06 from "@/assets/app/VortexCube/cube3/cube3-20.webp";

// Подключаем OrbitControls
extend({ OrbitControls });

// Функция для перевода градусов в радианы
const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

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

// Компонент для установки фона
function SceneBackground({ imagePath, canvasFullscreen }) {
  // Хук R3F для загрузки ресурсов three.js
  // const texture = useLoader(EXRLoader, imagePath);
  const texture = useLoader(TextureLoader, imagePath);

  // Если НЕ в fullscreen - НЕ устанавливаем фон вообще (прозрачный)
  if (!canvasFullscreen) {
    return null; // ⭐ Просто ничего не рендерим - фон будет прозрачным
  }

  // Возвращаем специальный элемент, который прикрепляет текстуру к фону сцены
  return <primitive attach="background" object={texture} />;
}

// Куб с прозрачными гранями и свечением по контуру
const Box = () => {
  const meshRef = useRef(null);

  // Цвета для 6 сторон с прозрачностью - используем MeshBasicMaterial для ярких цветов
  const materials = [
    new THREE.MeshBasicMaterial({ color: 'red', transparent: true, opacity: 0.7 }),
    new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.7 }),
    new THREE.MeshBasicMaterial({ color: 'blue', transparent: true, opacity: 0.7 }),
    new THREE.MeshBasicMaterial({ color: 'yellow', transparent: true, opacity: 0.7 }),
    new THREE.MeshBasicMaterial({ color: 'purple', transparent: true, opacity: 0.7 }),
    new THREE.MeshBasicMaterial({ color: 'cyan', transparent: true, opacity: 0.7 }),
  ];

  // Устанавливаем начальный наклон куба
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
    <group ref={meshRef}>
      <mesh geometry={new THREE.BoxGeometry(2.5, 2.5, 2.5)} material={materials} />
      {/* Белые линии по рёбрам куба */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(2.5,2.5,2.5))}>
        <lineBasicMaterial color="white" transparent opacity={0.8} depthTest={false} />
      </lineSegments>
    </group>
  );
};

const ChromaCube1x = forwardRef(({ canvasFullscreen = false, ...props }, ref) => {
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
    <div ref={ref} className="chroma-cube1x-container">
      <Canvas style={canvasStyle} camera={{ fov: 75 }} gl={{antialias: true, toneMapping: THREE.NoToneMapping}}>
        <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <ambientLight intensity={0.6} />

        {/* Используем компонент с путём к картинке */}
        <SceneBackground imagePath={small2Cube06} canvasFullscreen={canvasFullscreen} />

        <Box />
        <CameraControls />
      </Canvas>
    </div>
  )
});

ChromaCube1x.displayName = 'ChromaCube1x';

export default ChromaCube1x;