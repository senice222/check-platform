import { Provider } from 'react-redux';
import { store } from '../store/store';

interface Props {
    children: React.ReactNode;
}

export const AppProviders = ({ children }: Props) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};
