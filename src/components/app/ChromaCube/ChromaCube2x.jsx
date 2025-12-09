import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/ChromaCube/ChromaCube2x.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three';
import * as THREE from "three";

import small2Cube22 from "@/assets/app/VortexCube/cube3/cube3-22.webp";

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

// Компонент для установки фона
function SceneBackground({ imagePath, canvasFullscreen }) {
  // Хук R3F для загрузки ресурсов three.js
  // const texture = useLoader(EXRLoader, imagePath);
  const texture = useLoader(TextureLoader, imagePath);

  // Если НЕ в fullscreen - НЕ устанавливаем фон вообще (прозрачный)
  if (!canvasFullscreen) {
    return null; // ⭐ Просто ничего не рендерим - фон будет прозрачным
  }

  // Возвращаем специальный элемент, который прикрепляет текстуру к фону сцены
  return <primitive attach="background" object={texture} />;
}

// === Группа из 8 кубиков ===
const CubeGroup = ({ groupSize, gap }) => {
  const groupRef = useRef(null);

  // размер маленького кубика
  const cubeSize = groupSize / 2;
  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    [cubeSize]
  );

  // === Цвета с названиями ===
  const colors = useMemo(() => {
    const palette = [
      { name: "Красный", value: 0xff0000 }, { name: "Зелёный", value: 0x00ff00 }, { name: "Синий", value: 0x0000ff },
      { name: "Жёлтый", value: 0xffff00 }, { name: "Пурпурный", value: 0xff00ff }, { name: "Бирюзовый", value: 0x00ffff },
      { name: "Оранжевый", value: 0xff8c00 }, { name: "Сиреневый", value: 0x8a2be2 }, { name: "Ярко-зелёный", value: 0x32cd32 },
      { name: "Золотой", value: 0xffd700 }, { name: "Розовый", value: 0xff69b4 }, { name: "Фиолетовый", value: 0x9400d3 },
      { name: "Морская волна", value: 0x00fa9a }, { name: "Коралловый", value: 0xff7f50 }, { name: "Каштановый", value: 0x8b4513 },
      { name: "Тёмно-бирюзовый", value: 0x00ced1 }, { name: "Песочный", value: 0xf0e68c }, { name: "Томатный", value: 0xff6347 },
      { name: "Светло-голубой", value: 0x87ceeb }, { name: "Стальной", value: 0x4682b4 }, { name: "Тёмно-фиолетовый", value: 0x9932cc },
      { name: "Морской зелёный", value: 0x2e8b57 }, { name: "Малиновый", value: 0xff1493 }, { name: "Лайм", value: 0x7cfc00 },
      { name: "Кирпичный", value: 0xb22222 }, { name: "Бирюзово-зелёный", value: 0x20b2aa }, { name: "Индиго", value: 0x4b0082 },
    ];

    // Создаем THREE.Color объекты только один раз
    const colorsWithThree = palette.map((c) => ({
      ...c,
      color: new THREE.Color(c.value)
    }));

    // Перемешивание Фишера-Йетса для случайного порядка при каждой загрузке
    const shuffled = [...colorsWithThree];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8);
  }, []); // цвета будут перемешиваться заново при каждом монтировании компонента

  // === Позиции для 2×2×2 ===
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
        <group key={i} position={pos}>

          {/* Сам куб */}
          <mesh geometry={geometry}>
            <meshBasicMaterial color={colors[i].color} />
          </mesh>

          {/* Контур куба */}
          <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
            <lineSegments
              geometry={new THREE.EdgesGeometry(geometry)}
              onUpdate={self => self.position.multiplyScalar(1.0005)} // чуть вытащить наружу
            >
              <lineBasicMaterial color="black" depthTest={true} />
            </lineSegments>
          </lineSegments>

        </group>
      ))}
    </group>
  );
};

const ChromaCube2x = forwardRef(({ groupSize = 2.5, canvasFullscreen = false }, ref) => {
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

  // === загрузка из localStorage при первом рендере ===
  useEffect(() => {
    const saved = localStorage.getItem("chromaCube2xGap");
    if (saved !== null) {
      const num = parseFloat(saved);
      if (!isNaN(num)) {
        setGap(num);
      }
    }
  }, []);

  // === сохранение в localStorage при изменении gap ===
  useEffect(() => {
    localStorage.setItem("chromaCube2xGap", gap.toString());
  }, [gap]);

  // кнопки управления
  const handleReset = () => setGap(0.15);
  const handleIncrease = () =>
    setGap((prev) => Math.min(0.5, parseFloat((prev + 0.01).toFixed(2))));
  const handleDecrease = () =>
    setGap((prev) => Math.max(0, parseFloat((prev - 0.01).toFixed(2))));

  return (
    <div className="cube2x-inner-container">

      {/* input для gap */}
      <div className="cube-gap">
        <div className="label">
          {t('control.gap')}:
          <button className="slider-button minus" onClick={handleDecrease} title={t("control.decrease")}><i className="fa-solid fa-minus-circle" /></button>
          <input type="range" min="0" max="0.5" step="0.01"
                 value={gap}
                 onChange={(e) => setGap(parseFloat(e.target.value))}
          />
          <button className="slider-button plus" onClick={handleIncrease} title={t("control.increase")}><i className="fa-solid fa-plus-circle" /></button>
          <button className="slider-button reset" onClick={handleReset} title={t("control.reset-gup")}><i className="fa-solid fa-undo" /></button>
          <div className="scale-value">{gap.toFixed(2)}x</div>
        </div>
      </div>

      <div ref={ref}>
        <Canvas style={canvasStyle} camera={{ fov: 75 }} gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
          <ambientLight intensity={0.6} />

          {/* Используем компонент с путём к картинке */}
          <SceneBackground imagePath={small2Cube22} canvasFullscreen={canvasFullscreen} />

          <CubeGroup groupSize={groupSize} gap={gap} />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
});

ChromaCube2x.displayName = 'ChromaCube2x';

export default ChromaCube2x;