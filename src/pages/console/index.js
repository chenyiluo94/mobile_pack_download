import React from 'react';
import './index.scss';
import ajax, { ErrorCode } from '@utils/ajax'
import { values } from 'lodash';
import { Toast, Modal } from 'antd-mobile';
import axios from 'axios';
const alert = Modal.alert;
alert.maskClosable = true;


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
    loadAppinfo() {
        Toast.loading('加载中', 6000);
        ajax.get('/v1/allapp', {}).then((res) => {
            Toast.hide();
            if (res.code !== ErrorCode.succ) {
                Toast.info(res.msg)
                return
            }
            this.setState({
                list: res.obj
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
                <AppInfoRow item={element} props={this.props} history={this.props.history} key={element.id} />
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
                        <div className="console-row-appfrom">平台来源</div>
                        <div className="console-row-appinfo-name">应用包名</div>
                        <div className="console-row-appinfo-desc">是否删除</div>
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
    onClickItem2(item) {
        //replace替换
        if (item.filePath === null || item.filePath === undefined || item.filePath === "") {
            this.props.history.push({ pathname: "/upload/file/" + item.bid })
        } else {
            this.props.history.push({ pathname: "/download/" + item.bid })
        }
    }
    onClickDelete(item, e) {
        e.stopPropagation();
        this.showAlert(item)
        // Toast.info("删除")
    }
    onClickUpdate(item, e) {
        e.stopPropagation();
        this.props.history.push({ pathname: "/upload/file/" + item.bid })
    }
    showAlert(item) {
        const alertInstance = alert('', '是否删除', [
            {
                text: '取消', onPress: () => {
                    alertInstance.close();
                }, style: 'default'
            },
            {
                text: '确定', onPress: () => {
                    this.deleteID(item);
                    alertInstance.close();
                }
            },
        ]);
    };
    deleteID(item) {
        Toast.loading('加载中', 6000);
        var param = { "appid": item.id}
        axios.delete('/v1/delete',
            { params:param }) //config
            .then(response => {
                Toast.hide();
                if (response.code !== ErrorCode.succ) {
                    Toast.info(response.msg)
                    return
                }
                window.location.reload();
            })
            .catch(error => {
                Toast.hide();
                Toast.info('请求错误');
            })
    }
    render() {
        const item = this.props.item;
        return (
            <div className="console-row-appinfo color-white" onClick={() => { this.onClickItem2(item) }}>
                <div className="console-row-appinfo-name">{item.name}</div>
                <div className="console-row-appfrom">{item.platform}</div>
                <div className="console-row-appinfo-name">{item.bundleId}</div>
                <div className="console-row-appinfo-desc" >
                    <div className="console-row-btn" onClick={(e) => { this.onClickDelete(item, e) }}>删除</div>
                    <div className="console-row-btn margin-left15" onClick={(e) => { this.onClickUpdate(item, e) }}>更新</div>
                </div>
            </div>
        );
    }
}