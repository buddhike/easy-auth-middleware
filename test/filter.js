import sinon from 'sinon';
import Q from 'q';

import filter from '../lib/filter';

describe('filter', () => {
  const _req = {};

  it('should pass req to all filters', async () => {
    const f1 = sinon.stub();
    const f2 = sinon.stub();

    await filter(_req, f1, f2);

    f1.calledWith(_req).should.be.true;
    f2.calledWith(_req).should.be.true;
  });

  describe('no filter specified', () => {
    it('should return falsey', async () => {
      (await filter(_req)).should.be.false;
    });
  });

  describe('all filters failing', () => {
    it('should return falsey', async () => {
      (await filter(_req, () => {})).should.be.false;
    });
  });

  describe('successful filter', () => {
    const _nextFilter = sinon.spy(), _user = {};
    it('should return the output of filter', async () => {
      (await filter(_req, () => _user, _nextFilter)).should.equal(_user);
    });

    it('should not invoke subsequent filters', async () => {
      await filter(_req, () => _user, _nextFilter);
      _nextFilter.notCalled.should.be.true;
    });
  });

  describe('async filter', () => {
    let _asyncFilter, _asyncResult, _nextFilter;

    beforeEach(() => {
      _asyncResult = Q.defer();
      _asyncFilter = sinon.stub().returns(_asyncResult.promise);
      _nextFilter = sinon.spy();
    });

    it('should not invoke next filter until resolved', async () => {
      const r = filter(_req, _asyncFilter, _nextFilter);
      _nextFilter.notCalled.should.be.true;
      _asyncResult.resolve(false);
      await r;
      _nextFilter.called.should.be.true;
    });
  });
});
