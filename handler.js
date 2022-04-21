const headers = require("./headers");

const errorMessage = {
  4001: "無此路由",
  4002: "資料格式錯誤!",
  4003: '欄位未填寫正確!請用{"title":"XXX"}',
  4004: "無此ID",
};

function errorHandle(res, error) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      success: false,
      message: errorMessage[error] !== undefined ? errorMessage[error] : error,
    })
  );
  res.end();
}

function successHandle(res, data) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      success: true,
      data,
    })
  );
  res.end();
}

module.exports = {
  errorHandle,
  successHandle,
};
