import ensure from 'easy-ensure';

export default async (req, ...filters) => {
  ensure(req, 'req is required');
  filters = filters || [];

  for (let f in filters) {
    const result = filters[f](req);
    const user = result && result.then ? await result : result;

    if (user) {
      return user;
    }
  }

  return false;
}
