import React from 'react';
import './index.scss';
import ajax, { ErrorCode } from '@utils/ajax'
import { ImagePicker, WingBlank, SegmentedControl } from 'antd-mobile';
import { Toast, Picker } from 'antd-mobile';
const platformList=[
    { platform: "Android" },
    { platform: "iOS" },
];

class DetailPage extends React.Component {
    
    constructor(props) {
        super(props)
        this.appNameChange = this.appNameChange.bind(this);
        this.appInfoChange = this.appInfoChange.bind(this);
        this.state = {
            files: [],
            appName: "",
            appInfo: "",
            appPackName: '',
            platform:'',
        }
        this.handleChange = this.handleChange.bind(this);
    }
    onClickUpload = () => {
        //replace替换
        // this.props.history.push('/download')
        if (this.state.appName === "") {
            Toast.info('请输入应用名称');
            return;
        }
        if (this.state.appPackName === "") {
            Toast.info('请输入应用包名');
            return;
        }
        if (this.state.platform === "") {
            Toast.info('请选择设备信息');
            return;
        }
        
        if (this.state.appInfo === "") {
            Toast.info('请输入应用介绍');
            return;
        }
        Toast.loading('加载中', 6000);
        ajax.post('/v1/publish', { 
            name: this.state.appName, 
            desc: this.state.appInfo, 
            platform:this.state.platform,
            bundleId:this.state.appPackName,
            scteenshot: this.state.files.length>0?this.state.files[0].url :''}).then((res) => {
            Toast.hide();
            if (res.code !== ErrorCode.succ) {
                Toast.info(res.msg)
                return
            }
            //replace替换
            this.props.history.push({ pathname: "/upload/file/" + res.obj.id })
        }, (res) => {
            Toast.hide();
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

    appNameChange(e) {
        this.setState({ appName: e.target.value });
    }
    appPageNameChange(e) {
        this.setState({ appPackName: e.target.value });
    }
    appInfoChange(e) {
        this.setState({ appInfo: e.target.value });
    }
    handleChange(event) {
        this.setState({platform: event.target.value});
    }

    render() {
        const { files } = this.state;
        console.log("------------" + platformList)
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
                        <div className="detail-text">应用包名</div>
                        <input placeholder="请输入应用报名" className="detail-edit-name" onChange={(e) => this.appPageNameChange(e)}></input>

                        <div className="detail-text">设备信息</div>
                        <div className="detail-radio">
                        <label > <input type="radio" name='gender' value="Android"
                                        onChange={this.handleChange}/>Android</label>
                        <label > <input className="margin-40" type="radio" name='gender' value="iOS"
                                        onChange={this.handleChange}/>iOS</label>
                        </div>
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