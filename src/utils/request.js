import axios from 'axios';
import { router } from '@src/router';
import { useUser } from '@src/store/modules/user';
import { downloadFile } from '@src/utils/index';

export const request = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 120 * 1000,
});

const generateCustomRequestKey = () => '' + Date.now() + Math.random();

export const delayRequest = axiosRequestConfig => {
    const customRequestKey = generateCustomRequestKey();
    const config = { ...axiosRequestConfig, isDelayRequest: true };
    if (config.multiple) config.customRequestKey = customRequestKey;
    return {
        customRequestKey,
        start: () => request(config),
        cancel: () => removePending(config),
    };
};

export const pending = new Map();
export const generateURL = config =>
    [config.method, config.url?.replace(import.meta.env.VITE_APP_API_URL, ''), config.customRequestKey].filter(Boolean).join('&');

const addPending = config => {
    const url = generateURL(config);
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken(cancel => {
            if (!pending.has(url)) {
                // 如果 pending 中不存在当前请求，则添加进去
                pending.set(url, cancel);
            }
        });
};
/**
 * 移除请求
 * @param {Object} config
 */
const removePending = config => {
    const url = generateURL(config);
    if (pending.has(url)) {
        // 如果在 pending 中存在当前请求标识，且没有禁用，需要取消当前请求，并且移除
        const cancel = pending.get(url);
        cancel();
        pending.delete(url);
    }
};
/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
    pending.forEach(cancel => cancel());
    pending.clear();
};

request.interceptors.request.use(
    config => {
        const user = useUser();
        const token = user.name;
        if (token) {
            config.headers.common['Authorization'] = token;
        }
        if (config.multiple) {
            config.customRequestKey = config.customRequestKey || generateCustomRequestKey();
        } else {
            removePending(config); // 在请求开始前，对之前的请求做检查取消操作，除了配置了 multiple 的请求
        }
        addPending(config); // 将当前请求添加到 pending 中
        return config;
    },
    err => {
        // Do something with index error
        alert('客户端网络错误');
        throw err;
    }
);

// Add a response interceptor
request.interceptors.response.use(
    response => {
        // Do something with response data
        removePending(response.config); // 在请求结束后，移除本次请求
        const data = response.data;
        if (data instanceof Blob) {
            return downloadFile(response);
        } else {
            if (data.code === 200) {
                return data;
            } else if (data.code === 403) {
                router.replace('/login');
            } else {
                console.error('😭😭😭', response);
                alert(data.message || '出错了');
                throw data;
            }
        }
    },
    err => {
        if (axios.isCancel(err)) {
            throw '💩💩💩请求已取消';
        }
        removePending(err.config); // 在请求结束后，移除本次请求
        alert('服务器开小差了，请刷新重试');
        throw err;
    }
);
