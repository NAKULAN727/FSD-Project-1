export const dummyQuestions = [
  {
    id: 1,
    title: "How do I center a div using Tailwind CSS?",
    description:
      "I've been trying to center a div horizontally and vertically. Can someone explain the best way to do this using Tailwind utilities?",
    tags: ["css", "tailwind-css", "flexbox"],
    votes: 42,
    answersCount: 2,
    author: "frontend_dev",
    createdAt: "2023-11-15T10:00:00Z",
    views: 1205,
    answers: [
      {
        id: 101,
        text: 'You can use `flex` with `items-center` and `justify-center`. \n\nExample:\n`<div class="flex justify-center items-center h-screen">\n  <div>Centered Content</div>\n</div>`',
        author: "css_master",
        votes: 50,
        accepted: true,
        createdAt: "2023-11-15T11:00:00Z",
      },
      {
        id: 102,
        text: 'Another way is using `grid` with `place-items-center`. \n\nExample:\n`<div class="grid place-items-center h-screen">\n  <div>Centered Content</div>\n</div>`',
        author: "grid_fan",
        votes: 20,
        accepted: false,
        createdAt: "2023-11-15T12:00:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "What is the difference between useEffect and useLayoutEffect?",
    description:
      "I'm confused about when to use `useEffect` vs `useLayoutEffect` in React. The documentation says `useLayoutEffect` fires synchronously after all DOM mutations. Can someone provide a practical example?",
    tags: ["react", "hooks", "javascript"],
    votes: 28,
    answersCount: 1,
    author: "react_learner",
    createdAt: "2023-11-16T09:30:00Z",
    views: 840,
    answers: [
      {
        id: 201,
        text: "`useEffect` runs asynchronously after the render is committed to the screen. `useLayoutEffect` runs synchronously immediately after React has performed all DOM mutations. Use `useLayoutEffect` if you need to measure DOM elements (like scroll position or width) before the browser paints.",
        author: "hooks_guru",
        votes: 35,
        accepted: false,
        createdAt: "2023-11-16T10:00:00Z",
      },
    ],
  },
  {
    id: 3,
    title: "How to fetch data in React 18?",
    description:
      "With the new React 18 features, what is the recommended way to fetch data? Should I still use `useEffect` or is there a better approach like Suspense?",
    tags: ["react", "api", "fetch"],
    votes: 15,
    answersCount: 0,
    author: "data_fetcher",
    createdAt: "2023-11-17T14:20:00Z",
    views: 310,
    answers: [],
  },
];

export const allTags = [
  {
    id: 1,
    name: "javascript",
    count: 1205,
    description:
      "For questions regarding programming in ECMAScript (JavaScript/JS) and its various implementations (excluding ActionScript).",
  },
  {
    id: 2,
    name: "react",
    count: 980,
    description:
      "React is a JavaScript library for building user interfaces. It uses a declarative, component-based approach.",
  },
  {
    id: 3,
    name: "css",
    count: 850,
    description:
      "CSS is a style sheet language used for describing the presentation of a document written in a markup language like HTML.",
  },
  {
    id: 4,
    name: "html",
    count: 600,
    description:
      "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
  },
  {
    id: 5,
    name: "node.js",
    count: 540,
    description:
      "Node.js is an event-based, non-blocking, asynchronous I/O runtime that uses Google's V8 JavaScript engine and libuv library.",
  },
  {
    id: 6,
    name: "python",
    count: 1500,
    description:
      "Python is a multi-paradigm, dynamically typed, multipurpose programming language.",
  },
  {
    id: 7,
    name: "tailwind-css",
    count: 320,
    description:
      "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
  },
  {
    id: 8,
    name: "typescript",
    count: 450,
    description:
      "TypeScript is a strict syntactical superset of JavaScript and adds optional static typing to the language.",
  },
];
