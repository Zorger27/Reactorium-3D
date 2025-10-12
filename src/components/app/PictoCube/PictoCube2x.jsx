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

  // ---- конфигурации ----
  const cubeConfigsRaw = [
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube01, sideSmallCube01, sideSmallCube01, sideSmallCube01] },
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube02, sideSmallCube02, sideSmallCube02, sideSmallCube02] },
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube03, sideSmallCube03, sideSmallCube03, sideSmallCube03] },
    { top: topSmallCube02, bottom: bottomSmallCube02, sides: [sideSmallCube04, sideSmallCube04, sideSmallCube04, sideSmallCube04] },
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube05, sideSmallCube05, sideSmallCube05, sideSmallCube05] },
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube06, sideSmallCube06, sideSmallCube06, sideSmallCube06] },
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube07, sideSmallCube07, sideSmallCube07, sideSmallCube07] },
    { top: topSmallCube01, bottom: bottomSmallCube01, sides: [sideSmallCube08, sideSmallCube08, sideSmallCube08, sideSmallCube08] },
  ];

  // ---- Собираем все пути, фильтруем undefined и делаем уникальными ----
  const texturePathList = useMemo(() => {
    const arr = cubeConfigsRaw.flatMap(cfg => [cfg.top, cfg.bottom, ...(cfg.sides || [])]);
    return Array.from(new Set(arr.filter(Boolean))); // только truthy строки, уникально
  }, [cubeConfigsRaw]);

  // ---- Загружаем все текстуры одним вызовом ----
  // Если texturePathList пуст — передадим пустой массив (useLoader вернёт либо [], либо что-то корректное)
  const loaded = useLoader(THREE.TextureLoader, texturePathList.length ? texturePathList : []);
  // loaded гарантированно — либо Texture, либо Array; защитимся ниже.

  // ---- Создаём map: path -> Texture (чтобы можно было восстанавливать конкретную текстуру по её пути) ----
  const textureByPath = useMemo(() => {
    const map = new Map();
    if (Array.isArray(loaded)) {
      for (let i = 0; i < texturePathList.length; i++) {
        const path = texturePathList[i];
        const tex = loaded[i];
        if (path && tex) {
          // базовые параметры для всех текстур
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.flipY = true;
          tex.center = new THREE.Vector2(0.5, 0.5);
          tex.needsUpdate = true;
          map.set(path, tex);
        }
      }
    }
    return map;
  }, [loaded, texturePathList]);

  // ---- Вспомогательная функция: получить текстуру по пути, или null ----
  const getTex = (path) => (path ? textureByPath.get(path) || null : null);

  // ---- Настройка поворотов по умолчанию для граней (можно расширить/перенастроить) ----
  const defaultSideRotations = {
    right: -90,
    left: 90,
    back: 180,
    front: 0,
    top: 0,
    bottom: 0
  };

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
        // Получаем конфиг для кубика (если нет — берём по модулю)
        const cfg = cubeConfigsRaw[i % cubeConfigsRaw.length];

        // Получаем оригинальные текстуры (или null)
        const topTex = getTex(cfg.top);
        const bottomTex = getTex(cfg.bottom);

        // sides ожидается массив длины 4; если меньше — заполняем повтором
        const sidesPaths = (cfg.sides || []);
        while (sidesPaths.length < 4) sidesPaths.push(sidesPaths[sidesPaths.length - 1] || null);

        const sideTexs = sidesPaths.map(p => getTex(p));

        // Для BoxGeometry порядок материалов: [ right, left, top, bottom, front, back ]
        const materials = [];

        // helper для создания материалов с поворотом (клонируем текстуру чтобы не мутировать оригинал)
        const makeMat = (tex, rotateDeg = 0) => {
          if (!tex) return new THREE.MeshBasicMaterial({ color: 0xcccccc }); // заглушка
          const t = tex.clone();
          t.center = new THREE.Vector2(0.5, 0.5);
          t.flipY = true;
          t.colorSpace = THREE.SRGBColorSpace;
          t.rotation = degreesToRadians(rotateDeg || 0);
          t.needsUpdate = true;
          return new THREE.MeshBasicMaterial({ map: t });
        };

        // right (0) <- возьмём sideTexs[0] и повернём на defaultSideRotations.right
        materials[0] = makeMat(sideTexs[0], defaultSideRotations.right);
        // left (1)
        materials[1] = makeMat(sideTexs[1], defaultSideRotations.left);
        // front (4)
        materials[2] = makeMat(sideTexs[2], defaultSideRotations.front);
        // back (5)
        materials[3] = makeMat(sideTexs[3], defaultSideRotations.back);
        // top (2)
        materials[4] = makeMat(topTex, defaultSideRotations.top);
        // bottom (3)
        materials[5] = makeMat(bottomTex, defaultSideRotations.bottom);

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
  const [gap, setGap] = useLocalStorage("pictoCube2xGap", 0.15, parseFloat);
  const [rotationX, setRotationX] = useLocalStorage("pictoCube2xRotX", 90, parseFloat);
  const [rotationY, setRotationY] = useLocalStorage("pictoCube2xRotY", 20, parseFloat);
  const [rotationZ, setRotationZ] = useLocalStorage("pictoCube2xRotZ", 0, parseFloat);
  const [speed, setSpeed] = useLocalStorage("pictoCube2xSpeed", 0.01, parseFloat);
  const [direction, setDirection] = useLocalStorage("pictoCube2xDirection", -1, v => parseInt(v, 10));
  const [isRotating, setIsRotating] = useLocalStorage("pictoCube2xIsRotating", false, v => v === "true");

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