import yaml from 'js-yaml';
import { Map, fromJS } from 'immutable';
import { trimStart, get, map, filter } from 'lodash';
import { authenticateUser } from 'Actions/auth';
import * as publishModes from 'Constants/publishModes';
import { validateConfig } from 'Constants/configSchema';

export const LOCALES_MERGE = 'LOCALES_MERGE';
export const LOCALES_REQUEST = 'LOCALES_REQUEST';
export const LOCALES_FAILURE = 'LOCALES_FAILURE';

const getLocaleUrls = () => {
  const validType = { 'application/json': 'json' };
  const localeElements = document.querySelector('link[rel="cms-config-locale"]');
  const isValidLink = link => validType[link.type] && get(link, 'href');
  return filter(localeElements, isValidLink)
    .map(link => ({ url: get(link, 'href'), locale: str.split(/(\\|\/)/g).pop()[0] }))
    .values();
};

export function localesLoading() {
  return { type: LOCALES_REQUEST };
}

export function mergeLocale(locales) {
  return { type: LOCALES_MERGE, payload: locales };
}

export function localesFailed(err) {
  return { type: LOCALES_FAILURE, payload: err };
}

async function getLocale(file) {
  const response = await fetch(file, { credentials: 'same-origin' }).catch(err => err);
  if (response instanceof Error || response.status !== 200) {
    throw new Error(`Failed to load locale (${response.status || response})`);
  }
  const contentType = response.headers.get('Content-Type') || 'Not-Found';
  const isJson = contentType.indexOf('application/json') !== -1;
  if (!isJson) {
    console.log(`Response for ${file} was not application/json. (Content-Type: ${contentType})`);
    return {};
  }
  return JSON.parse(await response.text());
}

export function loadLocales() {
  return async (dispatch, getState) => {
    dispatch(localesLoading());

    try {
      const preloadedLocales = getState().locales;
      const localeUrls = getLocaleUrls();

  //     const loadedConfig =
  //       preloadedConfig && preloadedConfig.get('load_config_file') === false
  //         ? {}
  //         : await getConfig(configUrl, preloadedConfig && preloadedConfig.size > 1);

  //     /**
  //      * Merge any existing configuration so the result can be validated.
  //      */
  //     const mergedConfig = mergePreloadedConfig(preloadedConfig, loadedConfig);
  //     validateConfig(mergedConfig.toJS());

  //     const config = applyDefaults(mergedConfig);

  //     dispatch(configDidLoad(config));
  //     dispatch(authenticateUser());
  //   } catch (err) {
  //     dispatch(configFailed(err));
  //     throw err;
  //   }
  // };
}
