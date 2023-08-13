export const getImageUrl = path => new URL(`../assets/${path}`, import.meta.url).href;

export const getBrowser = () => {
    return {
        versions: (() => {
            const u = window.navigator.userAgent;
            return {
                //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                dingtalk: u.indexOf('DingTalk') > -1, //是否为钉钉内部
                taurusapp: u.indexOf('TaurusApp') > -1, //是否为专有钉钉和浙政钉钉
                alipay: u.indexOf('AlipayClient') > -1, //是否为支付宝
                wechat: /MicroMessenger/i.test(u), //是否微信中
                webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
                dtDreamApp: u.toLowerCase().indexOf('dtdreamweb') > -1, // 浙里办 APP
                alipayMini: u.toLowerCase().indexOf('miniprogram') > -1 && u.toLowerCase().indexOf('alipay') > -1, // 浙里办支付宝小程序
            };
        })(),
        language: window.navigator.language.toLowerCase(),
    };
};

export const getEnv = () => import.meta.env.MODE;

export const isDevMode = () => import.meta.env.DEV;

export const isProdMode = () => import.meta.env.PROD;

// 注意：需要配置 axios config 的 responseType: 'blob'
export const downloadFile = response => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            try {
                const jsonData = JSON.parse(this.result); // 成功 说明是普通对象数据
                console.error('非文件流响应');
                reject(jsonData);
            } catch (err) {
                // 解析成对象失败，说明是正常的文件流
                const blob = new Blob([response.data]);
                // 本地保存文件
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // TODO：注意这里的 headers 用于获取文件名称，确保后台已经返回正确字段
                const filename = response?.headers?.['content-disposition']?.split('filename*=')?.[1]?.substr(7);
                link.setAttribute('download', decodeURI(filename));
                document.body.appendChild(link);
                link.click();
                resolve(response.data);
            }
        };
        fileReader.readAsText(response.data);
    });
};

// 日期选择同一天拼接时间
export const formatDateTime = date => {
    if (date && date.length === 2) {
        return date[0] === date[1] ? [date[0] + ' 00:00:00', date[1] + ' 23:59:59'] : date;
    } else {
        return date;
    }
};

// 判断是否是钉钉或者浙政钉
export const isDdOrZzd = () => {
    return getBrowser().versions.dingtalk || getBrowser().versions.taurusapp;
};

// 判断pc还是移动
export const isMobile = () => {
    let userAgentInfo = navigator.userAgent;
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let getArr = Agents.filter(i => userAgentInfo.includes(i));
    return !!getArr.length;
};
