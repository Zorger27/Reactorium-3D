import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/PictoCube/PictoCube2x.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import ControlBlock from "@/components/util/ControlBlock.jsx";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

import topSmallCube from "@/assets/app/PictoCube/cube2/top01.webp"
import bottomSmallCube from "@/assets/app/PictoCube/cube2/bottom01.webp"
import sideSmallCube01 from "@/assets/app/PictoCube/cube2/cube01.webp"
import sideSmallCube02 from "@/assets/app/PictoCube/cube2/cube02.webp"
import sideSmallCube03 from "@/assets/app/PictoCube/cube2/cube03.webp"
import sideSmallCube04 from "@/assets/app/PictoCube/cube2/cube04.webp"
import sideSmallCube05 from "@/assets/app/PictoCube/cube2/cube05.webp"
import sideSmallCube06 from "@/assets/app/PictoCube/cube2/cube06.webp"
import sideSmallCube07 from "@/assets/app/PictoCube/cube2/cube07.webp"
import sideSmallCube08 from "@/assets/app/PictoCube/cube2/cube08.webp"

extend({ OrbitControls });
const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

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

// Конфигурации кубиков
const CUBE_CONFIGS = [
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube01, sideSmallCube01, sideSmallCube01, sideSmallCube01] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube02, sideSmallCube02, sideSmallCube02, sideSmallCube02] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube03, sideSmallCube03, sideSmallCube03, sideSmallCube03] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube04, sideSmallCube04, sideSmallCube04, sideSmallCube04] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube05, sideSmallCube05, sideSmallCube05, sideSmallCube05] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube06, sideSmallCube06, sideSmallCube06, sideSmallCube06] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube07, sideSmallCube07, sideSmallCube07, sideSmallCube07] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube08, sideSmallCube08, sideSmallCube08, sideSmallCube08] },
];

// ---- Настройка поворотов по умолчанию для граней (можно расширить/перенастроить) ----
const DEFAULT_SIDE_ROTATIONS = {
  right: -90,
  left: 90,
  back: 180,
  front: 0,
  top: 0,
  bottom: 0
};

