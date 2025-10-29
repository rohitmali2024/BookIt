import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
}

export const experienceAPI = {
  getAll: () => api.get("/experiences"),
  getById: (id: string) => api.get(`/experiences/${id}`),
}

export const bookingAPI = {
  create: (data: any) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings"),
}

export const promoAPI = {
  validate: (code: string, amount: number) => api.post("/promo/validate", { code, amount }),
}

export default api
