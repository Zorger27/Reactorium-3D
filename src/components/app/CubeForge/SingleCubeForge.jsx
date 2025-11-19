import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/CubeForge/SingleCubeForge.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import ControlBlock from "@/components/util/ControlBlock.jsx";
import { useTranslation } from 'react-i18next';
import jsPDF from "jspdf";
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

import topSmallCube from "@/assets/app/PictoCube/cube3/top01.webp"
import bottomSmallCube from "@/assets/app/PictoCube/cube3/bottom03.webp"
import sideSmallCube01 from "@/assets/app/PictoCube/cube3/cube01.webp"
import sideSmallCube02 from "@/assets/app/PictoCube/cube3/cube02.webp"
import sideSmallCube03 from "@/assets/app/PictoCube/cube3/cube03.webp"
import sideSmallCube04 from "@/assets/app/PictoCube/cube3/cube04.webp"
import sideSmallCube05 from "@/assets/app/PictoCube/cube3/cube05.webp"
import sideSmallCube06 from "@/assets/app/PictoCube/cube3/cube06.webp"
import sideSmallCube07 from "@/assets/app/PictoCube/cube3/cube07.webp"
import sideSmallCube08 from "@/assets/app/PictoCube/cube3/cube08.webp"
import sideSmallCube09 from "@/assets/app/PictoCube/cube3/cube09.webp"
import sideSmallCube10 from "@/assets/app/PictoCube/cube3/cube10.webp"
import sideSmallCube11 from "@/assets/app/PictoCube/cube3/cube11.webp"
import sideSmallCube12 from "@/assets/app/PictoCube/cube3/cube12.webp"
import sideSmallCube13 from "@/assets/app/PictoCube/cube3/cube13.webp"
import sideSmallCube14 from "@/assets/app/PictoCube/cube3/cube14.webp"
import sideSmallCube15 from "@/assets/app/PictoCube/cube3/cube15.webp"
import sideSmallCube16 from "@/assets/app/PictoCube/cube3/cube16.webp"
import sideSmallCube17 from "@/assets/app/PictoCube/cube3/cube17.webp"
import sideSmallCube18 from "@/assets/app/PictoCube/cube3/cube18.webp"
import sideSmallCube19 from "@/assets/app/PictoCube/cube3/cube19.webp"
import sideSmallCube20 from "@/assets/app/PictoCube/cube3/cube20.webp"
import sideSmallCube21 from "@/assets/app/PictoCube/cube3/cube21.webp"
import sideSmallCube22 from "@/assets/app/PictoCube/cube3/cube22.webp"
import sideSmallCube23 from "@/assets/app/PictoCube/cube3/cube23.webp"
import sideSmallCube24 from "@/assets/app/PictoCube/cube3/cube24.webp"
import sideSmallCube25 from "@/assets/app/PictoCube/cube3/cube25.webp"
import sideSmallCube26 from "@/assets/app/PictoCube/cube3/cube26.webp"
import sideSmallCube27 from "@/assets/app/PictoCube/cube3/cube27.webp"

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

// Конфигурации 27 кубиков
const CUBE_CONFIGS = [
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube01, sideSmallCube01, sideSmallCube01, sideSmallCube01] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube02, sideSmallCube02, sideSmallCube02, sideSmallCube02] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube03, sideSmallCube03, sideSmallCube03, sideSmallCube03] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube04, sideSmallCube04, sideSmallCube04, sideSmallCube04] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube05, sideSmallCube05, sideSmallCube05, sideSmallCube05] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube06, sideSmallCube06, sideSmallCube06, sideSmallCube06] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube07, sideSmallCube07, sideSmallCube07, sideSmallCube07] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube08, sideSmallCube08, sideSmallCube08, sideSmallCube08] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube09, sideSmallCube09, sideSmallCube09, sideSmallCube09] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube10, sideSmallCube10, sideSmallCube10, sideSmallCube10] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube11, sideSmallCube11, sideSmallCube11, sideSmallCube11] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube12, sideSmallCube12, sideSmallCube12, sideSmallCube12] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube13, sideSmallCube13, sideSmallCube13, sideSmallCube13] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube14, sideSmallCube14, sideSmallCube14, sideSmallCube14] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube15, sideSmallCube15, sideSmallCube15, sideSmallCube15] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube16, sideSmallCube16, sideSmallCube16, sideSmallCube16] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube17, sideSmallCube17, sideSmallCube17, sideSmallCube17] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube18, sideSmallCube18, sideSmallCube18, sideSmallCube18] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube19, sideSmallCube19, sideSmallCube19, sideSmallCube19] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube20, sideSmallCube20, sideSmallCube20, sideSmallCube20] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube21, sideSmallCube21, sideSmallCube21, sideSmallCube21] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube22, sideSmallCube22, sideSmallCube22, sideSmallCube22] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube23, sideSmallCube23, sideSmallCube23, sideSmallCube23] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube24, sideSmallCube24, sideSmallCube24, sideSmallCube24] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube25, sideSmallCube25, sideSmallCube25, sideSmallCube25] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube26, sideSmallCube26, sideSmallCube26, sideSmallCube26] },
  { top: topSmallCube, bottom: bottomSmallCube, sides: [sideSmallCube27, sideSmallCube27, sideSmallCube27, sideSmallCube27] },
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

