import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import '@/components/app/CubeForge/MultiCubeForge.scss'
import { useResponsiveStyle } from "@/hooks/useResponsiveStyle.js";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import ControlBlock from "@/components/util/ControlBlock.jsx";
import SavePanel from "@/components/panel/SavePanel.jsx";
import ClearStoragePanel from "@/components/panel/ClearStoragePanel.jsx";
import CubeStylePanel from "@/components/panel/CubeStylePanel.jsx";
import ShufflePanel from "@/components/panel/ShufflePanel.jsx";
import CanvasBackgroundPanel from "@/components/panel/CanvasBackgroundPanel.jsx";
import RotationControlPanel from "@/components/panel/RotationControlPanel.jsx";
import { useTranslation } from 'react-i18next';
import {Canvas, useFrame, useThree, extend, useLoader} from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three';
import * as THREE from "three";

// Картинки для фото-кубика с Уровнем 1
import rightImg from "@/assets/app/PictoCube/cube3/cube04.webp";
import leftImg from "@/assets/app/PictoCube/cube3/cube07.webp";
import frontImg from "@/assets/app/PictoCube/cube1/front.webp";
import backImg from "@/assets/app/PictoCube/cube1/back.webp";
import bottomImg from "@/assets/app/PictoCube/cube1/bottom.webp";
import topImg from "@/assets/app/PictoCube/cube1/top.webp";

// Картинки для фото-кубика с Уровнем 2
import topLevel2Cube from "@/assets/app/PictoCube/cube2/top01.webp"
import bottomLevel2Cube from "@/assets/app/PictoCube/cube2/bottom01.webp"
import sideLevel2Cube01 from "@/assets/app/PictoCube/cube2/cube01.webp"
import sideLevel2Cube02 from "@/assets/app/PictoCube/cube2/cube02.webp"
import sideLevel2Cube03 from "@/assets/app/PictoCube/cube2/cube03.webp"
import sideLevel2Cube04 from "@/assets/app/PictoCube/cube2/cube04.webp"
import sideLevel2Cube05 from "@/assets/app/PictoCube/cube2/cube05.webp"
import sideLevel2Cube06 from "@/assets/app/PictoCube/cube2/cube06.webp"
import sideLevel2Cube07 from "@/assets/app/PictoCube/cube2/cube07.webp"
import sideLevel2Cube08 from "@/assets/app/PictoCube/cube2/cube08.webp"

// Картинки для фото-кубика с Уровнем 3
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

// Картинки для кубика с текстурами с Уровнем 1
import rightTexture from "@/assets/app/VortexCube/cube1/cube1-14.webp";
import leftTexture from "@/assets/app/VortexCube/cube1/cube1-11.webp";
import frontTexture from "@/assets/app/VortexCube/cube1/cube1-06.webp";
import backTexture from "@/assets/app/VortexCube/cube1/cube1-03.webp";
import bottomTexture from "@/assets/app/VortexCube/cube1/cube1-05.webp";
import topTexture from "@/assets/app/VortexCube/cube1/cube1-12.webp";

// Картинки для кубика с текстурами с Уровнем 2
import smallCube01 from "@/assets/app/VortexCube/cube2/cube2-01.webp";
import smallCube02 from "@/assets/app/VortexCube/cube2/cube2-02.webp";
import smallCube03 from "@/assets/app/VortexCube/cube2/cube2-03.webp";
import smallCube04 from "@/assets/app/VortexCube/cube2/cube2-04.webp";
import smallCube05 from "@/assets/app/VortexCube/cube2/cube2-05.webp";
import smallCube06 from "@/assets/app/VortexCube/cube2/cube2-06.webp";
import smallCube07 from "@/assets/app/VortexCube/cube2/cube2-07.webp";
import smallCube08 from "@/assets/app/VortexCube/cube2/cube2-08.webp";

// Картинки для кубика с текстурами с Уровнем 3
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

// === Конфигурации текстур для разных уровней ===

// Уровень 1: каждая сторона - своя текстура (6 текстур)
const TEXTURE_CONFIG_LEVEL_1 = [
  {
    right: rightTexture,
    left: leftTexture,
    front: frontTexture,
    back: backTexture,
    bottom: bottomTexture,
    top: topTexture
  }
];

// Уровень 2: каждый кубик - одна текстура (8 кубиков)
const TEXTURE_CONFIG_LEVEL_2 = [
  { texture: smallCube01 },
  { texture: smallCube02 },
  { texture: smallCube03 },
  { texture: smallCube04 },
  { texture: smallCube05 },
  { texture: smallCube06 },
  { texture: smallCube07 },
  { texture: smallCube08 },
];

// Уровень 3: каждый кубик - одна текстура (27 кубиков)
const TEXTURE_CONFIG_LEVEL_3 = [
  { texture: small2Cube01 }, { texture: small2Cube02 }, { texture: small2Cube03 },
  { texture: small2Cube04 }, { texture: small2Cube05 }, { texture: small2Cube06 },
  { texture: small2Cube07 }, { texture: small2Cube08 }, { texture: small2Cube09 },
  { texture: small2Cube10 }, { texture: small2Cube11 }, { texture: small2Cube12 },
  { texture: small2Cube13 }, { texture: small2Cube14 }, { texture: small2Cube15 },
  { texture: small2Cube16 }, { texture: small2Cube17 }, { texture: small2Cube18 },
  { texture: small2Cube19 }, { texture: small2Cube20 }, { texture: small2Cube21 },
  { texture: small2Cube22 }, { texture: small2Cube23 }, { texture: small2Cube24 },
  { texture: small2Cube25 }, { texture: small2Cube26 }, { texture: small2Cube27 },
];

// === Палитра цветов (27 цветов для разных кубиков) ===
const COLOR_PALETTE = [
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

// === Конфигурации цветов для разных уровней ===

// Уровень 1: каждая сторона - свой цвет (6 цветов)
const COLOR_CONFIG_LEVEL_1 = [
  {
    right: COLOR_PALETTE[0].value,   // Красный
    left: COLOR_PALETTE[1].value,    // Зелёный
    front: COLOR_PALETTE[4].value,   // Пурпурный
    back: COLOR_PALETTE[5].value,    // Бирюзовый
    bottom: COLOR_PALETTE[3].value,  // Жёлтый
    top: COLOR_PALETTE[2].value,     // Синий
  }
];

// Уровень 2: каждый кубик - один цвет (8 кубиков)
const COLOR_CONFIG_LEVEL_2 = [
  { color: COLOR_PALETTE[26].value },  // Индиго
  { color: COLOR_PALETTE[25].value },  // Бирюзово-зелёный
  { color: COLOR_PALETTE[24].value },  // Кирпичный
  { color: COLOR_PALETTE[23].value },  // Лайм
  { color: COLOR_PALETTE[22].value },  // Малиновый
  { color: COLOR_PALETTE[21].value },  // Морской зелёный
  { color: COLOR_PALETTE[20].value },  // Тёмно-фиолетовый
  { color: COLOR_PALETTE[19].value },  // Стальной
];

// Уровень 3: каждый кубик - один цвет (27 кубиков)
const COLOR_CONFIG_LEVEL_3 = COLOR_PALETTE.map(c => ({ color: c.value }));

// === Конфигурации ФОТО для разных уровней ===

const PHOTO_CONFIG_LEVEL_1 = [
  {
    right: rightImg,
    left: leftImg,
    front: frontImg,
    back: backImg,
    bottom: bottomImg,
    top: topImg
  }
];

// Уровень 2: каждый кубик - свои фото (8 кубиков, top/bottom/sides)
const PHOTO_CONFIG_LEVEL_2 = [
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube01, sideLevel2Cube01, sideLevel2Cube01, sideLevel2Cube01] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube02, sideLevel2Cube02, sideLevel2Cube02, sideLevel2Cube02] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube03, sideLevel2Cube03, sideLevel2Cube03, sideLevel2Cube03] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube04, sideLevel2Cube04, sideLevel2Cube04, sideLevel2Cube04] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube05, sideLevel2Cube05, sideLevel2Cube05, sideLevel2Cube05] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube06, sideLevel2Cube06, sideLevel2Cube06, sideLevel2Cube06] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube07, sideLevel2Cube07, sideLevel2Cube07, sideLevel2Cube07] },
  { top: topLevel2Cube, bottom: bottomLevel2Cube, sides: [sideLevel2Cube08, sideLevel2Cube08, sideLevel2Cube08, sideLevel2Cube08] },
];

