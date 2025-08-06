# Life Could Be A Dream

## Project Info

A science fiction comic store and universe built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS.

## How to Run Locally

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the project root with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```
   - Open the local URL shown in the terminal (e.g., http://localhost:8080/gamer-dream-comics/)

## How to Deploy to GitHub Pages

1. **Push your code to GitHub.**
2. **Ensure your `index.html` has the correct `<base href="/gamer-dream-comics/" />` tag.**
3. **GitHub Actions will automatically build and deploy your site to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.**
4. **Set your repository's GitHub Pages source to `gh-pages` or the default branch as needed.**
5. **Access your site at:**
   ```
   https://<your-username>.github.io/gamer-dream-comics/
   ```

## Tech Stack
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for authentication and data)

## Features
- Comic stories and character database
- User authentication and progress tracking
- Interactive assistant bot (Mr. Effort)
- Responsive, modern UI

---

For any issues, open an issue on GitHub or contribute via pull request.
