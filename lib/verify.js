// Generated by IcedCoffeeScript 108.0.11
(function() {
  var GenericKey, iced, import_key_cb, make_esc, ukm, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  ukm = require('./ukm');

  make_esc = require('iced-error').make_esc;

  exports.GenericKey = GenericKey = (function() {
    function GenericKey(_arg) {
      this.km = _arg.km;
    }

    GenericKey.prototype.kid = function() {
      return this.km.get_ekid().toString('hex');
    };

    GenericKey.prototype.isPGP = function() {
      return !!this.km.get_pgp_fingerprint();
    };

    GenericKey.prototype._verify_cb = function(s, opts, cb) {
      var body, esc, payload, sig_eng, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb);
      sig_eng = this.km.make_sig_eng();
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/verify.iced",
            funcname: "GenericKey._verify_cb"
          });
          sig_eng.unbox(s, esc(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                payload = arguments[0];
                return body = arguments[1];
              };
            })(),
            lineno: 11
          })), opts);
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(null, [payload, body]);
        };
      })(this));
    };

    GenericKey.prototype.verify = function(s, opts) {
      return new Promise(((function(_this) {
        return function(resolve, reject) {
          return _this._verify_cb(s, opts, function(err, res) {
            if (err != null) {
              return reject(err);
            } else {
              return resolve(res);
            }
          });
        };
      })(this)));
    };

    return GenericKey;

  })();

  import_key_cb = function(s, opts, cb) {
    var esc, km, ret, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    esc = make_esc(cb);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/max/src/keybase/kbpgp/src/verify.iced"
        });
        ukm.import_armored_public({
          armored: s,
          opts: opts
        }, esc(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return km = arguments[0];
            };
          })(),
          lineno: 23
        })));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        ret = new GenericKey({
          km: km
        });
        return cb(null, ret);
      };
    })(this));
  };

  exports.importKey = function(s, opts) {
    return new Promise(function(resolve, reject) {
      return import_key_cb(s, opts, function(err, ret) {
        if (err != null) {
          return reject(err);
        } else {
          return resolve(ret);
        }
      });
    });
  };

}).call(this);