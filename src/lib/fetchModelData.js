
/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url  The URL to fetch the model from.
 * @returns {Promise}   A promise that resolves with the JSON data, or rejects with an error.
 */

// Hàm để fetch dữ liệu từ API backend
function fetchModel(url, options = {}) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    const headers = { ...options.headers };
    if (token && options.auth) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const fetchOptions = {
      ...options, // lay tat ca tuy chon tu options (method, body,...)
      headers: headers,
    }

    // fetch request voi header
    fetch(url, fetchOptions)
      .then((response) => {
        // Kiểm tra xem response có thành công không (status 2xx)
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json(); // Chuyển response sang JSON
      })
      .then((data) => {
        resolve(data); // Giải quyết promise với dữ liệu JSON
      })
      .catch((error) => {
        console.error("Error fetching model:", error);
        reject(error); // Từ chối promise nếu có lỗi
      });
  });
}

export default fetchModel;