const CubeGroup = ({ groupSize, gap, rotationX, rotationY, rotationZ, isRotating, direction, speed, resetTrigger, flipTrigger, smallCubeScale, shuffleTrigger, positionsResetTrigger }) => {
  const groupRef = useRef(null);
  const cubeSize = groupSize / 2;

  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize * smallCubeScale, cubeSize * smallCubeScale, cubeSize * smallCubeScale),
    [cubeSize, smallCubeScale]
  );

  const texturePathList = useMemo(() => {
    const arr = CUBE_CONFIGS.flatMap(cfg => [cfg.top, cfg.bottom, ...(cfg.sides || [])]);
    return Array.from(new Set(arr.filter(Boolean)));
  }, []);

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

  // === Базовые упорядоченные позиции для 2×2×2 (8 кубиков) ===
  const basePositions = useMemo(() => {
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

  // --- order (массив индексов 0..7). Если null — значит упорядочено.
  const STORAGE_KEY = 'pictoCube2xPositionsOrder';

  // Используем useState с ленивой инициализацией из localStorage
  const [order, setOrder] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 8) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Ошибка чтения order из localStorage:', e);
    }
    return null;
  });

  const isInitializedRef = useRef(false); // Используем ref вместо state (флаг инициализации)

  // Храним текущие позиции кубиков (куда они реально должны идти)
  const currentTargetsRef = useRef([]);

  // Флаг - двигаются ли кубики сейчас (только при shuffle)
  const isMovingRef = useRef(false);

  // === targets — реальные координаты, к которым идут кубики ===
  const targets = useMemo(() => {
    if (Array.isArray(order)) {
      return order.map(idx => basePositions[idx]);
    }
    return basePositions;
  }, [basePositions, order]);

  // Сохраняем order в localStorage при каждом изменении
  useEffect(() => {
    if (order === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }
  }, [order]);

  // Инициализируем позиции кубиков при первом рендере ПОСЛЕ загрузки order
  useEffect(() => {
    if (groupRef.current && !isInitializedRef.current) {
      isInitializedRef.current = true;
      currentTargetsRef.current = targets.map(pos => [...pos]);

      groupRef.current.children.forEach((mesh, i) => {
        const t = currentTargetsRef.current[i];
        if (t) {
          mesh.position.set(t[0], t[1], t[2]);
        }
      });
    }
  }, [targets]);

  // При изменении gap - синхронно обновляем currentTargets БЕЗ анимации
  useEffect(() => {
    if (!isMovingRef.current && currentTargetsRef.current.length > 0 && isInitializedRef.current) {
      currentTargetsRef.current = targets.map(pos => [...pos]);

      if (groupRef.current) {
        groupRef.current.children.forEach((mesh, i) => {
          const t = currentTargetsRef.current[i];
          if (t) {
            mesh.position.set(t[0], t[1], t[2]);
          }
        });
      }
    }
  }, [targets, gap]);

  // При shuffleTrigger — создаём новую случайную перестановку индексов
  useEffect(() => {
    if (shuffleTrigger === 0) return;

    const n = basePositions.length;
    const arr = Array.from({ length: n }, (_, i) => i);

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    setOrder(arr);
    isMovingRef.current = true;
  }, [shuffleTrigger, basePositions.length]);

  // При positionsResetTrigger — очищаем order
  useEffect(() => {
    if (positionsResetTrigger === 0) return;

    setOrder(null);
    isMovingRef.current = true;
  }, [positionsResetTrigger]);

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

    const smoothSpeed = 3.0;

    if (isMovingRef.current) {
      let allReached = true;

      groupRef.current.children.forEach((mesh, i) => {
        const t = targets[i];
        if (!t) return;

        if (!currentTargetsRef.current[i]) {
          currentTargetsRef.current[i] = [...t];
        }

        const current = currentTargetsRef.current[i];

        current[0] += (t[0] - current[0]) * (1 - Math.exp(-smoothSpeed * delta));
        current[1] += (t[1] - current[1]) * (1 - Math.exp(-smoothSpeed * delta));
        current[2] += (t[2] - current[2]) * (1 - Math.exp(-smoothSpeed * delta));

        const targetVec = new THREE.Vector3(current[0], current[1], current[2]);
        mesh.position.lerp(targetVec, 1 - Math.exp(-smoothSpeed * delta));

        const distance = mesh.position.distanceTo(targetVec);
        if (distance > 0.001) {
          allReached = false;
        }
      });

      if (allReached) {
        isMovingRef.current = false;
      }
    }

    if (targetRotationZ === null && isRotating) {
      groupRef.current.rotation.z += direction * speed;
    }
    if (targetRotationZ !== null) {
      const diff = targetRotationZ - groupRef.current.rotation.z;
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

  // Мемоизируем создание материалов
  const cubeMaterials = useMemo(() => {

    // ---- Вспомогательная функция: получить текстуру по пути, или null ----
    const getTex = (path) => (path ? textureByPath.get(path) || null : null);

    const makeMat = (tex, rotateDeg = 0) => {
      if (!tex) return new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const t = tex.clone();
      t.center = new THREE.Vector2(0.5, 0.5);
      t.flipY = true;
      t.colorSpace = THREE.SRGBColorSpace;
      t.rotation = degreesToRadians(rotateDeg || 0);
      t.needsUpdate = true;
      return new THREE.MeshBasicMaterial({
        map: t,
        depthTest: true,
        depthWrite: true,
        transparent: false
      });
    };

    return Array.from({ length: 8 }, (_, i) => {
      const cfg = CUBE_CONFIGS[i % CUBE_CONFIGS.length];
      const topTex = getTex(cfg.top);
      const bottomTex = getTex(cfg.bottom);

      const sidesPaths = [...(cfg.sides || [])];
      while (sidesPaths.length < 4) sidesPaths.push(sidesPaths[sidesPaths.length - 1] || null);
      const sideTexs = sidesPaths.map(p => getTex(p));

      return [
        makeMat(sideTexs[0], DEFAULT_SIDE_ROTATIONS.right),
        makeMat(sideTexs[1], DEFAULT_SIDE_ROTATIONS.left),
        makeMat(sideTexs[2], DEFAULT_SIDE_ROTATIONS.front),
        makeMat(sideTexs[3], DEFAULT_SIDE_ROTATIONS.back),
        makeMat(bottomTex, DEFAULT_SIDE_ROTATIONS.bottom),
        makeMat(topTex, DEFAULT_SIDE_ROTATIONS.top),
      ];
    });
  }, [textureByPath]);

  return (
    <group ref={groupRef}>
      {basePositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={geometry} material={cubeMaterials[i]} />
      ))}
    </group>
  );
};

