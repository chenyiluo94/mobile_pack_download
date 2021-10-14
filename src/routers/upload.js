import Loadable from 'react-loadable'
import loading from '../components/loading'
const Upload = [
    {
        path: "/upload",
        exact: true,
        check_login: true,
        component: Loadable({
            loader: () =>
                import('@pages/upload/index'),
            loading,
        })
    },
    {
        path: "/upload/detail",
        exact: true,
        check_login: true,
        component: Loadable({
            loader: () =>
                import('@pages/upload/detail/index'),
            loading,
        })
    },
]
export default Upload