// Уровень 3: каждый кубик - свои фото (27 кубиков, top/bottom/sides)
const PHOTO_CONFIG_LEVEL_3 = [
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

extend({ OrbitControls });
const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

function SetupCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = 75;
    camera.position.set(0, 0, 12);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

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

// Компонент для установки фона (условно рендерит загрузчик)
function SceneBackground({ imagePath, canvasFullscreen }) {
  if (!canvasFullscreen) {
    return null; // Прозрачный фон
  }

  return <BackgroundTexture imagePath={imagePath} />;
}

// Компонент загрузки текстуры (вызывается только когда нужно)
function BackgroundTexture({ imagePath }) {
  const texture = useLoader(TextureLoader, imagePath);
  return <primitive attach="background" object={texture} />;
}

// ---- Настройка поворотов по умолчанию для граней (можно расширить/перенастроить) ----
const DEFAULT_SIDE_ROTATIONS = {
  right: -90,
  left: 90,
  back: 180,
  front: 0,
  top: 0,
  bottom: 0
};

// Функция для выбора куба через клик
export const useCubeSelection = (groupRefs, onSelect) => {
  const { camera, gl, raycaster } = useThree();
  const mouse = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(
        mouse,
        /** @type {import('three').PerspectiveCamera} */ (camera)
      );

      for (let i = 0; i < groupRefs.length; i++) {
        const group = groupRefs[i]?.current;
        if (!group) continue;

        const intersects = raycaster.intersectObjects(group.children, true);
        if (intersects.length) {
          onSelect(i + 1);
          return;
        }
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, raycaster, mouse, groupRefs, onSelect]);
};

