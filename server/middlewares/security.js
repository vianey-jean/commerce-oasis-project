
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Configuration de rate limiting avancée
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}, URL: ${req.originalUrl}`);
    res.status(429).json({ 
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
});

// Rate limits spécifiques
const generalLimiter = createRateLimit(15 * 60 * 1000, 100, 'Trop de requêtes, réessayez plus tard');
const authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Trop de tentatives de connexion');
const apiLimiter = createRateLimit(15 * 60 * 1000, 200, 'Limite API atteinte');

const securityMiddlewares = [
  helmet({ 
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),
  xssClean()
];

const additionalCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Validation avancée des entrées
const validateInput = (input, type = 'string', maxLength = 1000) => {
  if (typeof input !== type) return false;
  if (type === 'string' && input.length > maxLength) return false;
  if (type === 'string' && /<script|javascript:|data:/i.test(input)) return false;
  return true;
};

const sanitizeMiddleware = (req, res, next) => {
  try {
    // Nettoyer les paramètres de la requête
    if (req.params) {
      const keys = Object.keys(req.params);
      for (let key of keys) {
        if (!validateInput(req.params[key], 'string', 200)) {
          return res.status(400).json({ error: 'Paramètres invalides' });
        }
        req.params[key] = req.params[key]
          .replace(/[<>]/g, '')
          .trim()
          .substring(0, 200);
      }
    }
    
    // Nettoyer les query parameters
    if (req.query) {
      const keys = Object.keys(req.query);
      for (let key of keys) {
        if (typeof req.query[key] === 'string') {
          if (!validateInput(req.query[key], 'string', 500)) {
            return res.status(400).json({ error: 'Paramètres de requête invalides' });
          }
          req.query[key] = req.query[key]
            .replace(/[<>]/g, '')
            .trim()
            .substring(0, 500);
        }
      }
    }
    
    // Nettoyer le corps de la requête de manière récursive
    if (req.body && typeof req.body === 'object' && !req.is('multipart/form-data')) {
      const sanitizeObject = (obj, depth = 0) => {
        if (depth > 10) return obj; // Éviter la récursion infinie
        
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            if (!validateInput(value, 'string', 10000)) {
              throw new Error('Contenu invalide détecté');
            }
            sanitized[key] = value
              .replace(/[<>]/g, '')
              .trim()
              .substring(0, 10000);
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value, depth + 1);
          } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item => 
              typeof item === 'string' ? 
                item.replace(/[<>]/g, '').trim().substring(0, 1000) : 
                item
            );
          } else {
            sanitized[key] = value;
          }
        }
        return sanitized;
      };

      req.body = sanitizeObject(req.body);
    }

    next();
  } catch (error) {
    console.error('Erreur de validation:', error.message);
    res.status(400).json({ error: 'Données invalides' });
  }
};

// Middleware de logging de sécurité
const securityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /(<script|javascript:|data:)/i,
    /(union|select|insert|delete|drop|create|alter)/i,
    /(\.\.|\/\/|\\\\)/,
    /(eval\(|function\(|=>)/
  ];

  const requestData = JSON.stringify({
    params: req.params,
    query: req.query,
    body: req.body
  });

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));
  
  if (isSuspicious) {
    console.warn(`🚨 Activité suspecte détectée:`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

module.exports = {
  securityMiddlewares,
  additionalCorsHeaders,
  sanitizeMiddleware,
  generalLimiter,
  authLimiter,
  apiLimiter,
  securityLogger
};
