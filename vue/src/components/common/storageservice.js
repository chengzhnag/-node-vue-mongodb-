const storageservice = {
  write(key, value) {
    let _value = "";
    if (value) {
      _value = JSON.stringify(value);
    }
    localStorage.setItem(key, _value);
  },
  read(key, call) {
    //web直接从store中获取数据
    let value = localStorage.getItem(key);
    if (value && value != "undefined" && value != "null" && value != "" && value != "[]" && value != "{}") {
      let _value = null;
      try {
        _value = JSON.parse(value);
        if (typeof _value == "string") {
          _value = JSON.parse(_value);
        }
      } catch (ex) {

      }
      call && call(_value);
      return _value;
    }
    return null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
}


export {
  storageservice
}