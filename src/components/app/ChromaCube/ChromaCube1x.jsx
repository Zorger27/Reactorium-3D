import React, {forwardRef, useEffect, useRef} from "react";
import '@/components/app/ChromaCube/ChromaCube1x.scss'
import {BoxGeometry, EdgesGeometry, MeshBasicMaterial, Euler} from 'three';
// import { GridHelper, EdgesGeometry, BoxGeometry, MeshStandardMaterial } from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

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

// Куб с прозрачными гранями и свечением по контуру
const Box = () => {
  const meshRef = useRef(null);

  // Цвета для 6 сторон с прозрачностью - используем MeshBasicMaterial для ярких цветов
  const materials = [
    new MeshBasicMaterial({ color: 'red', transparent: true, opacity: 0.7 }),
    new MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.7 }),
    new MeshBasicMaterial({ color: 'blue', transparent: true, opacity: 0.7 }),
    new MeshBasicMaterial({ color: 'yellow', transparent: true, opacity: 0.7 }),
    new MeshBasicMaterial({ color: 'purple', transparent: true, opacity: 0.7 }),
    new MeshBasicMaterial({ color: 'cyan', transparent: true, opacity: 0.7 }),
  ];

  // Устанавливаем начальный наклон
  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

  useEffect(() => {
    if (meshRef.current) {

      const euler = new Euler(
        degreesToRadians(90),   // 90 градусов по X
        degreesToRadians(20),   // 20 градусов по Y
        0                            // 0° поворот по Z
      );

      meshRef.current.setRotationFromEuler(euler);
    }
  }, []);

  //  // Крутим именно куб! Другой вариант: камера вращается вокруг наклонённого куба (через OrbitControls)!
  // useFrame(() => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.x += 0.003;
  //     meshRef.current.rotation.y += 0.005;
  //   }
  //   if (edgesRef.current) {
  //     edgesRef.current.rotation.copy(meshRef.current.rotation);
  //   }
  // });

  return (
    <group ref={meshRef}>
      <mesh geometry={new BoxGeometry(2.5, 2.5, 2.5)} material={materials} />
      <lineSegments geometry={new EdgesGeometry(new BoxGeometry(2.5,2.5,2.5))}>
        <lineBasicMaterial color="white" transparent opacity={0.8} depthTest={false} />
      </lineSegments>
    </group>
  );
};

// // Сетка для сцены
// const Grid = () => {
//   const { scene } = useThree();
//   React.useEffect(() => {
//     const grid = new GridHelper(10, 10, 0xffffff, 0x444444);
//     scene.add(grid);
//     return () => { scene.remove(grid); };
//   }, [scene]);
//   return null;
// };

const ChromaCube1x = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="chroma-cube-container">
      {/* 3D сцена */}
      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{ fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping // Убираем tone mapping для ярких цветов
        }}
      >
        <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <ambientLight intensity={0.6} />
        <Box />
        {/*<Grid />*/}
        <CameraControls />
      </Canvas>
    </div>
  )
});

ChromaCube1x.displayName = 'ChromaCube1x';

export default ChromaCube1x;