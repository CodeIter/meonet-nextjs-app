# Web App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22%20v24-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-blue?logo=pnpm)](https://pnpm.io/)
[![Next.js v15](https://img.shields.io/badge/Framework%20Next.js-v15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Platform-Vercel-000000?logo=vercel)](https://vercel.com/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

This is Next.js web app with api and blog.

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone --depth=1 https://github.com/your-username/meonet.git  \
    meonet.git \
&& cd meonet.git \
&& tree --gitignore \
&& ls -FAlh
````

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser
   to see the result.

You can start editing the page by modifying `src/app/route.ts`.
The page auto-updates as you edit the file.

4. Create an optimized production build:

```bash
pnpm build
```

5. Start the production server:

```bash
pnpm start
```
## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?filter=next.js) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

1. Push to a Git repository
2. Import into [Vercel](https://vercel.com/new)
3. Environment variables will be auto-detected

### Docker

Build and run with:

```bash
docker build -t meonet .
docker run -p 3000:3000 meonet
```

## Resources

* [Next.js Documentation](https://nextjs.org/docs)
- [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
* [Learn Next.js](https://nextjs.org/learn)
* [Next.js on GitHub](https://github.com/vercel/next.js)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Unified Markdown Processing](https://unifiedjs.com/)

## License

This project uses the [MIT License](LICENSE), allowing free use in personal
and commercial projects.

See the [LICENSE](LICENSE) file for full details.

Third-party libraries may use different licenses - see [package.json](package.json) for details.

---

*Built with ❤️ by @CodeIter*