const CubeGroup = ({ groupSize, gap, rotationX, rotationY, rotationZ, isRotating, direction, speed, resetTrigger, flipTrigger, smallCubeScale, shuffleTrigger, positionsResetTrigger, cubeMode }) => {
  const groupRef = useRef(null);
  const cubeSize = groupSize / 3;

  // === Расчет количества кубов в зависимости от режима ===
  const getCubeCount = () => {
    // cubeMode теперь уже содержит количество кубов (1, 8 или 27)
    return cubeMode;
  };

  const cubeCount = cubeMode;

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

  // === Базовые упорядоченные позиции в зависимости от cubeMode ===
  const basePositions = useMemo(() => {
    if (cubeMode === 1) {
      // Один куб в центре
      return [[0, 0, 0]];
    } else if (cubeMode === 8) {
      // 2x2x2 кубов
      const step = (cubeSize + gap) / 2;
      const coords = [-step, step];
      const result = [];
      for (let x of coords) {
        for (let y of coords) {
          for (let z of coords) {
            result.push([x, y, z]);
          }
        }
      }
      return result;
    } else {
      // 3x3x3 кубов (27 кубов)
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
    }
  }, [cubeSize, gap, cubeMode]);

  // --- order (массив индексов 0..26). Если null — значит упорядочено.
  const STORAGE_KEY = 'singleCubeForgePositionsOrder';

  // Используем useState с ленивой инициализацией из localStorage
  const [order, setOrder] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Проверяем соответствие текущему режиму
        if (Array.isArray(parsed) && parsed.length === cubeCount) {
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

      const children = Array.from(groupRef.current.children);
      children.forEach((mesh, i) => {
        const t = currentTargetsRef.current[i];
        if (t) {
          mesh.position.set(t[0], t[1], t[2]);
        }
      });
    }
  }, [targets]);

  // === Сброс инициализации при смене режима ===
  useEffect(() => {
    isInitializedRef.current = false;
    currentTargetsRef.current = [];
    setOrder(null);
  }, [cubeMode]);

  // При изменении gap - синхронно обновляем currentTargets БЕЗ анимации
  useEffect(() => {
    if (!isMovingRef.current && currentTargetsRef.current.length > 0 && isInitializedRef.current) {
      currentTargetsRef.current = targets.map(pos => [...pos]);

      if (groupRef.current) {
        const children = Array.from(groupRef.current.children);
        children.forEach((mesh, i) => {
          const t = currentTargetsRef.current[i];
          if (t) {
            mesh.position.set(t[0], t[1], t[2]);
          }
        });
      }
    }
  }, [targets, gap]);

  // === Перемешивание кубов ===
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

  // === Сброс позиций кубов ===
  useEffect(() => {
    if (positionsResetTrigger === 0) return;

    setOrder(null);
    isMovingRef.current = true;
  }, [positionsResetTrigger]);

  // === Первоначальная ориентация ===
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

  // === Основная функция анимации сцены (useFrame) ===
  useFrame((_, delta) => {
    /**
     * Отвечает за плавное перемещение, вращение и анимацию группы кубиков в реальном времени.
     * Состоит из трёх логических блоков:
     * 1. Перемещение кубиков к целевым позициям (shuffle/reset)
     * 2. Постоянное вращение группы
     * 3. Плавный поворот к заданному углу
     */

    // Проверка: если группа кубиков не инициализирована — выходим
    if (!groupRef.current) return;

    // Скорость плавной анимации перемещения кубиков (выше = быстрее)
    const smoothSpeed = 3.0;

    // === БЛОК 1: Анимация перемещения кубиков (shuffle/reset) ===
    if (isMovingRef.current) {
      // Флаг: все ли кубики достигли своих целевых позиций
      let allReached = true;

      // Проходим по каждому кубику в группе
      const children = Array.from(groupRef.current.children);
      children.forEach((mesh, i) => {
        // Получаем целевую позицию для текущего кубика
        const t = targets[i];
        if (!t) return;

        // Инициализируем текущую позицию, если её ещё нет
        if (!currentTargetsRef.current[i]) {
          currentTargetsRef.current[i] = [...t];
        }

        const current = currentTargetsRef.current[i];

        // Плавное движение по каждой оси (X, Y, Z) с экспоненциальным затуханием
        // Формула: новое значение += (целевое - текущее) * фактор_скорости
        // Фактор скорости: (1 - Math.exp(-smoothSpeed * delta)) даёт плавное замедление
        current[0] += (t[0] - current[0]) * (1 - Math.exp(-smoothSpeed * delta));
        current[1] += (t[1] - current[1]) * (1 - Math.exp(-smoothSpeed * delta));
        current[2] += (t[2] - current[2]) * (1 - Math.exp(-smoothSpeed * delta));

        // Создаём вектор целевой позиции для интерполяции
        const targetVec = new THREE.Vector3(current[0], current[1], current[2]);

        // Применяем линейную интерполяцию (lerp) к реальной позиции меша
        mesh.position.lerp(targetVec, 1 - Math.exp(-smoothSpeed * delta));

        // Проверяем расстояние до цели (если больше 0.001 — кубик ещё движется)
        const distance = mesh.position.distanceTo(targetVec);
        if (distance > 0.001) {
          allReached = false; // Ещё не достигли цели
        }
      });

      // Если все кубики достигли своих позиций — останавливаем анимацию перемещения
      if (allReached) {
        isMovingRef.current = false;
      }
    }

    // === БЛОК 2: Постоянное вращение группы кубиков ===
    // Преобразуем пользовательскую скорость (0-10) в реальную скорость вращения (0-0.025)
    // При значении 4 получаем комфортную скорость ~0.01 радиан/кадр
    const actualSpeed = (speed / 10) * 0.025;

    // Если нет целевого угла поворота И вращение включено — крутим постоянно
    if (targetRotationZ === null && isRotating) {
      groupRef.current.rotation.z += direction * actualSpeed;
    }

    // === БЛОК 3: Плавный поворот на заданный угол (например, 180°) ===
    if (targetRotationZ !== null) {
      // Вычисляем разницу между текущим и целевым углом
      const diff = targetRotationZ - groupRef.current.rotation.z;

      // Нормализуем угол в диапазон [-π, π] (кратчайший путь поворота)
      // Формула убирает "лишние обороты" и находит оптимальное направление
      const normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;

      // Плавно приближаемся к целевому углу (ограничиваем скорость поворота)
      groupRef.current.rotation.z += normalizedDiff * Math.min(10 * delta, 1);

      // Если угол почти достигнут (погрешность < 0.01 радиан) — фиксируем и сбрасываем цель
      if (Math.abs(normalizedDiff) < 0.01) {
        groupRef.current.rotation.z = targetRotationZ;
        setTargetRotationZ(null); // Возвращаемся к обычному вращению
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

  // Очистка. При размонтировании CubeGroup все текстуры и материалы будут освобождены и память не утечёт!
  useEffect(() => {
    return () => {
      if (!groupRef.current) return;
      groupRef.current.children.forEach(mesh => {
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              if (mat.map) mat.map.dispose(); // освобождаем текстуру
              mat.dispose(); // освобождаем материал
            });
          } else {
            if (mesh.material.map) mesh.material.map.dispose();
            mesh.material.dispose();
          }
        }
        if (mesh.geometry) mesh.geometry.dispose(); // освобождаем геометрию
      });
    };
  }, []);

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

    // Генерируем материалы для текущего числа кубов
    return Array.from({ length: cubeCount }, (_, i) => {
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
  }, [textureByPath, cubeCount]);

  return (
    <group ref={groupRef}>
      {basePositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={geometry} material={cubeMaterials[i]} />
      ))}
    </group>
  );
};

