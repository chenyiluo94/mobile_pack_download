import qs from 'qs'
export const get_search = (data) => {
  return qs.stringify(data, {
    sort: function (a, b) {
      let len = a.length;
      for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) {
          a = a[i] || '';
          b = b[i] || '';
          break;
        }
      }
      return a.charCodeAt() - b.charCodeAt()
    }
  })
}

export default {
  get_search,
}
