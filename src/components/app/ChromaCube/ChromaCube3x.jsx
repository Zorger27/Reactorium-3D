import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/ChromaCube/ChromaCube3x.scss';
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle";
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

// === Группа из 27 кубиков ===
const CubeGroup = ({ groupSize, gap }) => {
  const groupRef = useRef(null);

  // размер маленького кубика
  const cubeSize = groupSize / 3;
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
      { name: "Оранжевый", value: 0xff8c00 },
      { name: "Сиреневый", value: 0x8a2be2 },
      { name: "Ярко-зелёный", value: 0x32cd32 },
      { name: "Золотой", value: 0xffd700 },
      { name: "Розовый", value: 0xff69b4 },
      { name: "Фиолетовый", value: 0x9400d3 },
      { name: "Морская волна", value: 0x00fa9a },
      { name: "Коралловый", value: 0xff7f50 },
      { name: "Каштановый", value: 0x8b4513 },
      { name: "Тёмно-бирюзовый", value: 0x00ced1 },
      { name: "Песочный", value: 0xf0e68c },
      { name: "Томатный", value: 0xff6347 },
      { name: "Светло-голубой", value: 0x87ceeb },
      { name: "Стальной", value: 0x4682b4 },
      { name: "Тёмно-фиолетовый", value: 0x9932cc },
      { name: "Морской зелёный", value: 0x2e8b57 },
      { name: "Малиновый", value: 0xff1493 },
      { name: "Лайм", value: 0x7cfc00 },
      { name: "Кирпичный", value: 0xb22222 },
      { name: "Бирюзово-зелёный", value: 0x20b2aa },
      { name: "Индиго", value: 0x4b0082 },
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

    return shuffled.slice(0, 27);
  }, []); // цвета будут перемешиваться заново при каждом монтировании компонента

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
          <meshBasicMaterial color={colors[i].color} />
        </mesh>
      ))}
    </group>
  );
};

const ChromaCube3x = forwardRef(({ groupSize = 2.5 }, ref) => {
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
        <label className={`label-all ${isOpen ? "open" : "closed"}`}>
          {/* заголовок, который открывает/закрывает блок */}
          <div className={`gap-label ${isOpen ? "open" : "closed"}`} onClick={() => setIsOpen((prev) => !prev)}>{t("project1.gap")}</div>

          {/* скрываем/показываем блок */}
          {isOpen && (
            <div className="gap-controls">
              <div className="slider-wrapper">
                <button className="slider-button minus" onClick={handleDecrease} title={t("project1.decrease")}><i className="fa-solid fa-minus-circle"/></button>
                <input type="range" min="0" max="0.5" step="0.01" value={gap} onChange={(e) => setGap(parseFloat(e.target.value))}/>
                <button className="slider-button plus" onClick={handleIncrease} title={t("project1.increase")}><i className="fa-solid fa-plus-circle"/></button>
              </div>
              <div className="reset-wrapper">
                <button className="slider-button reset" onClick={handleReset} title={t("project1.reset")}><i className="fa-solid fa-undo"/></button>
                <div className="scale-value">{gap.toFixed(2)}x</div>
              </div>
            </div>
          )}
        </label>
      </div>

      <div ref={ref} className="chroma-cube-container">
        <Canvas
          style={canvasStyle} // responsive inline-стили
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
    </div>
  )
});

ChromaCube3x.displayName = 'ChromaCube3x';

export default ChromaCube3x;