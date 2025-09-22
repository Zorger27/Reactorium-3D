import React, { forwardRef, useEffect } from "react";
import '@/components/app/PictoCube/PictoCube1x.scss'
import { Euler } from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
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
  const edgesRef = React.useRef(null);

  // Загружаем текстуры
  const loader = new THREE.TextureLoader();
  const textureRight = loader.load(rightImg);
  const textureLeft = loader.load(leftImg);
  const textureFront = loader.load(frontImg);
  const textureBack = loader.load(backImg);
  const textureBottom = loader.load(bottomImg);
  const textureTop = loader.load(topImg);

  // Корректируем UV для отдельных сторон
  textureBack.center.set(0.5, 0.5);
  textureBack.rotation = Math.PI;
  textureBack.needsUpdate = true;

  textureLeft.center.set(0.5, 0.5);
  textureLeft.rotation = Math.PI / 2;
  textureLeft.needsUpdate = true;

  textureRight.center.set(0.5, 0.5);
  textureRight.rotation = -Math.PI / 2;
  textureRight.needsUpdate = true;

  const materials = [
    new THREE.MeshBasicMaterial({ map: textureRight }),
    new THREE.MeshBasicMaterial({ map: textureLeft }),
    new THREE.MeshBasicMaterial({ map: textureFront }),
    new THREE.MeshBasicMaterial({ map: textureBack }),
    new THREE.MeshBasicMaterial({ map: textureBottom }),
    new THREE.MeshBasicMaterial({ map: textureTop }),
  ];

  // Устанавливаем начальный наклон
  useEffect(() => {
    if (meshRef.current && edgesRef.current) {
      const euler = new Euler(Math.PI / 2, 0.35, 0);
      meshRef.current.setRotationFromEuler(euler);
      edgesRef.current.setRotationFromEuler(euler);
    }
  }, []);

  return (
    <>
      <mesh ref={meshRef} geometry={new THREE.BoxGeometry(2.5, 2.5, 2.5)} material={materials} />;
    </>
  );
};

const PictoCube1x = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="picto-cube-container">
      <Canvas style={{ height: '100%', width: '100%' }} camera={{ fov: 75 }} >
        <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <ambientLight intensity={0.6} />
        <PictoBox />
        <CameraControls />
      </Canvas>
    </div>
  );
});

PictoCube1x.displayName = "PictoCube1x";

export default PictoCube1x;