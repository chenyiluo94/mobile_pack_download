import Loadable from 'react-loadable'
import loading from '../components/loading'
const Console = [
    {
        path: "/console",
        exact: true,
        check_login: true,
        component: Loadable({
            loader: () =>
                import('@pages/console/index'),
            loading,
        })
    },
]
export default Console