import { get, post } from "./http"

export const login = (p) => post("/login", p)

export const register = (p) => post("/register", p)

// 获取登录状态及用户信息
export const checkUserLoginInfo = (p) => get("/checkUserLogin", p);

export const getUserInfo = (p) => get("/user", p)