import { useRequestStore } from '../stores/UseRequestStore.js';

export function useRequests() {
  const store = useRequestStore();
  const modules = store.modules;

  const initializeModule = (name) => {
    store.initializeModule(name);
  };

  const getAllData = (module, uri, payload = null) => {
    return store.getAllData(module, uri, payload);
  };

  const createRecord = (module, uri, payload) => {
    return store.createRecord(module, uri, payload);
  };

  const updateRecord = (module, uri, payload) => {
    return store.updateRecord(module, uri, payload);
  };

  const deleteRecord = (module, payload) => {
    return store.deleteRecord(module, payload);
  };

  const onRequest = (props, module, uri, filter_text, filter_fields) => {
    props.pagination.filter_text = filter_text;
    props.pagination.filter_fields = filter_fields;
    getAllData(module, uri, props.pagination);
  };

  return {
    initializeModule,
    getAllData,
    createRecord,
    updateRecord,
    deleteRecord,
    onRequest,
    modules,
  };
}