const CubeGroup = ({ groupSize, gap, rotationX, rotationY, rotationZ, isRotating, direction, speed,
                     resetTrigger, flipTrigger, smallCubeScale, shuffleTrigger, setShuffleTrigger, positionsResetTrigger,
                     cubeLevel, cubeStyle, cubePosition = [0, 0, 0], isSelected = false }) => {
  const groupRef = useRef(null);

  // Определяем сколько кубов в одной строке
  const cubesPerSide = cubeLevel === 1 ? 1 : (cubeLevel === 8 ? 2 : 3);

  // Размер одного маленького куба рассчитывается так:
  // total = cubeSize * cubesPerSide + gap * (cubesPerSide - 1)
  // groupSize = cubeSize * cubesPerSide + gap * (cubesPerSide - 1)
  // cubeSize = (groupSize - gap * (cubesPerSide - 1)) / cubesPerSide
  const cubeSize = (groupSize - gap * (cubesPerSide - 1)) / cubesPerSide + gap / cubesPerSide * 2; // Супер Важно!

  const cubeCount = cubeLevel; // Количество кубов в зависимости от уровня

  // Выбираем правильную конфигурацию в зависимости от cubeLevel И cubeStyle
  const CUBE_CONFIGS = useMemo(() => {
    // Фото
    if (cubeStyle === 'photo') {
      return cubeLevel === 1 ? PHOTO_CONFIG_LEVEL_1
        : cubeLevel === 8 ? PHOTO_CONFIG_LEVEL_2
          : PHOTO_CONFIG_LEVEL_3;
    }
    // Текстура
    if (cubeStyle === 'texture') {
      return cubeLevel === 1 ? TEXTURE_CONFIG_LEVEL_1
        : cubeLevel === 8 ? TEXTURE_CONFIG_LEVEL_2
          : TEXTURE_CONFIG_LEVEL_3;
    }
    // Цвет
    if (cubeStyle === 'color') {
      return cubeLevel === 1 ? COLOR_CONFIG_LEVEL_1
        : cubeLevel === 8 ? COLOR_CONFIG_LEVEL_2
          : COLOR_CONFIG_LEVEL_3;
    }
    // По умолчанию - фото
    return cubeLevel === 1 ? PHOTO_CONFIG_LEVEL_1
      : cubeLevel === 8 ? PHOTO_CONFIG_LEVEL_2
        : PHOTO_CONFIG_LEVEL_3;
  }, [cubeLevel, cubeStyle]);

  const geometry = useMemo(
    () => new THREE.BoxGeometry(cubeSize * smallCubeScale, cubeSize * smallCubeScale, cubeSize * smallCubeScale),
    [cubeSize, smallCubeScale]
  );

  // Для загрузки текстур, фотографий
  const texturePathList = useMemo(() => {
    if (cubeStyle === "color") return []; // Чертовски важная штука!!! Без неё не будет работать cubeLevel1!

    const arr = [];

    CUBE_CONFIGS.forEach(cfg => {
      // Для фото: добавляем top, bottom, sides
      if (cfg.top) arr.push(cfg.top);
      if (cfg.bottom) arr.push(cfg.bottom);
      if (cfg.sides) arr.push(...cfg.sides);

      // Для текстур: добавляем texture, right, left, front, back
      if (cfg.texture) arr.push(cfg.texture);
      if (cfg.right) arr.push(cfg.right);
      if (cfg.left) arr.push(cfg.left);
      if (cfg.front) arr.push(cfg.front);
      if (cfg.back) arr.push(cfg.back);
    });

    return Array.from(new Set(arr.filter(Boolean)));
  }, [CUBE_CONFIGS]);

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

  // === Базовые упорядоченные позиции в зависимости от cubeLevel ===
  const basePositions = useMemo(() => {
    const step = cubeSize + gap; // Шаг между кубами

    if (cubeLevel === 1) {
      // Один куб в центре
      return [[0, 0, 0]];
    } else if (cubeLevel === 8) {
      // 2x2x2 кубов
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
    } else {
      // 3x3x3 кубов (27 кубов)
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
  }, [cubeSize, gap, cubeLevel]);

  // Функция для получения ключа хранилища в зависимости от УРОВНЯ (1, 2, 3)
  // Маппим режим (1-3) на количество кубиков (1, 8, 27) для более читаемых ключей
  const cubeLevelToCount = { 1: 1, 8: 2, 27: 3 };
  const getStorageKey = (level) => `multiCubeForgePositionsOrder_level_${cubeLevelToCount[level]}`;

  // Массив индексов позиций кубиков. Если null — значит кубики в естественном порядке (не перемешаны).
  // Сохраняем ОТДЕЛЬНО для каждого уровня (1x1x1, 2x2x2, 3x3x3)
  const STORAGE_KEY = useMemo(() => getStorageKey(cubeLevel), [cubeLevel]);

  // === ИНИЦИАЛИЗАЦИЯ: Загружаем сохранённый порядок из localStorage для текущего режима
  // Ленивая инициализация - выполняется один раз при первом рендере
  // Проверяем что сохранённые данные соответствуют текущему режиму (правильное количество кубиков)
  const [order, setOrder] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Проверяем соответствие текущему режиму
        // (массив должен содержать ровно столько индексов, сколько кубиков в этом режиме)
        if (Array.isArray(parsed) && parsed.length === basePositions.length) {
          console.log(`✅ Загружены сохранённые позиции для режима ${cubeLevelToCount[cubeLevel]} (${cubeLevel} кубиков)`);
          return parsed;
        }
      }
    } catch (e) {
      console.error('Ошибка чтения order из localStorage:', e);
    }
    console.log(`📝 Новый порядок для режима ${cubeLevelToCount[cubeLevel]} (${cubeLevel} кубиков)`);
    return null; // Возвращаем null, если нет сохранённых данных или они не совпадают
  });

  const isInitializedRef = useRef(false); // Флаг инициализации

  // Храним текущие позиции кубиков (куда они реально должны идти)
  const currentTargetsRef = useRef([]);

  // Флаг - двигаются ли кубики сейчас (только при shuffle)
  const isMovingRef = useRef(false);

  // Флаг для отслеживания: в данный момент ли идёт загрузка order из localStorage
  // Используется чтобы отличить загрузку (без анимации) от shuffle (с анимацией)
  const isLoadingFromStorageRef = useRef(false);

  // Управление вращением куба
  const [targetRotationZ, setTargetRotationZ] = useState(null);

  // === ВЫЧИСЛЕНИЕ: Преобразуем порядок кубиков в реальные координаты
  // Если order пуст — используем естественный порядок позиций (basePositions)
  // Если order заполнен — переставляем позиции согласно сохранённому порядку
  const targets = useMemo(() => {
    if (Array.isArray(order)) {
      // order содержит индексы: [3, 1, 5, ...] - какой кубик должен быть где
      // Маппим индексы на реальные позиции
      return order.map(idx => basePositions[idx]);
    }
    // Используем естественный порядок
    return basePositions;
  }, [basePositions, order]);

  // Функция для получения текущего order из localStorage (без state)
  const getOrderFromStorage = (level = cubeLevel) => {

    /**
     * Получает сохранённый порядок кубиков из localStorage
     * Возвращает массив индексов или null если данных нет/они некорректны
     *
     * Пример: [3, 1, 5, 0, 2, 4] означает, что кубик #0 должен быть на позиции basePositions[3],
     * кубик #1 на позиции basePositions[1], и т.д.
     */

    try {
      const key = getStorageKey(level);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Проверяем: массив ли это и совпадает ли длина с текущим режимом
      if (Array.isArray(parsed) && parsed.length === basePositions.length) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // EFFECT 1: СБРОС ФЛАГОВ ПРИ СМЕНЕ CUBE LEVEL
  useEffect(() => {

    /**
     * Срабатывает когда пользователь меняет уровень (cubeLevel 1→2→3)
     *
     * Что делает:
     * - Сбрасывает флаг инициализации (isInitializedRef.current = false)
     *   → позволит следующему effect инициализировать позиции кубиков
     * - Сбрасывает флаг перемещения (isMovingRef.current = false)
     *   → останавливает плавное перемещение если оно было
     * - Помечает, что сейчас идёт загрузка из хранилища
     *   → следующие effect'ы поймут что НЕ НУЖНО запускать анимацию
     *
     * Почему queueMicrotask? Чтобы гарантировать правильный порядок выполнения
     */

    isInitializedRef.current = false;
    isMovingRef.current = false;
    isLoadingFromStorageRef.current = true;
    currentTargetsRef.current = [];  // Очищаем старые позиции
    // setOrder(null);  // Сбрасываем order при смене уровня

    queueMicrotask(() => {
      console.log('🔄 Микротаск: сброс завершён, можно загружать order');
    });
  }, [basePositions.length]); // Зависимость: смена cubeLevel меняет количество позиций

  // EFFECT 2: ИНИЦИАЛИЗАЦИЯ ПОЗИЦИЙ КУБИКОВ ПРИ ПЕРВОМ РЕНДЕРЕ
  useEffect(() => {

    /**
     * Срабатывает один раз при появлении новых кубиков (смена cubeLevel)
     * или когда меняется массив целевых позиций (targets)
     *
     * Что делает:
     * - Устанавливает каждому кубику его начальную позицию МГНОВЕННО (без анимации)
     * - Если загружаем из localStorage → позиции соответствуют сохранённому порядку
     * - Если первый раз → позиции соответствуют естественному порядку (basePositions)
     *
     * Зачем нужна проверка isLoadingFromStorageRef?
     * Чтобы отличить:
     * - Загрузку старых данных (не нужна анимация, просто встать на место)
     * - Новый режим (нужна инициализация перед первым shuffle)
     */

    queueMicrotask(() => {
      // Если уже инициализировано или идёт перемещение → выходим
      if (!groupRef.current || isInitializedRef.current || isMovingRef.current) {
        return;
      }

      // Проверяем есть ли сохранённый порядок в хранилище
      const storedOrder = getOrderFromStorage();

      // Если загружаем из localStorage и есть сохранённые данные → инициализируем БЕЗ анимации
      if (isLoadingFromStorageRef.current && storedOrder) {
        console.log('⏸️ Инициализация при загрузке - анимация НЕ запускается');
        isLoadingFromStorageRef.current = false; // Помечаем что загрузка завершена
        isInitializedRef.current = true;

        // Копируем целевые позиции в буфер
        currentTargetsRef.current = targets.map(pos => [...pos]);

        // Устанавливаем каждому кубику его позицию МГНОВЕННО
        const children = Array.from(groupRef.current.children);
        children.forEach((mesh, i) => {
          const t = currentTargetsRef.current[i];
          if (t) {
            mesh.position.set(t[0], t[1], t[2]);
          }
        });
        return;
      }

      isLoadingFromStorageRef.current = false;

      // Первая инициализация → обычный процесс
      isInitializedRef.current = true;
      currentTargetsRef.current = targets.map(pos => [...pos]);

      const children = Array.from(groupRef.current.children);
      children.forEach((mesh, i) => {
        const t = currentTargetsRef.current[i];
        if (t) {
          mesh.position.set(t[0], t[1], t[2]);
        }
      });
      console.log(`🎯 Инициализированы позиции ${children.length} кубиков`);
    });
  }, [targets]); // Зависимость: только от targets, БЕЗ cubeLevel (чтобы не срабатывало при смене уровня)

  // EFFECT 3: Синхронизация currentTargetsRef с targets
  useEffect(() => {
    // Обновляем currentTargetsRef когда targets меняется
    // (например, после shuffle через setOrder)
    if (isInitializedRef.current) {
      currentTargetsRef.current = targets.map(pos => [...pos]);
      // console.log(`🔄 Синхронизированы targets для ${targets.length} кубиков, первая позиция: [${targets[0][0].toFixed(2)}, ${targets[0][1].toFixed(2)}, ${targets[0][2].toFixed(2)}]`);
    }
  }, [targets]);

  // EFFECT 4: ПЕРЕМЕШИВАНИЕ КУБИКОВ
  useEffect(() => {

    /**
     * Срабатывает когда пользователь нажимает кнопку "Перемешать кубики"
     *
     * Что делает:
     * 1. Генерирует случайный порядок кубиков (алгоритм Fisher-Yates shuffle)
     * 2. Сохраняет этот порядок в localStorage (чтобы при выходе/входе он сохранился)
     * 3. Запускает плавную анимацию перемещения кубиков (через setOrder)
     * 4. Сбрасывает shuffleTrigger СРАЗУ после использования
     *    → это предотвращает автоматический shuffle при смене уровня
     *
     * Пример результата:
     * arr = [3, 1, 5, 0, 2, 4] → кубик с индексом 3 встанет на позицию 0,
     * кубик с индексом 1 встанет на позицию 1, и т.д.
     */

    // Если нет команды на перемешивание → выходим
    if (shuffleTrigger === 0) return;

    // Генерируем случайный порядок
    const n = basePositions.length;
    const arr = Array.from({ length: n }, (_, i) => i);

    // Fisher-Yates shuffle алгоритм (надёжное перемешивание)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // ✅ Сохраняем в localStorage
    localStorage.setItem(getStorageKey(cubeLevel), JSON.stringify(arr));
    console.log(`💾 Сохранён order для режима ${cubeLevelToCount[cubeLevel]} (${n} кубиков)`);

    // ✅ Запускаем анимацию
    setOrder(arr);
    isMovingRef.current = true;
    console.log(`🎲 Запущено перемешивание (${n} кубиков)`);

    // ✅ Сбрасываем trigger
    queueMicrotask(() => {
      setShuffleTrigger(0);
      isLoadingFromStorageRef.current = true; // Помечаем для следующей загрузки
    });
  }, [shuffleTrigger, basePositions.length, setShuffleTrigger]); // Зависимость: shuffleTrigger от кнопки, basePositions от уровня

  // EFFECT 5: СБРОС ПОЗИЦИЙ (КНОПКА RESET)
  useEffect(() => {

    /**
     * Срабатывает когда пользователь нажимает кнопку "Восстановить позиции"
     *
     * Что делает:
     * 1. Очищает сохранённый порядок из localStorage
     *    → при следующем входе кубики будут в естественном порядке
     * 2. Сбрасывает order в null (естественный порядок)
     *    → targets вернутся к basePositions
     * 3. Запускает плавную анимацию возврата кубиков на исходные позиции
     *
     * Почему нужно очищать localStorage?
     * Если не очистить, то при смене уровня и возврате обратно
     * загрузится старый перемешанный порядок из Effect 3
     */

    if (positionsResetTrigger === 0) return;

    // ⚠️ Проверяем ТЕКУЩИЙ режим (STORAGE_KEY может измениться)
    const currentStorageKey = getStorageKey(cubeLevel);
    const raw = localStorage.getItem(currentStorageKey);
    const storedOrder = raw ? JSON.parse(raw) : null;

    if (!storedOrder) {
      // Если localStorage пустой → кубики уже на базовых позициях → ничего не делаем
      console.log(`ℹ️ Order уже сброшен для режима ${cubeLevelToCount[cubeLevel]}, анимация не нужна`);
      return;
    }

    // Очищаем localStorage для ТЕКУЩЕГО режима
    localStorage.removeItem(currentStorageKey);
    console.log(`🗑️ Очищен order для режима ${cubeLevelToCount[cubeLevel]} (${basePositions.length} кубиков)`);

    // ⚠️ ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: order уже null?
    if (order === null) {
      // Если order уже null → анимация не нужна, просто обновим позиции
      console.log(`ℹ️ Order уже null, принудительно обновляем позиции без анимации`);

      // Принудительно устанавливаем базовые позиции
      if (groupRef.current) {
        const children = Array.from(groupRef.current.children);
        children.forEach((mesh, i) => {
          const pos = basePositions[i];
          if (pos) {
            mesh.position.set(pos[0], pos[1], pos[2]);
          }
        });
      }
      return;
    }

    // Сбрасываем order и запускаем анимацию
    setOrder(null);
    isMovingRef.current = true;
  }, [positionsResetTrigger]);

  // EFFECT 6: При изменении gap - синхронно обновляем currentTargets БЕЗ анимации
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

  // EFFECT 7: Первоначальная ориентация
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        degreesToRadians(rotationX),
        degreesToRadians(rotationY),
        degreesToRadians(rotationZ)
      );
    }
  }, [rotationX, rotationY, rotationZ]);

  // EFFECT 8: Сброс
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

  // EFFECT 9: Поворот на 180°
  useEffect(() => {
    if (groupRef.current) {
      const currentZ = groupRef.current.rotation.z;
      const newTarget = currentZ + Math.PI;
      setTargetRotationZ(newTarget);
    }
  }, [flipTrigger]);

  // EFFECT 10: Очистка. При размонтировании CubeGroup все текстуры и материалы будут освобождены и память не утечёт!
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

  // Флаг для отслеживания первого кадра после установки targetRotationZ
  // Используется, чтобы на первом кадре Level 1 прибавить весь normalizedDiff сразу и убрать стартовый рывок,
  // а на последующих кадрах применять обычную плавную интерполяцию.
  const firstFlipFrameRef = useRef(true);

  // === ОСНОВНАЯ ФУНКЦИЯ АНИМАЦИИ СЦЕНЫ (useFrame) ===
  useFrame((_, delta) => {

    /**
     * Отвечает за плавное перемещение, вращение и анимацию группы кубиков в реальном времени.
     * Состоит из трёх логических блоков:
     * 1. Анимация перемещения кубиков (shuffle/reset)
     * 2. Постоянное вращение группы
     * 3. Плавный поворот к заданному углу
     */

    // Проверка: если группа кубиков не инициализирована – выходим
    if (!groupRef.current) return;

    // Скорость плавной анимации перемещения кубиков (выше = быстрее)
    const smoothSpeed = 3.0;

    // === БЛОК 1: Анимация перемещения кубиков (shuffle/reset) ===
    if (isMovingRef.current) {

      // --- Условие: если cubeLevel === 1 (один куб) ---
      if (cubeLevel === 1) {
        /**
         * Для режима 1x1x1 (один кубик):
         * Перемещение не требуется, так как куб один и находится в центре.
         * Сразу помечаем анимацию как завершённую.
         */
        isMovingRef.current = false;
      }
      // --- Условие: иные режимы (8 или 27 кубиков) ---
      else {
        /**
         * Для режимов 2x2x2 (8 кубиков) и 3x3x3 (27 кубиков):
         * Выполняем плавную анимацию перемещения кубиков к целевым позициям.
         */

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
          // Фактор скорости: (1 - Math.exp(-smoothSpeed * delta)) дает плавное замедление
          current[0] += (t[0] - current[0]) * (1 - Math.exp(-smoothSpeed * delta));
          current[1] += (t[1] - current[1]) * (1 - Math.exp(-smoothSpeed * delta));
          current[2] += (t[2] - current[2]) * (1 - Math.exp(-smoothSpeed * delta));

          // Создаём вектор целевой позиции для интерполяции
          const targetVec = new THREE.Vector3(current[0], current[1], current[2]);

          // Применяем линейную интерполяцию (lerp) к реальной позиции меша
          mesh.position.lerp(targetVec, 1 - Math.exp(-smoothSpeed * delta));

          // Проверяем расстояние до цели (если больше 0.001 – кубик ещё движется)
          const distance = mesh.position.distanceTo(targetVec);
          if (distance > 0.001) {
            allReached = false; // Ещё не достигли цели
          }
        });

        // Если все кубики достигли своих позиций – останавливаем анимацию перемещения
        if (allReached) {
          isMovingRef.current = false;
        }
      }
    }

    // === БЛОК 2: Постоянное вращение группы кубиков ===
    // Преобразуем пользовательскую скорость (0-10) в реальную скорость вращения (0-0.025)
    // При значении 4 получаем комфортную скорость ~0.01 радиан/кадр
    const actualSpeed = (speed / 10) * 0.025;

    // Если нет целевого угла поворота И вращение включено – крутим постоянно
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
      if (cubeLevel === 1 && firstFlipFrameRef.current || cubeStyle === "color" && firstFlipFrameRef.current) {
        groupRef.current.rotation.z += normalizedDiff;
        firstFlipFrameRef.current = false;
      } else {
        groupRef.current.rotation.z += normalizedDiff * Math.min(10 * delta, 1);
      }

      // Если угол почти достигнут (погрешность < 0.01 радиан) – фиксируем и убираем цель
      if (Math.abs(normalizedDiff) < 0.01) {
        groupRef.current.rotation.z = targetRotationZ;
        setTargetRotationZ(null); // Возвращаемся к обычному вращению
      }
    }
  });

  // Мемоизируем создание материалов
  const cubeMaterials = useMemo(() => {

    // === ЦВЕТ: один цвет на все стороны (кроме уровня 1) ===
    if (cubeStyle === 'color') {
      return Array.from({ length: cubeCount }, (_, i) => {
        const cfg = CUBE_CONFIGS[i % CUBE_CONFIGS.length];

        // Уровень 1: каждая сторона - свой цвет
        if (cubeLevel === 1) {
          return [
            new THREE.MeshBasicMaterial({ color: cfg.right }),
            new THREE.MeshBasicMaterial({ color: cfg.left }),
            new THREE.MeshBasicMaterial({ color: cfg.front }),
            new THREE.MeshBasicMaterial({ color: cfg.back }),
            new THREE.MeshBasicMaterial({ color: cfg.bottom }),
            new THREE.MeshBasicMaterial({ color: cfg.top }),
          ];
        }

        // Уровни 2 и 3: один цвет на все стороны
        const colorMat = new THREE.MeshBasicMaterial({ color: cfg.color });
        return [colorMat, colorMat, colorMat, colorMat, colorMat, colorMat];
      });
    }

    // === ФОТО: используем текстуры с top/bottom/sides ===
    if (cubeStyle === 'photo') {
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

      return Array.from({ length: cubeCount }, (_, i) => {
        const cfg = CUBE_CONFIGS[i % CUBE_CONFIGS.length];

        // Уровень 1: используем right/left/top/bottom/front/back
        if (cubeLevel === 1) {
          const rightTex = getTex(cfg.right);
          const leftTex = getTex(cfg.left);
          const frontTex = getTex(cfg.front);
          const backTex = getTex(cfg.back);
          const bottomTex = getTex(cfg.bottom);
          const topTex = getTex(cfg.top);

          return [
            makeMat(rightTex, DEFAULT_SIDE_ROTATIONS.right),
            makeMat(leftTex, DEFAULT_SIDE_ROTATIONS.left),
            makeMat(frontTex, DEFAULT_SIDE_ROTATIONS.front),
            makeMat(backTex, DEFAULT_SIDE_ROTATIONS.back),
            makeMat(bottomTex, DEFAULT_SIDE_ROTATIONS.bottom),
            makeMat(topTex, DEFAULT_SIDE_ROTATIONS.top),
          ];
        }

        // Уровни 2 и 3: используем top/bottom/sides
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
    }

    // === ТЕКСТУРА: одна текстура на все стороны (кроме уровня 1) ===
    if (cubeStyle === 'texture') {
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

      return Array.from({ length: cubeCount }, (_, i) => {
        const cfg = CUBE_CONFIGS[i % CUBE_CONFIGS.length];

        // Уровень 1: каждая сторона - своя текстура
        if (cubeLevel === 1) {
          const rightTex = getTex(cfg.right);
          const leftTex = getTex(cfg.left);
          const frontTex = getTex(cfg.front);
          const backTex = getTex(cfg.back);
          const bottomTex = getTex(cfg.bottom);
          const topTex = getTex(cfg.top);

          return [
            makeMat(rightTex, DEFAULT_SIDE_ROTATIONS.right),
            makeMat(leftTex, DEFAULT_SIDE_ROTATIONS.left),
            makeMat(frontTex, DEFAULT_SIDE_ROTATIONS.front),
            makeMat(backTex, DEFAULT_SIDE_ROTATIONS.back),
            makeMat(bottomTex, DEFAULT_SIDE_ROTATIONS.bottom),
            makeMat(topTex, DEFAULT_SIDE_ROTATIONS.top),
          ];
        }

        // // Уровни 2 и 3: одна текстура на все стороны, БЕЗ DEFAULT_SIDE_ROTATIONS (без ротации)
        // const tex = getTex(cfg.texture);
        // return Array.from({ length: 6 }, () => makeMat(tex, 0));

        // Уровни 2 и 3: одна текстура на все стороны
        const tex = getTex(cfg.texture);

        return [
          makeMat(tex, DEFAULT_SIDE_ROTATIONS.right),
          makeMat(tex, DEFAULT_SIDE_ROTATIONS.left),
          makeMat(tex, DEFAULT_SIDE_ROTATIONS.front),
          makeMat(tex, DEFAULT_SIDE_ROTATIONS.back),
          makeMat(tex, DEFAULT_SIDE_ROTATIONS.bottom),
          makeMat(tex, DEFAULT_SIDE_ROTATIONS.top),
        ];
      });
    }

    // По умолчанию - возвращаем серые кубики
    return Array.from({ length: cubeCount }, () => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      return [mat, mat, mat, mat, mat, mat];
    });

  }, [textureByPath, cubeCount, CUBE_CONFIGS, cubeStyle, cubeLevel]);

  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group ref={groupRef} position={cubePosition}>
      {isSelected && (
        <mesh>
          <boxGeometry args={[groupSize * 1.1, groupSize * 1.1, groupSize * 1.1]} />
          <meshBasicMaterial color="#ffff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
      {basePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh geometry={geometry} material={cubeMaterials[i]} />
          {cubeStyle === 'color' && (
            <lineSegments geometry={edgesGeometry} onUpdate={(self) => self.position.multiplyScalar(1.0005)}>
              <lineBasicMaterial color="black" depthTest={true} />
            </lineSegments>
          )}
        </group>
      ))}
    </group>
  );
};

