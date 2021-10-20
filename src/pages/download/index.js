import React from 'react';
import './index.scss';
import ajax, { ErrorCode } from '@utils/ajax'
import { divide } from 'lodash';
import QRCode from 'qrcode.react';
import { Toast } from 'antd-mobile';
class Download extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowExpand: true,//文字是否展开
            qrUrl: '',//二维码地址，android是apk的下载地址，ios是本页面的地址
            text: '',//应用介绍
            appName: '',//app名字
            screenshot: '',//应用截图
            icon: '',//图标
            bundleId: '',//包名
            platform: '',//平台来源
            iosDownloadurl: '',//ios的下载地址
            isShowScreenshot: true,//是否显示截图
        }
        this.appId = this.props.match.params.appId;
    }
    componentDidMount() {
        this.loadDownloadInfo();
    }
    handleUp = () => {
        const { isShowExpand } = this.state;
        this.setState({
            isShowExpand: !isShowExpand
        });
    }

    onClickDownload(qrUrl) {
        if (this.state.platform === 'iOS') {
            window.location.href = this.state.iosDownloadurl;
        } else {
            window.location.href = qrUrl;
        }

    }
    loadDownloadInfo() {
        Toast.loading('加载中', 6000);
        ajax.get('/v1/appinfobid/' + this.appId, {}).then((res) => {
            Toast.hide();
            if (res.code !== ErrorCode.succ) {
                Toast.info(res.msg)
                return
            }
            if (res.obj.platform === 'iOS') {
                this.setState({
                    qrUrl: 'https://fir.bllgo.com/#/download/' + this.appId,
                    iosDownloadurl: "itms-services://?action=download-manifest&url=https://fir.bllgo.com" + res.obj.plistPath,
                })
            } else {
                this.setState({
                    qrUrl: "https://fir.bllgo.com" + res.obj.filePath,
                })
            }
            if (res.obj.screenshot === null || res.obj.screenshot === '' || res.obj.screenshot === undefined) {
                this.setState({
                    isShowScreenshot: false,
                })
            } else {
                this.setState({
                    isShowScreenshot: true,
                })
            }
            this.setState({
                text: res.obj.desc,
                appName: res.obj.name,
                screenshot: res.obj.screenshot,
                icon: res.obj.icon,
                bundleId: res.obj.bundleId,
                platform: res.obj.platform,
            });
        }, (res) => {
            Toast.hide()
            Toast.info(res.msg)
        })
    }

    render() {
        let { isShowExpand, text, appName, screenshot, icon, platform, bundleId, qrUrl,isShowScreenshot } = this.state;
        const numbers = [1];
        let isExpandDiv;
        if (text !== "" && text.length > 10) {
            if (isShowExpand) {
                isExpandDiv = (<a className="app-info-text-green" onClick={this.handleUp}>展开</a>)
            } else {
                isExpandDiv = (<a className="app-info-text-green" onClick={this.handleUp}>收缩</a>)
            }
        } else {
            isExpandDiv = '';
        }
        return (
            <div className="download-info">
                <img className="header-img" src="/image/header_img.png"></img>
                <img className="download-app-icon" src={icon}></img>
                <div className="download-app-info">
                    <span className="download-app-name">{appName}</span>
                    <span className="download-app-type">内测版</span>
                </div>
                <div className="download-version-info">
                    <span className="download-version-build">包名：{bundleId}</span>
                    <div className="vertical-line"></div>
                    <span className="download-app-size">平台来源：{platform}</span>
                </div>
                <QRCode
                    className="download-app-img"
                    value={this.state.qrUrl}  //value参数为生成二维码的链接
                    size={200} //二维码的宽高尺寸
                    fgColor="#000000"  //二维码的颜色
                />
                <div className="download-button" onClick={() => this.onClickDownload(qrUrl)}>下载</div>
                <div className="app-info">
                    <div className="horizontal-line"></div>
                    <div className="app-content-margin">
                        <div className="app-info-title">应用介绍</div>
                        <div className="app-info-content">
                            <div
                                style={isShowExpand ? {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    webkitBoxOrient: 'vertical',
                                    WebkitLineClamp: '3',
                                } : {}}
                            >{text}</div>
                            {isExpandDiv}
                        </div>
                    </div>
                </div>
                {
                    isShowScreenshot ? (<div className="app-info">
                        <div className="horizontal-line"></div>
                        <div className="app-content-margin">
                            <div className="app-info-title">应用截图</div>
                            <div className="app-info-imglist">
                                <ListImgList numbers={numbers} screenshot={screenshot} />
                            </div>
                        </div>
                    </div>) : ''
                }
                <div className="margin-200"> </div>

            </div>
        );
    }
}

function ListImgItem(props) {
    const screenshot = props.value;


    return <img className="img-show-item"
        src={screenshot}
    >
    </img>;
}

function ListImgList(props) {
    const numbers = props.numbers;
    const screenshot = props.screenshot;
    const listItems = numbers.map((number) =>
        <ListImgItem key={number.toString()}
            value={screenshot} />
    );
    return (
        <div className="img-show-row" >
            {listItems}
        </div>
    );
}


export default Download;