const SingleCubeForge = forwardRef(({ groupSize = 2.5 }, ref) => {
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
  const [isShuffleMenuOpen, setIsShuffleMenuOpen] = useState(false);
  const [isClearMenuOpen, setIsClearMenuOpen] = useState(false);
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);

  // Состояние для записи видео
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const animationFrameRef = useRef(null);

  // управление вращением
  const [resetTrigger, setResetTrigger] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(false);

  // === загрузка и сохранение в localStorage ===
  const [gap, setGap, resetGap] = useLocalStorage("singleCubeForgeGap", 0.15, parseFloat);
  const [smallCubeScale, setSmallCubeScale, resetSmallCubeScale] = useLocalStorage("singleCubeForgeSmallCubeScale", 0.85, parseFloat);
  const [rotationX, setRotationX, resetRotationX] = useLocalStorage("singleCubeForgeRotX", 90, parseFloat);
  const [rotationY, setRotationY, resetRotationY] = useLocalStorage("singleCubeForgeRotY", 0, parseFloat);
  const [rotationZ, setRotationZ, resetRotationZ] = useLocalStorage("singleCubeForgeRotZ", 0, parseFloat);
  const [speed, setSpeed, resetSpeed] = useLocalStorage("singleCubeForgeSpeed", 4, parseFloat);
  const [direction, setDirection, resetDirection] = useLocalStorage("singleCubeForgeDirection", 1, v => parseInt(v, 10));
  const [isRotating, setIsRotating, resetIsRotating] = useLocalStorage("singleCubeForgeIsRotating", true, v => v === "true");
  // === Новый режим кубов ===
  const [cubeMode, setCubeMode] = useLocalStorage("singleCubeForgeCubeMode", 3, v => parseInt(v, 10));

  // --- кнопки вращения ---
  const handleClockwise = () => {setDirection(1);setIsRotating(true);};
  const handleCounterClockwise = () => {setDirection(-1);setIsRotating(true);};
  const handlePause = () => {setIsRotating(prev => !prev);};
  const handleStop = () => {setIsRotating(false);setResetTrigger(prev => !prev);};
  const handleFlip = () => {setFlipTrigger(prev => !prev);};

  // --- Фабрика хэндлеров для ControlBlock ---
  const makeHandlers = (setter, defaultValue, min, max, step = 1) => ({
    reset: () => setter(defaultValue),
    increase: () => setter(prev => Math.min(max, +(prev + step).toFixed(2))),
    decrease: () => setter(prev => Math.max(min, +(prev - step).toFixed(2))),
  });

  // Кнопки управления
  const cubeModeHandlers = makeHandlers(setCubeMode, 3, 1, 3, 1);
  const speedHandlers = makeHandlers(setSpeed, 4, 0, 10, 1);
  const gapHandlers = makeHandlers(setGap, 0.15, 0, 0.5, 0.01);
  const smallCubeScaleHandlers = makeHandlers(setSmallCubeScale, 0.85, 0.5, 1, 0.05);
  const rotXHandlers = makeHandlers(setRotationX, 90, -180, 180);
  const rotYHandlers = makeHandlers(setRotationY, 0, -180, 180);
  const rotZHandlers = makeHandlers(setRotationZ, 0, -180, 180);

  // Объект для маппинга режима на количество кубов:
  const cubeModeMap = {
    1: 1,   // режим 1 = 1 куб
    2: 8,   // режим 2 = 8 кубов
    3: 27   // режим 3 = 27 кубов
  };

  // Фактическое количество кубов:
  const actualCubeCount = cubeModeMap[cubeMode];

  // useEffect для закрытия при клике вне меню
  useEffect(() => {
    if (!isShuffleMenuOpen && !isClearMenuOpen && !isSaveMenuOpen) return;

    const handleClickOutside = (event) => {
      // Если клик не внутри панели кнопок
      if (!event.target.closest('.special-buttons')) {
        setIsShuffleMenuOpen(false);
        setIsClearMenuOpen(false);

        // Меню сохранения НЕ закрываем во время записи видео
        if (!isRecording) {
          setIsSaveMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShuffleMenuOpen, isClearMenuOpen, isSaveMenuOpen, isRecording]);

  // Когда открывается меню перемешивания — закрываем остальные меню
  useEffect(() => {
    if (isShuffleMenuOpen) {
      setIsClearMenuOpen(false);

      // Меню сохранения НЕ закрываем во время записи видео
      if (!isRecording) {
        setIsSaveMenuOpen(false);
      }
    }
  }, [isShuffleMenuOpen, isRecording]);

  // Когда открывается меню очистки — закрываем остальные меню
  useEffect(() => {
    if (isClearMenuOpen) {
      setIsShuffleMenuOpen(false);

      // Меню сохранения НЕ закрываем во время записи видео
      if (!isRecording) {
        setIsSaveMenuOpen(false);
      }
    }
  }, [isClearMenuOpen, isRecording]);

  // Когда открывается меню сохранения — закрываем остальные меню
  useEffect(() => {
    if (isSaveMenuOpen) {
      setIsShuffleMenuOpen(false);
      setIsClearMenuOpen(false);
    }
  }, [isSaveMenuOpen]);

  // === Очистка ТЕКУЩЕГО localStorage (только SingleCubeForge) ===
  const clearCurrentStorage = () => {
    // Проверяем, есть ли вообще что очищать
    const hasData = Object.keys(localStorage).some(key => key.startsWith('pictoCube3x'));
    if (!hasData) {
      alert(t('storage.noData')); // "Немає даних для очищення. 🙄🫤"
      return;
    }

    const confirmed = window.confirm(t('storage.confirm-clear-current'));
    if (!confirmed) {
      alert(t('storage.alertNo'));
      return;
    }

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('singleCubeForge')) {
          localStorage.removeItem(key);
        }
      });

      // Сброс значений через reset-хуки
      resetGap();
      resetSmallCubeScale();
      resetRotationX();
      resetRotationY();
      resetRotationZ();
      resetSpeed();
      resetDirection();
      resetIsRotating();

      setPositionsResetTrigger(prev => prev + 1);
      setResetTrigger(prev => !prev);

      alert(t('storage.alertYes'));
    } catch (e) {
      console.error('Ошибка при очистке localStorage:', e);
    }

    setIsClearMenuOpen(false);
  };

  // === Полная очистка localStorage ===
  const clearAllStorage = () => {
    if (localStorage.length === 0) {
      alert(t('storage.noData'));
      return;
    }

    const confirmed = window.confirm(t('storage.confirm-clear-all'));
    if (!confirmed) {
      alert(t('storage.alertNo'));
      return;
    }

    try {
      localStorage.clear();
      // сброс дефолтов через reset
      resetGap();
      resetSmallCubeScale();
      resetRotationX();
      resetRotationY();
      resetRotationZ();
      resetSpeed();
      resetDirection();
      resetIsRotating();

      setPositionsResetTrigger(prev => prev + 1);
      setResetTrigger(prev => !prev);

      alert(t('storage.alertYes'));
    } catch (e) {
      console.error('Ошибка при очистке всего localStorage:', e);
    }

    setIsClearMenuOpen(false);
  };

  // Внутренний ref для доступа к Canvas
  const internalRef = useRef(null);

  // Callback для объединения внешнего и внутреннего ref
  const setRefs = (node) => {
    internalRef.current = node;
    if (ref) {
      if (typeof ref === 'function') ref(node);
      else ref.current = node;
    }
  };

  // Функция получения данных для сохранения
  const getSaveMetadata = () => {
    const title = t('project4.single-description');
    const dateTime = new Date().toLocaleString();
    const footer = t('save.created');
    const site = "https://reactorium-3d.vercel.app";

    return { title, dateTime, footer, site };
  };

  // Сохранение сцены как JPG (белый фон)
  const saveAsJPG = () => {
    const containerRef = ref?.current || internalRef.current;

    if (!containerRef) {
      console.error("Ошибка: Canvas контейнер не инициализирован");
      return;
    }

    // Получаем canvas element из react-three-fiber
    const canvas = containerRef.querySelector('canvas');
    if (!canvas) {
      console.error("Ошибка: Canvas element не найден");
      return;
    }

    // Ждём следующий кадр, чтобы canvas точно отрендерился
    requestAnimationFrame(() => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Определение мобильного режима
      const isMobile = window.innerWidth < 768;

      // Коэффициент масштабирования
      const scaleFactor = isMobile ? 1.2 : 1.0;
      let baseFontSize = Math.floor(canvas.width * 0.045 * scaleFactor);
      const smallFontSize = Math.floor(baseFontSize * 0.7);
      let footerFontSize = Math.floor(baseFontSize * 0.6);
      const padding = Math.floor(baseFontSize * 1.1);

      // Система отступов
      const topMargin = padding * (isMobile ? 2.0 : 1.2); // Отступ сверху
      const titleDateSpacing = padding * (isMobile ? 1.0 : 0.9); // Пробел для заголовка-даты
      const footerSiteSpacing = padding * (isMobile ? 0.8 : 0.7); // Пробел для footer-site
      const bottomMargin = padding * (isMobile ? 1.0 : 0.5); // Отступ снизу

      const canvasWidth = canvas.width + padding * 2;
      const canvasHeight = canvas.height + topMargin + titleDateSpacing + footerSiteSpacing + bottomMargin;

      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;

      tempCtx.fillStyle = "white";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, padding, topMargin + titleDateSpacing);

      const { title, dateTime, footer, site } = getSaveMetadata();

      // Функция для динамического подбора размера шрифта
      const adjustFontSize = (text, maxWidth, initialFontSize) => {
        let fontSize = initialFontSize;
        do {
          tempCtx.font = `bold ${fontSize}px Arial`;
          if (tempCtx.measureText(text).width <= maxWidth) {
            return fontSize;
          }
          fontSize--;
        } while (fontSize > 10);
        return fontSize;
      };

      // Подбор размера шрифта для каждого текста
      baseFontSize = adjustFontSize(title, tempCanvas.width * 0.9, baseFontSize);
      footerFontSize = adjustFontSize(footer, tempCanvas.width * 0.9, footerFontSize);
      const siteFontSize = adjustFontSize(site, tempCanvas.width * 0.9, footerFontSize);

      // 📌 Заголовок (зелёный)
      tempCtx.font = `bold ${baseFontSize}px Arial`;
      tempCtx.fillStyle = "green";
      tempCtx.textAlign = "center";
      tempCtx.fillText(title, tempCanvas.width / 2, topMargin);

      // 📅 Дата (голубая)
      tempCtx.font = `normal ${smallFontSize}px Arial`;
      tempCtx.fillStyle = "dodgerblue";
      tempCtx.fillText(dateTime, tempCanvas.width / 2, topMargin + titleDateSpacing);

      // 🔽 Footer (розовый)
      const footerY = tempCanvas.height - footerSiteSpacing - bottomMargin;
      tempCtx.font = `normal ${footerFontSize}px Arial`;
      tempCtx.fillStyle = "deeppink";
      tempCtx.fillText(footer, tempCanvas.width / 2, footerY);

      // 📅 Сайт (синий)
      tempCtx.font = `italic ${siteFontSize}px Arial`;
      tempCtx.fillStyle = "blue";
      tempCtx.fillText(site, tempCanvas.width / 2, footerY + footerSiteSpacing);

      const image = tempCanvas.toDataURL("image/jpeg", 0.99);
      const link = document.createElement("a");
      link.href = image;
      link.download = "CubeJPG.jpg";
      link.click();

      setIsSaveMenuOpen(false);
    });
  };

  // Сохранение сцены как PNG (прозрачный фон)
  const saveAsPNG = () => {
    const containerRef = ref?.current || internalRef.current;

    if (!containerRef) {
      console.error("Ошибка: Canvas контейнер не инициализирован");
      return;
    }

    // Получаем canvas element из react-three-fiber
    const canvas = containerRef.querySelector('canvas');
    if (!canvas) {
      console.error("Ошибка: Canvas element не найден");
      return;
    }

    // Ждём следующий кадр, чтобы canvas точно отрендерился
    requestAnimationFrame(() => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Определение мобильного режима
      const isMobile = window.innerWidth < 768;

      // Коэффициент масштабирования
      const scaleFactor = isMobile ? 1.2 : 1.0;
      let baseFontSize = Math.floor(canvas.width * 0.045 * scaleFactor);
      const smallFontSize = Math.floor(baseFontSize * 0.7);
      let footerFontSize = Math.floor(baseFontSize * 0.6);
      const padding = Math.floor(baseFontSize * 1.1);

      // Система отступов
      const topMargin = padding * (isMobile ? 2.0 : 1.2); // Отступ сверху
      const titleDateSpacing = padding * (isMobile ? 1.0 : 0.9); // Пробел для заголовка-даты
      const footerSiteSpacing = padding * (isMobile ? 0.8 : 0.7); // Пробел для footer-site
      const bottomMargin = padding * (isMobile ? 1.0 : 0.5); // Отступ снизу

      const canvasWidth = canvas.width + padding * 2;
      const canvasHeight = canvas.height + topMargin + titleDateSpacing + footerSiteSpacing + bottomMargin;

      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;

      // tempCtx.fillStyle = "white";
      // tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, padding, topMargin + titleDateSpacing);

      const { title, dateTime, footer, site } = getSaveMetadata();

      // Функция для динамического подбора размера шрифта
      const adjustFontSize = (text, maxWidth, initialFontSize) => {
        let fontSize = initialFontSize;
        do {
          tempCtx.font = `bold ${fontSize}px Arial`;
          if (tempCtx.measureText(text).width <= maxWidth) {
            return fontSize;
          }
          fontSize--;
        } while (fontSize > 10);
        return fontSize;
      };

      // Подбор размера шрифта для каждого текста
      baseFontSize = adjustFontSize(title, tempCanvas.width * 0.9, baseFontSize);
      footerFontSize = adjustFontSize(footer, tempCanvas.width * 0.9, footerFontSize);
      const siteFontSize = adjustFontSize(site, tempCanvas.width * 0.9, footerFontSize);

      // 📌 Заголовок (зелёный)
      tempCtx.font = `bold ${baseFontSize}px Arial`;
      tempCtx.fillStyle = "green";
      tempCtx.textAlign = "center";
      tempCtx.fillText(title, tempCanvas.width / 2, topMargin);

      // 📅 Дата (голубая)
      tempCtx.font = `normal ${smallFontSize}px Arial`;
      tempCtx.fillStyle = "dodgerblue";
      tempCtx.fillText(dateTime, tempCanvas.width / 2, topMargin + titleDateSpacing);

      // 🔽 Footer (розовый)
      const footerY = tempCanvas.height - footerSiteSpacing - bottomMargin;
      tempCtx.font = `normal ${footerFontSize}px Arial`;
      tempCtx.fillStyle = "deeppink";
      tempCtx.fillText(footer, tempCanvas.width / 2, footerY);

      // 📅 Сайт (синий)
      tempCtx.font = `italic ${siteFontSize}px Arial`;
      tempCtx.fillStyle = "blue";
      tempCtx.fillText(site, tempCanvas.width / 2, footerY + footerSiteSpacing);

      // 📸 Сохранение в PNG
      const image = tempCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "CubePNG.png";
      link.click();

      setIsSaveMenuOpen(false);
    });
  };

  // Сохранение сцены как PDF
  const saveAsPDF = async () => {
    // === 1. Проверка доступности контейнера ===
    const containerRef = ref?.current || internalRef.current;

    if (!containerRef) {
      console.error("Ошибка: Canvas контейнер не инициализирован");
      return;
    }

    // === 2. Получение canvas элемента из React Three Fiber ===
    const canvas = containerRef.querySelector('canvas');
    if (!canvas) {
      console.error("Ошибка: Canvas element не найден");
      return;
    }

    // === 3. Функция для загрузки шрифта ===
    const loadFont = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить шрифт: ${response.statusText}`);
      }
      return await response.arrayBuffer();
    };

    // === 4. Загрузка всех необходимых шрифтов с CDN (проверенные версии) ===
    let fontRegularBuffer, fontMediumBuffer, fontItalicBuffer;
    try {
      // fontRegularBuffer = await loadFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf');
      // fontMediumBuffer = await loadFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf');
      // fontItalicBuffer = await loadFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf');
      fontRegularBuffer = await loadFont('/fonts/Roboto-Regular.ttf');
      fontMediumBuffer  = await loadFont('/fonts/Roboto-Medium.ttf');
      fontItalicBuffer  = await loadFont('/fonts/Roboto-Italic.ttf');
    } catch (error) {
      console.error("Ошибка загрузки шрифта:", error);
      alert("Не удалось загрузить шрифт для PDF");
      return;
    }

    // === 5. Конвертация шрифтов в Base64 для jsPDF ===
    const fontRegularBase64 = btoa(
      new Uint8Array(fontRegularBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const fontMediumBase64 = btoa(
      new Uint8Array(fontMediumBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const fontItalicBase64 = btoa(
      new Uint8Array(fontItalicBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    // === 6. Ожидание рендера canvas перед копированием ===
    requestAnimationFrame(() => {
      // === 7. Создание временного canvas для композиции ===
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");
      const { width, height } = canvas;

      // === 8. Расчёт размеров и отступов (как в JPG) ===
      const isMobile = window.innerWidth < 768;
      const scaleFactor = isMobile ? 1.2 : 1.0;

      let baseFontSize = Math.floor(width * 0.045 * scaleFactor);
      const smallFontSize = Math.floor(baseFontSize * 0.7);
      let footerFontSize = Math.floor(baseFontSize * 0.6);
      const padding = Math.floor(baseFontSize * 1.1);

      const topMargin = padding * (isMobile ? 2.0 : 1.2);
      const titleDateSpacing = padding * (isMobile ? 1.0 : 0.9);
      const footerSiteSpacing = padding * (isMobile ? 0.8 : 0.7);
      const bottomMargin = padding * (isMobile ? 1.0 : 0.5);

      const canvasWidth = width + padding * 2;
      const canvasHeight = height + topMargin + titleDateSpacing + footerSiteSpacing + bottomMargin;

      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;

      // === 9. Заливка белым фоном ===
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // === 10. Копирование 3D сцены на временный canvas ===
      ctx.drawImage(canvas, padding, topMargin + titleDateSpacing);

      // === 11. Конвертация в JPEG для вставки в PDF ===
      const image = tempCanvas.toDataURL("image/jpeg", 0.99);

      // === 12. Создание PDF с размерами идентичными JPG ===
      // Переводим пиксели в миллиметры (1px ≈ 0.264583mm при 96 DPI)
      const pxToMm = 0.264583;
      const pdfWidth = canvasWidth * pxToMm;
      const pdfHeight = canvasHeight * pxToMm;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      // === 13. Регистрация шрифтов в jsPDF ===
      pdf.addFileToVFS('Roboto-Regular.ttf', fontRegularBase64);
      pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

      pdf.addFileToVFS('Roboto-Medium.ttf', fontMediumBase64);
      pdf.addFont('Roboto-Medium.ttf', 'Roboto', 'bold');

      pdf.addFileToVFS('Roboto-Italic.ttf', fontItalicBase64);
      pdf.addFont('Roboto-Italic.ttf', 'Roboto', 'italic');

      pdf.setFont('Roboto', 'normal');

      // === 14. Получение метаданных для текста ===
      const { title, dateTime, footer, site } = getSaveMetadata();

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // === 15. Вставка изображения на всю страницу ===
      pdf.addImage(image, "JPEG", 0, 0, pageWidth, pageHeight);

      // === 16. Функция для динамического подбора размера шрифта ===
      const adjustFontSize = (text, maxWidth, initialFontSize) => {
        let fontSize = initialFontSize;
        do {
          pdf.setFontSize(fontSize);
          if (pdf.getTextWidth(text) <= maxWidth) {
            return fontSize;
          }
          fontSize--;
        } while (fontSize > 10);
        return fontSize;
      };

      // === 17. Конвертация размеров шрифтов из пикселей в пункты ===
      // 1px = 0.75pt (стандартное соотношение при 96 DPI)
      const pxToPt = 0.75;

      // === 18. Подбор оптимальных размеров шрифтов ===
      const finalBaseFontSize = adjustFontSize(title, pageWidth * 0.9, baseFontSize * pxToPt);
      const finalSmallFontSize = smallFontSize * pxToPt;
      const finalFooterFontSize = adjustFontSize(footer, pageWidth * 0.9, footerFontSize * pxToPt);
      const finalSiteFontSize = adjustFontSize(site, pageWidth * 0.9, footerFontSize * pxToPt);

      // === 19. Конвертация отступов в миллиметры ===
      const topMarginMm = topMargin * pxToMm;
      const titleDateSpacingMm = titleDateSpacing * pxToMm;
      const footerSiteSpacingMm = footerSiteSpacing * pxToMm;
      const bottomMarginMm = bottomMargin * pxToMm;

      // === 20. Добавление текстовых элементов ===

      // 📌 Заголовок (зелёный, жирный - Roboto Medium)
      pdf.setFont('Roboto', 'bold'); // используем Medium как bold
      pdf.setFontSize(finalBaseFontSize);
      pdf.setTextColor(0, 128, 0);
      pdf.text(title, pageWidth / 2, topMarginMm, { align: "center" });

      // 📅 Дата и время (голубая, обычная)
      pdf.setFont('Roboto', 'normal');
      pdf.setFontSize(finalSmallFontSize);
      pdf.setTextColor(30, 144, 255);
      pdf.text(dateTime, pageWidth / 2, topMarginMm + titleDateSpacingMm, { align: "center" });

      // 🔽 Footer текст (розовый, обычная)
      const footerY = pageHeight - footerSiteSpacingMm - bottomMarginMm;
      pdf.setFont('Roboto', 'normal');
      pdf.setFontSize(finalFooterFontSize);
      pdf.setTextColor(255, 105, 180);
      pdf.text(footer, pageWidth / 2, footerY, { align: "center" });

      // 🌐 Сайт (синий, курсив)
      pdf.setFont("Roboto", "italic");
      pdf.setTextColor(0, 0, 255);
      pdf.setFontSize(finalSiteFontSize);
      pdf.text(site, pageWidth / 2, footerY + footerSiteSpacingMm, { align: "center" });

      // === 21. Сохранение PDF файла ===
      pdf.save("CubePDF.pdf");

      // === 22. Закрытие меню сохранения ===
      setIsSaveMenuOpen(false);
    });
  };

  // Начать запись видео
  const startRecording = () => {
    // 1. Проверка доступности контейнера
    const containerRef = ref?.current || internalRef.current;

    if (!containerRef) {
      console.error("Ошибка: Canvas контейнер не инициализирован");
      return;
    }

    // 2. Получение canvas элемента из React Three Fiber
    const canvas = containerRef.querySelector('canvas');
    if (!canvas) {
      console.error("Ошибка: Canvas element не найден");
      return;
    }

    // 3. Расчёт размеров с учётом текста и отступов (как в JPG)
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 1.2 : 1.0;

    let baseFontSize = Math.floor(canvas.width * 0.045 * scaleFactor);
    const smallFontSize = Math.floor(baseFontSize * 0.7);
    let footerFontSize = Math.floor(baseFontSize * 0.6);
    const padding = Math.floor(baseFontSize * 1.1);

    const topMargin = padding * (isMobile ? 2.0 : 1.2);
    const titleDateSpacing = padding * (isMobile ? 1.0 : 0.9);
    const footerSiteSpacing = padding * (isMobile ? 0.8 : 0.7);
    const bottomMargin = padding * (isMobile ? 1.0 : 0.5);

    // 4. Создание canvas с правильными размерами (включая текст)
    const streamCanvas = document.createElement("canvas");
    const streamCtx = streamCanvas.getContext("2d");
    streamCanvas.width = canvas.width + padding * 2;
    streamCanvas.height = canvas.height + topMargin + titleDateSpacing + footerSiteSpacing + bottomMargin;

    // 5. Создание видео-потока из canvas (60 FPS)
    const stream = streamCanvas.captureStream(60);

    // 6. Функция отрисовки каждого кадра видео
    const drawFrame = () => {
      // Заливка белым фоном
      streamCtx.fillStyle = "white";
      streamCtx.fillRect(0, 0, streamCanvas.width, streamCanvas.height);

      // Копируем 3D сцену с отступами (как в JPG)
      streamCtx.drawImage(canvas, padding, topMargin + titleDateSpacing);

      const { title, dateTime, footer, site } = getSaveMetadata();

      // Функция для динамического подбора размера шрифта
      const adjustFontSize = (text, maxWidth, initialFontSize) => {
        let fontSize = initialFontSize;
        do {
          streamCtx.font = `bold ${fontSize}px Arial`;
          if (streamCtx.measureText(text).width <= maxWidth) {
            return fontSize;
          }
          fontSize--;
        } while (fontSize > 10);
        return fontSize;
      };

      // Подбор размера шрифта для каждого текста
      baseFontSize = adjustFontSize(title, streamCanvas.width * 0.9, baseFontSize);
      footerFontSize = adjustFontSize(footer, streamCanvas.width * 0.9, footerFontSize);
      const siteFontSize = adjustFontSize(site, streamCanvas.width * 0.9, footerFontSize);

      // 📌 Заголовок (зелёный, жирный)
      streamCtx.font = `bold ${baseFontSize}px Arial`;
      streamCtx.fillStyle = "green";
      streamCtx.textAlign = "center";
      streamCtx.fillText(title, streamCanvas.width / 2, topMargin);

      // 📅 Дата (голубая)
      streamCtx.font = `normal ${smallFontSize}px Arial`;
      streamCtx.fillStyle = "dodgerblue";
      streamCtx.fillText(dateTime, streamCanvas.width / 2, topMargin + titleDateSpacing);

      // 🔽 Footer (розовый)
      const footerY = streamCanvas.height - footerSiteSpacing - bottomMargin;
      streamCtx.font = `normal ${footerFontSize}px Arial`;
      streamCtx.fillStyle = "deeppink";
      streamCtx.fillText(footer, streamCanvas.width / 2, footerY);

      // 🌐 Сайт (синий, курсив)
      streamCtx.font = `italic ${siteFontSize}px Arial`;
      streamCtx.fillStyle = "blue";
      streamCtx.fillText(site, streamCanvas.width / 2, footerY + footerSiteSpacing);

      // Продолжаем запись следующего кадра
      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    // 7. Определение поддерживаемого формата видео
    let mimeType;
    let isMP4 = false;

    // Проверка Safari (предпочитаем MP4)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && MediaRecorder.isTypeSupported("video/mp4")) {
      mimeType = "video/mp4";
      isMP4 = true;
      console.log("🍎 Safari обнаружен! Используем MP4.");
    } else if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
      mimeType = "video/webm; codecs=vp9";
    } else if (MediaRecorder.isTypeSupported("video/webm; codecs=vp8")) {
      mimeType = "video/webm; codecs=vp8";
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      mimeType = "video/mp4";
      isMP4 = true;
    } else {
      console.error("⛔ Ваш браузер не поддерживает запись видео.");
      alert("Запись видео не поддерживается в этом браузере");
      return;
    }

    // 8. Создание MediaRecorder для записи потока
    try {
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
    } catch (error) {
      console.error("Ошибка создания MediaRecorder:", error);
      alert("Не удалось начать запись видео");
      return;
    }

    // 9. Обработчик получения данных
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    // 10. Обработчик завершения записи
    mediaRecorderRef.current.onstop = () => saveVideo(isMP4);

    // 11. Очистка буфера
    recordedChunksRef.current = [];

    // 12. ЖДЁМ один кадр, чтобы canvas гарантированно отрендерился
    requestAnimationFrame(() => {
      // Отрисовываем первый кадр (с кубиком!)
      drawFrame();

      // Ждём ещё один кадр для надёжности
      requestAnimationFrame(() => {
        // Теперь запускаем запись - первый кадр уже готов!
        mediaRecorderRef.current.start();
        setIsRecording(true);

        console.log(`🎥 Запись видео началась! Формат: ${isMP4 ? 'MP4' : 'WebM'}`);
      });
    });
  };

  // Остановка записи
  const stopRecording = () => {
    // 1. Остановка MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // 2. Остановка отрисовки кадров
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 3. Обновление состояния
    setIsRecording(false);
    setIsSaveMenuOpen(false);

    console.log("🛑 Запись видео остановлена!");
  };

  // Сохранение видео
  const saveVideo = (isMP4Format) => {
    // 1. Проверка наличия записанных данных
    if (recordedChunksRef.current.length === 0) {
      console.warn("⚠️ Нет записанных данных!");
      return;
    }

    // 2. Определение типа видео и расширения
    const mimeType = isMP4Format ? "video/mp4" : "video/webm";
    const extension = isMP4Format ? "mp4" : "webm";

    // 3. Создание Blob из записанных фрагментов
    const blob = new Blob(recordedChunksRef.current, { type: mimeType });
    const url = URL.createObjectURL(blob);

    // 4. Создание ссылки для скачивания
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cube.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 5. Освобождение памяти
    URL.revokeObjectURL(url);
    recordedChunksRef.current = [];

    console.log(`💾 Видео сохранено как Cube.${extension}!`);
  };

  return (
    <div className="single-cube-forge-container">
      {/* === Панели управления кубом === */}
      <div className="cube-controls">

        {/* Состояние: ничего не открыто → показываем ВСЕ блоки (закрытые) */}
        {openBlock === null && (
          <>
            <ControlBlock
              label={t("control.cube-mode") || "Режим кубов"}
              icon="fa-solid fa-cubes"
              isOpen={false}
              onToggle={() => setOpenBlock("cubeMode")}
              gapConfig={{
                value: cubeMode,
                min: 1,
                max: 3,
                step: 1,
                onChange: setCubeMode,
                ...cubeModeHandlers
              }}
            />

            <ControlBlock label={t("control.speed")} icon="fa-solid fa-gauge-simple-high" isOpen={false} onToggle={() => setOpenBlock("speed")}
                          gapConfig={{value: speed, min: 0, max: 10, step: 1, onChange: setSpeed, ...speedHandlers,}}
            />
            <ControlBlock label={t("control.gap")} icon="fa-solid fa-arrows-left-right" isOpen={false} onToggle={() => setOpenBlock("gap")}
                          gapConfig={{value: gap, min: 0, max: 0.5, step: 0.01, onChange: setGap, ...gapHandlers}}
            />

            <ControlBlock label={t("control.small-cube-size")} icon="fa-solid fa-up-right-and-down-left-from-center" isOpen={false} onToggle={() => setOpenBlock("smallCubeSize")}
                          gapConfig={{value: smallCubeScale, min: 0.5, max: 1.0, step: 0.05, onChange: setSmallCubeScale, ...smallCubeScaleHandlers,}}
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

        {/* Состояние: открыт cubeMode → показываем только его */}
        {openBlock === "cubeMode" && (
          <ControlBlock
            label={t("control.cube-mode") || "Режим кубов"}
            icon="fa-solid fa-cubes"
            isOpen={true}
            onToggle={() => setOpenBlock(null)}
            gapConfig={{
              value: cubeMode,
              min: 1,
              max: 3,
              step: 1,
              onChange: setCubeMode,
              ...cubeModeHandlers
            }}
          />
        )}

        {/* Состояние: открыт speed → показываем только его */}
        {openBlock === "speed" && (
          <ControlBlock label={t("control.speed")} icon="fa-solid fa-gauge-simple-high" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: speed, min: 0, max: 10, step: 1, onChange: setSpeed, ...speedHandlers,}}
          />
        )}

        {/* Состояние: открыт gap → показываем только его */}
        {openBlock === "gap" && (
          <ControlBlock label={t("control.gap")} icon="fa-solid fa-arrows-left-right" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: gap, min: 0, max: 0.5, step: 0.01, onChange: setGap, ...gapHandlers}}
          />
        )}

        {/* Состояние: открыт smallCubeSize → показываем только его */}
        {openBlock === "smallCubeSize" && (
          <ControlBlock label={t("control.small-cube-size")} icon="fa-solid fa-up-right-and-down-left-from-center" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: smallCubeScale, min: 0.5, max: 1.0, step: 0.05, onChange: setSmallCubeScale, ...smallCubeScaleHandlers,}}
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

        {/* === Панель очистки localStorage === */}
        <div className="clear-buttons">
          {/* Главная кнопка */}
          <button className={`main-clear-button ${isClearMenuOpen ? 'open' : ''}`} onClick={() => setIsClearMenuOpen(prev => !prev)} title={isClearMenuOpen ? t('storage.menu-close') : t('storage.menu-open')}>
            <i className={`main-clear-icon fas ${isClearMenuOpen ? 'fa-times' : 'fa-trash-alt'}`}></i><span className="main-clear-text">{t('storage.title')}</span>
          </button>

          {/* Подменю */}
          <div className={`clear-submenu ${isClearMenuOpen ? 'open' : ''}`}>
            <button onClick={clearCurrentStorage} title={t('storage.clearCurrent')}><i className="fas fa-broom"></i></button>
            <button onClick={clearAllStorage} title={t('storage.clearAll')}><i className="fas fa-fire"></i></button>
          </div>
        </div>

        {/* === Панель перемешивания кубов === */}
        <div className="shuffle-buttons">
          {/* Главная кнопка */}
          <button className={`main-shuffle-button ${isShuffleMenuOpen ? 'open' : ''}`} onClick={() => setIsShuffleMenuOpen(prev => !prev)} title={isShuffleMenuOpen ? t('shuffle.menu-close') : t('shuffle.menu-open')}>
            <i className={`main-shuffle-icon fas ${isShuffleMenuOpen ? 'fa-times' : 'fa-globe'}`}></i><span className="main-shuffle-text">{t('shuffle.title')}</span>
          </button>

          {/* Подменю с кнопками */}
          <div className={`shuffle-submenu ${isShuffleMenuOpen ? 'open' : ''}`}>
            <button onClick={() => {setShuffleTrigger(prev => prev + 1);setIsShuffleMenuOpen(true);}} title={t('shuffle.begin')}>
              <i className="fas fa-random"></i>
            </button>
            <button onClick={() => {setPositionsResetTrigger(prev => prev + 1);setIsShuffleMenuOpen(true);}} title={t('shuffle.reset')}>
              <i className="fas fa-undo"></i>
            </button>
          </div>
        </div>

        {/* === Панель сохранения === */}
        <div className="save-buttons">
          {/* Главная кнопка */}
          <button className={`main-save-button ${isSaveMenuOpen ? 'open' : ''}`}
                  onClick={isRecording ? '' : () => setIsSaveMenuOpen(prev => !prev)}
                  title={isSaveMenuOpen ? t('save.closeSaveData') : t('save.saveData')}
          >
            <i className={`main-save-icon fas ${isSaveMenuOpen ? 'fa-times' : 'fa-save'}`}></i><span className="main-save-text">{t('save.title')}</span>
          </button>

          {/* Подменю с кнопками */}
          <div className={`save-submenu ${isSaveMenuOpen ? 'open' : ''}`}>
            {/* Сохранение сцены как JPG (белый фон) */}
            <button onClick={ saveAsJPG } title={t('save.saveJPG')}><i className="fas fa-camera"></i></button>
            {/* Сохранение сцены как PNG (прозрачный фон) */}
            <button onClick={ saveAsPNG } title={t('save.savePNG')}><i className="fas fa-file-image"></i></button>
            {/* Сохранение сцены как PDF */}
            <button onClick={ saveAsPDF } title={t('save.savePDF')}><i className="fas fa-file-pdf"></i></button>
            {/* Сохранение сцены как Video */}
            <button className={`film-start ${isRecording ? 'film-stop recording' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    title={isRecording ? t('save.stopVideo') : t('save.startVideo')}
            >
              <i className={`fas ${isRecording ? 'fa-stop-circle' : 'fa-film'}`}></i>
            </button>
          </div>

        </div>

      </div>

      <div ref={setRefs}>
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
            cubeMode={actualCubeCount}
          />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
});

SingleCubeForge.displayName = 'SingleCubeForge';

export default SingleCubeForge;