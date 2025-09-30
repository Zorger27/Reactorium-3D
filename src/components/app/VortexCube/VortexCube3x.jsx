import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import "@/components/app/VortexCube/VortexCube3x.scss"
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

import small2Cube01 from "@/assets/app/VortexCube/cube3/cube3-01.webp";
import small2Cube02 from "@/assets/app/VortexCube/cube3/cube3-02.webp";
import small2Cube03 from "@/assets/app/VortexCube/cube3/cube3-03.webp";
import small2Cube04 from "@/assets/app/VortexCube/cube3/cube3-04.webp";
import small2Cube05 from "@/assets/app/VortexCube/cube3/cube3-05.webp";
import small2Cube06 from "@/assets/app/VortexCube/cube3/cube3-06.webp";
import small2Cube07 from "@/assets/app/VortexCube/cube3/cube3-07.webp";
import small2Cube08 from "@/assets/app/VortexCube/cube3/cube3-08.webp";
import small2Cube09 from "@/assets/app/VortexCube/cube3/cube3-09.webp";
import small2Cube10 from "@/assets/app/VortexCube/cube3/cube3-10.webp";
import small2Cube11 from "@/assets/app/VortexCube/cube3/cube3-11.webp";
import small2Cube12 from "@/assets/app/VortexCube/cube3/cube3-12.webp";
import small2Cube13 from "@/assets/app/VortexCube/cube3/cube3-13.webp";
import small2Cube14 from "@/assets/app/VortexCube/cube3/cube3-14.webp";
import small2Cube15 from "@/assets/app/VortexCube/cube3/cube3-15.webp";
import small2Cube16 from "@/assets/app/VortexCube/cube3/cube3-16.webp";
import small2Cube17 from "@/assets/app/VortexCube/cube3/cube3-17.webp";
import small2Cube18 from "@/assets/app/VortexCube/cube3/cube3-18.webp";
import small2Cube19 from "@/assets/app/VortexCube/cube3/cube3-19.webp";
import small2Cube20 from "@/assets/app/VortexCube/cube3/cube3-20.webp";
import small2Cube21 from "@/assets/app/VortexCube/cube3/cube3-21.webp";
import small2Cube22 from "@/assets/app/VortexCube/cube3/cube3-22.webp";
import small2Cube23 from "@/assets/app/VortexCube/cube3/cube3-23.webp";
import small2Cube24 from "@/assets/app/VortexCube/cube3/cube3-24.webp";
import small2Cube25 from "@/assets/app/VortexCube/cube3/cube3-25.webp";
import small2Cube26 from "@/assets/app/VortexCube/cube3/cube3-26.webp";
import small2Cube27 from "@/assets/app/VortexCube/cube3/cube3-27.webp";

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

// === Группа из 27 кубиков ===
const CubeGroup = ({ groupSize, gap }) => {
  const groupRef = useRef(null);

  // размер маленького кубика
  const cubeSize = groupSize / 3;
  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    [cubeSize]
  );

  // === Загружаем текстуры (через useLoader) ===
  const textures = useLoader(THREE.TextureLoader, [
    String(small2Cube01), String(small2Cube02), String(small2Cube03), String(small2Cube04), String(small2Cube05),
    String(small2Cube06), String(small2Cube07), String(small2Cube08), String(small2Cube09), String(small2Cube10),
    String(small2Cube11), String(small2Cube12), String(small2Cube13), String(small2Cube14), String(small2Cube15),
    String(small2Cube16), String(small2Cube17), String(small2Cube18), String(small2Cube19), String(small2Cube20),
    String(small2Cube21), String(small2Cube22), String(small2Cube23), String(small2Cube24), String(small2Cube25),
    String(small2Cube26), String(small2Cube27),
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

  // === Позиции для 3×3×3 ===
  const positions = useMemo(() => {
    const step = cubeSize + gap;
    const coords = [-step, 0, step];
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

  // === Наклон по Эйлеру ===
  useEffect(() => {
    if (groupRef.current) {
      const euler = new THREE.Euler(
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
        <mesh key={i} position={pos} geometry={geometry}>
          <meshBasicMaterial map={shuffledTextures[i]} />
        </mesh>
      ))}
    </group>
  );
};

const VortexCube3x = forwardRef(({ groupSize = 2.5 }, ref) => {
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
    const saved = localStorage.getItem("vortexCube3xGap");
    if (saved !== null) {
      const num = parseFloat(saved);
      if (!isNaN(num)) {
        setGap(num);
      }
    }
  }, []);

  // === сохранение в localStorage при изменении gap ===
  useEffect(() => {
    localStorage.setItem("vortexCube3xGap", gap.toString());
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
    <div className="cube3x-inner-container">

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

VortexCube3x.displayName = 'VortexCube3x';

export default VortexCube3x;