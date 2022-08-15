import { generateIdmApi } from './BaseApi.js';
import { getTenantURL } from './utils/ApiUtils.js';
import { state } from '../storage/state';
import storage from '../storage/SessionStorage.js';

const managedObjectByIdURLTemplate = ({ tenant, type, id, fieldsParam = '' }) =>
  `${tenant}/openidm/managed/${type}/${id}${
    fieldsParam ? `?${fieldsParam}` : fieldsParam
  }`;

const managedObjectQueryAllURLTemplate = ({
  tenant,
  type,
  pageCookie = '',
  fieldsParam = '',
}) =>
  `${tenant}/openidm/managed/${type}?_queryFilter=true&_pageSize=10000${fieldsParam}${
    pageCookie ? `&_pagedResultsCookie=${pageCookie}` : pageCookie
  }`;

/**
 * Get managed object
 * @param {String} id managed object id
 * @returns {Promise} a promise that resolves to an object containing a managed object
 */
export const getManagedObject = async ({ type, id, fields }) => {
  const fieldsParam = `_fields=${fields.length ? fields.join(',') : '*'}`;
  const urlString = managedObjectByIdURLTemplate({
    tenant: getTenantURL(storage.session.getTenant()),
    type,
    id,
    fieldsParam,
  });
  return generateIdmApi().get(urlString);
};

/**
 * Put managed object
 * @param {String} id managed object id
 * @param {String} data managed object
 * @returns {Promise} a promise that resolves to an object containing a managed object
 */
export const putManagedObject = async ({ type, id, data }) => {
  const urlString = managedObjectByIdURLTemplate({
    id,
    tenant: getTenantURL(storage.session.getTenant()),
    type,
  });
  return generateIdmApi().put(urlString, data);
};

/**
 * Query managed objects
 * @param {Object} config
 * @param {string} config.type managed object type
 * @param {string} config.fields fields to retrieve
 * @param {string} config.pageCookie paged results cookie
 * @param {import('../types/state/State').WithOptions<'tenant'>['state']} config.state
 * @returns {Promise} a promise that resolves to an object containing managed objects of the desired type
 */
export const queryAllManagedObjectsByType = async ({
  type,
  fields,
  pageCookie,
  state: { tenant },
}) => {
  const fieldsParam = `&_fields=${
    fields.length ? `${fields.join(',')}` : '_id'
  }`;
  const urlstring = managedObjectQueryAllURLTemplate({
    tenant: getTenantURL({ tenant }),
    type,
    fieldsParam,
    pageCookie,
  });
  return generateIdmApi().get(urlstring);
};
