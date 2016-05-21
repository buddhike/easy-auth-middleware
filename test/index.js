import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('Auth middleware', () => {
  let _req, _res, _next, _filterResult, _middleware;

  beforeEach(() => {
    _req = {};
    _res = {};
    _next = sinon.stub();
    _filterResult = { then: sinon.stub() };

    const filter = {
      default: sinon.stub().returns(_filterResult),
      __esModule: true,
      '@noCallThru': true
    };

    _middleware = proxyquire('../lib/index', {
      './filter': filter
    }).default();
  });

  describe('filter not returning a user', () => {
    it('should call next middleware with an error', () => {
      _middleware(_req, _res, _next);
      _filterResult.then.callArgWith(0, false)
      _next.getCall(0).args[0].message.should.equal('unauthorized');
    });
  });

  describe('filter returning a user', () => {
    const _user = {};

    beforeEach(() => {
      _middleware(_req, _res, _next);
      _filterResult.then.callArgWith(0, _user);
    });

    it('should make it available for the pipeline', () => {
      _req.user.should.equal(_user);
    });

    it('should invoke the next middleware without an error', () => {
      _next.getCall(0).args.length.should.equal(0);
    });
  });
});
