export const corsOptions = {
  origin: (origin, cb) => {
    // Ajuste para produção: restringir para seu domínio
    cb(null, true)
  },
  credentials: true,
}
