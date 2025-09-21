import React from 'react';
import { useTranslation } from 'react-i18next';
import '@/pages/menu/Project1.scss';
import {Link} from "react-router-dom";
import {useSpaCleanup} from "@/hooks/useSpaCleanup.js";
import ToggleFooterButton from "@/components/util/ToggleFooterButton.jsx";
import MetaTags from "@/components/seo/MetaTags.jsx";

// R3F
import {BoxGeometry, EdgesGeometry, MeshStandardMaterial} from 'three';
// import { GridHelper, EdgesGeometry, BoxGeometry, MeshStandardMaterial } from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Подключаем OrbitControls
extend({ OrbitControls });

// Компонент управления камерой
const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = React.useRef(null);
  useFrame(() => controls.current && controls.current.update());
  return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
};

// Куб с прозрачными гранями и свечением по контуру
const Box = () => {
  const meshRef = React.useRef(null);
  const edgesRef = React.useRef(null);

  // Цвета для 6 сторон с прозрачностью
  const materials = [
    new MeshStandardMaterial({ color: 'red', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'green', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'blue', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'yellow', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'purple', transparent: true, opacity: 0.7 }),
    new MeshStandardMaterial({ color: 'cyan', transparent: true, opacity: 0.7 }),
  ];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <>
      <mesh ref={meshRef} geometry={new BoxGeometry(2, 2, 2)} material={materials} />
      <lineSegments ref={edgesRef} geometry={new EdgesGeometry(new BoxGeometry(2,2,2))}>
        <lineBasicMaterial attach="material" color="white" transparent opacity={0.8} depthTest={false} />
      </lineSegments>
    </>
  );
};

// // Сетка для сцены
// const Grid = () => {
//   const { scene } = useThree();
//   React.useEffect(() => {
//     const grid = new GridHelper(10, 10, 0xffffff, 0x444444);
//     scene.add(grid);
//     return () => { scene.remove(grid); };
//   }, [scene]);
//   return null;
// };

export const Project1 = () => {
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  useSpaCleanup();

  return (
    <div className="project1">

      <MetaTags
        mainTitle={t('project1.name')}
        metaTags={[
          { name: "description", content: t('project1.disc') },

          // Open Graph meta tags
          { property: "og:title", content: t('project1.name') },
          { property: "og:description", content: t('project1.disc') },
          { property: "og:image", content: `${siteUrl}/ogimage/project1.jpg` },
          { property: "og:url", content: `${siteUrl}/project1` },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: `${siteUrl}` },

          // Twitter meta tags
          { property: "twitter:title", content: t('project1.name') },
          { property: "twitter:description", content: t('project1.disc') },
          { property: "twitter:image", content: `${siteUrl}/ogimage/project1.jpg` },
          { name: "twitter:card", content: "summary_large_image" },
        ]}
      />

      <div className="container">
        <h1><Link to="/" className="back-to-menu" title={t('extra.back')}>
          <i className="fa fa-arrow-circle-left"></i></Link>
          {t('project1.name')}
          <ToggleFooterButton />
        </h1>
        <hr className="custom-line" />

        {/* 3D сцена */}
        <Canvas style={{ height: '600px', width: '100%' }} camera={{ fov: 75 }} >
          <perspectiveCamera makeDefault position={[3, 3, 3]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <Box />
          {/*<Grid />*/}
          <CameraControls />
        </Canvas>

      </div>
    </div>
  );
};