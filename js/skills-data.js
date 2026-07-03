const SKILLS_DATA = [
  {
    id: 'lenguajes',
    title: 'Lenguajes de programación',
    items: [
      { name: 'Java', percent: 88, icon: 'simple-icons:openjdk' },
      { name: 'JavaScript (ES6+)', percent: 92, icon: 'simple-icons:javascript' },
      { name: 'SQL', percent: 82, icon: 'tabler:database' },
      { name: 'HTML', percent: 85, icon: 'simple-icons:html5' },
      { name: 'CSS', percent: 84, icon: 'simple-icons:css3' },
    ],
  },
  {
    id: 'desktop',
    title: 'Interfaz gráfica (Desktop)',
    items: [
      { name: 'JavaFX', percent: 90, icon: 'tabler:device-desktop' },
      { name: 'FXML', percent: 90, icon: 'tabler:code' },
      { name: 'JavaFX Media', percent: 75, icon: 'tabler:music' },
    ],
  },
  {
    id: 'web',
    title: 'Frameworks Web',
    items: [
      { name: 'React.js', percent: 88, icon: 'simple-icons:react' },
      { name: 'React Router DOM', percent: 88, icon: 'simple-icons:reactrouter' },
      { name: 'Vite', percent: 88, icon: 'simple-icons:vite' },
      { name: 'Tailwind CSS', percent: 87, icon: 'simple-icons:tailwindcss' },
      { name: 'Framer Motion', percent: 80, icon: 'simple-icons:framer' },
      { name: 'GSAP (GreenSock Animation Platform)', percent: 82, icon: 'simple-icons:greensock' },
    ],
  },
  {
    id: 'movil',
    title: 'Desarrollo móvil',
    items: [
      { name: 'React Native', percent: 90, icon: 'simple-icons:react' },
      { name: 'Expo', percent: 90, icon: 'simple-icons:expo' },
      { name: 'React Navigation', percent: 88, icon: 'tabler:route' },
      { name: 'React Native Reanimated', percent: 82, icon: 'tabler:wand' },
      { name: 'Expo Linear Gradient', percent: 82, icon: 'tabler:palette' },
      { name: 'AsyncStorage', percent: 85, icon: 'tabler:device-mobile' },
      { name: 'Expo Secure Store', percent: 84, icon: 'tabler:lock' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'Node.js', percent: 90, icon: 'simple-icons:nodedotjs' },
      { name: 'Express.js', percent: 90, icon: 'simple-icons:express' },
      { name: 'Express Validator', percent: 85, icon: 'tabler:checkbox' },
      { name: 'Helmet', percent: 82, icon: 'tabler:shield' },
      { name: 'CORS', percent: 90, icon: 'tabler:world' },
      { name: 'Morgan', percent: 80, icon: 'tabler:file-text' },
      { name: 'UUID', percent: 85, icon: 'tabler:fingerprint' },
    ],
  },
  {
    id: 'bd',
    title: 'Bases de datos',
    items: [
      { name: 'MySQL', percent: 82, icon: 'simple-icons:mysql' },
      { name: 'MongoDB', percent: 85, icon: 'simple-icons:mongodb' },
      { name: 'PostgreSQL', percent: 70, icon: 'simple-icons:postgresql' },
    ],
  },
  {
    id: 'orm',
    title: 'ORM / ODM',
    items: [
      { name: 'JDBC', percent: 85, icon: 'tabler:plug' },
      { name: 'Mongoose', percent: 86, icon: 'simple-icons:mongoose' },
      { name: 'Sequelize', percent: 72, icon: 'simple-icons:sequelize' },
    ],
  },
  {
    id: 'estado',
    title: 'Gestión de estado',
    items: [
      { name: 'Zustand', percent: 88, icon: 'tabler:box' },
    ],
  },
  {
    id: 'apis',
    title: 'Consumo de APIs',
    items: [
      { name: 'Axios', percent: 92, icon: 'simple-icons:axios' },
      { name: 'REST APIs', percent: 91, icon: 'tabler:api' },
    ],
  },
  {
    id: 'auth',
    title: 'Autenticación y seguridad',
    items: [
      { name: 'JWT', percent: 90, icon: 'simple-icons:jsonwebtokens' },
      { name: 'Argon2', percent: 88, icon: 'tabler:key' },
      { name: 'BCrypt', percent: 88, icon: 'tabler:shield-lock' },
      { name: 'Control de roles', percent: 88, icon: 'tabler:users-group' },
      { name: 'Middleware de autenticación', percent: 90, icon: 'tabler:shield-check' },
      { name: 'Express Rate Limit', percent: 80, icon: 'tabler:gauge' },
    ],
  },
  {
    id: 'archivos',
    title: 'Archivos e imágenes',
    items: [
      { name: 'Cloudinary', percent: 85, icon: 'simple-icons:cloudinary' },
      { name: 'Multer', percent: 86, icon: 'tabler:upload' },
    ],
  },
  {
    id: 'reportes',
    title: 'Reportes',
    items: [
      { name: 'JasperReports', percent: 70, icon: 'tabler:report' },
      { name: 'APIReport', percent: 70, icon: 'tabler:file-report' },
      { name: 'ExcelJS', percent: 78, icon: 'simple-icons:microsoftexcel' },
    ],
  },
  {
    id: 'correos',
    title: 'Correos electrónicos',
    items: [
      { name: 'Nodemailer', percent: 82, icon: 'tabler:mail' },
      { name: 'Brevo (SMTP/API)', percent: 82, icon: 'simple-icons:brevo' },
    ],
  },
  {
    id: 'multimedia',
    title: 'Multimedia',
    items: [
      { name: 'JavaFX Media', percent: 75, icon: 'tabler:music' },
      { name: 'Reproducción de audio', percent: 75, icon: 'tabler:volume' },
    ],
  },
  {
    id: 'iconografia',
    title: 'Iconografía',
    items: [
      { name: 'Lucide React', percent: 85, icon: 'simple-icons:lucide' },
      { name: 'Heroicons', percent: 85, icon: 'tabler:icons' },
    ],
  },
  {
    id: 'herramientas',
    title: 'Herramientas de desarrollo',
    items: [
      { name: 'NetBeans', percent: 90, icon: 'simple-icons:apachenetbeanside' },
      { name: 'Apache Ant', percent: 65, icon: 'simple-icons:apacheant' },
      { name: 'Docker Compose', percent: 70, icon: 'simple-icons:docker' },
      { name: 'ESLint', percent: 82, icon: 'simple-icons:eslint' },
      { name: 'Nodemon', percent: 85, icon: 'simple-icons:nodemon' },
      { name: 'PostCSS', percent: 80, icon: 'simple-icons:postcss' },
      { name: 'PNPM Workspaces', percent: 78, icon: 'simple-icons:pnpm' },
      { name: 'Cross-env', percent: 82, icon: 'tabler:settings' },
    ],
  },
  {
    id: 'ia',
    title: 'Inteligencia Artificial',
    items: [
      { name: 'Google Generative AI (Gemini)', percent: 80, icon: 'simple-icons:googlegemini' },
      { name: 'Google GenAI SDK', percent: 80, icon: 'simple-icons:google' },
      { name: 'Google Cloud Vision API', percent: 82, icon: 'simple-icons:googlecloud' },
    ],
  },
  {
    id: 'documentacion',
    title: 'Documentación de APIs',
    items: [
      { name: 'Swagger UI Express', percent: 85, icon: 'simple-icons:swagger' },
      { name: 'Swagger JSDoc', percent: 84, icon: 'simple-icons:swagger' },
    ],
  },
  {
    id: 'mapas',
    title: 'Mapas y geolocalización',
    items: [
      { name: 'opening_hours', percent: 75, icon: 'tabler:clock' },
    ],
  },
  {
    id: 'arquitectura',
    title: 'Arquitectura y patrones',
    items: [
      { name: 'MVC (Modelo-Vista-Controlador)', percent: 90, icon: 'tabler:layout-grid' },
      { name: 'Arquitectura por capas', percent: 91, icon: 'tabler:stack-2' },
      { name: 'APIs REST', percent: 91, icon: 'tabler:api' },
      { name: 'Programación Orientada a Objetos', percent: 88, icon: 'tabler:cube' },
      { name: 'Arquitectura modular', percent: 90, icon: 'tabler:puzzle' },
    ],
  },
];