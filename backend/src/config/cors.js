export const corsOptions = {
  origin: (origin, cb) => {
    cb(null, true)
  },
  credentials: true,
}
