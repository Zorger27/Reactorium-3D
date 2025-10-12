import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/PictoCube/PictoCube2x.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import ControlBlock from "@/components/util/ControlBlock.jsx";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

import topSmallCube01 from "@/assets/app/PictoCube/cube2/top01.webp"
import topSmallCube02 from "@/assets/app/PictoCube/cube2/top02.webp"
import bottomSmallCube01 from "@/assets/app/PictoCube/cube2/bottom01.webp"
import bottomSmallCube02 from "@/assets/app/PictoCube/cube2/bottom02.webp"
import sideSmallCube01 from "@/assets/app/PictoCube/cube2/cube01.webp"
import sideSmallCube02 from "@/assets/app/PictoCube/cube2/cube02.webp"
import sideSmallCube03 from "@/assets/app/PictoCube/cube2/cube03.webp"
import sideSmallCube04 from "@/assets/app/PictoCube/cube2/cube04.webp"
import sideSmallCube05 from "@/assets/app/PictoCube/cube2/cube05.webp"
import sideSmallCube06 from "@/assets/app/PictoCube/cube2/cube06.webp"
import sideSmallCube07 from "@/assets/app/PictoCube/cube2/cube07.webp"
import sideSmallCube08 from "@/assets/app/PictoCube/cube2/cube08.webp"
import sideSmallCube09 from "@/assets/app/PictoCube/cube2/cube09.webp"

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
      autoRotate={false}
    />
  );
};

// === Группа из 8 кубиков с картинками ===
const CubeGroup = ({ groupSize, gap, rotationX, rotationY, rotationZ, isRotating, direction, speed, resetTrigger, flipTrigger }) => {
  const groupRef = useRef(null);

  // размер маленького кубика
  const cubeSize = groupSize / 2;
  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    [cubeSize]
  );

  // === Загружаем все текстуры один раз ===
  const texturePaths = [
    topSmallCube01, topSmallCube02,
    bottomSmallCube01, bottomSmallCube02,
    sideSmallCube01, sideSmallCube02, sideSmallCube03, sideSmallCube04,
    sideSmallCube05, sideSmallCube06, sideSmallCube07, sideSmallCube08, sideSmallCube09
  ];
  const textures = useLoader(THREE.TextureLoader, texturePaths);

  // === Настраиваем каждую текстуру ===
  const processedTextures = useMemo(() => {
    return textures.map((texture, index) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;

      // Индивидуальные повороты для ориентации
      texture.center = new THREE.Vector2(0.5, 0.5);
      switch (index) {
        case 0: // topSmallCube01
        case 1: // topSmallCube02
          texture.rotation = 0;
          break;
        case 2: // bottomSmallCube01
        case 3: // bottomSmallCube02
          texture.rotation = Math.PI;
          break;
        default:
          // Боковые — выравниваем ориентацию
          texture.rotation = 0;
      }

      texture.needsUpdate = true;
      return texture;
    });
  }, [textures]);

  // === Конфигурация 8 кубиков ===
  const cubeConfigs = [
    { top: processedTextures[0], bottom: processedTextures[2], sides: processedTextures.slice(4, 5) },
    { top: processedTextures[0], bottom: processedTextures[2], sides: processedTextures.slice(5, 6) },
    { top: processedTextures[0], bottom: processedTextures[2], sides: processedTextures.slice(6, 7) },
    { top: processedTextures[0], bottom: processedTextures[2], sides: processedTextures.slice(7, 8) },
    { top: processedTextures[1], bottom: processedTextures[3], sides: processedTextures.slice(8, 9) },
    { top: processedTextures[1], bottom: processedTextures[3], sides: processedTextures.slice(9, 10) },
    { top: processedTextures[1], bottom: processedTextures[3], sides: processedTextures.slice(10, 11) },
    { top: processedTextures[1], bottom: processedTextures[3], sides: processedTextures.slice(11, 12) },
  ];

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

  // === Первоначальная ориентация - Наклон по Эйлеру ===
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        degreesToRadians(rotationX),
        degreesToRadians(rotationY),
        degreesToRadians(rotationZ)
      );
    }
  }, [rotationX, rotationY, rotationZ]);

  // --- Управление вращением ---
  const [targetRotationZ, setTargetRotationZ] = useState(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Если идёт плавный поворот, ручное вращение не применяем
    if (targetRotationZ === null && isRotating) {
      groupRef.current.rotation.z += direction * speed;
    }

    if (targetRotationZ !== null) {
      const currentZ = groupRef.current.rotation.z;
      const diff = targetRotationZ - currentZ;
      const normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;

      groupRef.current.rotation.z += normalizedDiff * Math.min(10 * delta, 1);

      if (Math.abs(normalizedDiff) < 0.01) {
        groupRef.current.rotation.z = targetRotationZ;
        setTargetRotationZ(null);
      }
    }
  });

  // === Сброс ===
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        degreesToRadians(rotationX),
        degreesToRadians(rotationY),
        degreesToRadians(rotationZ)
      );
      setTargetRotationZ(null);
    }
  }, [resetTrigger]);

  // === Поворот на 180° ===
  useEffect(() => {
    if (groupRef.current) {
      const currentZ = groupRef.current.rotation.z;
      const newTarget = currentZ + Math.PI;
      setTargetRotationZ(newTarget);
    }
  }, [flipTrigger]);

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => {
        const texSet = cubeConfigs[i % cubeConfigs.length];
        const sides = texSet.sides[0]; // сейчас одна текстура для всех боков

        // создаём материалы со своей ориентацией
        const materials = [0, 1, 2, 3, 4, 5].map((sideIndex) => {
          const tex =
            sideIndex === 4 ? texSet.bottom :
              sideIndex === 5 ? texSet.top :
                sides;

          // клонируем чтобы не крутить оригинал
          const t = tex.clone();
          t.colorSpace = THREE.SRGBColorSpace;
          t.center = new THREE.Vector2(0.5, 0.5);
          t.flipY = true;

          // коррекция ориентации по сторонам
          if (sideIndex === 1) t.rotation = degreesToRadians(90); // left
          if (sideIndex === 0) t.rotation = degreesToRadians(-90); // right
          if (sideIndex === 3) t.rotation = degreesToRadians(180); // back

          t.needsUpdate = true;
          return new THREE.MeshBasicMaterial({ map: t });
        });

        return (
          <mesh key={i} position={pos} geometry={geometry} material={materials} />
        );
      })}
    </group>
  );
};

