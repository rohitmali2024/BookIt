import axios from "axios"

// const api = axios.create({
//   baseURL: API_BASE_URL,
// })

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
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
  getById: (id: string) => api.get(`/bookings/${id}`),
}

export const promoAPI = {
  validate: (code: string, amount: number) => api.post("/promo/validate", { code, amount }),
}

export default api
