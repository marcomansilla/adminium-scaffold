import { useRequestStore } from '../stores/UseRequestStore.js';
import { useAuthStore } from '../stores/UseAuthStore.js';

export function useRequests() {
  const authStore = useAuthStore();
  const store = useRequestStore();
  const modules = store.modules;

  const initializeModule = (name) => {
    store.initializeModule(name);
  };

  const getAllData = (module, uri, payload=null, secure=false) => {
    var customHeaders = {};
    if (secure) {
      customHeaders = authStore.getHeaders;
    }
    return store.getAllData(module, uri, payload, secure, customHeaders);
  };

  const createRecord = (module, uri, payload, secure=false) => {
    return store.createRecord(module, uri, payload, secure);
  };

  const updateRecord = (module, uri, payload, secure=false) => {
    return store.updateRecord(module, uri, payload);
  };

  const deleteRecord = (module, payload, secure=false) => {
    return store.deleteRecord(module, payload);
  };

  const getModuleData = (module, uri, field, secure=false) => {
    return store.getModuleData(module, uri, field, secure);
  };

  const onRequest = (props, module, uri, filter_text, filter_fields, secure=false) => {
    props.pagination.filter_text = filter_text;
    props.pagination.filter_fields = filter_fields;
    getAllData(module, uri, props.pagination);
  };

  const uploadFile = (uri, formdata, secure=false) => {
    return store.uploadFile(uri, formdata);
  };

  return {
    initializeModule,
    getAllData,
    getModuleData,
    createRecord,
    updateRecord,
    deleteRecord,
    onRequest,
    uploadFile,
    modules,
  };
}
