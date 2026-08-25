import PropTypes from 'prop-types';
import React, { createContext, useState, useEffect } from 'react';
import defaultConfig from '../config';

const initialState = {
  ...defaultConfig,
  onChangeMenuType: () => {},
  onChangePresetColor: () => {},
  onChangeLocale: () => {},
  onChangeRTL: () => {},
  onChangeBorderRadius: () => {},
  onChangeFontFamily: () => {},
};

export const ConfigContext = createContext(initialState);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const savedConfig = localStorage.getItem('recipe-admin-config');
      return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('recipe-admin-config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  const onChangeMenuType = (navType) => {
    setConfig((prev) => ({ ...prev, navType }));
  };

  const onChangePresetColor = (presetColor) => {
    setConfig((prev) => ({ ...prev, presetColor }));
  };

  const onChangeLocale = (i18n) => {
    setConfig((prev) => ({ ...prev, i18n }));
  };

  const onChangeRTL = (rtlLayout) => {
    setConfig((prev) => ({ ...prev, rtlLayout }));
  };

  const onChangeBorderRadius = (event, newValue) => {
    setConfig((prev) => ({ ...prev, borderRadius: newValue }));
  };

  const onChangeFontFamily = (fontFamily) => {
    setConfig((prev) => ({ ...prev, fontFamily }));
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeMenuType,
        onChangePresetColor,
        onChangeLocale,
        onChangeRTL,
        onChangeBorderRadius,
        onChangeFontFamily,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = {
  children: PropTypes.node,
};
