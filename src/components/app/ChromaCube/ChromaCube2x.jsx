import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/ChromaCube/ChromaCube2x.scss'
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";

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
      { name: "Красный", value: 0xff0000 },
      { name: "Зелёный", value: 0x00ff00 },
      { name: "Синий", value: 0x0000ff },
      { name: "Жёлтый", value: 0xffff00 },
      { name: "Пурпурный", value: 0xff00ff },
      { name: "Бирюзовый", value: 0x00ffff },
      { name: "Оранжевый", value: 0xff4500 },
      { name: "Сиреневый", value: 0x8a2be2 },
      { name: "Ярко-зелёный", value: 0x32cd32 },
      { name: "Золотой", value: 0xffd700 },
      { name: "Розовый", value: 0xff69b4 },
      { name: "Фиолетовый", value: 0x9400d3 },
      { name: "Морская волна", value: 0x00fa9a },
      { name: "Тёмно-оранжевый", value: 0xff8c00 },
      { name: "Коричневый", value: 0x8b4513 },
      { name: "Тёмно-бирюзовый", value: 0x00ced1 },
      { name: "Хаки", value: 0xf0e68c },
      { name: "Тёмно-красный", value: 0xff6347 },
      { name: "Светло-голубой", value: 0x87ceeb },
      { name: "Синевато-серый", value: 0x4682b4 },
      { name: "Тёмно-фиолетовый", value: 0x9932cc },
      { name: "Зеленовато-коричневый", value: 0x2e8b57 },
      { name: "Глубокий розовый", value: 0xff1493 },
      { name: "Лайм", value: 0x7cfc00 },
      { name: "Огненно-красный", value: 0xb22222 },
      { name: "Синевато-зелёный", value: 0x20b2aa },
      { name: "Красновато-коричневый", value: 0xff4500 },
    ].map((c) => ({ ...c, color: new THREE.Color(c.value) }));

    // перемешивание Фишера-Йетса
    for (let i = palette.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [palette[i], palette[j]] = [palette[j], palette[i]];
    }
    return palette.slice(0, 8);
  }, []);

  // === Позиции для 2×2×2 ===
  const positions = useMemo(() => {
    const half = cubeSize / 2;
    const coords = [-(half + gap / 2), half + gap / 2];
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
          <meshBasicMaterial color={colors[i].color} />
        </mesh>
      ))}
    </group>
  );
};

const ChromaCube2x = forwardRef(({ groupSize = 2.5 }, ref) => {
  const { t } = useTranslation();
  const [gap, setGap] = useState(0.15);

  // кнопки управления
  const handleReset = () => setGap(0.15);
  const handleIncrease = () =>
    setGap((prev) => Math.min(0.5, parseFloat((prev + 0.01).toFixed(2))));
  const handleDecrease = () =>
    setGap((prev) => Math.max(0, parseFloat((prev - 0.01).toFixed(2))));

  return (
    <div ref={ref} className="chroma-cube-container">
      {/* input для gap */}
      <div className="cube-gap">
        <label>
          {t('project1.gap')}
          <button className="slider-button minus" onClick={handleDecrease} title={t("project1.decrease")}><i className="fa-solid fa-minus-circle" /></button>
          <input type="range" min="0" max="0.5" step="0.01"
            value={gap}
            onChange={(e) => setGap(parseFloat(e.target.value))}
          />
          <button className="slider-button plus" onClick={handleIncrease} title={t("project1.increase")}><i className="fa-solid fa-plus-circle" /></button>
          <button className="slider-button reset" onClick={handleReset} title={t("project1.reset")}><i className="fa-solid fa-undo" /></button>
          <div className="scale-value">{gap.toFixed(2)}x</div>
        </label>
      </div>

      <Canvas
        style={{ height: '88%', width: '100%' }}
        className="chroma-cube-canvas"
        camera={{ fov: 75 }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        <perspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <ambientLight intensity={0.6} />
        <CubeGroup groupSize={groupSize} gap={gap} />
        <CameraControls />
      </Canvas>
    </div>
  )
});

ChromaCube2x.displayName = 'ChromaCube2x';

export default ChromaCube2x;