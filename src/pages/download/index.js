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
            qrUrl:'',//二维码地址
            text: '',//应用介绍
            appName:'',//app名字
            screenshot:'',//应用截图
            icon:'',//图标
            bundleId:'',//包名
            platform:'',//平台来源
        }
        this.appId=this.props.match.params.appId;
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
    loadDownloadInfo(){
        Toast.loading('加载中', 6000);
        ajax.get('/v1/appinfobid/'+this.appId, {}).then((res) => {
            Toast.hide();
            if (res.code !== ErrorCode.succ) {
                Toast.info(res.msg)
                return
            }
            this.setState({
               text:res.obj.desc,
               qrUrl:"https://fir.bllgo.com/"+res.obj.filePath,
               appName:res.obj.name,
               screenshot:res.obj.screenshot,
               icon:res.obj.icon,
               bundleId:res.obj.bundleId,
               platform:res.obj.platform,
            });
        }, (res) => {
            Toast.hide()
            Toast.info(res.msg)
        })
    }

    render() {
        let { isShowExpand, text,appName,screenshot,icon,platform,bundleId } = this.state;
        const numbers = [1];
        let isExpandDiv;
        if (text!==""&&text.length > 10) {
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
                <div className="download-button">下载</div>
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
                <div className="app-info">
                    <div className="horizontal-line"></div>
                    <div className="app-content-margin">
                        <div className="app-info-title">应用截图</div>
                        <div className="app-info-imglist">
                            <ListImgList numbers={numbers} screenshot={this.state.screenshot} />
                        </div>
                    </div>
                </div>

                <div className="app-info">
                    <div className="horizontal-line"></div>
                    <div className="app-content-margin">
                        <div className="app-info-title">使用反馈</div>
                        <div className="app-info-content">向该应用的开发者提交您在使用过程中遇到的问题或对应用的建议，帮助他们做的更好。</div>
                        <div className="app-feedback">反馈</div>
                    </div>
                </div>
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