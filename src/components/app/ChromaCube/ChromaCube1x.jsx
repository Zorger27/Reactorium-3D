import React, { forwardRef } from "react";
// R3F
import {BoxGeometry, EdgesGeometry, MeshStandardMaterial} from 'three';
// import { GridHelper, EdgesGeometry, BoxGeometry, MeshStandardMaterial } from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Подключаем OrbitControls
extend({ OrbitControls });

// Компонент управления камерой
const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = React.useRef(null);
  useFrame(() => controls.current && controls.current.update());
  return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
};

// Куб с прозрачными гранями и свечением по контуру
const Box = () => {
  const meshRef = React.useRef(null);
  const edgesRef = React.useRef(null);

  // Цвета для 6 сторон с прозрачностью
  const materials = [
    new MeshStandardMaterial({ color: 'red', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'green', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'blue', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'yellow', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'purple', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'cyan', transparent: true, opacity: 0.7 }),
  ];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <>
      <mesh ref={meshRef} geometry={new BoxGeometry(2, 2, 2)} material={materials} />
      <lineSegments ref={edgesRef} geometry={new EdgesGeometry(new BoxGeometry(2,2,2))}>
        <lineBasicMaterial attach="material" color="white" transparent opacity={0.8} depthTest={false} />
      </lineSegments>
    </>
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
    <div ref={ref} style={{ height: '628px', width: '100%' }}>
      {/* 3D сцена */}
      <Canvas style={{ height: '100%', width: '100%' }} camera={{ fov: 75 }} >
        <perspectiveCamera makeDefault position={[3, 3, 3]} />
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 10, 10]} intensity={1.9} />
        <Box />
        {/*<Grid />*/}
        <CameraControls />
      </Canvas>
    </div>
  )
});

ChromaCube1x.displayName = 'ChromaCube1x';

export default ChromaCube1x;