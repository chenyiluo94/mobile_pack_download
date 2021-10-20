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
        this.appId=this.props.match.params.appId;
    }
    onClickUpload = () => {
        if (this.state.files.length <= 0) {
            Toast.info('请上传apk');
            return;
        }
        Toast.loading('加载中', 6000);
        const formData = new FormData()
        formData.append("file", this.state.files[0])
        formData.append("bid", this.appId)
        fetch('v1/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(results => {
            Toast.hide();
                if (results.code !== ErrorCode.succ) {
                    Toast.info(results.msg)
                    return
                }else{
                    this.props.history.replace({ pathname: "/download/"+this.appId})
                }
        })
        .catch(err => {
         Toast.hide();
          console.log(err)
        })
        
        
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