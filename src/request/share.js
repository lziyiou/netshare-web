import { get, post } from "./http"


// 分享文件请求
export const shareFile = (p) => post('/share', p)


// 请求分享文件资源
export const getShareFile = (link, p) => get(link, p)