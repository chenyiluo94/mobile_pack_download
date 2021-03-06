import Page404 from '../pages/404'
import Loadable from 'react-loadable'
import loading from '../components/loading'
import Page from './page.js'
import Download from './download.js'
import Console from './console.js'
import Upload from './upload.js'
import Login from './login.js'
const routes = [
  {
    path: "/",
    exact: true,
    check_login: true,
    component: Loadable({
      loader: () =>
        import('@pages/console'),
      loading,
    })
  },
  {
    path: "/home",
    exact: true,
    check_login: true,
    component: Loadable({
      loader: () =>
        import('@pages/home/index'),
      loading,
    })
  },
  ...Page,
  ...Download,
  ...Console,
  ...Upload,
  ...Login,
  {
    check_login: false,
    component: Page404
  }];
  export default routes