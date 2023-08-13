<template>
    <div class="password" :class="{ active: isMobile() }">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="handelPwdLogin">
            <a-form-item name="account" :rules="[{ required: true, message: '请输入账号' }]">
                <a-input v-model:value="formState.account" placeholder="账号" size="large" @blur="formState.account = $event.target.value.trim()">
                    <template #prefix>
                        <GlobalIcon name="nickName" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="formState.password" placeholder="密码" size="large" autocomplete="off">
                    <template #prefix>
                        <GlobalIcon name="loginPwd" />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item class="btn">
                <a-button type="primary" html-type="submit" size="large" block :loading="loading">登 录</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
/**  @description:密码登录  **/
import GlobalIcon from '@src/components/GlobalIcon';
import { isMobile } from '@src/utils/index.js';
import { gupoMessage } from '@src/components/UI';

const router = useRouter();

const formState = reactive({
    account: '', //测试账号 admin 888888
    password: '',
    imgcode: '',
});

const loading = ref(false);
const handelPwdLogin = async () => {
    if (formState.account === 'admin' && formState.password === '123456') {
        window.sessionStorage.setItem('loginMock', '1');
        router.push('/list');
    } else {
        gupoMessage.error('帐号密码错误');
    }
};
</script>
<style lang="less" scoped>
.password {
    :deep(.ant-form) {
        .ant-row.ant-form-item.btn {
            margin-bottom: 0;

            .ant-form-item-control-input-content {
                margin-top: 30px;
                @media screen and (max-width: 1440px) {
                    & {
                        margin-top: 20px;
                    }
                }
            }
        }

        .ant-col.ant-form-item-control {
            margin-bottom: 6px;

            .ant-input-affix-wrapper {
                position: relative;
                background-color: #255086;
                border: 1px solid #3bb7ff;

                .ant-input {
                    margin-left: 45px;
                    color: #fff;
                    background-color: #255086;
                }

                .ant-input-prefix {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    width: 39px;
                    height: 39px;
                    background-color: #216aab;
                    border: 1px solid #3bb7ff;
                    border-top: none;
                    border-left: none;
                    align-items: center;
                    justify-content: center;

                    .gupoIcon {
                        font-size: 18px;
                        color: #65c4ff;
                    }
                }

                .ant-input-password-icon {
                    color: #3bb7ff;
                }
            }
        }

        .ant-form-item-has-error .ant-input-prefix .gupoIcon {
            color: #ff4d4f !important;
        }

        .code-cont {
            display: flex;

            img {
                width: 94px;
                height: 40px;
                margin-left: 18px;
                cursor: pointer;
                flex: none;
            }
        }
    }

    &.active {
        padding: 0 28px;

        :deep(.ant-form) {
            .ant-col.ant-form-item-control {
                .ant-input-affix-wrapper {
                    background-color: transparent;
                    border: none;
                    border-bottom: 1px solid #3f71f6;

                    .ant-input {
                        background-color: transparent;
                    }

                    .ant-input-prefix {
                        background-color: transparent;
                        border: none;

                        .gupoIcon {
                            font-size: 18px;
                            color: #3f71f6;
                        }
                    }

                    .ant-input-password-icon {
                        color: #3f71f6;
                    }
                }
            }

            .ant-row.ant-form-item.btn {
                margin-top: 10px;
            }
        }
    }

    .forgetPassword {
        position: absolute;
        bottom: -3em;
        left: 50%;
        font-size: 14px;
        color: #65c4ff;
        cursor: pointer;
        transform: translateX(-50%);
    }
}
</style>
