import filter from './filter';

export default (...filters) => {
  return (req, res, next) => {
    filter(req, ...filters)
    .then(u => {
      if (u) {
        req.user = u;
        next();
      } else {
        next(new Error('unauthorized'));
      }
    });
  }
}
