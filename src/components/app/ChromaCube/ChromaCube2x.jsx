import React, {forwardRef, useEffect, useRef } from "react";
import '@/components/app/ChromaCube/ChromaCube2x.scss'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Three from "three";

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

// Куб
const Box = () => {
  const meshRef = useRef(null);

  // Цвета для 6 сторон с прозрачностью - используем MeshBasicMaterial для ярких цветов
  const materials = [
    new Three.MeshBasicMaterial({ color: 'red'}),
    new Three.MeshBasicMaterial({ color: 'green'}),
    new Three.MeshBasicMaterial({ color: 'blue'}),
    new Three.MeshBasicMaterial({ color: 'yellow'}),
    new Three.MeshBasicMaterial({ color: 'purple'}),
    new Three.MeshBasicMaterial({ color: 'cyan'}),
  ];

  // Устанавливаем начальный наклон
  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

  useEffect(() => {
    if (meshRef.current) {

      const euler = new Three.Euler(
        degreesToRadians(90),   // 90 градусов по X
        degreesToRadians(20),   // 20 градусов по Y
        0                            // 0° поворот по Z
      );

      meshRef.current.setRotationFromEuler(euler);
    }
  }, []);

  return (
    <mesh geometry={new Three.BoxGeometry(2.5, 2.5, 2.5)} ref={meshRef} material={materials} />
  );
};

const ChromaCube2x = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="chroma-cube-container">
      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{ fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: Three.NoToneMapping // Убираем tone mapping для ярких цветов
        }}
      >
        <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <ambientLight intensity={0.6} />
        <Box />
        <CameraControls />
      </Canvas>
    </div>
  )
});

ChromaCube2x.displayName = 'ChromaCube2x';

export default ChromaCube2x;