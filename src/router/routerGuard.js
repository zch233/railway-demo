import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from '@src/router';
import { useStoreUser } from '@src/store/modules/user';
import { useStorePermission } from '@src/store/modules/permission';

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (to.meta.whiteList) {
        next();
    } else {
        if (window.sessionStorage.getItem('loginMock') === '1') {
            const storeUser = useStoreUser();
            const storePermission = useStorePermission();
            const { token: queryToken, system_code: querySystemCode, org_id: queryOrgId } = to.query;

            if (queryToken && queryToken !== storeUser.token) storeUser.setToken(queryToken);
            if (querySystemCode && querySystemCode !== storeUser.systemCode) storeUser.setSystemCode(querySystemCode);
            if (queryOrgId && queryOrgId !== storeUser.orgId) storeUser.setOrgId(Number(queryOrgId));
            if (!Object.keys(storeUser.userInfo).length) await storeUser.initUser();
            if (!storeUser.orgListMenu.length) await storeUser.getUserSystemOrg();
            if (!storePermission.hasRoute && !to.meta.whiteList) {
                const { redirectRoute } = await storePermission.initRoutes();
                next({ ...to, replace: true, path: to.fullPath === '/' ? redirectRoute : to.fullPath });
            } else {
                next();
            }
        } else {
            next('/login');
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
