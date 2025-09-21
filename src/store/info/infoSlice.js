import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    id: 1,
    title: 'React',
    version: '19.1.0',
    url: 'https://react.dev',
  },
  {
    id: 2,
    title: "Three.js",
    version: "180",
    url: "https://github.com/mrdoob/three.js/releases"
  },
  {
    id: 3,
    title: "Orbit controls",
    version: "82.1.0",
    url: "https://threejs.org/docs/#examples/en/controls/OrbitControls"
  },
  {
    id: 4,
    title: "React Three Fiber",
    version: "9.3.0",
    url: "https://r3f.docs.pmnd.rs/getting-started/introduction"
  },
  {
    id: 5,
    title: 'React Router',
    version: '7.7.1',
    url: 'https://reactrouter.com',
  },
  {
    id: 6,
    title: 'Redux Toolkit',
    version: '2.8.2',
    url: 'https://redux-toolkit.js.org',
  },
  {
    id: 7,
    title: 'Vite',
    version: '7.1.5',
    url: 'https://vitejs.dev',
  },
  {
    id: 8,
    title: 'React i18next',
    version: '15.6.1',
    url: 'https://react.i18next.com',
  },
  {
    id: 9,
    title: "HTML5",
    version: "",
    url: "https://developer.mozilla.org/ru/docs/Learn/HTML/Introduction_to_HTML"
  },
  {
    id: 10,
    title: "CSS3",
    version: "",
    url: "https://developer.mozilla.org/ru/docs/Learn/CSS/First_steps"
  },
  {
    id: 11,
    title: "SASS",
    version: "1.89.2",
    url: "https://sass-lang.com"
  },
  {
    id: 12,
    title: "FlexBox CSS",
    version: "",
    url: "https://developer.mozilla.org/ru/docs/Learn/CSS/CSS_layout/Flexbox"
  },
  {
    id: 13,
    title: "Grid CSS",
    version: "",
    url: "https://developer.mozilla.org/ru/docs/Web/CSS/CSS_grid_layout"
  },
  {
    id: 14,
    title: "JavaScript",
    version: "",
    url: "https://developer.mozilla.org/ru/docs/Learn/JavaScript"
  },
  {
    id: 15,
    title: "Markdown",
    version: "",
    url: "https://www.markdownguide.org"
  },
  {
    id: 16,
    title: "Google Search Console",
    version: "",
    url: "https://search.google.com/search-console"
  },
  {
    id: 17,
    title: "Google Analytics",
    version: "4.0",
    url: "https://analytics.google.com"
  },
  {
    id: 18,
    title: "Open Graph protocol",
    version: "",
    url: "https://ogp.me"
  },
  {
    id: 19,
    title: "Favicon",
    version: "",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Favicon"
  },
  {
    id: 20,
    title: "Sitemap",
    version: "",
    url: "https://www.sitemaps.org"
  },
  {
    id: 21,
    title: "Robots.txt",
    version: "",
    url: "https://developers.google.com/search/docs/crawling-indexing/robots/intro"
  },
];

const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {},
});

export default infoSlice.reducer;
