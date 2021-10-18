import Loadable from 'react-loadable'
import loading from '../components/loading'
const Download = [
    {
        path: "/download/:appId",
        exact: true,
        check_login: true,
        component: Loadable({
            loader: () =>
                import('@pages/download/index'),
            loading,
        })
    },
]
export default Download