const PictoCube2x = forwardRef(({ groupSize = 2.5 }, ref) => {
  const { t } = useTranslation();

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
  const [shuffleTrigger, setShuffleTrigger] = useState(0);
  const [positionsResetTrigger, setPositionsResetTrigger] = useState(0);
  const [isSpecialMenuOpen, setIsSpecialMenuOpen] = useState(false);

  // управление вращением
  const [resetTrigger, setResetTrigger] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(false);

  // === загрузка и сохранение в localStorage ===
  const [gap, setGap] = useLocalStorage("pictoCube2xGap", 0.15, parseFloat);
  const [smallCubeScale, setSmallCubeScale] = useLocalStorage("pictoCube2xSmallCubeScale", 0.85, parseFloat);
  const [rotationX, setRotationX] = useLocalStorage("pictoCube2xRotX", 90, parseFloat);
  const [rotationY, setRotationY] = useLocalStorage("pictoCube2xRotY", 0, parseFloat);
  const [rotationZ, setRotationZ] = useLocalStorage("pictoCube2xRotZ", 0, parseFloat);
  const [speed, setSpeed] = useLocalStorage("pictoCube2xSpeed", 0.01, parseFloat);
  const [direction, setDirection] = useLocalStorage("pictoCube2xDirection", 1, v => parseInt(v, 10));
  const [isRotating, setIsRotating] = useLocalStorage("pictoCube2xIsRotating", true, v => v === "true");

  // --- кнопки вращения ---
  const handleClockwise = () => {setDirection(1);setIsRotating(true);};
  const handleCounterClockwise = () => {setDirection(-1);setIsRotating(true);};
  const handlePause = () => {setIsRotating(prev => !prev);};
  const handleStop = () => {setIsRotating(false);setResetTrigger(prev => !prev);};
  const handleFlip = () => {setFlipTrigger(prev => !prev);};

  // --- фабрика хэндлеров для ControlBlock ---
  const makeHandlers = (setter, defaultValue, min, max, step = 1) => ({
    reset: () => setter(defaultValue),
    increase: () => setter(prev => Math.min(max, +(prev + step).toFixed(2))),
    decrease: () => setter(prev => Math.max(min, +(prev - step).toFixed(2))),
  });

  // Кнопки управления
  const speedHandlers = makeHandlers(setSpeed, 0.01, 0, 0.05, 0.01);
  const gapHandlers = makeHandlers(setGap, 0.15, 0, 0.5, 0.01);
  const smallCubeScaleHandlers = makeHandlers(setSmallCubeScale, 0.85, 0.5, 1, 0.05);
  const rotXHandlers = makeHandlers(setRotationX, 90, -180, 180);
  const rotYHandlers = makeHandlers(setRotationY, 0, -180, 180);
  const rotZHandlers = makeHandlers(setRotationZ, 0, -180, 180);

  // useEffect для закрытия при клике вне меню
  useEffect(() => {
    if (!isSpecialMenuOpen) return;

    const handleClickOutside = (event) => {
      // Проверяем, что клик был НЕ по кнопкам меню
      if (!event.target.closest('.special-buttons')) {
        setIsSpecialMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSpecialMenuOpen]);

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

            <ControlBlock label={t("control.small-cube-size")} isOpen={false} onToggle={() => setOpenBlock("smallCubeSize")}
              gapConfig={{value: smallCubeScale, min: 0.5, max: 1.0, step: 0.05, onChange: setSmallCubeScale, ...smallCubeScaleHandlers,}}
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

        {openBlock === "smallCubeSize" && (
          <ControlBlock label={t("control.small-cube-size")} isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: smallCubeScale, min: 0.5, max: 1.0, step: 0.05, onChange: setSmallCubeScale, ...smallCubeScaleHandlers,}}
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
        <button onClick={handleClockwise} title={t('control.clockwise')}><i className="fa-solid fa-left-long"></i></button>
        <button onClick={handlePause} title={ isRotating ? t('control.pause') : t('control.continue') }>
          <i className={`fas ${isRotating ? "fa-pause" : "fa-play"}`}></i>
        </button>
        <button onClick={handleStop} title={t('control.stop')}><i className="fas fa-stop"></i></button>
        <button onClick={handleFlip} title={t('control.180')}><i className="fas fa-sync-alt"></i></button>
        <button onClick={handleCounterClockwise} title={t('control.counterclockwise')}><i className="fa-solid fa-right-long"></i></button>
      </div>

      {/* === Панель специальных кнопок === */}
      <div className="special-buttons">
        {/* Главная кнопка */}
        <button className={`main-shuffle-button ${isSpecialMenuOpen ? 'open' : ''}`} onClick={() => setIsSpecialMenuOpen(prev => !prev)} title={t('control.shuffle-menu')}>
          <i className={`fas ${isSpecialMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Подменю с кнопками */}
        <div className={`special-submenu ${isSpecialMenuOpen ? 'open' : ''}`}>
          <button onClick={() => {setShuffleTrigger(prev => prev + 1);setIsSpecialMenuOpen(true);}} title={t('control.shuffle')}>
            <i className="fas fa-random"></i>
          </button>
          <button onClick={() => {setPositionsResetTrigger(prev => prev + 1);setIsSpecialMenuOpen(true);}} title={t('control.resetPositions')}>
            <i className="fas fa-undo"></i>
          </button>
        </div>
      </div>

      <div ref={ref}>
        <Canvas style={canvasStyle} camera={{ fov: 75 }} gl={{ antialias: true, toneMapping: THREE.NoToneMapping, logarithmicDepthBuffer: true }}>
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
            smallCubeScale={smallCubeScale}
            shuffleTrigger={shuffleTrigger}
            positionsResetTrigger={positionsResetTrigger}
          />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
});

PictoCube2x.displayName = 'PictoCube2x';

export default PictoCube2x;