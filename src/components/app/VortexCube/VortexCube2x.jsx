import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import "@/components/app/VortexCube/VortexCube2x.scss"
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

import smallCube01 from "@/assets/app/VortexCube/cube2/cube2-01.webp";
import smallCube02 from "@/assets/app/VortexCube/cube2/cube2-02.webp";
import smallCube03 from "@/assets/app/VortexCube/cube2/cube2-03.webp";
import smallCube04 from "@/assets/app/VortexCube/cube2/cube2-04.webp";
import smallCube05 from "@/assets/app/VortexCube/cube2/cube2-05.webp";
import smallCube06 from "@/assets/app/VortexCube/cube2/cube2-06.webp";
import smallCube07 from "@/assets/app/VortexCube/cube2/cube2-07.webp";
import smallCube08 from "@/assets/app/VortexCube/cube2/cube2-08.webp";
import smallCube09 from "@/assets/app/VortexCube/cube2/cube2-09.webp";
import smallCube10 from "@/assets/app/VortexCube/cube2/cube2-10.webp";
import smallCube11 from "@/assets/app/VortexCube/cube2/cube2-11.webp";
import smallCube12 from "@/assets/app/VortexCube/cube2/cube2-12.webp";
import smallCube13 from "@/assets/app/VortexCube/cube2/cube2-13.webp";
import smallCube14 from "@/assets/app/VortexCube/cube2/cube2-14.webp";

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

// === Группа из 8 кубиков с текстурами ===
const CubeGroup = ({ groupSize, gap }) => {
  const groupRef = useRef(null);

  // размер маленького кубика
  const cubeSize = groupSize / 2;
  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    [cubeSize]
  );

  // === Загружаем текстуры (через useLoader) ===
  const textures = useLoader(THREE.TextureLoader, [
    String(smallCube01),
    String(smallCube02),
    String(smallCube03),
    String(smallCube04),
    String(smallCube05),
    String(smallCube06),
    String(smallCube07),
    String(smallCube08),
    String(smallCube09),
    String(smallCube10),
    String(smallCube11),
    String(smallCube12),
    String(smallCube13),
    String(smallCube14),
  ]);

  // === Перемешиваем текстуры один раз ===
  const shuffledTextures = useMemo(() => {
    const arr = [...textures];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [textures]);

  // === Позиции для 2×2×2 (8 кубиков) ===
  const positions = useMemo(() => {
    const step = cubeSize + gap;
    const coords = [-step / 2, step / 2];
    const result = [];
    for (let x of coords) {
      for (let y of coords) {
        for (let z of coords) {
          result.push([x, y, z]);
        }
      }
    }
    return result;
  }, [cubeSize, gap]);

  // === Наклон ===
  useEffect(() => {
    if (groupRef.current) {
      const euler = new THREE.Euler(
        degreesToRadians(90),
        degreesToRadians(20),
        0
      );
      groupRef.current.setRotationFromEuler(euler);
    }
  }, []);

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={geometry}>
          <meshBasicMaterial map={shuffledTextures[i]} />
        </mesh>
      ))}
    </group>
  );
};

const VortexCube2x = forwardRef(({ groupSize = 2.5 }, ref) => {
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

  const { t } = useTranslation();
  const [gap, setGap] = useState(0.15);
  const [isOpen, setIsOpen] = useState(false);
  const gapRef = useRef(null);

  // === загрузка из localStorage при первом рендере ===
  useEffect(() => {
    const saved = localStorage.getItem("vortexCube2xGap");
    if (saved !== null) {
      const num = parseFloat(saved);
      if (!isNaN(num)) {
        setGap(num);
      }
    }
  }, []);

  // === сохранение в localStorage при изменении gap ===
  useEffect(() => {
    localStorage.setItem("vortexCube2xGap", gap.toString());
  }, [gap]);

  // кнопки управления
  const handleReset = () => setGap(0.15);
  const handleIncrease = () =>
    setGap((prev) => Math.min(0.5, parseFloat((prev + 0.01).toFixed(2))));
  const handleDecrease = () =>
    setGap((prev) => Math.max(0, parseFloat((prev - 0.01).toFixed(2))));

  // закрытие при клике вне блока
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (gapRef.current && !gapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="cube2x-inner-container">

      {/* input для gap */}
      <div className="cube-gap" ref={gapRef}>
        <div className={`label-all ${isOpen ? "open" : "closed"}`}>
          {/* заголовок, который открывает/закрывает блок */}
          <div className={`gap-label ${isOpen ? "open" : "closed"}`}
               onClick={() => setIsOpen((prev) => !prev)}>
            {t("project2.gap")}
          </div>

          {/* скрываем/показываем блок */}
          {isOpen && (
            <div className="gap-controls">
              <div className="slider-wrapper">
                <button className="slider-button minus" onClick={handleDecrease} title={t("project2.decrease")}><i className="fa-solid fa-minus-circle"/></button>
                <input type="range" min="0" max="0.5" step="0.01" value={gap} onChange={(e) => setGap(parseFloat(e.target.value))}/>
                <button className="slider-button plus" onClick={handleIncrease} title={t("project2.increase")}><i className="fa-solid fa-plus-circle"/></button>
              </div>
              <div className="reset-wrapper">
                <button className="slider-button reset" onClick={handleReset} title={t("project2.reset")}><i className="fa-solid fa-undo"/></button>
                <div className="scale-value">{gap.toFixed(2)}x</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={ref}>
        <Canvas
          style={canvasStyle} // responsive inline-стили
          camera={{ fov: 75 }}
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        >
          <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
          <ambientLight intensity={0.6} />
          <CubeGroup groupSize={groupSize} gap={gap} />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
});

VortexCube2x.displayName = 'VortexCube2x';

export default VortexCube2x;