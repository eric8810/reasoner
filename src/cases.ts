import { weatherDoc } from "./tools.doc";

export const programingCases = [
  {
    id: "1",
    name: "Vue.js Reactivity Issue",
    query: `I'm having an issue with Vue.js reactivity. I have an object in my data that looks like this:

data() {
  return {
    user: {
      name: 'John',
      settings: {
        theme: 'dark'
      }
    }
  }
}

When I try to update user.settings.theme, the UI doesn't update even though I can see the value changed when I console.log it. Here's how I'm trying to update it:

this.user.settings.theme = 'light';

What am I doing wrong and how can I fix this reactivity issue?`,
  },
  {
    id: "2",
    name: "React useEffect Infinite Loop",
    query: `I'm experiencing an infinite loop with useEffect in my React component:

useEffect(() => {
  setCount(count + 1);
}, [count]);

The component keeps re-rendering endlessly. What's causing this and how can I fix it?`,
  },
  {
    id: "3",
    name: "CSS Flexbox Centering",
    query: `I'm trying to center a div both horizontally and vertically inside its parent container. I've tried using margin: auto but it only centers horizontally. Here's my current CSS:

.parent {
  height: 100vh;
}
.child {
  width: 200px;
  height: 200px;
  margin: auto;
}

What's the best way to achieve perfect centering using flexbox?`,
  },
  {
    id: "4",
    name: "JavaScript Memory Leak",
    query: `I noticed my single-page application is getting slower over time and consuming more memory. Here's my event listener setup:

componentDidMount() {
  window.addEventListener('resize', this.handleResize);
}

handleResize = () => {
  this.setState({ windowWidth: window.innerWidth });
}

What could be causing the memory leak and how should I properly clean up event listeners?`,
  },
  {
    id: "5",
    name: "Next.js Data Fetching",
    query: `I'm building a Next.js application and trying to decide between getStaticProps and getServerSideProps for my product page. Here's my current setup:

export async function getStaticProps() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  
  return {
    props: { products }
  }
}

The data changes frequently. Should I switch to getServerSideProps? What are the performance implications?`,
  },
  {
    id: "6",
    name: "CSS Grid vs Flexbox",
    query: `I'm building a responsive layout with a header, sidebar, main content, and footer. When should I use CSS Grid vs Flexbox? Here's my current structure:

<div class="container">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>

What would be the most appropriate approach for this layout?`,
  },
  {
    id: "7",
    name: "Weather API",
    query: `
  最近的气温适合去北京还是深圳？

  我们有以下天气 API 文档：
  ${weatherDoc()}

  生成解决这个问题的可以一次运行的python代码，只返回代码，不要其他文本。
  `,
  },
];

export const documentationCases = [
  {
    id: "1",
    name: "Weather API Documentation",
    query: `I'm trying to understand the Weather API documentation. Can you help me understand how to use it?`,
  },
];
