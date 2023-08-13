<template>
    <div class="pc-login">
        <div class="login-center" :style="{ backgroundImage: `url(${bgUrl})` }">
            <div class="login-area-parent">
                <div class="system-name">{{ names.systemName }}</div>
                <div class="login-area">
                    <img src="@src/assets/images/img.png" alt="" class="border-left" />
                    <img src="@src/assets/images/img_1.png" alt="" class="border-right" />
                    <div class="main-content">
                        <div class="title-content">
                            <div
                                :class="{ active: type === item.type }"
                                class="title"
                                @click="changeLoginMethod(item.type)"
                                v-for="item in titleObj"
                                :key="item.type"
                            >
                                <span>{{ item.title }}</span>
                                <div class="line" />
                            </div>
                        </div>
                        <Password v-show="type === 'password'" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Password from './Password.vue';
import bgUrl from '@src/assets/images/bg.jpg';

const type = ref('password');

const names = ref('');

const titleObj = [
    {
        title: '列车实际开行概况辅助分析系统',
        type: 'password',
    },
];

const changeLoginMethod = data => {
    type.value = data;
};
</script>
<style lang="less" scoped>
.pc-login {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .login-top,
    .login-bottom {
        height: 60px;
        flex: none;
        background-color: #fff;
    }

    .login-top {
        display: flex;
        align-items: center;

        img {
            width: 120px;
            margin-left: 30px;
        }

        span {
            display: inline-block;
            padding: 0px 8px;
            margin-left: 20px;
            color: #fff;
            background: var(--ant-primary-color);
            border-radius: 2px;
        }
    }

    .login-top-title {
        padding-left: @space6;
        font-size: 16px;
        font-weight: bold;
    }

    .login-center {
        position: relative;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        flex: 1;

        .login-area-parent {
            position: absolute;
            top: 50%;
            right: 13%;
            transform: translateY(-50%);

            .system-name {
                margin-bottom: 30px;
                font-size: 34px;
                font-weight: bold;
                color: #fff;
                text-align: center;
            }

            .login-area {
                position: relative;
                width: 440px;
                padding: 32px 52px 52px;
                background: rgba(255, 255, 255, 0.7);
                box-sizing: border-box;

                img.border-left,
                img.border-right {
                    height: 150px;
                }

                img.border-left {
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 1;
                }

                img.border-right {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }

                .main-content {
                    position: relative;
                    z-index: 3;
                }

                .title-content {
                    position: relative;
                    display: flex;
                    margin-bottom: 60px;
                    font-size: 24px;
                    color: #d0d3db;
                    justify-content: space-around;
                    align-items: center;

                    .title {
                        cursor: pointer;

                        &.active {
                            margin-top: 9px;
                            font-size: 24px;
                            color: #333;

                            .line {
                                width: 95%;
                                height: 4px;
                                margin: 5px auto 0;
                                background: #3bb7ff;
                                border-radius: 2px;
                                opacity: 1;
                            }
                        }
                    }

                    .org-name {
                        position: absolute;
                        bottom: -46px;
                        left: 0;
                        font-size: 16px;
                        color: #fed65d;

                        span:nth-child(2) {
                            margin-left: @space1;
                            font-weight: bold;
                        }
                    }
                }

                .qr-code {
                    display: flex;
                    height: 400px;
                    color: #fff;
                    flex-direction: column;
                    align-items: center;

                    .tip {
                        margin-top: 35px;
                        margin-bottom: 40px;
                        font-size: 28px;
                        font-weight: bold;
                    }

                    .iframe-cont {
                        position: relative;
                        width: 200px;
                        height: 200px;
                        overflow: hidden;
                        background-color: #fff;

                        iframe {
                            position: absolute;
                            top: -87px;
                            left: 0;
                        }
                    }

                    .method-tip {
                        margin-top: @space7;
                        font-size: 16px;
                    }
                }

                .scan-code {
                    position: absolute;
                    top: -55px;
                    right: -55px;
                    width: 105px;
                    height: 105px;
                    overflow: hidden;
                    font-size: 38px;
                    color: #fff;
                    transform: rotate(45deg);

                    :deep(.gupoIcon) {
                        position: absolute;
                        bottom: -13px;
                        left: 34px;
                        cursor: pointer;
                        transform: rotate(45deg);

                        &.computed {
                            transform: rotate(-45deg);
                        }

                        &:hover {
                            color: var(--ant-primary-color);
                        }
                    }
                }
            }
            @media screen and (max-width: 1440px) {
                & {
                    .system-name {
                        margin-bottom: 25px;
                        font-size: 30px;
                    }

                    .login-area {
                        width: 380px;
                        padding: 32px 45px 42px;

                        .title-content {
                            margin-bottom: 50px;

                            .title.active {
                                font-size: 20px;
                            }

                            .org-name {
                                position: absolute;
                                bottom: -40px;
                                left: 0;
                                font-size: 15px;
                                font-weight: bold;
                                color: #fed65d;
                            }
                        }

                        .qr-code .method-tip {
                            font-size: 15px;
                        }
                    }
                }
            }
        }
    }

    .login-bottom {
        line-height: 60px;
        color: #999;
        text-align: center;

        &.active {
            height: 0;
            line-height: 0;
        }
    }

    .login-bottom-zzd {
        padding: @space3;
        color: #999;
        text-align: center;

        div:nth-child(2) {
            margin-top: @space1;
        }
    }
}
</style>
