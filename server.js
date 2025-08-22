import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad básica
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '1mb' }));

// CORS
const allowed = process.env.ALLOWED_ORIGIN?.split(',').map(s=>s.trim()).filter(Boolean) || ['*'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes('*') || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }
}));

// Rate limit
const limiter = rateLimit({ windowMs: 60 * 1000, max: 50 }); // 50 req/min
app.use(limiter);

// Salud
app.get('/', (_req,res)=> res.json({ ok:true, service:'agencia-backend' }));

// Contacto
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, empresa, mensaje, origin } = req.body || {};
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: 'Campos requeridos: nombre, email, mensaje' });
    }

    // Aquí guardarías en DB si quieres (gratis: Google Sheets API / Airtable free / Notion API)
    // Por ahora, log + respuesta
    console.log(`[Contacto] ${new Date().toISOString()}
    Nombre: ${nombre}
    Email: ${email}
    Empresa: ${empresa || '-'}
    Origin: ${origin || '-'}
    Mensaje: ${mensaje}
    -----------------------------------`);

    // (Opcional) enviar correo usando SendGrid si configuras API key
    await sendWithSendgrid({ nombre, email, empresa, mensaje });

    return res.json({ ok: true, message: 'Mensaje recibido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno' });
  }
});

// ===== Opcional: SendGrid =====
import sgMail from '@sendgrid/mail';
async function sendWithSendgrid({ nombre, email, empresa, mensaje }) {
  if (!process.env.SENDGRID_API_KEY || !process.env.CONTACT_TO) return;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.CONTACT_TO,
    from: process.env.CONTACT_TO,
    subject: `Nuevo contacto: ${nombre}`,
    text: `Email: ${email}\nEmpresa: ${empresa || '-'}\n\n${mensaje}`
  };
  await sgMail.send(msg);
}

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
