import React from 'react';
import './index.scss';
import ajax, { ErrorCode } from '@utils/ajax';
import { Progress, Toast } from 'antd-mobile';

class Upload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileName: '',
            files: [],
        }
    }
    onClickUpload = () => {
        if (this.state.files.length <= 0) {
            Toast.info('请上传apk');
            return;
        }
        console.log(this.state.files[0]);
        console.log(this.state.files[0].file)
        // ajax.post('v1/upload', { appid: 'F4B768D0-604D-4F94-A6DE-81399345FE06', file: this.state.files[0] }).then((res) => {
        //     // removeDudaoSession()
        //     if (res.code !== ErrorCode.succ) {
        //         Toast.info(res.msg)
        //         return
        //     }
        //     //保存信息
        // }, (res) => {
        //     Toast.info(res.msg)
        // })
        const formData = new FormData()
        formData.append("file", this.state.files[0])
        formData.append("appid", 'F4B768D0-604D-4F94-A6DE-81399345FE06')
        fetch('v1/upload', {
            method: 'POST',
            body: formData
        }).then(response => console.log(response))

        // const res = await fetch.post('v1/upload', formData, {
        //     'Content-Type': 'multipart/form-data'
        // })
        // if (res.code !== ErrorCode.succ) {
        //     Toast.info(res.msg)
        //     return
        // }else{
        //     Toast.info(res.msg)
        // }
    }
    onFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                fileName: event.target.files[0].name,
                files: event.target.files,
            });
        }
    }
    render() {
        const { fileName } = this.state;
        return (
            <div className="upload-info">
                <div className="upload-top">
                    <div className="upload-title">发布应用</div>
                    <div className="release-button" onClick={this.onClickUpload}>发布</div>
                </div>

                <div className="horizontal-line"></div>
                <div className="upload-bg">
                    <div className="upload-box">
                        <div className="upload-button">立即上传
                            <input className="upload-input" onChange={this.onFileChange} type="file" name='file' accept=".ipa,.apk" />
                        </div>
                    </div>

                    <div className="upload-text">{fileName}</div>
                    <div className="upload-tip">点击按钮选择应用的安装包，或拖拽文件到此区域<br />
                        （支持ipa或apk文件，支持中断后续传）
                    </div>
                </div>
            </div>
        );
    }
}

export default Upload;