const PictoCube2x = forwardRef(({ groupSize = 2.5 }, ref) => {
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
  const [openBlock, setOpenBlock] = useState(null);

  // управление вращением
  const [resetTrigger, setResetTrigger] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(false);

  // === загрузка и сохранение в localStorage ===
  const [gap, setGap] = useLocalStorage("vortexCube3xGap", 0.15, parseFloat);
  const [rotationX, setRotationX] = useLocalStorage("vortexCube3xRotX", 90, parseFloat);
  const [rotationY, setRotationY] = useLocalStorage("vortexCube3xRotY", 20, parseFloat);
  const [rotationZ, setRotationZ] = useLocalStorage("vortexCube3xRotZ", 0, parseFloat);
  const [speed, setSpeed] = useLocalStorage("vortexCube3xSpeed", 0.01, parseFloat);
  const [direction, setDirection] = useLocalStorage("vortexCube3xDirection", -1, v => parseInt(v, 10));
  const [isRotating, setIsRotating] = useLocalStorage("vortexCube3xIsRotating", false, v => v === "true");

  // --- кнопки вращения ---
  const handleClockwise = () => {
    setDirection(1);
    setIsRotating(true);
  };

  const handleCounterClockwise = () => {
    setDirection(-1);
    setIsRotating(true);
  };

  const handlePause = () => {
    setIsRotating(prev => !prev);
  };

  const handleStop = () => {
    setIsRotating(false);
    setResetTrigger(prev => !prev); // триггер на сброс
  };

  const handleFlip = () => {
    setFlipTrigger(prev => !prev);
  };

  // --- фабрика хэндлеров для ControlBlock ---
  const makeHandlers = (setter, defaultValue, min, max, step = 1) => ({
    reset: () => setter(defaultValue),
    increase: () => setter(prev => Math.min(max, +(prev + step).toFixed(2))),
    decrease: () => setter(prev => Math.max(min, +(prev - step).toFixed(2))),
  });

  // Кнопки управления
  const speedHandlers = makeHandlers(setSpeed, 0.01, 0, 0.05, 0.01);
  const gapHandlers = makeHandlers(setGap, 0.15, 0, 0.5, 0.01);
  const rotXHandlers = makeHandlers(setRotationX, 90, -180, 180);
  const rotYHandlers = makeHandlers(setRotationY, 20, -180, 180);
  const rotZHandlers = makeHandlers(setRotationZ, 0, -180, 180);

  return (
    <div className="picto-cube2x-container">
      <div className="cube-controls">

        {/* Состояние: ничего не открыто → показываем ВСЕ блоки (закрытые) */}
        {openBlock === null && (
          <>
            <ControlBlock label={t("control.speed")} isOpen={false} onToggle={() => setOpenBlock("speed")}
                          gapConfig={{value: speed, min: 0, max: 0.05, step: 0.01, onChange: setSpeed, ...speedHandlers,}}
            />
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

        {/* Состояние: открыт speed → показываем только его */}
        {openBlock === "speed" && (
          <ControlBlock label={t("control.speed")} isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: speed, min: 0, max: 0.05, step: 0.01, onChange: setSpeed, ...speedHandlers,}}
          />
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

      {/* === Панель кнопок управления вращением === */}
      <div className="rotation-buttons">
        <button onClick={handleClockwise} title={t('control.clockwise')}><i className="fas fa-rotate-right"></i></button>
        <button onClick={handlePause} title={ isRotating ? t('control.pause') : t('control.continue') }>
          <i className={`fas ${isRotating ? "fa-pause" : "fa-play"}`}></i>
        </button>
        <button onClick={handleStop} title={t('control.stop')}><i className="fas fa-stop"></i></button>
        <button onClick={handleFlip} title={t('control.180')}><i className="fas fa-sync-alt"></i></button>
        <button onClick={handleCounterClockwise} title={t('control.counterclockwise')}><i className="fas fa-rotate-left"></i></button>
      </div>

      <div ref={ref}>
        <Canvas style={canvasStyle} camera={{ fov: 75 }} gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
          <ambientLight intensity={0.6} />
          <CubeGroup
            groupSize={groupSize}
            gap={gap}
            rotationX={rotationX}
            rotationY={rotationY}
            rotationZ={rotationZ}
            isRotating={isRotating}
            direction={direction}
            speed={speed}
            resetTrigger={resetTrigger}
            flipTrigger={flipTrigger}
          />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
});

PictoCube2x.displayName = 'PictoCube2x';

export default PictoCube2x;