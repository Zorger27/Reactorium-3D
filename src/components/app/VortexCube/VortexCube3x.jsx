import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import "@/components/app/VortexCube/VortexCube3x.scss"
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import ControlBlock from "@/components/util/ControlBlock.jsx";
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
const CubeGroup = ({ groupSize, gap, rotationX, rotationY, rotationZ }) => {
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

const VortexCube3x = forwardRef(({ groupSize = 2.5 }, ref) => {
  const { t } = useTranslation();
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

  // states
  const [gap, setGap] = useState(0.15);
  const [rotationX, setRotationX] = useState(90);
  const [rotationY, setRotationY] = useState(20);
  const [rotationZ, setRotationZ] = useState(0);
  const [openBlock, setOpenBlock] = useState(null);

  // === загрузка из localStorage ===
  useEffect(() => {
    const savedGap = localStorage.getItem("vortexCube3xGap");
    if (savedGap) setGap(parseFloat(savedGap));

    const rx = localStorage.getItem("vortexCube3xRotX");
    const ry = localStorage.getItem("vortexCube3xRotY");
    const rz = localStorage.getItem("vortexCube3xRotZ");

    if (rx) setRotationX(parseFloat(rx));
    if (ry) setRotationY(parseFloat(ry));
    if (rz) setRotationZ(parseFloat(rz));
  }, []);

  // === сохранение в localStorage ===
  useEffect(() => { localStorage.setItem("vortexCube3xGap", String(gap)); }, [gap]);
  useEffect(() => { localStorage.setItem("vortexCube3xRotX", String(rotationX)); }, [rotationX]);
  useEffect(() => { localStorage.setItem("vortexCube3xRotY", String(rotationY)); }, [rotationY]);
  useEffect(() => { localStorage.setItem("vortexCube3xRotZ", String(rotationZ)); }, [rotationZ]);

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
    <div className="cube3x-inner-container">
      <div className="cube-controls">

        {/* Состояние: ничего не открыто → показываем ВСЕ блоки (закрытые) */}
        {openBlock === null && (
          <>
            <ControlBlock label={t("control.gap")} isOpen={false} onToggle={() => setOpenBlock("gap")}
                          gapConfig={{value: gap, min: 0, max: 0.5, step: 0.01, onChange: setGap, ...gapHandlers}}
            />

            <ControlBlock label={t("control.incline")} isOpen={false} onToggle={() => setOpenBlock("rotation")}
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
          <ControlBlock label={t("control.gap")} isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: gap, min: 0, max: 0.5, step: 0.01, onChange: setGap, ...gapHandlers}}
          />
        )}

        {/* Состояние: открыт rotation → показываем только его */}
        {openBlock === "rotation" && (
          <ControlBlock label={t("control.incline")} isOpen={true} onToggle={() => setOpenBlock(null)}
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
  )
});

VortexCube3x.displayName = 'VortexCube3x';

export default VortexCube3x;