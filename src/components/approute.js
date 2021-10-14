import React from 'react';
import { Route } from 'react-router-dom'
import utils from '@utils'
import log from '@utils/log'
import { UserAgent } from '@utils/useragent'
import share from 'src/utils/share'
// import { loginJump } from 'src/utils/loginCtrl'
import { store } from 'src/utils'
import { getShareCfg, shareTable } from 'src/config/share.js'
// import { setdotRfCookie, setPageCookie } from 'src/utils/cookie.js'
import { isBx, addfeature } from 'src/utils/bx_sdk'
import ErrorTrapping from '@components/common/ErrorTrapping'
// import Cookies from 'js-cookie';
// import qs from 'querystringify'
// import Url from 'url-parse'

class Approute extends React.Component {
  constructor(props) {
    super(props);
    this.pageShare = this.pageShare.bind(this)
    this.state = {}
    this.params = {}
    this.mainHost = ''
    this.params1 = utils.getUrlParam('search');
    this.params2 = utils.getUrlParam();
    this.allParams = {
      ...this.params1,
      ...this.params2
    }
  }
  async pageShare() {
    const shareCfg = await getShareCfg(this.props)
    const shareOpt = shareCfg.share
    const reg = new RegExp(this.props.location.pathname.substr(1), 'i')
    const canBxShare = shareTable.find((item) => reg.test(item.pathname))
    if (isBx && canBxShare) { // 官网app
      return addfeature({
        share: {
          title: shareOpt.title,
          desc: shareOpt.desc,
          img: shareOpt.imgUrl,
          url: shareOpt.link || window.location.href
        }
      });
    } else {
      return share.wx_jssdk_share_entry({
        location: this.props.location,
        share: shareOpt
      })
    }
  }
  componentWillMount() {
    //添加fr&channel的cookie覆盖逻辑
    // setPageCookie();
    this.setClientStore()
    //this.storeMiniInfo();
  }
  componentDidMount() {
    // loginJump(this.props.location.search)
    this.pageShare();
    // 借条特殊处理，页面回退问题
    const params = utils.get_url_params(this.props.location.search)
    const locationLine = window.location.href
    const pathname = this.props.location.pathname
    const isJt = locationLine.indexOf('channel=jietiao') > -1 || locationLine.indexOf('channel=360huzhu') > -1
    if (UserAgent.app.jietiao) {
      let leftCallback = () => {
        if (window.__jt_noback__ === 1) {
          return false;
        }
        if (pathname === '/lesson/home' || pathname === '/lesson/result' || this.props.location.search.indexOf('jietiaoback') >= 0 || isJt) {
          if (locationLine.indexOf('nojtback=1') > -1) {
            window.history.back()
            return
          }
          window.App.back();
        } else {
          window.history.back()
        }
      }
      if (params.src === utils.jietiao_params_flag()) {
        leftCallback = ''
      }
      setTimeout(() => {
        window.App.setHeader({
          title: '360金融课堂',
          leftCallback
        });
      }, 30);
    }
    if (UserAgent.env.ios && UserAgent.env.UCBrowser) {
      document.activeElement.blur()
    }
    // 设置打点
    document.addEventListener('DOMContentLoaded', () => {
      var loadTime = window.performance.timing.domContentLoadedEventStart - window.performance.timing.navigationStart;
      log({ ps: 'loadtime_' + loadTime / 1000 + 's', tp: 'loadtime' })
      this.commonDotLog()
      window.addEventListener('hashchange', () => {
        this.commonDotLog()
      }, false)
    }, false)

    // 客户端网络环境及设备尺寸信息打点
    try {
      // connection 分析客户端网络环境
      var connection = window.navigator && window.navigator.connection;
      if (connection && connection.effectiveType) {
        log({ ps: `${connection.effectiveType}_${connection.downlink * 1024 / 8}KB/s , device:${window.screen.width * window.devicePixelRatio}_${window.screen.height * window.devicePixelRatio}`, tp: 'page-network' })
        console.log(`effectiveType:${connection.effectiveType}; downlink:${connection.downlink * 1024 / 8}KB/s`)
        console.log(`device:${window.screen.width * window.devicePixelRatio}_${window.screen.height * window.devicePixelRatio}`)
      }
    } catch (error) {
      console.log('window.navigator.connection 不兼容')
    }
    // utils.set_log()
    document.body.style.overflowY = 'auto'
  }

  componentWillUnmount() {
    // setPageCookie();
    if (isBx) { // 官网app
      return addfeature({})
    }
  }
  commonDotLog() {
    if (this.props.location.pathname === '/') {
      // log({ ps: '/index', tp: 'page' })
    } else {
      log({ ps: window.location.hash.substr(1), tp: 'page' })
    }
  }
  storeMiniInfo() {
    let _ref_mini_program_openid = this.allParams._ref_mini_program_openid || undefined;
    let _ref_unionId = this.allParams._ref_unionId || undefined;
    let token = this.allParams.token || undefined;
    let mini_replace = this.allParams.mini_replace || undefined;
    if (!mini_replace) {
      return false;
    }
    if (_ref_mini_program_openid) {
      Cookies.set('__dot_open_id__', _ref_mini_program_openid, { domain: utils.getMainHost(), expires: 7 });
    }
    if (_ref_unionId) {
      Cookies.set('__dot_unionid__', _ref_unionId, { domain: utils.getMainHost(), expires: 7 });
    }
    if (token) {
      Cookies.set('CSTK', token, { domain: utils.getMainHost(), expires: 7 });
    }
    let res = new Url(window.location.href);
    res = this.resetUrl('_ref_mini_program_openid', res);
    res = this.resetUrl('_ref_unionId', res);
    res = this.resetUrl('token', res);
    res = this.resetUrl('mini_replace', res);
    let url = res.toString();
    window.location.replace(url);
  }
  resetUrl(key, urlInstance) {
    let hash = urlInstance.hash;
    let query = urlInstance.query;
    if (!!hash) {
      let index = hash.indexOf('?');
      let right = '';
      let left = hash;
      if (index > -1) {
        right = hash.slice(index + 1);
        let obj = qs.parse(right);
        if (!!obj[key]) {
          delete obj[key];
        }
        right = qs.stringify(obj, '&');
        right = right.slice(1);
        left = hash.slice(0, index + 1);
      }
      urlInstance.hash = left + right;
    }
    if (!!query) {
      let index = query.indexOf('?');
      let right = '';
      let left = query;
      if (index > -1) {
        right = query.slice(index + 1);
        let obj = qs.parse(right);
        if (!!obj[key]) {
          delete obj[key];
        }
        right = qs.stringify(obj, '&');
        right = right.slice(1);
        left = query.slice(0, index + 1);
      }
      urlInstance.query = left + right;
    }
    // console.log(urlInstance.hash)
    return urlInstance;
  }
  setClientStore() {
    const params = utils.get_url_params(this.props.location.search)
    let client = store.session_get('client') || {}
    if (params.source && params.source != client.value) {
      store.session_set('client', {
        value: params.source || ''
      })
    }
  }
  render() {
    return (<Route {...this.props}></Route>)
  }
}
export default ErrorTrapping(Approute)
