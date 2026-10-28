# Professional Portfolio Website

A modern, responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Features a clean design system, dark mode support, and smooth interactions.

## Features

✨ **Modern Design**
- Clean, professional layout with gradient accents
- Responsive design from 360px mobile to wide desktops
- Light and dark mode support with system preference detection
- Smooth animations and transitions

🎯 **Sections**
- **Hero**: Eye-catching introduction with call-to-action buttons
- **About**: Personal bio with key statistics
- **Projects**: Showcase of featured work with tags and descriptions
- **Skills**: Organized skill categories
- **Contact**: Contact form and social links

♿ **Accessibility**
- WCAG AA contrast compliance (4.5:1 for text)
- Semantic HTML structure
- Keyboard navigation support
- Focus visible states
- Respects `prefers-reduced-motion` preference

📱 **Responsive**
- Mobile-first approach
- Fluid typography with `clamp()`
- Flexible grid layouts
- Touch-friendly interactive elements

🎨 **Design System**
- CSS custom properties for colors, spacing, and typography
- Consistent 4/8px spacing scale
- Reusable component classes
- Modern CSS (Flexbox, Grid, custom properties)

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will open at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # All styling with design system
├── main.js             # JavaScript interactivity
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
└── dist/               # Production build output
```

## Customization

### Colors

Edit the CSS custom properties in `styles.css`:

```css
:root {
  --primary: #2563eb;      /* Main brand color */
  --accent: #7c3aed;       /* Accent color */
  --success: #10b981;      /* Success state */
  --warning: #f59e0b;      /* Warning state */
  --danger: #ef4444;       /* Error state */
}
```

### Content

Update the HTML in `index.html`:
- Change hero title and subtitle
- Update project cards with your work
- Modify skills and experience
- Update contact information

### Typography

Adjust font sizes and weights in `styles.css`:

```css
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS with minimal specificity
- Lazy-loaded animations with Intersection Observer
- Smooth scrolling behavior
- Minimal JavaScript footprint (~4KB gzipped)

## License

MIT
