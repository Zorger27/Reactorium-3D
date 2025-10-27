import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import "@/components/app/VortexCube/VortexCube2x.scss"
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

import ControlBlock from "@/components/util/ControlBlock.jsx";

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
const CubeGroup = ({ groupSize, gap, rotationX, rotationY, rotationZ }) => {
  const groupRef = useRef(null);

  // размер маленького кубика
  const cubeSize = groupSize / 2;
  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    [cubeSize]
  );

  // === Загружаем текстуры (через useLoader) ===
  const textures = useLoader(THREE.TextureLoader, [
    String(smallCube01), String(smallCube02), String(smallCube03), String(smallCube04), String(smallCube05),
    String(smallCube06), String(smallCube07), String(smallCube08), String(smallCube09), String(smallCube10),
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

  // === Наклон по Эйлеру ===
  useEffect(() => {
    if (groupRef.current) {
      const euler = new THREE.Euler(
        degreesToRadians(rotationX),
        degreesToRadians(rotationY),
        degreesToRadians(rotationZ)
      );
      groupRef.current.setRotationFromEuler(euler);
    }
  }, [rotationX, rotationY, rotationZ]);

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

// === Основной компонент ===
const VortexCube2x = forwardRef(({ groupSize = 2.5 }, ref) => {
  const { t } = useTranslation();
  // responsive inline-стили
  const canvasStyle = useResponsiveStyle({
    default: {
      height: 'calc(100vh - 225px)',
      width: '100%',
      marginTop: '0',
      marginLeft: '0',
    },
    "1020": {
      height: 'calc(100vh - 218px)',
      width: '100%',
      marginTop: '0',
      marginLeft: '0',
    },
    "768": {
      height: 'calc(100vh - 206px)',
      width: '100%',
      marginTop: '0',
      marginLeft: '0',
    }
  });

  // states
  const [gap, setGap] = useState(0.15);
  const [rotationX, setRotationX] = useState(90);
  const [rotationY, setRotationY] = useState(20);
  const [rotationZ, setRotationZ] = useState(0);
  const [openBlock, setOpenBlock] = useState(null);

  // === загрузка из localStorage ===
  useEffect(() => {
    const savedGap = localStorage.getItem("vortexCube2xGap");
    if (savedGap) setGap(parseFloat(savedGap));

    const rx = localStorage.getItem("vortexCube2xRotX");
    const ry = localStorage.getItem("vortexCube2xRotY");
    const rz = localStorage.getItem("vortexCube2xRotZ");

    if (rx) setRotationX(parseFloat(rx));
    if (ry) setRotationY(parseFloat(ry));
    if (rz) setRotationZ(parseFloat(rz));
  }, []);

  // === сохранение в localStorage ===
  useEffect(() => { localStorage.setItem("vortexCube2xGap", String(gap)); }, [gap]);
  useEffect(() => { localStorage.setItem("vortexCube2xRotX", String(rotationX)); }, [rotationX]);
  useEffect(() => { localStorage.setItem("vortexCube2xRotY", String(rotationY)); }, [rotationY]);
  useEffect(() => { localStorage.setItem("vortexCube2xRotZ", String(rotationZ)); }, [rotationZ]);

  // --- Управление значениями ---
  const makeHandlers = (setter, defaultValue, min, max, step = 1) => ({
    reset: () => setter(defaultValue),
    increase: () => setter(prev => Math.min(max, +(prev + step).toFixed(2))),
    decrease: () => setter(prev => Math.max(min, +(prev - step).toFixed(2))),
  });

  // Кнопки управления
  const gapHandlers = makeHandlers(setGap, 0.15, 0, 0.5, 0.01);
  const rotXHandlers = makeHandlers(setRotationX, 90, -180, 180);
  const rotYHandlers = makeHandlers(setRotationY, 20, -180, 180);
  const rotZHandlers = makeHandlers(setRotationZ, 0, -180, 180);

  return (
    <div className="cube2x-inner-container">
      <div className="cube-controls">

        {/* Состояние: ничего не открыто → показываем ВСЕ блоки (закрытые) */}
        {openBlock === null && (
          <>
            <ControlBlock label={t("control.gap")} icon="fa-solid fa-arrows-left-right" isOpen={false} onToggle={() => setOpenBlock("gap")}
              gapConfig={{value: gap, min: 0, max: 0.5, step: 0.01, onChange: setGap, ...gapHandlers}}
            />

            <ControlBlock label={t("control.incline")} icon="fa-solid fa-compass" isOpen={false} onToggle={() => setOpenBlock("rotation")}
              sliders={[
                { label: t("control.x-axis"), value: rotationX, min: -180, max: 180, handlers: { ...rotXHandlers, onChange: (v) => setRotationX(v) } },
                { label: t("control.y-axis"), value: rotationY, min: -180, max: 180, handlers: { ...rotYHandlers, onChange: (v) => setRotationY(v) } },
                { label: t("control.z-axis"), value: rotationZ, min: -180, max: 180, handlers: { ...rotZHandlers, onChange: (v) => setRotationZ(v) } },
              ]}
            />
          </>
        )}

        {/* Состояние: открыт gap → показываем только его */}
        {openBlock === "gap" && (
          <ControlBlock label={t("control.gap")} icon="fa-solid fa-arrows-left-right" isOpen={true} onToggle={() => setOpenBlock(null)}
            gapConfig={{value: gap, min: 0, max: 0.5, step: 0.01, onChange: setGap, ...gapHandlers}}
          />
        )}

        {/* Состояние: открыт rotation → показываем только его */}
        {openBlock === "rotation" && (
          <ControlBlock label={t("control.incline")} icon="fa-solid fa-compass" isOpen={true} onToggle={() => setOpenBlock(null)}
            sliders={[
              { label: t("control.x-axis"), value: rotationX, min: -180, max: 180, handlers: { ...rotXHandlers, onChange: (v) => setRotationX(v) } },
              { label: t("control.y-axis"), value: rotationY, min: -180, max: 180, handlers: { ...rotYHandlers, onChange: (v) => setRotationY(v) } },
              { label: t("control.z-axis"), value: rotationZ, min: -180, max: 180, handlers: { ...rotZHandlers, onChange: (v) => setRotationZ(v) } },
            ]}
          />
        )}

      </div>

      <div ref={ref}>
        <Canvas style={canvasStyle} camera={{ fov: 75 }} gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
          <ambientLight intensity={0.6} />
          <CubeGroup groupSize={groupSize} gap={gap} rotationX={rotationX} rotationY={rotationY} rotationZ={rotationZ} />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  );
});

VortexCube2x.displayName = 'VortexCube2x';

export default VortexCube2x;