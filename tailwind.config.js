/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // 在这里添加你的自定义颜色
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
    // 添加其他 Tailwind 插件
  ],
};
