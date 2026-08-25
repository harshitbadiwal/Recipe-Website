import { useContext } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';

const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};

export default useConfig;
