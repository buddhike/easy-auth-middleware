
export default (...filters) => {
  return (req, res, next) => {
    for (let f in filters) {
      const user = filters[f](req);
      if (user) {
        req.user = user;
        break;
      }
    }
    if (req.user) {
      next();
    } else {
      throw new Error('unauthorized');
    }
  }
}
