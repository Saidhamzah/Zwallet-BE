const MIMEType = (type) => {
  // console.log(token);
  if (type) {
    if (type.toLowerCase() == "png" || "jpg" || "jpeg" || "webp" || "gif") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = MIMEType;
