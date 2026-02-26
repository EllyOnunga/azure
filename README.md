# Azure Bay Restaurant Website

A modern seafood restaurant website built with HTML, CSS, and JavaScript.

## Project Structure

azure/
├── index.html              # Main homepage
├── about.html              # About us page
├── menu.html               # Restaurant menu
├── blog.html               # Blog listing
├── blog-single.html        # Individual blog post
├── contact.html            # Contact page
├── team.html              # Team members
├── team-single.html       # Individual team member
├── testimonials.html      # Customer testimonials
├── image-gallery.html     # Photo gallery
├── video-gallery.html     # Video gallery
├── faqs.html             # Frequently asked questions
├── reserve-table.html     # Table reservation
├── 404.html              # Error page
├── donation.html         # Donation/support page
├── privacy.html          # Privacy Policy
├── terms.html            # Terms of Service
│
├── css/                   # Stylesheets
│   ├── bootstrap.min.css  # Bootstrap framework
│   ├── custom.min.css     # Custom styles (minified)
│   ├── animate.css        # Animation effects
│   ├── all.min.css        # Font Awesome icons
│   └── ...
│
├── js/                    # JavaScript files
│   ├── jquery-3.7.1.min.js    # jQuery library
│   ├── bootstrap.min.js       # Bootstrap JS
│   ├── function.min.js        # Custom functions (minified)
│   └── ...
│
├── images/               # Image assets
│   ├── hero-image-new.webp   # Hero banner
│   ├── logo.svg             # Site logo
│   └── ...
│
├── webfonts/             # Font Awesome web fonts
│
├── docker-compose.yml    # Docker configuration
├── Dockerfile            # Docker image
├── k8s-deployment.yaml  # Kubernetes deployment
├── nginx.conf           # Nginx configuration
├── package.json          # Node.js dependencies
├── .prettierrc          # Prettier formatting config
└── .htmlhintrc          # HTML linting config

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Styling with Bootstrap 5
- **JavaScript** - jQuery for interactivity
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Bricolage Grotesque, Manrope)

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

```bash
# Install dependencies
npm install
```

### Development Commands

```bash
# Format all code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check

# Lint HTML files
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run full build (lint + format check)
npm run build
```

### Manual Formatting

If you have Prettier installed globally:

```bash
# Format all HTML files
prettier --write "**/*.html"

# Format all CSS files
prettier --write "**/*.css"

# Format all JS files
prettier --write "**/*.js"
```

### Manual Linting

If you have HTMLHint installed globally:

```bash
# Lint all HTML files
htmlhint **/*.html

# Fix issues automatically
htmlhint **/*.html --fix
```

## Viewing the Website

1. Open any HTML file in a web browser
2. Or use a local server (e.g., VS Code Live Server)

## Deployment

The project includes Docker and Kubernetes configurations for deployment.

### Docker

```bash
docker build -t azurebay .
docker-compose up
```

### Kubernetes

```bash
kubectl apply -f k8s-deployment.yaml
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

This project follows WCAG 2.1 guidelines:

- Keyboard navigable with skip links
- Proper ARIA labels
- Sufficient color contrast
- Screen reader friendly

## Production Build

Run the production build to lint and format all files:

```bash
npm run build:prod
```

This will:

1. Run HTML linting with HTMLHint
2. Format all code with Prettier
3. Output "Production build complete!"

### Quick Deploy with Docker

```bash
# Build and start the container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Production Docker Build

```bash
# Build the Docker image
docker build -t azurebay:latest .

# Run the container
docker run -d -p 8080:80 --name azurebay azurebay:latest
```

### Kubernetes Deployment

```bash
# Apply the deployment
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get pods -l app=azure-bay

# Scale the deployment
kubectl scale deployment azure-bay-app --replicas=3
```

## License

Copyright © 2024 Azure Bay. All rights reserved.