const MultiCubeForge = forwardRef(({ groupSize = 2.5, canvasFullscreen = false }, ref) => {
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

  // Выбор активного куба
  const [selectedCube, setSelectedCube] = useState(1);

  // states
  const [openBlock, setOpenBlock] = useState(null);
  const [isShuffleMenuOpen, setIsShuffleMenuOpen] = useState(false);
  const [isClearMenuOpen, setIsClearMenuOpen] = useState(false);
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const [isCubeStyleMenuOpen, setIsCubeStyleMenuOpen] = useState(false);
  const [isCanvasBackgroundMenuOpen, setIsCanvasBackgroundMenuOpen] = useState(false);

  // Состояние для записи видео
  const [isRecording, setIsRecording] = useState(false);

  // Refs для трёх кубов
  const cube1Ref = useRef(null);
  const cube2Ref = useRef(null);
  const cube3Ref = useRef(null);

  // Получаем настройки для каждого куба с правильным префиксом
  const getCubeSettings = (cubeId) => {
    const suffix = `Cube${cubeId}`;
    const [gap, setGap, resetGap] = useLocalStorage(`multiCubeForgeGap${suffix}`, 0.15, parseFloat);
    const [smallCubeScale, setSmallCubeScale, resetSmallCubeScale] = useLocalStorage(`multiCubeForgeSmallCubeScale${suffix}`, 0.85, parseFloat);
    const [rotationX, setRotationX, resetRotationX] = useLocalStorage(`multiCubeForgeRotX${suffix}`, 90, parseFloat);
    const [rotationY, setRotationY, resetRotationY] = useLocalStorage(`multiCubeForgeRotY${suffix}`, 0, parseFloat);
    const [rotationZ, setRotationZ, resetRotationZ] = useLocalStorage(`multiCubeForgeRotZ${suffix}`, 0, parseFloat);
    const [speed, setSpeed, resetSpeed] = useLocalStorage(`multiCubeForgeSpeed${suffix}`, 4, parseFloat);
    const [direction, setDirection, resetDirection] = useLocalStorage(`multiCubeForgeDirection${suffix}`, 1, v => parseInt(v, 10));
    const [isRotating, setIsRotating, resetIsRotating] = useLocalStorage(`multiCubeForgeIsRotating${suffix}`, true, v => v === "true");

    // Уровень и стиль по умолчанию для каждого куба
    let defaultLevel, defaultStyle;
    if (cubeId === 1) {
      defaultLevel = 1;
      defaultStyle = "photo";
    } else if (cubeId === 2) {
      defaultLevel = 8;
      defaultStyle = "texture";
    } else {
      defaultLevel = 27;
      defaultStyle = "color";
    }

    const [cubeLevel, setCubeLevel, resetCubeLevel] = useLocalStorage(`multiCubeForgeCubeLevel${suffix}`, defaultLevel, v => parseInt(v, 10));
    const [cubeStyle, setCubeStyle, resetCubeStyle] = useLocalStorage(`multiCubeForgeCubeStyle${suffix}`, defaultStyle, v => v);

    const [shuffleTrigger, setShuffleTrigger] = useState(0);
    const [positionsResetTrigger, setPositionsResetTrigger] = useState(0);

    // Управление вращением
    const [resetTrigger, setResetTrigger] = useState(false);
    const [flipTrigger, setFlipTrigger] = useState(false);

    return {
      gap, setGap, resetGap,
      smallCubeScale, setSmallCubeScale, resetSmallCubeScale,
      rotationX, setRotationX, resetRotationX,
      rotationY, setRotationY, resetRotationY,
      rotationZ, setRotationZ, resetRotationZ,
      speed, setSpeed, resetSpeed,
      direction, setDirection, resetDirection,
      isRotating, setIsRotating, resetIsRotating,
      cubeLevel, setCubeLevel, resetCubeLevel,
      cubeStyle, setCubeStyle, resetCubeStyle,
      shuffleTrigger, setShuffleTrigger,
      positionsResetTrigger, setPositionsResetTrigger,
      resetTrigger, setResetTrigger,
      flipTrigger, setFlipTrigger
    };
  };

  const cube1Settings = getCubeSettings(1);
  const cube2Settings = getCubeSettings(2);
  const cube3Settings = getCubeSettings(3);

  // Получаем настройки активного куба
  const settings = selectedCube === 1 ? cube1Settings : selectedCube === 2 ? cube2Settings : cube3Settings;

  const [canvasBackground, setCanvasBackground, resetCanvasBackground] = useLocalStorage("multiCubeForgeCanvasBackground", "scene01", v => v);

  // Кнопки вращения
  const handleClockwise = () => {settings.setDirection(1);settings.setIsRotating(true);};
  const handleCounterClockwise = () => {settings.setDirection(-1);settings.setIsRotating(true);};
  const handlePause = () => {settings.setIsRotating(prev => !prev);};
  const handleStop = () => {settings.setIsRotating(false);settings.setResetTrigger(prev => !prev);};
  const handleFlip = () => {settings.setFlipTrigger(prev => !prev);};

  // Фабрика хэндлеров для ControlBlock
  const makeHandlers = (setter, defaultValue, min, max, step = 1) => ({
    reset: () => setter(defaultValue),
    increase: () => setter(prev => Math.min(max, +(prev + step).toFixed(2))),
    decrease: () => setter(prev => Math.max(min, +(prev - step).toFixed(2))),
  });

  // Кнопки управления
  const cubeLevelHandlers = makeHandlers(settings.setCubeLevel, selectedCube === 1 ? 1 : selectedCube === 2 ? 8 : 27, 1, 3, 1);
  const speedHandlers = makeHandlers(settings.setSpeed, 4, 0, 10, 1);
  const gapHandlers = makeHandlers(settings.setGap, 0.15, 0, 0.5, 0.01);
  const smallCubeScaleHandlers = makeHandlers(settings.setSmallCubeScale, 0.85, 0.5, 1, 0.05);
  const rotXHandlers = makeHandlers(settings.setRotationX, 90, -180, 180);
  const rotYHandlers = makeHandlers(settings.setRotationY, 0, -180, 180);
  const rotZHandlers = makeHandlers(settings.setRotationZ, 0, -180, 180);

  // Объект для маппинга режима на количество кубов:
  const cubeLevelMap = {
    1: 1,   // уровень 1 = 1 куб
    2: 8,   // уровень 2 = 8 кубов
    3: 27   // уровень 3 = 27 кубов
  };

  // Маппинг названий фонов на импортированные изображения
  const backgroundMap = {
    scene01: small2Cube10,
    scene02: small2Cube15,
    scene03: small2Cube20,
    scene04: small2Cube24
  };

  // Фактическое количество кубов:
  // const actualCubeCount = cubeLevelMap[settings.cubeLevel];

  // EFFECT 11: useEffect для закрытия при клике вне меню!!!!!
  useEffect(() => {
    if (!isShuffleMenuOpen && !isClearMenuOpen && !isSaveMenuOpen && !isCubeStyleMenuOpen && !isCanvasBackgroundMenuOpen) return;

    const handleClickOutside = (event) => {
      // Если клик не внутри панели кнопок
      if (!event.target.closest('.special-buttons')) {
        setIsShuffleMenuOpen(false);
        setIsClearMenuOpen(false);
        setIsCubeStyleMenuOpen(false);
        setIsCanvasBackgroundMenuOpen(false);

        // Меню сохранения НЕ закрываем во время записи видео
        if (!isRecording) {setIsSaveMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShuffleMenuOpen, isClearMenuOpen, isSaveMenuOpen, isCubeStyleMenuOpen, isCanvasBackgroundMenuOpen, isRecording]);

  // EFFECT 12: Когда открывается меню перемешивания — закрываем остальные меню
  useEffect(() => {
    if (isShuffleMenuOpen) {
      setIsClearMenuOpen(false);
      setIsCubeStyleMenuOpen(false);
      setIsCanvasBackgroundMenuOpen(false);

      // Меню сохранения НЕ закрываем во время записи видео
      if (!isRecording) {setIsSaveMenuOpen(false);
      }
    }
  }, [isShuffleMenuOpen, isRecording]);

  // EFFECT 13: Когда открывается меню очистки — закрываем остальные меню
  useEffect(() => {
    if (isClearMenuOpen) {
      setIsShuffleMenuOpen(false);
      setIsCubeStyleMenuOpen(false);
      setIsCanvasBackgroundMenuOpen(false);

      // Меню сохранения НЕ закрываем во время записи видео
      if (!isRecording) {
        setIsSaveMenuOpen(false);
      }
    }
  }, [isClearMenuOpen, isRecording]);

  // EFFECT 14: Когда открывается меню сохранения — закрываем остальные меню
  useEffect(() => {
    if (isSaveMenuOpen) {
      setIsShuffleMenuOpen(false);
      setIsClearMenuOpen(false);
      setIsCubeStyleMenuOpen(false);
      setIsCanvasBackgroundMenuOpen(false);
    }
  }, [isSaveMenuOpen]);

  // EFFECT 15: Когда открывается меню выбора стиля куба — закрываем остальные меню
  useEffect(() => {
    if (isCubeStyleMenuOpen) {
      setIsShuffleMenuOpen(false);
      setIsClearMenuOpen(false);
      setIsCanvasBackgroundMenuOpen(false);

      // Меню сохранения НЕ закрываем во время записи видео
      if (!isRecording) {
        setIsSaveMenuOpen(false);
      }
    }
  }, [isCubeStyleMenuOpen, isRecording]);

  // EFFECT 16: Когда открывается меню фона — закрываем остальные меню
  useEffect(() => {
    if (isCanvasBackgroundMenuOpen) {
      setIsShuffleMenuOpen(false);
      setIsClearMenuOpen(false);
      setIsCubeStyleMenuOpen(false);
      if (!isRecording) setIsSaveMenuOpen(false);
    }
  }, [isCanvasBackgroundMenuOpen, isRecording]);

  // Функция для сброса всех состояний активного куба
  const resetAllStates = () => {
    settings.resetGap();
    settings.resetSmallCubeScale();
    settings.resetRotationX();
    settings.resetRotationY();
    settings.resetRotationZ();
    settings.resetSpeed();
    settings.resetDirection();
    settings.resetIsRotating();
    settings.resetCubeLevel();
    settings.resetCubeStyle();
    resetCanvasBackground();
    settings.setPositionsResetTrigger(prev => prev + 1);
    settings.setResetTrigger(prev => !prev);
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

  // Позиции для трёх кубов
  const cubePositions = [
    [-3.5, 0, 0],  // Куб 1 - слева
    [0, 0, 0],     // Куб 2 - центр
    [3.5, 0, 0]    // Куб 3 - справа
  ];

  // Компонент для обработки кликов
  const CubeSelector = () => {
    useCubeSelection([cube1Ref, cube2Ref, cube3Ref], setSelectedCube);
    return null;
  };


  return (
    <div className="multi-cube-forge-container">

      {/* Панель выбора куба */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: '10px',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '12px'
      }}>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setSelectedCube(id)}
            style={{
              padding: '10px 20px',
              background: selectedCube === id ? '#4a9eff' : '#333',
              border: selectedCube === id ? '2px solid #fff' : '2px solid #555',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
          >
            Cube {id}
          </button>
        ))}
      </div>

      {/* === Панели управления кубом === */}
      <div className="cube-controls">

        {/* Состояние: ничего не открыто → показываем ВСЕ блоки (закрытые) */}
        {openBlock === null && (
          <>
            <ControlBlock label={t("control.level")} icon="fa-solid fa-cubes" isOpen={false} onToggle={() => setOpenBlock("cubeLevel")}
                          gapConfig={{value: settings.cubeLevel, min: 1, max: 3, step: 1, onChange: settings.setCubeLevel, ...cubeLevelHandlers}}
            />

            <ControlBlock label={t("control.speed")} icon="fa-solid fa-gauge-simple-high" isOpen={false} onToggle={() => setOpenBlock("speed")}
                          gapConfig={{value: settings.speed, min: 0, max: 10, step: 1, onChange: settings.setSpeed, ...speedHandlers,}}
            />
            <ControlBlock label={t("control.gap")} icon="fa-solid fa-arrows-left-right" isOpen={false} onToggle={() => setOpenBlock("gap")}
                          gapConfig={{value: settings.gap, min: 0, max: 0.5, step: 0.01, onChange: settings.setGap, ...gapHandlers}}
            />

            <ControlBlock label={t("control.small-cube-size")} icon="fa-solid fa-up-right-and-down-left-from-center" isOpen={false} onToggle={() => setOpenBlock("smallCubeSize")}
                          gapConfig={{value: settings.smallCubeScale, min: 0.5, max: 1.0, step: 0.05, onChange: settings.setSmallCubeScale, ...smallCubeScaleHandlers,}}
            />

            <ControlBlock label={t("control.incline")} icon="fa-solid fa-compass" isOpen={false} onToggle={() => setOpenBlock("rotation")}
                          sliders={[
                            { label: t("control.x-axis"), value: settings.rotationX, min: -180, max: 180, handlers: { ...rotXHandlers, onChange: (v) => settings.setRotationX(v) } },
                            { label: t("control.y-axis"), value: settings.rotationY, min: -180, max: 180, handlers: { ...rotYHandlers, onChange: (v) => settings.setRotationY(v) } },
                            { label: t("control.z-axis"), value: settings.rotationZ, min: -180, max: 180, handlers: { ...rotZHandlers, onChange: (v) => settings.setRotationZ(v) } },
                          ]}
            />
          </>
        )}

        {/* Состояние: открыт cubeLevel → показываем только его */}
        {openBlock === "cubeLevel" && (
          <ControlBlock label={t("control.level")} icon="fa-solid fa-cubes" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: settings.cubeLevel, min: 1, max: 3, step: 1, onChange: settings.setCubeLevel, ...cubeLevelHandlers
                        }}
          />
        )}

        {/* Состояние: открыт speed → показываем только его */}
        {openBlock === "speed" && (
          <ControlBlock label={t("control.speed")} icon="fa-solid fa-gauge-simple-high" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: settings.speed, min: 0, max: 10, step: 1, onChange: settings.setSpeed, ...speedHandlers,}}
          />
        )}

        {/* Состояние: открыт gap → показываем только его */}
        {openBlock === "gap" && (
          <ControlBlock label={t("control.gap")} icon="fa-solid fa-arrows-left-right" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: settings.gap, min: 0, max: 0.5, step: 0.01, onChange: settings.setGap, ...gapHandlers}}
          />
        )}

        {/* Состояние: открыт smallCubeSize → показываем только его */}
        {openBlock === "smallCubeSize" && (
          <ControlBlock label={t("control.small-cube-size")} icon="fa-solid fa-up-right-and-down-left-from-center" isOpen={true} onToggle={() => setOpenBlock(null)}
                        gapConfig={{value: settings.smallCubeScale, min: 0.5, max: 1.0, step: 0.05, onChange: settings.setSmallCubeScale, ...smallCubeScaleHandlers,}}
          />
        )}

        {/* Состояние: открыт rotation → показываем только его */}
        {openBlock === "rotation" && (
          <ControlBlock label={t("control.incline")} icon="fa-solid fa-compass" isOpen={true} onToggle={() => setOpenBlock(null)}
                        sliders={[
                          { label: t("control.x-axis"), value: settings.rotationX, min: -180, max: 180, handlers: { ...rotXHandlers, onChange: (v) => settings.setRotationX(v) } },
                          { label: t("control.y-axis"), value: settings.rotationY, min: -180, max: 180, handlers: { ...rotYHandlers, onChange: (v) => settings.setRotationY(v) } },
                          { label: t("control.z-axis"), value: settings.rotationZ, min: -180, max: 180, handlers: { ...rotZHandlers, onChange: (v) => settings.setRotationZ(v) } },
                        ]}
          />
        )}

      </div>

      {/* === Панель кнопок управления вращением === */}
      <RotationControlPanel isRotating={settings.isRotating} onClockwise={handleClockwise} onCounterClockwise={handleCounterClockwise}
                            onPause={handlePause} onStop={handleStop} onFlip={handleFlip}
      />

      {/* === Панель специальных кнопок === */}
      <div className="special-buttons">

        {/* === Панель очистки localStorage === */}
        <ClearStoragePanel onClearCurrent={resetAllStates} onClearAll={resetAllStates} isOpen={isClearMenuOpen} onToggle={setIsClearMenuOpen}
                           storagePrefix="multiCubeForge"
        />

        {/* === Панель изменения стиля куба === */}
        <CubeStylePanel currentStyle={settings.cubeStyle} onStyleChange={settings.setCubeStyle} isOpen={isCubeStyleMenuOpen} onToggle={setIsCubeStyleMenuOpen}/>

        {/* === Панель перемешивания кубов === */}
        <ShufflePanel isVisible={settings.cubeLevel !== 1} isOpen={isShuffleMenuOpen} onToggle={setIsShuffleMenuOpen}
                      onShuffle={() => settings.setShuffleTrigger(prev => prev + 1)}
                      onReset={() => settings.setPositionsResetTrigger(prev => prev + 1)}
        />

        {/* === Панель выбора фона канваса для просмотра куба === */}
        <CanvasBackgroundPanel canvasRef={internalRef} currentBackground={canvasBackground} onBackgroundChange={setCanvasBackground}
                               onActivate={(bg) => {
                                 setCanvasBackground(bg);
                                 // Fullscreen откроется автоматически внутри компоненты
                               }}
                               isOpen={isCanvasBackgroundMenuOpen}
                               onToggle={setIsCanvasBackgroundMenuOpen}
        />

        {/* === Панель сохранения === */}
        <SavePanel canvasRef={internalRef} isRecording={isRecording} onRecordingChange={setIsRecording} isOpen={isSaveMenuOpen} onToggle={setIsSaveMenuOpen}
                   projectTitle={t('project4.multi-description')}
                   footerText={t('save.created')}
                   siteUrl="https://reactorium-3d.vercel.app"
        />

      </div>

      <div ref={setRefs}>
        <Canvas style={canvasStyle} gl={{ antialias: true, toneMapping: THREE.NoToneMapping, logarithmicDepthBuffer: true }}>
          <SetupCamera />
          <perspectiveCamera makeDefault position={[0, 0, 12]} />
          <ambientLight intensity={0.6} />

          <SceneBackground imagePath={backgroundMap[canvasBackground]} canvasFullscreen={canvasFullscreen}/>

          <CubeSelector />

          {/* Три куба */}
          <CubeGroup
            key="cube1"
            groupSize={groupSize}
            gap={cube1Settings.gap}
            rotationX={cube1Settings.rotationX}
            rotationY={cube1Settings.rotationY}
            rotationZ={cube1Settings.rotationZ}
            isRotating={cube1Settings.isRotating}
            direction={cube1Settings.direction}
            speed={cube1Settings.speed}
            resetTrigger={cube1Settings.resetTrigger}
            flipTrigger={cube1Settings.flipTrigger}
            smallCubeScale={cube1Settings.smallCubeScale}
            shuffleTrigger={cube1Settings.shuffleTrigger}
            setShuffleTrigger={cube1Settings.setShuffleTrigger}
            positionsResetTrigger={cube1Settings.positionsResetTrigger}
            cubeLevel={cubeLevelMap[cube1Settings.cubeLevel]}
            // cubeLevel={cubeLevelMap[actualCubeCount]}
            cubeStyle={cube1Settings.cubeStyle}
            cubePosition={cubePositions[0]}
            isSelected={selectedCube === 1}
            ref={cube1Ref}
          />

          <CubeGroup
            key="cube2"
            groupSize={groupSize}
            gap={cube2Settings.gap}
            rotationX={cube2Settings.rotationX}
            rotationY={cube2Settings.rotationY}
            rotationZ={cube2Settings.rotationZ}
            isRotating={cube2Settings.isRotating}
            direction={cube2Settings.direction}
            speed={cube2Settings.speed}
            resetTrigger={cube2Settings.resetTrigger}
            flipTrigger={cube2Settings.flipTrigger}
            smallCubeScale={cube2Settings.smallCubeScale}
            shuffleTrigger={cube2Settings.shuffleTrigger}
            setShuffleTrigger={cube2Settings.setShuffleTrigger}
            positionsResetTrigger={cube2Settings.positionsResetTrigger}
            cubeLevel={cubeLevelMap[cube2Settings.cubeLevel]}
            // cubeLevel={cubeLevelMap[actualCubeCount]}
            cubeStyle={cube2Settings.cubeStyle}
            cubePosition={cubePositions[1]}
            isSelected={selectedCube === 2}
            ref={cube2Ref}
          />

          <CubeGroup
            key="cube3"
            groupSize={groupSize}
            gap={cube3Settings.gap}
            rotationX={cube3Settings.rotationX}
            rotationY={cube3Settings.rotationY}
            rotationZ={cube3Settings.rotationZ}
            isRotating={cube3Settings.isRotating}
            direction={cube3Settings.direction}
            speed={cube3Settings.speed}
            resetTrigger={cube3Settings.resetTrigger}
            flipTrigger={cube3Settings.flipTrigger}
            smallCubeScale={cube3Settings.smallCubeScale}
            shuffleTrigger={cube3Settings.shuffleTrigger}
            setShuffleTrigger={cube3Settings.setShuffleTrigger}
            positionsResetTrigger={cube3Settings.positionsResetTrigger}
            // cubeLevel={cubeLevelMap[actualCubeCount]}
            cubeLevel={cubeLevelMap[cube3Settings.cubeLevel]}
            cubeStyle={cube3Settings.cubeStyle}
            cubePosition={cubePositions[2]}
            isSelected={selectedCube === 3}
            ref={cube3Ref}
          />

          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
});

MultiCubeForge.displayName = 'MultiCubeForge';

export default MultiCubeForge;