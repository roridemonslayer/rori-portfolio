# rori's portfolio (React + TypeScript + Vite)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

- **Content** (jobs, projects, skills, links, chatbot facts) lives in `src/data.ts`.
- **Project art**: drop a landscape image at `public/projects/<slug>.jpg` (slugs are in `src/data.ts`,
  e.g. `pathful.jpg`, `vector-search.jpg`). Until an image exists, the frame shows a title card.
- **Fit pics**: `public/assets/fit1.jpg`, `fit2.jpg`, `fit3.jpg`.
- Each section is a component in `src/components/`; styles are in `src/styles.css`.
