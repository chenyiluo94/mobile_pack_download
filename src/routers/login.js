import Loadable from 'react-loadable'
import loading from '../components/loading'
const Login = [
    {
        path: "/login",
        exact: true,
        check_login: true,
        component: Loadable({
            loader: () =>
                import('@pages/login/index'),
            loading,
        })
    },
    {
        path: "/register",
        exact: true,
        check_login: true,
        component: Loadable({
            loader: () =>
                import('@pages/register/index'),
            loading,
        })
    },
]
export default Login
