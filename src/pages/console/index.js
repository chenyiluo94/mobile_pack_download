import React from 'react';
import './index.scss';
import ajax, { ErrorCode } from '@utils/ajax'
import { values } from 'lodash';
import { Toast } from 'antd-mobile';
class ConsolePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [], //app数据
        }
    }
    componentDidMount() {
        this.loadAppinfo()
    }
    onClickItem = () => {
        //replace替换
        this.props.history.push('/upload/detail')
    }
    loadAppinfo(){
        Toast.loading('加载中', 6000);
        ajax.get('/v1/allapp', {}).then((res) => {
            Toast.hide();
            if (res.code !== ErrorCode.succ) {
                Toast.info(res.msg)
                return
            }
            this.setState({
                list:res.obj
            });
        }, (res) => {
            Toast.hide();
            Toast.info(res.msg)
        })
    }
    render() {
        const rowsInfo = [];
        this.state.list.forEach(element => {
            rowsInfo.push(
                <AppInfoRow item={element} props={this.props}   history={this.props.history} key={element.id} />
            );
        });
        return (
            <div className="console-info">
                <div className="console-top">
                    <div className="console-title">控制台</div>
                    <div className="console-button" onClick={this.onClickItem}>新建</div>
                </div>
                <div className="horizontal-line"></div>
                <div className="console-bg">
                    <div className="console-row-appinfo color-gray">
                        <div className="console-row-appinfo-name">应用名称</div>
                        <div className="console-row-appinfo-name">平台来源</div>
                        <div className="console-row-appinfo-name">应用包名</div>
                        <div className="console-row-appinfo-desc">应用描述</div>
                        <div className="console-row-appinfo-url">下载地址</div>
                    </div>
                    {rowsInfo}
                </div>
            </div>
            
        );
    }
}

export default ConsolePage;


//app信息 row
class AppInfoRow extends React.Component {
    onClickItem2(item){
        //replace替换
        if(item.filePath===null||item.filePath===undefined||item.filePath===""){
            this.props.history.push({ pathname: "/upload/file/"+item.id})
        }else{
            this.props.history.push({ pathname: "/download/"+item.bid})
        }
    }
    render() {
        const item = this.props.item;
        return (
            <div className="console-row-appinfo color-white" onClick={() => { this.onClickItem2(item) }}>
                <div className="console-row-appinfo-name">{item.name}</div>
                <div className="console-row-appinfo-name">{item.platform}</div>
                <div className="console-row-appinfo-name">{item.bundleId}</div>
                <div className="console-row-appinfo-desc">{item.desc}</div>
                <div className="console-row-appinfo-url">{item.filePath}</div>
            </div>
        );
    }
}