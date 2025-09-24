import React, {forwardRef, useEffect, useMemo, useRef} from "react";
import '@/components/app/ChromaCube/ChromaCube2x.scss'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";
import {Euler} from "three";

// Подключаем OrbitControls
extend({ OrbitControls });

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

// Группа из 8 кубиков
const CubeGroup = ({ groupSize = 2.5 }) => {
  const groupRef = useRef(null);

  // === Список цветов ===
  const colors = useMemo(() => {
    const allColors = [
      0xff0000,  // Красный
      0x00ff00,  // Зеленый
      0x0000ff,  // Синий
      0xffff00,  // Желтый
      0xff00ff,  // Пурпурный
      0x00ffff,  // Бирюзовый
      0xff4500,  // Оранжевый
      0x8a2be2,  // Сиреневый
      0x32cd32,  // Ярко-зеленый
      0xffd700,  // Золотой
      0xff69b4,  // Розовый
      0x9400d3,  // Фиолетовый
      0x00fa9a,  // Морская волна
      0xff8c00,  // Темно-оранжевый
      0x8b4513,  // Коричневый
      0x00ced1,  // Темно-бирюзовый
      0xf0e68c,  // Хаки
      0xff6347,  // Темно-красный
      0x87ceeb,  // Светло-голубой
      0x4682b4,  // Синевато-серый
      0x9932cc,  // Темно-фиолетовый
      0x2e8b57,  // Зеленовато-коричневый
      0xff1493,  // Глубокий розовый
      0x7cfc00,  // Лайм
      0xb22222,  // Огненно-красный
      0x20b2aa,  // Синевато-зеленый
      0xff4500   // Красновато-коричневый
    ].map(c => new THREE.Color(c));

    // === Перемешивание Фишером–Йетсом ===
    for (let i = allColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
    }

    return allColors;
  }, []); // <- заново при каждом монтировании компоненты

  // === Размер маленького кубика ===
  const cubeSize = groupSize / 2;

  // === Позиции (плотное размещение в 2x2x2) ===
  const positions = useMemo(() => {
    const offset = cubeSize / 1.8; // половина маленького куба
    return [
      [-offset, -offset, -offset],
      [ offset, -offset, -offset],
      [-offset,  offset, -offset],
      [ offset,  offset, -offset],
      [-offset, -offset,  offset],
      [ offset, -offset,  offset],
      [-offset,  offset,  offset],
      [ offset,  offset,  offset],
    ];
  }, [cubeSize]);

  // === Устанавливаем наклон по Эйлеру ===
  useEffect(() => {
    if (groupRef.current) {
      const euler = new Euler(
        degreesToRadians(90),   // 90 градусов по X
        degreesToRadians(20),   // 20 градусов по Y
        0                            // 0° поворот по Z
      );
      groupRef.current.setRotationFromEuler(euler);
    }
  }, []);

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
          <meshBasicMaterial color={colors[i % colors.length]} />
        </mesh>
      ))}
    </group>
  );
};

const ChromaCube2x = forwardRef(({ groupSize = 2.5 }, ref) => {
  return (
    <div ref={ref} className="chroma-cube-container">
      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{ fov: 75 }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <ambientLight intensity={0.6} />
        <CubeGroup groupSize={groupSize} />
        <CameraControls />
      </Canvas>
    </div>
  )
});

ChromaCube2x.displayName = 'ChromaCube2x';

export default ChromaCube2x;