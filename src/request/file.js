import axios from "axios";
import { get, post, put, axiosDelete } from "./http";

// 左侧菜单选择的为 全部 时，根据路径，获取文件列表
export const getFileListByPath = (p) => get("/fileList", p);
// 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
export const getFileListByType = (p) => get("/fileList/type", p);

// 创建文件夹
export const createDir = (p) => post('/dir', p)

// 删除文件夹 或 文件
export const deleteFile = (p) => axiosDelete('/file', p)

// 下载文件
export const download = (p) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/download',
            method: 'get',
            responseType: 'blob',
            params: p
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err.data);
        });
    });
}

// 重命名
export const renameFile = (p) => put('/file/rename', p)

// 获取图片
export const getImg = (p) => get('/img', p)

// 获取目录树
export const getDirTree = (p) => get('/dirTree', p)

// 移动文件
export const moveFile = (p) => put('/file/move', p)


