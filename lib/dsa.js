// Generated by IcedCoffeeScript 108.0.11
(function() {
  var ASP, BaseKey, BaseKeyPair, BigInteger, C, K, MRF, Pair, Priv, Pub, SRF, bn, bufeq_secure, iced, konst, make_esc, nbits, nbv, __iced_k, __iced_k_noop, _ref, _ref1, _ref2, _ref3,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  bn = require('./bn');

  nbits = bn.nbits, nbv = bn.nbv, BigInteger = bn.BigInteger;

  _ref = require('./rand'), SRF = _ref.SRF, MRF = _ref.MRF;

  _ref1 = require('./util'), bufeq_secure = _ref1.bufeq_secure, ASP = _ref1.ASP;

  make_esc = require('iced-error').make_esc;

  konst = require('./const');

  C = konst.openpgp;

  K = konst.kb;

  _ref2 = require('./basekeypair'), BaseKey = _ref2.BaseKey, BaseKeyPair = _ref2.BaseKeyPair;

  _ref3 = require('./rand'), SRF = _ref3.SRF, MRF = _ref3.MRF;

  Pub = (function(_super) {
    __extends(Pub, _super);

    Pub.type = C.public_key_algorithms.DSA;

    Pub.prototype.type = Pub.type;

    Pub.ORDER = ['p', 'q', 'g', 'y'];

    Pub.prototype.ORDER = Pub.ORDER;

    function Pub(_arg) {
      this.p = _arg.p, this.q = _arg.q, this.g = _arg.g, this.y = _arg.y;
    }

    Pub.alloc = function(raw) {
      return BaseKey.alloc(Pub, raw);
    };

    Pub.prototype.trunc_hash = function(h) {
      return bn.bn_from_left_n_bits(h, this.q.bitLength());
    };

    Pub.prototype.nbits = function() {
      var _ref4;
      return (_ref4 = this.p) != null ? _ref4.bitLength() : void 0;
    };

    Pub.prototype.verify = function(_arg, h, cb) {
      var err, hi, r, s, u1, u2, v, w;
      r = _arg[0], s = _arg[1];
      err = null;
      hi = this.trunc_hash(h);
      w = s.modInverse(this.q);
      u1 = hi.multiply(w).mod(this.q);
      u2 = r.multiply(w).mod(this.q);
      v = this.g.modPow(u1, this.p).multiply(this.y.modPow(u2, this.p)).mod(this.p).mod(this.q);
      if (!v.equals(r)) {
        err = new Error("verification failed");
      }
      return cb(err);
    };

    return Pub;

  })(BaseKey);

  Priv = (function(_super) {
    __extends(Priv, _super);

    Priv.ORDER = ['x'];

    Priv.prototype.ORDER = Priv.ORDER;

    function Priv(_arg) {
      this.x = _arg.x, this.pub = _arg.pub;
    }

    Priv.alloc = function(raw, pub) {
      return BaseKey.alloc(Priv, raw, {
        pub: pub
      });
    };

    Priv.prototype.sign = function(h, cb) {
      var err, g, hi, k, p, q, r, s, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref4;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      err = null;
      _ref4 = this.pub, p = _ref4.p, q = _ref4.q, g = _ref4.g;
      hi = this.pub.trunc_hash(h);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/dsa.iced",
            funcname: "Priv.sign"
          });
          SRF().random_zn(q.subtract(bn.nbv(2)), __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return k = arguments[0];
              };
            })(),
            lineno: 76
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          k = k.add(bn.BigInteger.ONE);
          r = g.modPow(k, p).mod(q);
          s = (k.modInverse(q).multiply(hi.add(_this.x.multiply(r)))).mod(q);
          return cb([r, s]);
        };
      })(this));
    };

    return Priv;

  })(BaseKey);

  Pair = (function(_super) {
    __extends(Pair, _super);

    Pair.Pub = Pub;

    Pair.prototype.Pub = Pub;

    Pair.Priv = Priv;

    Pair.prototype.Priv = Priv;

    Pair.type = C.public_key_algorithms.DSA;

    Pair.prototype.type = Pair.type;

    Pair.prototype.get_type = function() {
      return this.type;
    };

    Pair.klass_name = "DSA";

    function Pair(_arg) {
      var priv, pub;
      pub = _arg.pub, priv = _arg.priv;
      Pair.__super__.constructor.call(this, {
        pub: pub,
        priv: priv
      });
    }

    Pair.parse = function(pub_raw) {
      return BaseKeyPair.parse(Pair, pub_raw);
    };

    Pair.prototype.can_encrypt = function() {
      return false;
    };

    Pair.prototype.fulfills_flags = function(flags) {
      var good_for;
      good_for = this.good_for_flags();
      return (flags & good_for) === flags;
    };

    Pair.prototype.good_for_flags = function() {
      return C.key_flags.certify_keys | C.key_flags.sign_data;
    };

    Pair.prototype.verify_unpad_and_check_hash = function(_arg, cb) {
      var data, hash, hasher, sig;
      sig = _arg.sig, data = _arg.data, hasher = _arg.hasher, hash = _arg.hash;
      return this._dsa_verify_update_and_check_hash({
        sig: sig,
        data: data,
        hasher: hasher,
        hash: hash,
        klass: Pair
      }, cb);
    };

    Pair.prototype.pad_and_sign = function(data, _arg, cb) {
      var h, hasher, s, sig, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      hasher = _arg.hasher;
      hasher || (hasher = SHA512);
      h = hasher(data);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/dsa.iced",
            funcname: "Pair.pad_and_sign"
          });
          _this.priv.sign(h, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return sig = arguments[0];
              };
            })(),
            lineno: 128
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(null, Buffer.concat((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = sig.length; _i < _len; _i++) {
              s = sig[_i];
              _results.push(s.to_mpi_buffer());
            }
            return _results;
          })()));
        };
      })(this));
    };

    Pair.parse_sig = function(slice) {
      var buf, err, n, ret, _ref4;
      buf = slice.peek_rest_to_buffer();
      _ref4 = Pair.read_sig_from_buf(buf), err = _ref4[0], ret = _ref4[1], n = _ref4[2];
      if (err != null) {
        throw err;
      }
      slice.advance(n);
      return ret;
    };

    Pair.read_sig_from_buf = function(buf) {
      var err, n, o, order, orig_len, ret, x;
      orig_len = buf.length;
      order = ['r', 's'];
      err = null;
      ret = (function() {
        var _i, _len, _ref4, _results;
        _results = [];
        for (_i = 0, _len = order.length; _i < _len; _i++) {
          o = order[_i];
          if (!(err == null)) {
            continue;
          }
          _ref4 = bn.mpi_from_buffer(buf), err = _ref4[0], x = _ref4[1], buf = _ref4[2];
          _results.push(x);
        }
        return _results;
      })();
      n = orig_len - buf.length;
      return [err, ret, n];
    };

    return Pair;

  })(BaseKeyPair);

  exports.DSA = exports.Pair = Pair;

}).call(this);
