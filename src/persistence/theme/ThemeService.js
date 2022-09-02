import React from 'react';
import {StorageUtil} from '@components/utils/StorageUtil';
import {applicationProperties} from '@src/application.properties';

export const ThemeService = {
  set,
  get,
  list,
  setDefault,
  getDefault,
};

async function get() {
  return applicationProperties.defaultTheme.code;
}

async function set(t) {
  return await StorageUtil.setItem('theme', t);
}

async function list() {
  return applicationProperties.themes;
}

async function setDefault(t) {
  await StorageUtil.setItem('defaultTheme', t);
}

async function getDefault() {
  return (
    (await StorageUtil.getItem('defaultTheme')) ||
    applicationProperties.defaultTheme
  );
}
