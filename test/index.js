import sinon from 'sinon';
import auth from '../lib/index';


describe('Auth middleware', () => {
  let _req, _res, _next;

  beforeEach(() => {
    _req = {};
    _res = {};
    _next = sinon.stub();
  });

  it('should throw an exception when no filters specified', () => {
    const m = auth();
    (() => m(_req, _res, _next)).should.throw(Error, 'unauthorized');
  });

  describe('all filters fail', () => {
    it('should throw an exception', () => {
      const m = auth(() => {}, () => {});
      (() => m(_req, _res, _next)).should.throw(Error, 'unauthorized');
    });

    it('should not invoke next middleware', () => {
      const m = auth(() => {}, () => {});
      try { m(_req, _res, _next); } catch (e) { /* no-op */ }
      _next.called.should.be.false;
    });
  });

  describe('filters', () => {
    it('should receive the request', () => {
      const f = sinon.stub();
      const m = auth(f);
      try { m(_req, _res, _next); } catch (e) { /* no-op */ }
      f.calledWith(_req).should.be.true;
    });
  });

  describe('successful filter', () => {
    let _success, _fail, _user, _middleware;

    beforeEach(() => {
      _user = {};
      _success = sinon.stub().returns(_user);
      _fail = sinon.stub();
      _middleware = auth(_success, _fail);
    });

    it('should invoke next middleware', () => {
      _middleware(_req, _res, _next);
      _next.called.should.be.true;
    });

    it('should initialise req.user', () => {
      _middleware(_req, _res, _next);
      _req.user.should.equal(_user);
    });

    it('should not invoke next filter', () => {
      _middleware(_req, _res, _next);
      _fail.called.should.be.false;
    });
  });
});
