import React from 'react';
import './index.scss';
import ajax, { ErrorCode } from '@utils/ajax'
import { ImagePicker, WingBlank, SegmentedControl } from 'antd-mobile';
import { Toast } from 'antd-mobile';

class DetailPage extends React.Component {
    constructor(props) {
        super(props)
        // this.appNameChange = this.appNameChange.bind(this);
        // this.appInfoChange = this.appInfoChange.bind(this);
        this.state = {
            files: [],
            appName: "",
            appInfo: "",
        }
    }
    onClickUpload = () => {
        //replace替换
        // this.props.history.push('/download')
        if (this.state.appName === "") {
            Toast.info('请输入应用名称');
            return;
        }
        if (this.state.appInfo === "") {
            Toast.info('请输入应用介绍');
            return;
        }
        if (this.state.files.length <= 0) {
            Toast.info('请上传截图');
            return;
        }

        ajax.post('/v1/publish', { name: this.state.appName, desc: this.state.appInfo, scteenshot: this.state.files[0].url }).then((res) => {
            // removeDudaoSession()
            if (res.code !== ErrorCode.succ) {
                Toast.info(res.msg)
                return
            }
            //保存信息
        }, (res) => {
            Toast.info(res.msg)
        })
    }
    onChange = (files, type, index) => {
        console.log("--------" + files[0].url);
        this.setState({
            files,
        });
    };
    onTabChange = (key) => {
        console.log(key);
    };
    handleEditChange(type, event) {
        let value = event.target.value
        switch (type) {
            case 'appName':
                this.appNameChange(value);
                break
            case 'appInfo':
                this.appInfoChange(value);
                break
            default:
                break
        }

    }
    appNameChange(e) {
        this.setState({ appName: e.target.value });
    }
    appInfoChange(e) {
        this.setState({ appInfo: e.target.value });
    }
    render() {
        const { files } = this.state;
        return (
            <div className="detail-info">
                <div className="detail-title">创建应用</div>
                <div className="horizontal-line"></div>
                <div className="detail-all">
                <div className="detail-bg">
                    <div className="detail-app-info">
                        <div className="app-upload" onClick={this.onClickUpload}>创建应用</div>
                    </div>
                    <div className="detail-text">应用名称</div>
                    <input placeholder="请输入应用名称" className="detail-edit-name" maxLength="20" onChange={(e) => this.appNameChange(e)}></input>
                    <div className="detail-text">应用介绍</div>
                    <textarea placeholder="请输入应用介绍" className="detail-edit-introduce" onChange={(e) => this.appInfoChange(e)} ></textarea>
                    <div className="detail-text">应用截图</div>
                    <div className="detail-addimg-bg">
                        <ImagePicker
                            files={files}
                            onChange={this.onChange}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={files.length < 1}
                            multiple={true}
                        />
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default DetailPage;