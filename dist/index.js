var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __objSpread = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/.pnpm/dotenv@9.0.2/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@9.0.2/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    function log(message) {
      console.log(`[dotenv][DEBUG] ${message}`);
    }
    var NEWLINE = "\n";
    var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
    var RE_NEWLINES = /\\n/g;
    var NEWLINES_MATCH = /\r\n|\n|\r/;
    function parse(src, options) {
      const debug = Boolean(options && options.debug);
      const obj = {};
      src.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
          const key = keyValueArr[1];
          let val = keyValueArr[2] || "";
          const end = val.length - 1;
          const isDoubleQuoted = val[0] === '"' && val[end] === '"';
          const isSingleQuoted = val[0] === "'" && val[end] === "'";
          if (isSingleQuoted || isDoubleQuoted) {
            val = val.substring(1, end);
            if (isDoubleQuoted) {
              val = val.replace(RE_NEWLINES, NEWLINE);
            }
          } else {
            val = val.trim();
          }
          obj[key] = val;
        } else if (debug) {
          log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
        }
      });
      return obj;
    }
    function config(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let debug = false;
      if (options) {
        if (options.path != null) {
          dotenvPath = options.path;
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
        if (options.debug != null) {
          debug = true;
        }
      }
      try {
        const parsed = parse(fs.readFileSync(dotenvPath, {encoding}), {debug});
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else if (debug) {
            log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
          }
        });
        return {parsed};
      } catch (e) {
        return {error: e};
      }
    }
    module2.exports.config = config;
    module2.exports.parse = parse;
  }
});

// node_modules/.pnpm/delayed-stream@1.0.0/node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  "node_modules/.pnpm/delayed-stream@1.0.0/node_modules/delayed-stream/lib/delayed_stream.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    var util = require("util");
    module2.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util.inherits(DelayedStream, Stream);
    DelayedStream.create = function(source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function() {
      });
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.source.readable;
      }
    });
    DelayedStream.prototype.setEncoding = function() {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function() {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function() {
      this.source.pause();
    };
    DelayedStream.prototype.release = function() {
      this._released = true;
      this._bufferedEvents.forEach(function(args) {
        this.emit.apply(this, args);
      }.bind(this));
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function() {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function(args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  }
});

// node_modules/.pnpm/combined-stream@1.0.8/node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  "node_modules/.pnpm/combined-stream@1.0.8/node_modules/combined-stream/lib/combined_stream.js"(exports2, module2) {
    var util = require("util");
    var Stream = require("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module2.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util.inherits(CombinedStream, Stream);
    CombinedStream.create = function(options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function(stream) {
      return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
    };
    CombinedStream.prototype.append = function(stream) {
      var isStreamLike = CombinedStream.isStreamLike(stream);
      if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams
          });
          stream.on("data", this._checkDataSize.bind(this));
          stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
          stream.pause();
        }
      }
      this._streams.push(stream);
      return this;
    };
    CombinedStream.prototype.pipe = function(dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function() {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function() {
      var stream = this._streams.shift();
      if (typeof stream == "undefined") {
        this.end();
        return;
      }
      if (typeof stream !== "function") {
        this._pipeNext(stream);
        return;
      }
      var getStream = stream;
      getStream(function(stream2) {
        var isStreamLike = CombinedStream.isStreamLike(stream2);
        if (isStreamLike) {
          stream2.on("data", this._checkDataSize.bind(this));
          this._handleErrors(stream2);
        }
        this._pipeNext(stream2);
      }.bind(this));
    };
    CombinedStream.prototype._pipeNext = function(stream) {
      this._currentStream = stream;
      var isStreamLike = CombinedStream.isStreamLike(stream);
      if (isStreamLike) {
        stream.on("end", this._getNext.bind(this));
        stream.pipe(this, {end: false});
        return;
      }
      var value = stream;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function(stream) {
      var self = this;
      stream.on("error", function(err) {
        self._emitError(err);
      });
    };
    CombinedStream.prototype.write = function(data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function() {
      if (!this.pauseStreams) {
        return;
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function")
        this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function() {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function")
        this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function() {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function() {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function() {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function() {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function() {
      this.dataSize = 0;
      var self = this;
      this._streams.forEach(function(stream) {
        if (!stream.dataSize) {
          return;
        }
        self.dataSize += stream.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function(err) {
      this._reset();
      this.emit("error", err);
    };
  }
});

// node_modules/.pnpm/mime-db@1.47.0/node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/.pnpm/mime-db@1.47.0/node_modules/mime-db/db.json"(exports2, module2) {
    module2.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana"
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana"
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana"
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana"
      },
      "image/avcs": {
        source: "iana"
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/.pnpm/mime-db@1.47.0/node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/.pnpm/mime-db@1.47.0/node_modules/mime-db/index.js"(exports2, module2) {
    module2.exports = require_db();
  }
});

// node_modules/.pnpm/mime-types@2.1.30/node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/.pnpm/mime-types@2.1.30/node_modules/mime-types/index.js"(exports2) {
    "use strict";
    var db = require_mime_db();
    var extname = require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports2.charset = charset;
    exports2.charsets = {lookup: charset};
    exports2.contentType = contentType;
    exports2.extension = extension;
    exports2.extensions = Object.create(null);
    exports2.lookup = lookup;
    exports2.types = Object.create(null);
    populateMaps(exports2.extensions, exports2.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports2.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports2.charset(mime);
        if (charset2)
          mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports2.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path) {
      if (!path || typeof path !== "string") {
        return false;
      }
      var extension2 = extname("x." + path).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports2.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/defer.js"(exports2, module2) {
    module2.exports = defer;
    function defer(fn) {
      var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/async.js
var require_async = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/async.js"(exports2, module2) {
    var defer = require_defer();
    module2.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function() {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/abort.js"(exports2, module2) {
    module2.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/iterate.js"(exports2, module2) {
    var async = require_async();
    var abort = require_abort();
    module2.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
      state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        if (!(key in state.jobs)) {
          return;
        }
        delete state.jobs[key];
        if (error) {
          abort(state);
        } else {
          state.results[key] = output;
        }
        callback(error, state.results);
      });
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/state.js"(exports2, module2) {
    module2.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
      };
      if (sortMethod) {
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
          return sortMethod(list[a], list[b]);
        });
      }
      return initState;
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/lib/terminator.js"(exports2, module2) {
    var abort = require_abort();
    var async = require_async();
    module2.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/parallel.js"(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator, state, function(error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/serialOrdered.js"(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = serialOrdered;
    module2.exports.ascending = ascending;
    module2.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/serial.js
var require_serial = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/serial.js"(exports2, module2) {
    var serialOrdered = require_serialOrdered();
    module2.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  }
});

// node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  "node_modules/.pnpm/asynckit@0.4.0/node_modules/asynckit/index.js"(exports2, module2) {
    module2.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered()
    };
  }
});

// node_modules/.pnpm/form-data@4.0.0/node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  "node_modules/.pnpm/form-data@4.0.0/node_modules/form-data/lib/populate.js"(exports2, module2) {
    module2.exports = function(dst, src) {
      Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  }
});

// node_modules/.pnpm/form-data@4.0.0/node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  "node_modules/.pnpm/form-data@4.0.0/node_modules/form-data/lib/form_data.js"(exports2, module2) {
    var CombinedStream = require_combined_stream();
    var util = require("util");
    var path = require("path");
    var http = require("http");
    var https = require("https");
    var parseUrl = require("url").parse;
    var fs = require("fs");
    var Stream = require("stream").Stream;
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var populate = require_populate();
    module2.exports = FormData;
    util.inherits(FormData, CombinedStream);
    function FormData(options) {
      if (!(this instanceof FormData)) {
        return new FormData(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    FormData.LINE_BREAK = "\r\n";
    FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData.prototype.append = function(field, value, options) {
      options = options || {};
      if (typeof options == "string") {
        options = {filename: options};
      }
      var append = CombinedStream.prototype.append.bind(this);
      if (typeof value == "number") {
        value = "" + value;
      }
      if (util.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append(header);
      append(value);
      append(footer);
      this._trackLength(header, value, options);
    };
    FormData.prototype._trackLength = function(header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += +options.knownLength;
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
      if (!value || !value.path && !(value.readable && value.hasOwnProperty("httpVersion")) && !(value instanceof Stream)) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData.prototype._lengthRetriever = function(value, callback) {
      if (value.hasOwnProperty("fd")) {
        if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs.stat(value.path, function(err, stat) {
            var fileSize;
            if (err) {
              callback(err);
              return;
            }
            fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
      } else if (value.hasOwnProperty("httpModule")) {
        value.on("response", function(response) {
          value.pause();
          callback(null, +response.headers["content-length"]);
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData.prototype._multiPartHeader = function(field, value, options) {
      if (typeof options.header == "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
        "Content-Type": [].concat(contentType || [])
      };
      if (typeof options.header == "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (!headers.hasOwnProperty(prop))
          continue;
        header = headers[prop];
        if (header == null) {
          continue;
        }
        if (!Array.isArray(header)) {
          header = [header];
        }
        if (header.length) {
          contents += prop + ": " + header.join("; ") + FormData.LINE_BREAK;
        }
      }
      return "--" + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
    };
    FormData.prototype._getContentDisposition = function(value, options) {
      var filename, contentDisposition;
      if (typeof options.filepath === "string") {
        filename = path.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value.name || value.path) {
        filename = path.basename(options.filename || value.name || value.path);
      } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        filename = path.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        contentDisposition = 'filename="' + filename + '"';
      }
      return contentDisposition;
    };
    FormData.prototype._getContentType = function(value, options) {
      var contentType = options.contentType;
      if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (!contentType && value.readable && value.hasOwnProperty("httpVersion")) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && typeof value == "object") {
        contentType = FormData.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData.prototype._multiPartFooter = function() {
      return function(next) {
        var footer = FormData.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData.prototype._lastBoundary = function() {
      return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK;
    };
    FormData.prototype.getHeaders = function(userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
      };
      for (header in userHeaders) {
        if (userHeaders.hasOwnProperty(header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData.prototype.setBoundary = function(boundary) {
      this._boundary = boundary;
    };
    FormData.prototype.getBoundary = function() {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData.prototype.getBuffer = function() {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== "function") {
          if (Buffer.isBuffer(this._streams[i])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
          }
          if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData.LINE_BREAK)]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData.prototype._generateBoundary = function() {
      var boundary = "--------------------------";
      for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
      }
      this._boundary = boundary;
    };
    FormData.prototype.getLengthSync = function() {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(new Error("Cannot calculate proper length in synchronous way."));
      }
      return knownLength;
    };
    FormData.prototype.hasKnownLength = function() {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData.prototype.getLength = function(cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
          cb(err);
          return;
        }
        values.forEach(function(length) {
          knownLength += length;
        });
        cb(null, knownLength);
      });
    };
    FormData.prototype.submit = function(params, cb) {
      var request, options, defaults = {method: "post"};
      if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
          port: params.port,
          path: params.pathname,
          host: params.hostname,
          protocol: params.protocol
        }, defaults);
      } else {
        options = populate(params, defaults);
        if (!options.port) {
          options.port = options.protocol == "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol == "https:") {
        request = https.request(options);
      } else {
        request = http.request(options);
      }
      this.getLength(function(err, length) {
        if (err && err !== "Unknown stream") {
          this._error(err);
          return;
        }
        if (length) {
          request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
          var onResponse;
          var callback = function(error, responce) {
            request.removeListener("error", callback);
            request.removeListener("response", onResponse);
            return cb.call(this, error, responce);
          };
          onResponse = callback.bind(this, null);
          request.on("error", callback);
          request.on("response", onResponse);
        }
      }.bind(this));
      return request;
    };
    FormData.prototype._error = function(err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData.prototype.toString = function() {
      return "[object FormData]";
    };
  }
});

// node_modules/.pnpm/li@1.3.0/node_modules/li/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/li@1.3.0/node_modules/li/lib/index.js"(exports2, module2) {
    (function(name, definition, context) {
      if (typeof module2 != "undefined" && module2.exports)
        module2.exports = definition();
      else if (typeof context["define"] == "function" && context["define"]["amd"])
        define(definition);
      else
        context[name] = definition();
    })("li", function() {
      var relsRegExp = /^;\s*([^"=]+)=(?:"([^"]+)"|([^";,]+)(?:[;,]|$))/;
      var sourceRegExp = /^<([^>]*)>/;
      var delimiterRegExp = /^\s*,\s*/;
      return {
        parse: function(linksHeader, options) {
          var match;
          var source;
          var rels;
          var extended = options && options.extended || false;
          var links = [];
          while (linksHeader) {
            linksHeader = linksHeader.trim();
            source = sourceRegExp.exec(linksHeader);
            if (!source)
              break;
            var current = {
              link: source[1]
            };
            linksHeader = linksHeader.slice(source[0].length);
            var nextDelimiter = linksHeader.match(delimiterRegExp);
            while (linksHeader && (!nextDelimiter || nextDelimiter.index > 0)) {
              match = relsRegExp.exec(linksHeader);
              if (!match)
                break;
              linksHeader = linksHeader.slice(match[0].length);
              nextDelimiter = linksHeader.match(delimiterRegExp);
              if (match[1] === "rel" || match[1] === "rev") {
                rels = (match[2] || match[3]).split(/\s+/);
                current[match[1]] = rels;
              } else {
                current[match[1]] = match[2] || match[3];
              }
            }
            links.push(current);
            linksHeader = linksHeader.replace(delimiterRegExp, "");
          }
          if (!extended) {
            return links.reduce(function(result, currentLink) {
              if (currentLink.rel) {
                currentLink.rel.forEach(function(rel) {
                  result[rel] = currentLink.link;
                });
              }
              return result;
            }, {});
          }
          return links;
        },
        stringify: function(params) {
          var grouped = Object.keys(params).reduce(function(grouped2, key) {
            grouped2[params[key]] = grouped2[params[key]] || [];
            grouped2[params[key]].push(key);
            return grouped2;
          }, {});
          var entries = Object.keys(grouped).reduce(function(result, link) {
            return result.concat("<" + link + '>; rel="' + grouped[link].join(" ") + '"');
          }, []);
          return entries.join(", ");
        }
      };
    }, exports2);
  }
});

// node_modules/.pnpm/xcase@2.0.1/node_modules/xcase/es5/index.js
var require_es5 = __commonJS({
  "node_modules/.pnpm/xcase@2.0.1/node_modules/xcase/es5/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };
    function isLower(char) {
      return char >= 97 && char <= 122;
    }
    function isUpper(char) {
      return char >= 65 && char <= 90;
    }
    function isDigit(char) {
      return char >= 48 && char <= 57;
    }
    function toUpper(char) {
      return char - 32;
    }
    function toUpperSafe(char) {
      if (isLower(char)) {
        return char - 32;
      }
      return char;
    }
    function toLower(char) {
      return char + 32;
    }
    function camelize$1(str, separator) {
      var firstChar = str.charCodeAt(0);
      if (isDigit(firstChar) || isUpper(firstChar) || firstChar == separator) {
        return str;
      }
      var out = [];
      var changed = false;
      if (isUpper(firstChar)) {
        changed = true;
        out.push(toLower(firstChar));
      } else {
        out.push(firstChar);
      }
      var length = str.length;
      for (var i = 1; i < length; ++i) {
        var c = str.charCodeAt(i);
        if (c === separator) {
          changed = true;
          c = str.charCodeAt(++i);
          if (isNaN(c)) {
            return str;
          }
          out.push(toUpperSafe(c));
        } else {
          out.push(c);
        }
      }
      return changed ? String.fromCharCode.apply(void 0, out) : str;
    }
    function decamelize$1(str, separator) {
      var firstChar = str.charCodeAt(0);
      if (!isLower(firstChar)) {
        return str;
      }
      var length = str.length;
      var changed = false;
      var out = [];
      for (var i = 0; i < length; ++i) {
        var c = str.charCodeAt(i);
        if (isUpper(c)) {
          out.push(separator);
          out.push(toLower(c));
          changed = true;
        } else {
          out.push(c);
        }
      }
      return changed ? String.fromCharCode.apply(void 0, out) : str;
    }
    function pascalize$1(str, separator) {
      var firstChar = str.charCodeAt(0);
      if (isDigit(firstChar) || firstChar == separator) {
        return str;
      }
      var length = str.length;
      var changed = false;
      var out = [];
      for (var i = 0; i < length; ++i) {
        var c = str.charCodeAt(i);
        if (c === separator) {
          changed = true;
          c = str.charCodeAt(++i);
          if (isNaN(c)) {
            return str;
          }
          out.push(toUpperSafe(c));
        } else if (i === 0 && isLower(c)) {
          changed = true;
          out.push(toUpper(c));
        } else {
          out.push(c);
        }
      }
      return changed ? String.fromCharCode.apply(void 0, out) : str;
    }
    function depascalize$1(str, separator) {
      var firstChar = str.charCodeAt(0);
      if (!isUpper(firstChar)) {
        return str;
      }
      var length = str.length;
      var changed = false;
      var out = [];
      for (var i = 0; i < length; ++i) {
        var c = str.charCodeAt(i);
        if (isUpper(c)) {
          if (i > 0) {
            out.push(separator);
          }
          out.push(toLower(c));
          changed = true;
        } else {
          out.push(c);
        }
      }
      return changed ? String.fromCharCode.apply(void 0, out) : str;
    }
    function shouldProcessValue(value) {
      return value && (typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && !(value instanceof Date) && !(value instanceof Function);
    }
    function processKeys(obj, fun, opts) {
      var obj2 = void 0;
      if (obj instanceof Array) {
        obj2 = [];
      } else {
        if (typeof obj.prototype !== "undefined") {
          return obj;
        }
        obj2 = {};
      }
      for (var key in obj) {
        var value = obj[key];
        if (typeof key === "string")
          key = fun(key, opts && opts.separator);
        if (shouldProcessValue(value)) {
          obj2[key] = processKeys(value, fun, opts);
        } else {
          obj2[key] = value;
        }
      }
      return obj2;
    }
    function processKeysInPlace(obj, fun, opts) {
      var keys = Object.keys(obj);
      for (var idx = 0; idx < keys.length; ++idx) {
        var key = keys[idx];
        var value = obj[key];
        var newKey = fun(key, opts && opts.separator);
        if (newKey !== key) {
          delete obj[key];
        }
        if (shouldProcessValue(value)) {
          obj[newKey] = processKeys(value, fun, opts);
        } else {
          obj[newKey] = value;
        }
      }
      return obj;
    }
    function camelize$$1(str, separator) {
      return camelize$1(str, separator && separator.charCodeAt(0) || 95);
    }
    function decamelize$$1(str, separator) {
      return decamelize$1(str, separator && separator.charCodeAt(0) || 95);
    }
    function pascalize$$1(str, separator) {
      return pascalize$1(str, separator && separator.charCodeAt(0) || 95);
    }
    function depascalize$$1(str, separator) {
      return depascalize$1(str, separator && separator.charCodeAt(0) || 95);
    }
    function camelizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj))
        return obj;
      if (opts.inPlace)
        return processKeysInPlace(obj, camelize$$1, opts);
      return processKeys(obj, camelize$$1, opts);
    }
    function decamelizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj))
        return obj;
      if (opts.inPlace)
        return processKeysInPlace(obj, decamelize$$1, opts);
      return processKeys(obj, decamelize$$1, opts);
    }
    function pascalizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj))
        return obj;
      if (opts.inPlace)
        return processKeysInPlace(obj, pascalize$$1, opts);
      return processKeys(obj, pascalize$$1, opts);
    }
    function depascalizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj))
        return obj;
      if (opts.inPlace)
        return processKeysInPlace(obj, depascalize$$1, opts);
      return processKeys(obj, depascalize$$1, opts);
    }
    exports2.camelize = camelize$$1;
    exports2.decamelize = decamelize$$1;
    exports2.pascalize = pascalize$$1;
    exports2.depascalize = depascalize$$1;
    exports2.camelizeKeys = camelizeKeys;
    exports2.decamelizeKeys = decamelizeKeys;
    exports2.pascalizeKeys = pascalizeKeys;
    exports2.depascalizeKeys = depascalizeKeys;
  }
});

// node_modules/.pnpm/strict-uri-encode@2.0.0/node_modules/strict-uri-encode/index.js
var require_strict_uri_encode = __commonJS({
  "node_modules/.pnpm/strict-uri-encode@2.0.0/node_modules/strict-uri-encode/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
  }
});

// node_modules/.pnpm/decode-uri-component@0.2.0/node_modules/decode-uri-component/index.js
var require_decode_uri_component = __commonJS({
  "node_modules/.pnpm/decode-uri-component@0.2.0/node_modules/decode-uri-component/index.js"(exports2, module2) {
    "use strict";
    var token = "%[a-f0-9]{2}";
    var singleMatcher = new RegExp(token, "gi");
    var multiMatcher = new RegExp("(" + token + ")+", "gi");
    function decodeComponents(components, split) {
      try {
        return decodeURIComponent(components.join(""));
      } catch (err) {
      }
      if (components.length === 1) {
        return components;
      }
      split = split || 1;
      var left = components.slice(0, split);
      var right = components.slice(split);
      return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }
    function decode(input) {
      try {
        return decodeURIComponent(input);
      } catch (err) {
        var tokens = input.match(singleMatcher);
        for (var i = 1; i < tokens.length; i++) {
          input = decodeComponents(tokens, i).join("");
          tokens = input.match(singleMatcher);
        }
        return input;
      }
    }
    function customDecodeURIComponent(input) {
      var replaceMap = {
        "%FE%FF": "\uFFFD\uFFFD",
        "%FF%FE": "\uFFFD\uFFFD"
      };
      var match = multiMatcher.exec(input);
      while (match) {
        try {
          replaceMap[match[0]] = decodeURIComponent(match[0]);
        } catch (err) {
          var result = decode(match[0]);
          if (result !== match[0]) {
            replaceMap[match[0]] = result;
          }
        }
        match = multiMatcher.exec(input);
      }
      replaceMap["%C2"] = "\uFFFD";
      var entries = Object.keys(replaceMap);
      for (var i = 0; i < entries.length; i++) {
        var key = entries[i];
        input = input.replace(new RegExp(key, "g"), replaceMap[key]);
      }
      return input;
    }
    module2.exports = function(encodedURI) {
      if (typeof encodedURI !== "string") {
        throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
      }
      try {
        encodedURI = encodedURI.replace(/\+/g, " ");
        return decodeURIComponent(encodedURI);
      } catch (err) {
        return customDecodeURIComponent(encodedURI);
      }
    };
  }
});

// node_modules/.pnpm/split-on-first@1.1.0/node_modules/split-on-first/index.js
var require_split_on_first = __commonJS({
  "node_modules/.pnpm/split-on-first@1.1.0/node_modules/split-on-first/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (string, separator) => {
      if (!(typeof string === "string" && typeof separator === "string")) {
        throw new TypeError("Expected the arguments to be of type `string`");
      }
      if (separator === "") {
        return [string];
      }
      const separatorIndex = string.indexOf(separator);
      if (separatorIndex === -1) {
        return [string];
      }
      return [
        string.slice(0, separatorIndex),
        string.slice(separatorIndex + separator.length)
      ];
    };
  }
});

// node_modules/.pnpm/filter-obj@1.1.0/node_modules/filter-obj/index.js
var require_filter_obj = __commonJS({
  "node_modules/.pnpm/filter-obj@1.1.0/node_modules/filter-obj/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(obj, predicate) {
      var ret = {};
      var keys = Object.keys(obj);
      var isArr = Array.isArray(predicate);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = obj[key];
        if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
          ret[key] = val;
        }
      }
      return ret;
    };
  }
});

// node_modules/.pnpm/query-string@7.0.0/node_modules/query-string/index.js
var require_query_string = __commonJS({
  "node_modules/.pnpm/query-string@7.0.0/node_modules/query-string/index.js"(exports2) {
    "use strict";
    var strictUriEncode = require_strict_uri_encode();
    var decodeComponent = require_decode_uri_component();
    var splitOnFirst = require_split_on_first();
    var filterObject = require_filter_obj();
    var isNullOrUndefined = (value) => value === null || value === void 0;
    function encoderForArrayFormat(options) {
      switch (options.arrayFormat) {
        case "index":
          return (key) => (result, value) => {
            const index = result.length;
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[", index, "]"].join("")];
            }
            return [
              ...result,
              [encode(key, options), "[", encode(index, options), "]=", encode(value, options)].join("")
            ];
          };
        case "bracket":
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[]"].join("")];
            }
            return [...result, [encode(key, options), "[]=", encode(value, options)].join("")];
          };
        case "comma":
        case "separator":
        case "bracket-separator": {
          const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            value = value === null ? "" : value;
            if (result.length === 0) {
              return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
            }
            return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
          };
        }
        default:
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, encode(key, options)];
            }
            return [...result, [encode(key, options), "=", encode(value, options)].join("")];
          };
      }
    }
    function parserForArrayFormat(options) {
      let result;
      switch (options.arrayFormat) {
        case "index":
          return (key, value, accumulator) => {
            result = /\[(\d*)\]$/.exec(key);
            key = key.replace(/\[\d*\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = {};
            }
            accumulator[key][result[1]] = value;
          };
        case "bracket":
          return (key, value, accumulator) => {
            result = /(\[\])$/.exec(key);
            key = key.replace(/\[\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        case "comma":
        case "separator":
          return (key, value, accumulator) => {
            const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
            const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
            value = isEncodedArray ? decode(value, options) : value;
            const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
            accumulator[key] = newValue;
          };
        case "bracket-separator":
          return (key, value, accumulator) => {
            const isArray = /(\[\])$/.test(key);
            key = key.replace(/\[\]$/, "");
            if (!isArray) {
              accumulator[key] = value ? decode(value, options) : value;
              return;
            }
            const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
            if (accumulator[key] === void 0) {
              accumulator[key] = arrayValue;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], arrayValue);
          };
        default:
          return (key, value, accumulator) => {
            if (accumulator[key] === void 0) {
              accumulator[key] = value;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
      }
    }
    function validateArrayFormatSeparator(value) {
      if (typeof value !== "string" || value.length !== 1) {
        throw new TypeError("arrayFormatSeparator must be single character string");
      }
    }
    function encode(value, options) {
      if (options.encode) {
        return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
      }
      return value;
    }
    function decode(value, options) {
      if (options.decode) {
        return decodeComponent(value);
      }
      return value;
    }
    function keysSorter(input) {
      if (Array.isArray(input)) {
        return input.sort();
      }
      if (typeof input === "object") {
        return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
      }
      return input;
    }
    function removeHash(input) {
      const hashStart = input.indexOf("#");
      if (hashStart !== -1) {
        input = input.slice(0, hashStart);
      }
      return input;
    }
    function getHash(url) {
      let hash = "";
      const hashStart = url.indexOf("#");
      if (hashStart !== -1) {
        hash = url.slice(hashStart);
      }
      return hash;
    }
    function extract(input) {
      input = removeHash(input);
      const queryStart = input.indexOf("?");
      if (queryStart === -1) {
        return "";
      }
      return input.slice(queryStart + 1);
    }
    function parseValue(value, options) {
      if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
        value = Number(value);
      } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
        value = value.toLowerCase() === "true";
      }
      return value;
    }
    function parse(query, options) {
      options = Object.assign({
        decode: true,
        sort: true,
        arrayFormat: "none",
        arrayFormatSeparator: ",",
        parseNumbers: false,
        parseBooleans: false
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const formatter = parserForArrayFormat(options);
      const ret = Object.create(null);
      if (typeof query !== "string") {
        return ret;
      }
      query = query.trim().replace(/^[?#&]/, "");
      if (!query) {
        return ret;
      }
      for (const param of query.split("&")) {
        if (param === "") {
          continue;
        }
        let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, " ") : param, "=");
        value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
        formatter(decode(key, options), value, ret);
      }
      for (const key of Object.keys(ret)) {
        const value = ret[key];
        if (typeof value === "object" && value !== null) {
          for (const k of Object.keys(value)) {
            value[k] = parseValue(value[k], options);
          }
        } else {
          ret[key] = parseValue(value, options);
        }
      }
      if (options.sort === false) {
        return ret;
      }
      return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
        const value = ret[key];
        if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
          result[key] = keysSorter(value);
        } else {
          result[key] = value;
        }
        return result;
      }, Object.create(null));
    }
    exports2.extract = extract;
    exports2.parse = parse;
    exports2.stringify = (object, options) => {
      if (!object) {
        return "";
      }
      options = Object.assign({
        encode: true,
        strict: true,
        arrayFormat: "none",
        arrayFormatSeparator: ","
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
      const formatter = encoderForArrayFormat(options);
      const objectCopy = {};
      for (const key of Object.keys(object)) {
        if (!shouldFilter(key)) {
          objectCopy[key] = object[key];
        }
      }
      const keys = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys.sort(options.sort);
      }
      return keys.map((key) => {
        const value = object[key];
        if (value === void 0) {
          return "";
        }
        if (value === null) {
          return encode(key, options);
        }
        if (Array.isArray(value)) {
          if (value.length === 0 && options.arrayFormat === "bracket-separator") {
            return encode(key, options) + "[]";
          }
          return value.reduce(formatter(key), []).join("&");
        }
        return encode(key, options) + "=" + encode(value, options);
      }).filter((x) => x.length > 0).join("&");
    };
    exports2.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign({
        url: url_.split("?")[0] || "",
        query: parse(extract(url), options)
      }, options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {});
    };
    exports2.stringifyUrl = (object, options) => {
      options = Object.assign({
        encode: true,
        strict: true
      }, options);
      const url = removeHash(object.url).split("?")[0] || "";
      const queryFromUrl = exports2.extract(object.url);
      const parsedQueryFromUrl = exports2.parse(queryFromUrl, {sort: false});
      const query = Object.assign(parsedQueryFromUrl, object.query);
      let queryString = exports2.stringify(query, options);
      if (queryString) {
        queryString = `?${queryString}`;
      }
      let hash = getHash(object.url);
      if (object.fragmentIdentifier) {
        hash = `#${encode(object.fragmentIdentifier, options)}`;
      }
      return `${url}${queryString}${hash}`;
    };
    exports2.pick = (input, filter, options) => {
      options = Object.assign({
        parseFragmentIdentifier: true
      }, options);
      const {url, query, fragmentIdentifier} = exports2.parseUrl(input, options);
      return exports2.stringifyUrl({
        url,
        query: filterObject(query, filter),
        fragmentIdentifier
      }, options);
    };
    exports2.exclude = (input, filter, options) => {
      const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
      return exports2.pick(input, exclusionFilter, options);
    };
  }
});

// node_modules/.pnpm/@gitbeaker+requester-utils@28.4.1/node_modules/@gitbeaker/requester-utils/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/@gitbeaker+requester-utils@28.4.1/node_modules/@gitbeaker/requester-utils/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var xcase = require_es5();
    var queryString = require_query_string();
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = {label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: []}, f, y, t, g;
      return g = {next: verb(0), "throw": verb(1), "return": verb(2)}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return {value: op[1], done: false};
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return {value: op[0] ? op[1] : void 0, done: true};
      }
    }
    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = {error};
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    }
    function __spreadArray(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    }
    function formatQuery(params) {
      if (params === void 0) {
        params = {};
      }
      var decamelized = xcase.decamelizeKeys(params);
      if (decamelized.not)
        decamelized.not = JSON.stringify(decamelized.not);
      return queryString.stringify(decamelized, {arrayFormat: "bracket"});
    }
    function defaultOptionsHandler(serviceOptions, _a) {
      var _b = _a === void 0 ? {} : _a, body = _b.body, query = _b.query, sudo = _b.sudo, _c = _b.method, method = _c === void 0 ? "get" : _c;
      var headers = serviceOptions.headers, requestTimeout = serviceOptions.requestTimeout, url = serviceOptions.url;
      var bod;
      if (sudo)
        headers.sudo = sudo;
      if (typeof body === "object" && body.constructor.name !== "FormData") {
        bod = JSON.stringify(xcase.decamelizeKeys(body));
        headers["content-type"] = "application/json";
      } else {
        bod = body;
      }
      return {
        headers,
        timeout: requestTimeout,
        method,
        searchParams: formatQuery(query),
        prefixUrl: url,
        body: bod
      };
    }
    function createRequesterFn(optionsHandler, requestHandler) {
      var methods = ["get", "post", "put", "delete", "stream"];
      return function(serviceOptions) {
        var requester = {};
        methods.forEach(function(m) {
          requester[m] = function(endpoint, options) {
            var requestOptions = optionsHandler(serviceOptions, __assign(__assign({}, options), {method: m}));
            return requestHandler(endpoint, requestOptions);
          };
        });
        return requester;
      };
    }
    function extendClass(Base, customConfig) {
      return function(_super) {
        __extends(class_1, _super);
        function class_1() {
          var options = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
          }
          var _this = this;
          var _a = __read(options), config = _a[0], opts = _a.slice(1);
          _this = _super.apply(this, __spreadArray([__assign(__assign({}, customConfig), config)], __read(opts))) || this;
          return _this;
        }
        return class_1;
      }(Base);
    }
    function modifyServices(services, customConfig) {
      if (customConfig === void 0) {
        customConfig = {};
      }
      var updated = {};
      Object.entries(services).forEach(function(_a) {
        var _b = __read(_a, 2), k = _b[0], s = _b[1];
        updated[k] = extendClass(s, customConfig);
      });
      return updated;
    }
    function wait(ms) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, new Promise(function(resolve) {
            return setTimeout(resolve, ms);
          })];
        });
      });
    }
    var BaseService = function() {
      function BaseService2(_a) {
        var _b = _a === void 0 ? {} : _a, token = _b.token, jobToken = _b.jobToken, oauthToken = _b.oauthToken, sudo = _b.sudo, profileToken = _b.profileToken, requesterFn = _b.requesterFn, _c = _b.profileMode, profileMode = _c === void 0 ? "execution" : _c, _d = _b.host, host = _d === void 0 ? "https://gitlab.com" : _d, _e = _b.prefixUrl, prefixUrl = _e === void 0 ? "" : _e, _f = _b.version, version = _f === void 0 ? 4 : _f, _g = _b.camelize, camelize = _g === void 0 ? false : _g, _h = _b.rejectUnauthorized, rejectUnauthorized = _h === void 0 ? true : _h, _j = _b.requestTimeout, requestTimeout = _j === void 0 ? 3e5 : _j;
        if (!requesterFn)
          throw new ReferenceError("requesterFn must be passed");
        this.url = [host, "api", "v" + version, prefixUrl].join("/");
        this.headers = {
          "user-agent": "gitbeaker"
        };
        this.rejectUnauthorized = rejectUnauthorized;
        this.camelize = camelize;
        this.requestTimeout = requestTimeout;
        if (oauthToken)
          this.headers.authorization = "Bearer " + oauthToken;
        else if (jobToken)
          this.headers["job-token"] = jobToken;
        else if (token)
          this.headers["private-token"] = token;
        if (profileToken) {
          this.headers["X-Profile-Token"] = profileToken;
          this.headers["X-Profile-Mode"] = profileMode;
        }
        if (sudo)
          this.headers.Sudo = "" + sudo;
        this.requester = requesterFn(__assign({}, this));
      }
      return BaseService2;
    }();
    exports2.BaseService = BaseService;
    exports2.createRequesterFn = createRequesterFn;
    exports2.defaultOptionsHandler = defaultOptionsHandler;
    exports2.formatQuery = formatQuery;
    exports2.modifyServices = modifyServices;
    exports2.wait = wait;
  }
});

// node_modules/.pnpm/@gitbeaker+core@28.4.1/node_modules/@gitbeaker/core/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/.pnpm/@gitbeaker+core@28.4.1/node_modules/@gitbeaker/core/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var FormData = require_form_data();
    var li = require_lib();
    var xcase = require_es5();
    var requesterUtils = require_dist();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : {"default": e};
    }
    var FormData__default = /* @__PURE__ */ _interopDefaultLegacy(FormData);
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    }
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = {label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: []}, f, y, t, g;
      return g = {next: verb(0), "throw": verb(1), "return": verb(2)}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return {value: op[1], done: false};
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return {value: op[0] ? op[1] : void 0, done: true};
      }
    }
    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = {error};
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    }
    function __spreadArray(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    }
    function bundler(services) {
      return function Bundle(options) {
        var _this = this;
        Object.entries(services).forEach(function(_a) {
          var _b = __read(_a, 2), name = _b[0], Ser = _b[1];
          _this[name] = new Ser(options);
        });
      };
    }
    function appendFormFromObject(object) {
      var form = new FormData__default["default"]();
      Object.entries(object).forEach(function(_a) {
        var _b = __read(_a, 2), k = _b[0], v = _b[1];
        if (Array.isArray(v))
          form.append(k, v[0], v[1]);
        else
          form.append(k, v);
      });
      return form;
    }
    function getHelper(service, endpoint, _a, acc) {
      if (_a === void 0) {
        _a = {};
      }
      if (acc === void 0) {
        acc = [];
      }
      var sudo = _a.sudo, showExpanded = _a.showExpanded, maxPages = _a.maxPages, query = __rest(_a, ["sudo", "showExpanded", "maxPages"]);
      return __awaiter(this, void 0, void 0, function() {
        var response, headers, status, body, newAcc, next, withinBounds, leaf, regex;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, service.requester.get(endpoint, {query, sudo})];
            case 1:
              response = _b.sent();
              headers = response.headers, status = response.status;
              body = response.body;
              if (service.camelize)
                body = xcase.camelizeKeys(body);
              if (!Array.isArray(body)) {
                if (!showExpanded)
                  return [2, body];
                return [2, {
                  data: body,
                  headers,
                  status
                }];
              }
              newAcc = __spreadArray(__spreadArray([], __read(acc)), __read(body));
              next = li.parse(headers.link).next;
              withinBounds = maxPages ? newAcc.length / (query.perPage || 20) < maxPages : true;
              if (!query.page && next && withinBounds) {
                leaf = service.url.split("/").pop() || "";
                regex = new RegExp(".+/api/v\\d(/" + leaf + ")?/");
                return [2, getHelper(service, next.replace(regex, ""), {
                  maxPages,
                  sudo
                }, newAcc)];
              }
              if (!showExpanded || query.pagination === "keyset")
                return [2, newAcc];
              return [2, {
                data: newAcc,
                paginationInfo: {
                  total: parseInt(headers["x-total"], 10),
                  next: parseInt(headers["x-next-page"], 10) || null,
                  current: parseInt(headers["x-page"], 10) || 1,
                  previous: parseInt(headers["x-prev-page"], 10) || null,
                  perPage: parseInt(headers["x-per-page"], 10),
                  totalPages: parseInt(headers["x-total-pages"], 10)
                }
              }];
          }
        });
      });
    }
    function get(service, endpoint, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, getHelper(service, endpoint, options)];
        });
      });
    }
    function post(service, endpoint, _a) {
      if (_a === void 0) {
        _a = {};
      }
      var isForm = _a.isForm, sudo = _a.sudo, showExpanded = _a.showExpanded, options = __rest(_a, ["isForm", "sudo", "showExpanded"]);
      return __awaiter(this, void 0, void 0, function() {
        var body, r;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              body = isForm ? appendFormFromObject(options) : options;
              return [4, service.requester.post(endpoint, {
                body,
                sudo
              })];
            case 1:
              r = _b.sent();
              return [2, showExpanded ? {
                data: r.body,
                status: r.status,
                headers: r.headers
              } : r.body];
          }
        });
      });
    }
    function put(service, endpoint, _a) {
      if (_a === void 0) {
        _a = {};
      }
      var sudo = _a.sudo, showExpanded = _a.showExpanded, body = __rest(_a, ["sudo", "showExpanded"]);
      return __awaiter(this, void 0, void 0, function() {
        var r;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, service.requester.put(endpoint, {
                body,
                sudo
              })];
            case 1:
              r = _b.sent();
              return [2, showExpanded ? {data: r.body, status: r.status, headers: r.headers} : r.body];
          }
        });
      });
    }
    function del(service, endpoint, _a) {
      if (_a === void 0) {
        _a = {};
      }
      var sudo = _a.sudo, showExpanded = _a.showExpanded, query = __rest(_a, ["sudo", "showExpanded"]);
      return __awaiter(this, void 0, void 0, function() {
        var r;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, service.requester.delete(endpoint, {
                query,
                sudo
              })];
            case 1:
              r = _b.sent();
              return [2, showExpanded ? {data: r.body, status: r.status, headers: r.headers} : r.body];
          }
        });
      });
    }
    function stream(service, endpoint, options) {
      if (typeof service.requester.stream !== "function") {
        throw new Error("Stream method is not implementated in requester!");
      }
      return service.requester.stream(endpoint, {
        query: options
      });
    }
    var RequestHelper = {
      post,
      put,
      get,
      del,
      stream
    };
    var Groups = function(_super) {
      __extends(Groups2, _super);
      function Groups2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Groups2.prototype.all = function(options) {
        return RequestHelper.get(this, "groups", options);
      };
      Groups2.prototype.create = function(name, path, options) {
        return RequestHelper.post(this, "groups", __assign({name, path}, options));
      };
      Groups2.prototype.createLDAPLink = function(groupId, cn, groupAccess, provider, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.post(this, "groups/" + gId + "/ldap_group_links", __assign({
          cn,
          groupAccess,
          provider
        }, options));
      };
      Groups2.prototype.edit = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.put(this, "groups/" + gId, options);
      };
      Groups2.prototype.projects = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.get(this, "groups/" + gId + "/projects", options);
      };
      Groups2.prototype.remove = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.del(this, "groups/" + gId, options);
      };
      Groups2.prototype.removeLDAPLink = function(groupId, cn, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var provider = _a.provider, options = __rest(_a, ["provider"]);
        var gId = encodeURIComponent(groupId);
        var url2 = provider ? provider + "/" + cn : "" + cn;
        return RequestHelper.del(this, "groups/" + gId + "/ldap_group_links/" + url2, options);
      };
      Groups2.prototype.search = function(nameOrPath, options) {
        return RequestHelper.get(this, "groups", __assign({search: nameOrPath}, options));
      };
      Groups2.prototype.show = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.get(this, "groups/" + gId, options);
      };
      Groups2.prototype.subgroups = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.get(this, "groups/" + gId + "/subgroups", options);
      };
      Groups2.prototype.syncLDAP = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.post(this, "groups/" + gId + "/ldap_sync", options);
      };
      return Groups2;
    }(requesterUtils.BaseService);
    var ResourceAccessRequests = function(_super) {
      __extends(ResourceAccessRequests2, _super);
      function ResourceAccessRequests2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceAccessRequests2.prototype.all = function(resourceId) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/access_requests");
      };
      ResourceAccessRequests2.prototype.request = function(resourceId) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.post(this, rId + "/access_requests");
      };
      ResourceAccessRequests2.prototype.approve = function(resourceId, userId, options) {
        var _a = __read([resourceId, userId].map(encodeURIComponent), 2), rId = _a[0], uId = _a[1];
        return RequestHelper.post(this, rId + "/access_requests/" + uId + "/approve", options);
      };
      ResourceAccessRequests2.prototype.deny = function(resourceId, userId) {
        var _a = __read([resourceId, userId].map(encodeURIComponent), 2), rId = _a[0], uId = _a[1];
        return RequestHelper.del(this, rId + "/access_requests/" + uId);
      };
      return ResourceAccessRequests2;
    }(requesterUtils.BaseService);
    function url$4(projectId, resourceType, resourceId, noteId, awardId) {
      var _a = __read([projectId, resourceId, noteId].map(encodeURIComponent), 3), pId = _a[0], rId = _a[1], nId = _a[2];
      var output = [pId, resourceType, rId, "notes", nId, "award_emoji"];
      if (awardId)
        output.push(encodeURIComponent(awardId));
      return output.join("/");
    }
    var ResourceAwardEmojis = function(_super) {
      __extends(ResourceAwardEmojis2, _super);
      function ResourceAwardEmojis2(resourceType, options) {
        var _this = _super.call(this, __assign({prefixUrl: "projects"}, options)) || this;
        _this.resourceType = resourceType;
        return _this;
      }
      ResourceAwardEmojis2.prototype.all = function(projectId, resourceId, noteId, options) {
        return RequestHelper.get(this, url$4(projectId, this.resourceType, resourceId, noteId), options);
      };
      ResourceAwardEmojis2.prototype.award = function(projectId, resourceId, noteId, name, options) {
        return RequestHelper.post(this, url$4(projectId, this.resourceType, resourceId, noteId), __assign({name}, options));
      };
      ResourceAwardEmojis2.prototype.remove = function(projectId, resourceId, noteId, awardId, options) {
        return RequestHelper.del(this, url$4(projectId, this.resourceType, resourceId, noteId, awardId), options);
      };
      ResourceAwardEmojis2.prototype.show = function(projectId, resourceId, noteId, awardId, options) {
        return RequestHelper.get(this, url$4(projectId, this.resourceType, resourceId, noteId, awardId), options);
      };
      return ResourceAwardEmojis2;
    }(requesterUtils.BaseService);
    var ResourceBadges = function(_super) {
      __extends(ResourceBadges2, _super);
      function ResourceBadges2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceBadges2.prototype.add = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.post(this, rId + "/badges", options);
      };
      ResourceBadges2.prototype.all = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/badges", options);
      };
      ResourceBadges2.prototype.edit = function(resourceId, badgeId, options) {
        var _a = __read([resourceId, badgeId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.put(this, rId + "/badges/" + bId, options);
      };
      ResourceBadges2.prototype.preview = function(resourceId, linkUrl, imageUrl, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/badges/render", __assign({linkUrl, imageUrl}, options));
      };
      ResourceBadges2.prototype.remove = function(resourceId, badgeId, options) {
        var _a = __read([resourceId, badgeId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.del(this, rId + "/badges/" + bId, options);
      };
      ResourceBadges2.prototype.show = function(resourceId, badgeId, options) {
        var _a = __read([resourceId, badgeId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.get(this, rId + "/badges/" + bId, options);
      };
      return ResourceBadges2;
    }(requesterUtils.BaseService);
    var ResourceCustomAttributes = function(_super) {
      __extends(ResourceCustomAttributes2, _super);
      function ResourceCustomAttributes2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceCustomAttributes2.prototype.all = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/custom_attributes", options);
      };
      ResourceCustomAttributes2.prototype.set = function(resourceId, customAttributeId, value, options) {
        var _a = __read([resourceId, customAttributeId].map(encodeURIComponent), 2), rId = _a[0], cId = _a[1];
        return RequestHelper.put(this, rId + "/custom_attributes/" + cId, __assign({value}, options));
      };
      ResourceCustomAttributes2.prototype.remove = function(resourceId, customAttributeId, options) {
        var _a = __read([resourceId, customAttributeId].map(encodeURIComponent), 2), rId = _a[0], cId = _a[1];
        return RequestHelper.del(this, rId + "/custom_attributes/" + cId, options);
      };
      ResourceCustomAttributes2.prototype.show = function(resourceId, customAttributeId, options) {
        var _a = __read([resourceId, customAttributeId].map(encodeURIComponent), 2), rId = _a[0], cId = _a[1];
        return RequestHelper.get(this, rId + "/custom_attributes/" + cId, options);
      };
      return ResourceCustomAttributes2;
    }(requesterUtils.BaseService);
    var ResourceDeployTokens = function(_super) {
      __extends(ResourceDeployTokens2, _super);
      function ResourceDeployTokens2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceDeployTokens2.prototype.add = function(resourceId, tokenName, tokenScopes, options) {
        return RequestHelper.post(this, encodeURIComponent(resourceId) + "/deploy_tokens", __assign({name: tokenName, scopes: tokenScopes}, options));
      };
      ResourceDeployTokens2.prototype.all = function(_a) {
        var resourceId = _a.resourceId, options = __rest(_a, ["resourceId"]);
        var url2;
        if (resourceId) {
          url2 = encodeURIComponent(resourceId) + "/deploy_tokens";
        } else {
          url2 = "deploy_tokens";
        }
        return RequestHelper.get(this, url2, options);
      };
      ResourceDeployTokens2.prototype.remove = function(resourceId, tokenId, options) {
        var _a = __read([resourceId, tokenId].map(encodeURIComponent), 2), rId = _a[0], tId = _a[1];
        return RequestHelper.del(this, rId + "/deploy_tokens/" + tId, options);
      };
      return ResourceDeployTokens2;
    }(requesterUtils.BaseService);
    var ResourceDiscussions = function(_super) {
      __extends(ResourceDiscussions2, _super);
      function ResourceDiscussions2(resourceType, resource2Type, options) {
        var _this = _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
        _this.resource2Type = resource2Type;
        return _this;
      }
      ResourceDiscussions2.prototype.addNote = function(resourceId, resource2Id, discussionId, noteId, content, options) {
        var _a = __read([resourceId, resource2Id, discussionId, noteId].map(encodeURIComponent), 4), rId = _a[0], r2Id = _a[1], dId = _a[2], nId = _a[3];
        return RequestHelper.post(this, rId + "/" + this.resource2Type + "/" + r2Id + "/discussions/" + dId + "/notes", __assign({body: content, noteId: nId}, options));
      };
      ResourceDiscussions2.prototype.all = function(resourceId, resource2Id, options) {
        var _a = __read([resourceId, resource2Id].map(encodeURIComponent), 2), rId = _a[0], r2Id = _a[1];
        return RequestHelper.get(this, rId + "/" + this.resource2Type + "/" + r2Id + "/discussions", options);
      };
      ResourceDiscussions2.prototype.create = function(resourceId, resource2Id, content, options) {
        var _a = __read([resourceId, resource2Id].map(encodeURIComponent), 2), rId = _a[0], r2Id = _a[1];
        return RequestHelper.post(this, rId + "/" + this.resource2Type + "/" + r2Id + "/discussions", __assign({body: content}, options));
      };
      ResourceDiscussions2.prototype.editNote = function(resourceId, resource2Id, discussionId, noteId, content, options) {
        var _a = __read([resourceId, resource2Id, discussionId, noteId].map(encodeURIComponent), 4), rId = _a[0], r2Id = _a[1], dId = _a[2], nId = _a[3];
        return RequestHelper.put(this, rId + "/" + this.resource2Type + "/" + r2Id + "/discussions/" + dId + "/notes/" + nId, __assign({body: content}, options));
      };
      ResourceDiscussions2.prototype.removeNote = function(resourceId, resource2Id, discussionId, noteId, options) {
        var _a = __read([resourceId, resource2Id, discussionId, noteId].map(encodeURIComponent), 4), rId = _a[0], r2Id = _a[1], dId = _a[2], nId = _a[3];
        return RequestHelper.del(this, rId + "/" + this.resource2Type + "/" + r2Id + "/discussions/" + dId + "/notes/" + nId, options);
      };
      ResourceDiscussions2.prototype.show = function(resourceId, resource2Id, discussionId, options) {
        var _a = __read([resourceId, resource2Id, discussionId].map(encodeURIComponent), 3), rId = _a[0], r2Id = _a[1], dId = _a[2];
        return RequestHelper.get(this, rId + "/" + this.resource2Type + "/" + r2Id + "/discussions/" + dId, options);
      };
      return ResourceDiscussions2;
    }(requesterUtils.BaseService);
    var ResourceIssueBoards = function(_super) {
      __extends(ResourceIssueBoards2, _super);
      function ResourceIssueBoards2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceIssueBoards2.prototype.all = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/boards", options);
      };
      ResourceIssueBoards2.prototype.create = function(resourceId, name, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.post(this, rId + "/boards", __assign({name}, options));
      };
      ResourceIssueBoards2.prototype.createList = function(resourceId, boardId, labelId, options) {
        var _a = __read([resourceId, boardId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.post(this, rId + "/boards/" + bId + "/lists", __assign({labelId}, options));
      };
      ResourceIssueBoards2.prototype.edit = function(resourceId, boardId, options) {
        var _a = __read([resourceId, boardId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.put(this, rId + "/boards/" + bId, options);
      };
      ResourceIssueBoards2.prototype.editList = function(resourceId, boardId, listId, position, options) {
        var _a = __read([resourceId, boardId, listId].map(encodeURIComponent), 3), rId = _a[0], bId = _a[1], lId = _a[2];
        return RequestHelper.put(this, rId + "/boards/" + bId + "/lists/" + lId, __assign({position}, options));
      };
      ResourceIssueBoards2.prototype.lists = function(resourceId, boardId, options) {
        var _a = __read([resourceId, boardId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.get(this, rId + "/boards/" + bId + "/lists", options);
      };
      ResourceIssueBoards2.prototype.remove = function(resourceId, boardId, options) {
        var _a = __read([resourceId, boardId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.del(this, rId + "/boards/" + bId, options);
      };
      ResourceIssueBoards2.prototype.removeList = function(resourceId, boardId, listId, options) {
        var _a = __read([resourceId, boardId, listId].map(encodeURIComponent), 3), rId = _a[0], bId = _a[1], lId = _a[2];
        return RequestHelper.del(this, rId + "/boards/" + bId + "/lists/" + lId, options);
      };
      ResourceIssueBoards2.prototype.show = function(resourceId, boardId, options) {
        var _a = __read([resourceId, boardId].map(encodeURIComponent), 2), rId = _a[0], bId = _a[1];
        return RequestHelper.get(this, rId + "/boards/" + bId, options);
      };
      ResourceIssueBoards2.prototype.showList = function(resourceId, boardId, listId, options) {
        var _a = __read([resourceId, boardId, listId].map(encodeURIComponent), 3), rId = _a[0], bId = _a[1], lId = _a[2];
        return RequestHelper.get(this, rId + "/boards/" + bId + "/lists/" + lId, options);
      };
      return ResourceIssueBoards2;
    }(requesterUtils.BaseService);
    var ResourceLabels = function(_super) {
      __extends(ResourceLabels2, _super);
      function ResourceLabels2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceLabels2.prototype.all = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/labels", options);
      };
      ResourceLabels2.prototype.create = function(resourceId, labelName, color, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.post(this, rId + "/labels", __assign({name: labelName, color}, options));
      };
      ResourceLabels2.prototype.edit = function(resourceId, labelName, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.put(this, rId + "/labels", __assign({name: labelName}, options));
      };
      ResourceLabels2.prototype.remove = function(resourceId, labelName, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.del(this, rId + "/labels", __assign({name: labelName}, options));
      };
      ResourceLabels2.prototype.subscribe = function(resourceId, labelId, options) {
        var _a = __read([resourceId, labelId].map(encodeURIComponent), 2), rId = _a[0], lId = _a[1];
        return RequestHelper.post(this, rId + "/issues/" + lId + "/subscribe", options);
      };
      ResourceLabels2.prototype.unsubscribe = function(resourceId, labelId, options) {
        var _a = __read([resourceId, labelId].map(encodeURIComponent), 2), rId = _a[0], lId = _a[1];
        return RequestHelper.del(this, rId + "/issues/" + lId + "/unsubscribe", options);
      };
      return ResourceLabels2;
    }(requesterUtils.BaseService);
    var ResourceMembers = function(_super) {
      __extends(ResourceMembers2, _super);
      function ResourceMembers2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceMembers2.prototype.add = function(resourceId, userId, accessLevel, options) {
        var _a = __read([resourceId, userId].map(encodeURIComponent), 2), rId = _a[0], uId = _a[1];
        return RequestHelper.post(this, rId + "/members", __assign({userId: uId, accessLevel}, options));
      };
      ResourceMembers2.prototype.all = function(resourceId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var includeInherited = _a.includeInherited, options = __rest(_a, ["includeInherited"]);
        var rId = encodeURIComponent(resourceId);
        var url2 = [rId, "members"];
        if (includeInherited)
          url2.push("all");
        return RequestHelper.get(this, url2.join("/"), options);
      };
      ResourceMembers2.prototype.edit = function(resourceId, userId, accessLevel, options) {
        var _a = __read([resourceId, userId].map(encodeURIComponent), 2), rId = _a[0], uId = _a[1];
        return RequestHelper.put(this, rId + "/members/" + uId, __assign({accessLevel}, options));
      };
      ResourceMembers2.prototype.show = function(resourceId, userId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var includeInherited = _a.includeInherited, options = __rest(_a, ["includeInherited"]);
        var _b = __read([resourceId, userId].map(encodeURIComponent), 2), rId = _b[0], uId = _b[1];
        var url2 = [rId, "members"];
        if (includeInherited)
          url2.push("all");
        url2.push(uId);
        return RequestHelper.get(this, url2.join("/"), options);
      };
      ResourceMembers2.prototype.remove = function(resourceId, userId, options) {
        var _a = __read([resourceId, userId].map(encodeURIComponent), 2), rId = _a[0], uId = _a[1];
        return RequestHelper.del(this, rId + "/members/" + uId, options);
      };
      return ResourceMembers2;
    }(requesterUtils.BaseService);
    var ResourceMilestones = function(_super) {
      __extends(ResourceMilestones2, _super);
      function ResourceMilestones2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceMilestones2.prototype.all = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/milestones", options);
      };
      ResourceMilestones2.prototype.create = function(resourceId, title, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.post(this, rId + "/milestones", __assign({title}, options));
      };
      ResourceMilestones2.prototype.edit = function(resourceId, milestoneId, options) {
        var _a = __read([resourceId, milestoneId].map(encodeURIComponent), 2), rId = _a[0], mId = _a[1];
        return RequestHelper.put(this, rId + "/milestones/" + mId, options);
      };
      ResourceMilestones2.prototype.issues = function(resourceId, milestoneId, options) {
        var _a = __read([resourceId, milestoneId].map(encodeURIComponent), 2), rId = _a[0], mId = _a[1];
        return RequestHelper.get(this, rId + "/milestones/" + mId + "/issues", options);
      };
      ResourceMilestones2.prototype.mergeRequests = function(resourceId, milestoneId, options) {
        var _a = __read([resourceId, milestoneId].map(encodeURIComponent), 2), rId = _a[0], mId = _a[1];
        return RequestHelper.get(this, rId + "/milestones/" + mId + "/merge_requests", options);
      };
      ResourceMilestones2.prototype.show = function(resourceId, milestoneId, options) {
        var _a = __read([resourceId, milestoneId].map(encodeURIComponent), 2), rId = _a[0], mId = _a[1];
        return RequestHelper.get(this, rId + "/milestones/" + mId, options);
      };
      return ResourceMilestones2;
    }(requesterUtils.BaseService);
    var ResourceNotes = function(_super) {
      __extends(ResourceNotes2, _super);
      function ResourceNotes2(resourceType, resource2Type, options) {
        var _this = _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
        _this.resource2Type = resource2Type;
        return _this;
      }
      ResourceNotes2.prototype.all = function(resourceId, resource2Id, options) {
        var _a = __read([resourceId, resource2Id].map(encodeURIComponent), 2), rId = _a[0], r2Id = _a[1];
        return RequestHelper.get(this, rId + "/" + this.resource2Type + "/" + r2Id + "/notes", options);
      };
      ResourceNotes2.prototype.create = function(resourceId, resource2Id, body, options) {
        var _a = __read([resourceId, resource2Id].map(encodeURIComponent), 2), rId = _a[0], r2Id = _a[1];
        return RequestHelper.post(this, rId + "/" + this.resource2Type + "/" + r2Id + "/notes", __assign({body}, options));
      };
      ResourceNotes2.prototype.edit = function(resourceId, resource2Id, noteId, body, options) {
        var _a = __read([resourceId, resource2Id, noteId].map(encodeURIComponent), 3), rId = _a[0], r2Id = _a[1], nId = _a[2];
        return RequestHelper.put(this, rId + "/" + this.resource2Type + "/" + r2Id + "/notes/" + nId, __assign({body}, options));
      };
      ResourceNotes2.prototype.remove = function(resourceId, resource2Id, noteId, options) {
        var _a = __read([resourceId, resource2Id, noteId].map(encodeURIComponent), 3), rId = _a[0], r2Id = _a[1], nId = _a[2];
        return RequestHelper.del(this, rId + "/" + this.resource2Type + "/" + r2Id + "/notes/" + nId, options);
      };
      ResourceNotes2.prototype.show = function(resourceId, resource2Id, noteId, options) {
        var _a = __read([resourceId, resource2Id, noteId].map(encodeURIComponent), 3), rId = _a[0], r2Id = _a[1], nId = _a[2];
        return RequestHelper.get(this, rId + "/" + this.resource2Type + "/" + r2Id + "/notes/" + nId, options);
      };
      return ResourceNotes2;
    }(requesterUtils.BaseService);
    var ResourceTemplates = function(_super) {
      __extends(ResourceTemplates2, _super);
      function ResourceTemplates2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: ["templates", resourceType].join("/")}, options)) || this;
      }
      ResourceTemplates2.prototype.all = function(options) {
        return RequestHelper.get(this, "", options);
      };
      ResourceTemplates2.prototype.show = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, "" + rId, options);
      };
      return ResourceTemplates2;
    }(requesterUtils.BaseService);
    var ResourceVariables = function(_super) {
      __extends(ResourceVariables2, _super);
      function ResourceVariables2(resourceType, options) {
        return _super.call(this, __assign({prefixUrl: resourceType}, options)) || this;
      }
      ResourceVariables2.prototype.all = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.get(this, rId + "/variables", options);
      };
      ResourceVariables2.prototype.create = function(resourceId, options) {
        var rId = encodeURIComponent(resourceId);
        return RequestHelper.post(this, rId + "/variables", options);
      };
      ResourceVariables2.prototype.edit = function(resourceId, keyId, options) {
        var _a = __read([resourceId, keyId].map(encodeURIComponent), 2), rId = _a[0], kId = _a[1];
        return RequestHelper.put(this, rId + "/variables/" + kId, options);
      };
      ResourceVariables2.prototype.show = function(resourceId, keyId, options) {
        var _a = __read([resourceId, keyId].map(encodeURIComponent), 2), rId = _a[0], kId = _a[1];
        return RequestHelper.get(this, rId + "/variables/" + kId, options);
      };
      ResourceVariables2.prototype.remove = function(resourceId, keyId, options) {
        var _a = __read([resourceId, keyId].map(encodeURIComponent), 2), rId = _a[0], kId = _a[1];
        return RequestHelper.del(this, rId + "/variables/" + kId, options);
      };
      return ResourceVariables2;
    }(requesterUtils.BaseService);
    var GroupAccessRequests = function(_super) {
      __extends(GroupAccessRequests2, _super);
      function GroupAccessRequests2(options) {
        return _super.call(this, "groups", options) || this;
      }
      return GroupAccessRequests2;
    }(ResourceAccessRequests);
    var GroupBadges = function(_super) {
      __extends(GroupBadges2, _super);
      function GroupBadges2(options) {
        return _super.call(this, "groups", options) || this;
      }
      return GroupBadges2;
    }(ResourceBadges);
    var GroupCustomAttributes = function(_super) {
      __extends(GroupCustomAttributes2, _super);
      function GroupCustomAttributes2(options) {
        return _super.call(this, "groups", options) || this;
      }
      return GroupCustomAttributes2;
    }(ResourceCustomAttributes);
    var GroupIssueBoards = function(_super) {
      __extends(GroupIssueBoards2, _super);
      function GroupIssueBoards2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "groups", options) || this;
      }
      return GroupIssueBoards2;
    }(ResourceIssueBoards);
    var GroupMembers = function(_super) {
      __extends(GroupMembers2, _super);
      function GroupMembers2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "groups", options) || this;
      }
      return GroupMembers2;
    }(ResourceMembers);
    var GroupMilestones = function(_super) {
      __extends(GroupMilestones2, _super);
      function GroupMilestones2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "groups", options) || this;
      }
      return GroupMilestones2;
    }(ResourceMilestones);
    var GroupProjects = function(_super) {
      __extends(GroupProjects2, _super);
      function GroupProjects2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      GroupProjects2.prototype.all = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.get(this, "groups/" + gId + "/projects", options);
      };
      GroupProjects2.prototype.add = function(groupId, projectId, options) {
        var _a = __read([groupId, projectId].map(encodeURIComponent), 2), gId = _a[0], pId = _a[1];
        return RequestHelper.post(this, "groups/" + gId + "/projects/" + pId, options);
      };
      return GroupProjects2;
    }(requesterUtils.BaseService);
    var GroupRunners = function(_super) {
      __extends(GroupRunners2, _super);
      function GroupRunners2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      GroupRunners2.prototype.all = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.get(this, "groups/" + gId + "/runners", options);
      };
      return GroupRunners2;
    }(requesterUtils.BaseService);
    var GroupVariables = function(_super) {
      __extends(GroupVariables2, _super);
      function GroupVariables2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "groups", options) || this;
      }
      return GroupVariables2;
    }(ResourceVariables);
    var GroupLabels = function(_super) {
      __extends(GroupLabels2, _super);
      function GroupLabels2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "groups", options) || this;
      }
      return GroupLabels2;
    }(ResourceLabels);
    var GroupDeployTokens = function(_super) {
      __extends(GroupDeployTokens2, _super);
      function GroupDeployTokens2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "groups", options) || this;
      }
      return GroupDeployTokens2;
    }(ResourceDeployTokens);
    var Epics = function(_super) {
      __extends(Epics2, _super);
      function Epics2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Epics2.prototype.all = function(groupId, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.get(this, "groups/" + gId + "/epics", options);
      };
      Epics2.prototype.create = function(groupId, title, options) {
        var gId = encodeURIComponent(groupId);
        return RequestHelper.post(this, "groups/" + gId + "/epics", __assign({title}, options));
      };
      Epics2.prototype.edit = function(groupId, epicId, options) {
        var _a = __read([groupId, epicId].map(encodeURIComponent), 2), gId = _a[0], eId = _a[1];
        return RequestHelper.put(this, "groups/" + gId + "/epics/" + eId, options);
      };
      Epics2.prototype.remove = function(groupId, epicId, options) {
        var _a = __read([groupId, epicId].map(encodeURIComponent), 2), gId = _a[0], eId = _a[1];
        return RequestHelper.del(this, "groups/" + gId + "/epics/" + eId, options);
      };
      Epics2.prototype.show = function(groupId, epicId, options) {
        var _a = __read([groupId, epicId].map(encodeURIComponent), 2), gId = _a[0], eId = _a[1];
        return RequestHelper.get(this, "groups/" + gId + "/epics/" + eId, options);
      };
      return Epics2;
    }(requesterUtils.BaseService);
    var EpicIssues = function(_super) {
      __extends(EpicIssues2, _super);
      function EpicIssues2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      EpicIssues2.prototype.all = function(groupId, epicId, options) {
        var _a = __read([groupId, epicId].map(encodeURIComponent), 2), gId = _a[0], eId = _a[1];
        return RequestHelper.get(this, "groups/" + gId + "/epics/" + eId + "/issues", options);
      };
      EpicIssues2.prototype.assign = function(groupId, epicId, issueId, options) {
        var _a = __read([groupId, epicId, issueId].map(encodeURIComponent), 3), gId = _a[0], eId = _a[1], iId = _a[2];
        return RequestHelper.post(this, "groups/" + gId + "/epics/" + eId + "/issues/" + iId, options);
      };
      EpicIssues2.prototype.edit = function(groupId, epicId, issueId, options) {
        var _a = __read([groupId, epicId, issueId].map(encodeURIComponent), 3), gId = _a[0], eId = _a[1], iId = _a[2];
        return RequestHelper.put(this, "groups/" + gId + "/epics/" + eId + "/issues/" + iId, options);
      };
      EpicIssues2.prototype.remove = function(groupId, epicId, issueId, options) {
        var _a = __read([groupId, epicId, issueId].map(encodeURIComponent), 3), gId = _a[0], eId = _a[1], iId = _a[2];
        return RequestHelper.del(this, "groups/" + gId + "/epics/" + eId + "/issues/" + iId, options);
      };
      return EpicIssues2;
    }(requesterUtils.BaseService);
    var EpicNotes = function(_super) {
      __extends(EpicNotes2, _super);
      function EpicNotes2(options) {
        return _super.call(this, "groups", "epics", options) || this;
      }
      return EpicNotes2;
    }(ResourceNotes);
    var EpicDiscussions = function(_super) {
      __extends(EpicDiscussions2, _super);
      function EpicDiscussions2(options) {
        return _super.call(this, "groups", "epics", options) || this;
      }
      return EpicDiscussions2;
    }(ResourceDiscussions);
    var Users = function(_super) {
      __extends(Users2, _super);
      function Users2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Users2.prototype.all = function(options) {
        return RequestHelper.get(this, "users", options);
      };
      Users2.prototype.activities = function(options) {
        return RequestHelper.get(this, "users/activities", options);
      };
      Users2.prototype.projects = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.get(this, "users/" + uId + "/projects", options);
      };
      Users2.prototype.block = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.post(this, "users/" + uId + "/block", options);
      };
      Users2.prototype.create = function(options) {
        return RequestHelper.post(this, "users", options);
      };
      Users2.prototype.current = function(options) {
        return RequestHelper.get(this, "user", options);
      };
      Users2.prototype.edit = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.put(this, "users/" + uId, options);
      };
      Users2.prototype.events = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.get(this, "users/" + uId + "/events", options);
      };
      Users2.prototype.search = function(emailOrUsername, options) {
        return RequestHelper.get(this, "users", __assign({search: emailOrUsername}, options));
      };
      Users2.prototype.show = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.get(this, "users/" + uId, options);
      };
      Users2.prototype.remove = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.del(this, "users/" + uId, options);
      };
      Users2.prototype.unblock = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.post(this, "users/" + uId + "/unblock", options);
      };
      return Users2;
    }(requesterUtils.BaseService);
    var UserCustomAttributes = function(_super) {
      __extends(UserCustomAttributes2, _super);
      function UserCustomAttributes2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "users", options) || this;
      }
      return UserCustomAttributes2;
    }(ResourceCustomAttributes);
    var url$3 = function(userId) {
      return userId ? "users/" + encodeURIComponent(userId) + "/emails" : "user/emails";
    };
    var UserEmails = function(_super) {
      __extends(UserEmails2, _super);
      function UserEmails2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UserEmails2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        return RequestHelper.get(this, url$3(userId), options);
      };
      UserEmails2.prototype.add = function(email, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        return RequestHelper.post(this, url$3(userId), __assign({email}, options));
      };
      UserEmails2.prototype.show = function(emailId, options) {
        var eId = encodeURIComponent(emailId);
        return RequestHelper.get(this, "user/emails/" + eId, options);
      };
      UserEmails2.prototype.remove = function(emailId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        var eId = encodeURIComponent(emailId);
        return RequestHelper.del(this, url$3(userId) + "/" + eId, options);
      };
      return UserEmails2;
    }(requesterUtils.BaseService);
    var UserImpersonationTokens = function(_super) {
      __extends(UserImpersonationTokens2, _super);
      function UserImpersonationTokens2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UserImpersonationTokens2.prototype.all = function(userId, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.get(this, "users/" + uId + "/impersonation_tokens", options);
      };
      UserImpersonationTokens2.prototype.add = function(userId, name, scopes, expiresAt, options) {
        var uId = encodeURIComponent(userId);
        return RequestHelper.post(this, "users/" + uId + "/impersonation_tokens", __assign({
          name,
          expiresAt,
          scopes
        }, options));
      };
      UserImpersonationTokens2.prototype.show = function(userId, tokenId, options) {
        var _a = __read([userId, tokenId].map(encodeURIComponent), 2), uId = _a[0], tId = _a[1];
        return RequestHelper.get(this, "users/" + uId + "/impersonation_tokens/" + tId, options);
      };
      UserImpersonationTokens2.prototype.revoke = function(userId, tokenId, options) {
        var _a = __read([userId, tokenId].map(encodeURIComponent), 2), uId = _a[0], tId = _a[1];
        return RequestHelper.del(this, "users/" + uId + "/impersonation_tokens/" + tId, options);
      };
      return UserImpersonationTokens2;
    }(requesterUtils.BaseService);
    var url$2 = function(userId) {
      return userId ? "users/" + encodeURIComponent(userId) + "/keys" : "user/keys";
    };
    var UserKeys = function(_super) {
      __extends(UserKeys2, _super);
      function UserKeys2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UserKeys2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        return RequestHelper.get(this, url$2(userId), options);
      };
      UserKeys2.prototype.create = function(title, key, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        return RequestHelper.post(this, url$2(userId), __assign({
          title,
          key
        }, options));
      };
      UserKeys2.prototype.show = function(keyId, options) {
        var kId = encodeURIComponent(keyId);
        return RequestHelper.get(this, "user/keys/" + kId, options);
      };
      UserKeys2.prototype.remove = function(keyId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        var kId = encodeURIComponent(keyId);
        return RequestHelper.del(this, url$2(userId) + "/" + kId, options);
      };
      return UserKeys2;
    }(requesterUtils.BaseService);
    var url$1 = function(userId) {
      return userId ? "users/" + encodeURIComponent(userId) + "/gpg_keys" : "users/gpg_keys";
    };
    var UserGPGKeys = function(_super) {
      __extends(UserGPGKeys2, _super);
      function UserGPGKeys2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UserGPGKeys2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        return RequestHelper.get(this, url$1(userId), options);
      };
      UserGPGKeys2.prototype.add = function(key, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        return RequestHelper.post(this, url$1(userId), __assign({key}, options));
      };
      UserGPGKeys2.prototype.show = function(keyId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        var kId = encodeURIComponent(keyId);
        return RequestHelper.get(this, url$1(userId) + "/" + kId, options);
      };
      UserGPGKeys2.prototype.remove = function(keyId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        var kId = encodeURIComponent(keyId);
        return RequestHelper.del(this, url$1(userId) + "/" + kId, options);
      };
      return UserGPGKeys2;
    }(requesterUtils.BaseService);
    var Branches = function(_super) {
      __extends(Branches2, _super);
      function Branches2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Branches2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/branches", options);
      };
      Branches2.prototype.create = function(projectId, branchName, ref, options) {
        var _a;
        var pId = encodeURIComponent(projectId);
        var branchKey = this.url.includes("v3") ? "branchName" : "branch";
        return RequestHelper.post(this, "projects/" + pId + "/repository/branches", __assign((_a = {}, _a[branchKey] = branchName, _a.ref = ref, _a), options));
      };
      Branches2.prototype.protect = function(projectId, branchName, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/protected_branches", __assign({name: branchName}, options));
      };
      Branches2.prototype.remove = function(projectId, branchName, options) {
        var _a = __read([projectId, branchName].map(encodeURIComponent), 2), pId = _a[0], bName = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/repository/branches/" + bName, options);
      };
      Branches2.prototype.show = function(projectId, branchName, options) {
        var _a = __read([projectId, branchName].map(encodeURIComponent), 2), pId = _a[0], bName = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/repository/branches/" + bName, options);
      };
      Branches2.prototype.unprotect = function(projectId, branchName, options) {
        var _a = __read([projectId, branchName].map(encodeURIComponent), 2), pId = _a[0], bName = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/repository/branches/" + bName + "/unprotect", options);
      };
      return Branches2;
    }(requesterUtils.BaseService);
    var Commits = function(_super) {
      __extends(Commits2, _super);
      function Commits2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Commits2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits", options);
      };
      Commits2.prototype.cherryPick = function(projectId, sha, branch, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/repository/commits/" + sha + "/cherry_pick", __assign({branch}, options));
      };
      Commits2.prototype.comments = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha + "/comments", options);
      };
      Commits2.prototype.create = function(projectId, branch, message, actions, options) {
        if (actions === void 0) {
          actions = [];
        }
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/repository/commits", __assign({branch, commitMessage: message, actions}, options));
      };
      Commits2.prototype.createComment = function(projectId, sha, note, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/repository/commits/" + sha + "/comments", __assign({note}, options));
      };
      Commits2.prototype.diff = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha + "/diff", options);
      };
      Commits2.prototype.editStatus = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/statuses/" + sha, options);
      };
      Commits2.prototype.references = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha + "/refs", options);
      };
      Commits2.prototype.revert = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/repository/commits/" + sha + "/revert", options);
      };
      Commits2.prototype.show = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha, options);
      };
      Commits2.prototype.status = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha + "/statuses", options);
      };
      Commits2.prototype.mergeRequests = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha + "/merge_requests", options);
      };
      Commits2.prototype.signature = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/commits/" + sha + "/signature", options);
      };
      return Commits2;
    }(requesterUtils.BaseService);
    var CommitDiscussions = function(_super) {
      __extends(CommitDiscussions2, _super);
      function CommitDiscussions2(options) {
        return _super.call(this, "projects", "repository/commits", options) || this;
      }
      return CommitDiscussions2;
    }(ResourceDiscussions);
    var ContainerRegistry = function(_super) {
      __extends(ContainerRegistry2, _super);
      function ContainerRegistry2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ContainerRegistry2.prototype.repositories = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/registry/repositories", options);
      };
      ContainerRegistry2.prototype.tags = function(projectId, repositoryId, options) {
        var _a = __read([projectId, repositoryId].map(encodeURIComponent), 2), pId = _a[0], rId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/registry/repositories/" + rId + "/tags", options);
      };
      ContainerRegistry2.prototype.removeRepository = function(projectId, repositoryId, options) {
        var _a = __read([projectId, repositoryId].map(encodeURIComponent), 2), pId = _a[0], rId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/registry/repositories/" + rId, options);
      };
      ContainerRegistry2.prototype.removeTag = function(projectId, repositoryId, tagName, options) {
        var _a = __read([projectId, repositoryId, tagName].map(encodeURIComponent), 3), pId = _a[0], rId = _a[1], tId = _a[2];
        return RequestHelper.del(this, "projects/" + pId + "/registry/repositories/" + rId + "/tags/" + tId, options);
      };
      ContainerRegistry2.prototype.removeTags = function(projectId, repositoryId, nameRegexDelete, options) {
        var _a = __read([projectId, repositoryId].map(encodeURIComponent), 2), pId = _a[0], rId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/registry/repositories/" + rId + "/tags", __assign({nameRegexDelete}, options));
      };
      ContainerRegistry2.prototype.showTag = function(projectId, repositoryId, tagName, options) {
        var _a = __read([projectId, repositoryId, tagName].map(encodeURIComponent), 3), pId = _a[0], rId = _a[1], tId = _a[2];
        return RequestHelper.get(this, "projects/" + pId + "/registry/repositories/" + rId + "/tags/" + tId, options);
      };
      return ContainerRegistry2;
    }(requesterUtils.BaseService);
    var Deployments = function(_super) {
      __extends(Deployments2, _super);
      function Deployments2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Deployments2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/deployments", options);
      };
      Deployments2.prototype.show = function(projectId, deploymentId, options) {
        var _a = __read([projectId, deploymentId].map(encodeURIComponent), 2), pId = _a[0], dId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/deployments/" + dId, options);
      };
      Deployments2.prototype.mergeRequests = function(projectId, deploymentId, options) {
        var _a = __read([projectId, deploymentId].map(encodeURIComponent), 2), pId = _a[0], dId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/deployments/" + dId + "/merge_requests", options);
      };
      return Deployments2;
    }(requesterUtils.BaseService);
    var DeployKeys = function(_super) {
      __extends(DeployKeys2, _super);
      function DeployKeys2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      DeployKeys2.prototype.add = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/deploy_keys", options);
      };
      DeployKeys2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, options = __rest(_a, ["projectId"]);
        var url2;
        if (projectId) {
          url2 = "projects/" + encodeURIComponent(projectId) + "/deploy_keys";
        } else {
          url2 = "deploy_keys";
        }
        return RequestHelper.get(this, url2, options);
      };
      DeployKeys2.prototype.edit = function(projectId, keyId, options) {
        var _a = __read([projectId, keyId].map(encodeURIComponent), 2), pId = _a[0], kId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/deploy_keys/" + kId, options);
      };
      DeployKeys2.prototype.enable = function(projectId, keyId, options) {
        var _a = __read([projectId, keyId].map(encodeURIComponent), 2), pId = _a[0], kId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/deploy_keys/" + kId + "/enable", options);
      };
      DeployKeys2.prototype.remove = function(projectId, keyId, options) {
        var _a = __read([projectId, keyId].map(encodeURIComponent), 2), pId = _a[0], kId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/deploy_keys/" + kId, options);
      };
      DeployKeys2.prototype.show = function(projectId, keyId, options) {
        var _a = __read([projectId, keyId].map(encodeURIComponent), 2), pId = _a[0], kId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/deploy_keys/" + kId, options);
      };
      return DeployKeys2;
    }(requesterUtils.BaseService);
    var Environments = function(_super) {
      __extends(Environments2, _super);
      function Environments2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Environments2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/environments", options);
      };
      Environments2.prototype.show = function(projectId, environmentId, options) {
        var _a = __read([projectId, environmentId].map(encodeURIComponent), 2), pId = _a[0], eId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/environments/" + eId, options);
      };
      Environments2.prototype.create = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/environments", options);
      };
      Environments2.prototype.edit = function(projectId, environmentId, options) {
        var _a = __read([projectId, environmentId].map(encodeURIComponent), 2), pId = _a[0], eId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/environments/" + eId, options);
      };
      Environments2.prototype.remove = function(projectId, environmentId, options) {
        var _a = __read([projectId, environmentId].map(encodeURIComponent), 2), pId = _a[0], eId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/environments/" + eId, options);
      };
      Environments2.prototype.stop = function(projectId, environmentId, options) {
        var _a = __read([projectId, environmentId].map(encodeURIComponent), 2), pId = _a[0], eId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/environments/" + eId + "/stop", options);
      };
      return Environments2;
    }(requesterUtils.BaseService);
    var FreezePeriods = function(_super) {
      __extends(FreezePeriods2, _super);
      function FreezePeriods2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      FreezePeriods2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/freeze_periods", options);
      };
      FreezePeriods2.prototype.show = function(projectId, freezePeriodId, options) {
        var _a = __read([projectId, freezePeriodId].map(encodeURIComponent), 2), pId = _a[0], fId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/freeze_periods/" + fId, options);
      };
      FreezePeriods2.prototype.create = function(projectId, freezeStart, freezeEnd, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/freeze_periods", __assign({
          freezeStart,
          freezeEnd
        }, options));
      };
      FreezePeriods2.prototype.edit = function(projectId, freezePeriodId, options) {
        var _a = __read([projectId, freezePeriodId].map(encodeURIComponent), 2), pId = _a[0], fId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/freeze_periods/" + fId, options);
      };
      FreezePeriods2.prototype.delete = function(projectId, freezePeriodId, options) {
        var _a = __read([projectId, freezePeriodId].map(encodeURIComponent), 2), pId = _a[0], fId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/freeze_periods/" + fId, options);
      };
      return FreezePeriods2;
    }(requesterUtils.BaseService);
    var Issues = function(_super) {
      __extends(Issues2, _super);
      function Issues2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Issues2.prototype.addSpentTime = function(projectId, issueIid, duration, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/add_spent_time", __assign({duration}, options));
      };
      Issues2.prototype.addTimeEstimate = function(projectId, issueIid, duration, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/time_estimate", __assign({duration}, options));
      };
      Issues2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, groupId = _a.groupId, options = __rest(_a, ["projectId", "groupId"]);
        var url2;
        if (projectId) {
          url2 = "projects/" + encodeURIComponent(projectId) + "/issues";
        } else if (groupId) {
          url2 = "groups/" + encodeURIComponent(groupId) + "/issues";
        } else {
          url2 = "issues";
        }
        return RequestHelper.get(this, url2, options);
      };
      Issues2.prototype.create = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/issues", options);
      };
      Issues2.prototype.closedBy = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/issues/" + iId + "/closed_by", options);
      };
      Issues2.prototype.edit = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/issues/" + iId, options);
      };
      Issues2.prototype.link = function(projectId, issueIid, targetProjectId, targetIssueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        var _b = __read([targetProjectId, targetIssueIid].map(encodeURIComponent), 2), targetpId = _b[0], targetIid = _b[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/links", __assign({targetProjectId: targetpId, targetIssueIid: targetIid}, options));
      };
      Issues2.prototype.links = function(projectId, issueIid) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/issues/" + iId + "/links");
      };
      Issues2.prototype.participants = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/issues/" + iId + "/participants", options);
      };
      Issues2.prototype.relatedMergeRequests = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/issues/" + iId + "/related_merge_requests", options);
      };
      Issues2.prototype.removeLink = function(projectId, issueIid, issueLinkId, options) {
        var _a = __read([projectId, issueIid, issueLinkId].map(encodeURIComponent), 3), pId = _a[0], iId = _a[1], iLinkId = _a[2];
        return RequestHelper.del(this, "projects/" + pId + "/issues/" + iId + "/links/" + iLinkId, __assign({}, options));
      };
      Issues2.prototype.remove = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/issues/" + iId, options);
      };
      Issues2.prototype.resetSpentTime = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/reset_spent_time", options);
      };
      Issues2.prototype.resetTimeEstimate = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/reset_time_estimate", options);
      };
      Issues2.prototype.show = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/issues/" + iId, options);
      };
      Issues2.prototype.subscribe = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/subscribe", options);
      };
      Issues2.prototype.timeStats = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/issues/" + iId + "/time_stats", options);
      };
      Issues2.prototype.unsubscribe = function(projectId, issueIid, options) {
        var _a = __read([projectId, issueIid].map(encodeURIComponent), 2), pId = _a[0], iId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/issues/" + iId + "/unsubscribe", options);
      };
      return Issues2;
    }(requesterUtils.BaseService);
    var IssuesStatistics = function(_super) {
      __extends(IssuesStatistics2, _super);
      function IssuesStatistics2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      IssuesStatistics2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, groupId = _a.groupId, options = __rest(_a, ["projectId", "groupId"]);
        var url2;
        if (projectId) {
          url2 = "projects/" + encodeURIComponent(projectId) + "/issues_statistics";
        } else if (groupId) {
          url2 = "groups/" + encodeURIComponent(groupId) + "/issues_statistics";
        } else {
          url2 = "issues_statistics";
        }
        return RequestHelper.get(this, url2, options);
      };
      return IssuesStatistics2;
    }(requesterUtils.BaseService);
    var IssueNotes = function(_super) {
      __extends(IssueNotes2, _super);
      function IssueNotes2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", "issues", options) || this;
      }
      return IssueNotes2;
    }(ResourceNotes);
    var IssueDiscussions = function(_super) {
      __extends(IssueDiscussions2, _super);
      function IssueDiscussions2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", "issues", options) || this;
      }
      return IssueDiscussions2;
    }(ResourceDiscussions);
    var IssueAwardEmojis = function(_super) {
      __extends(IssueAwardEmojis2, _super);
      function IssueAwardEmojis2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "issues", options) || this;
      }
      return IssueAwardEmojis2;
    }(ResourceAwardEmojis);
    var Jobs = function(_super) {
      __extends(Jobs2, _super);
      function Jobs2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Jobs2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/jobs", options);
      };
      Jobs2.prototype.cancel = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/jobs/" + jId + "/cancel", options);
      };
      Jobs2.prototype.downloadSingleArtifactFile = function(projectId, jobId, artifactPath, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var _b = _a.stream, stream2 = _b === void 0 ? false : _b, options = __rest(_a, ["stream"]);
        var _c = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _c[0], jId = _c[1];
        var method = stream2 ? "stream" : "get";
        return RequestHelper[method](this, "projects/" + pId + "/jobs/" + jId + "/artifacts/" + artifactPath, options);
      };
      Jobs2.prototype.downloadSingleArtifactFileFromRef = function(projectId, ref, artifactPath, jobName, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var _b = _a.stream, stream2 = _b === void 0 ? false : _b, options = __rest(_a, ["stream"]);
        var _c = __read([projectId, ref, jobName].map(encodeURIComponent), 3), pId = _c[0], rId = _c[1], name = _c[2];
        var method = stream2 ? "stream" : "get";
        return RequestHelper[method](this, "projects/" + pId + "/jobs/artifacts/" + rId + "/raw/" + artifactPath + "?job=" + name, options);
      };
      Jobs2.prototype.downloadLatestArtifactFile = function(projectId, ref, jobName, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var _b = _a.stream, stream2 = _b === void 0 ? false : _b, options = __rest(_a, ["stream"]);
        var _c = __read([projectId, ref, jobName].map(encodeURIComponent), 3), pId = _c[0], rId = _c[1], name = _c[2];
        var method = stream2 ? "stream" : "get";
        return RequestHelper[method](this, "projects/" + pId + "/jobs/artifacts/" + rId + "/download?job=" + name, options);
      };
      Jobs2.prototype.downloadTraceFile = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/jobs/" + jId + "/trace", options);
      };
      Jobs2.prototype.erase = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/jobs/" + jId + "/erase", options);
      };
      Jobs2.prototype.eraseArtifacts = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/jobs/" + jId + "/artifacts", options);
      };
      Jobs2.prototype.keepArtifacts = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/jobs/" + jId + "/artifacts/keep", options);
      };
      Jobs2.prototype.play = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/jobs/" + jId + "/play", options);
      };
      Jobs2.prototype.retry = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/jobs/" + jId + "/retry", options);
      };
      Jobs2.prototype.show = function(projectId, jobId, options) {
        var _a = __read([projectId, jobId].map(encodeURIComponent), 2), pId = _a[0], jId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/jobs/" + jId, options);
      };
      Jobs2.prototype.showPipelineJobs = function(projectId, pipelineId, options) {
        var _a = __read([projectId, pipelineId].map(encodeURIComponent), 2), pId = _a[0], ppId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/pipelines/" + ppId + "/jobs", options);
      };
      return Jobs2;
    }(requesterUtils.BaseService);
    var Labels = function(_super) {
      __extends(Labels2, _super);
      function Labels2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return Labels2;
    }(ResourceLabels);
    var MergeRequests = function(_super) {
      __extends(MergeRequests2, _super);
      function MergeRequests2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      MergeRequests2.prototype.accept = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/merge_requests/" + mIid + "/merge", options);
      };
      MergeRequests2.prototype.addSpentTime = function(projectId, mergerequestIid, duration, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/add_spent_time", __assign({duration}, options));
      };
      MergeRequests2.prototype.addTimeEstimate = function(projectId, mergerequestIid, duration, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/time_estimate", __assign({duration}, options));
      };
      MergeRequests2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, groupId = _a.groupId, options = __rest(_a, ["projectId", "groupId"]);
        var url2;
        if (projectId) {
          url2 = "projects/" + encodeURIComponent(projectId) + "/merge_requests";
        } else if (groupId) {
          url2 = "groups/" + encodeURIComponent(groupId) + "/merge_requests";
        } else {
          url2 = "merge_requests";
        }
        return RequestHelper.get(this, url2, options);
      };
      MergeRequests2.prototype.cancelOnPipelineSucess = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/merge_requests/" + mIid + "/cancel_merge_when_pipeline_succeeds", options);
      };
      MergeRequests2.prototype.changes = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/changes", options);
      };
      MergeRequests2.prototype.closesIssues = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/closes_issues", options);
      };
      MergeRequests2.prototype.commits = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/commits", options);
      };
      MergeRequests2.prototype.create = function(projectId, sourceBranch, targetBranch, title, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests", __assign({
          id: pId,
          sourceBranch,
          targetBranch,
          title
        }, options));
      };
      MergeRequests2.prototype.edit = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/merge_requests/" + mIid, options);
      };
      MergeRequests2.prototype.participants = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/participants", options);
      };
      MergeRequests2.prototype.pipelines = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/pipelines", options);
      };
      MergeRequests2.prototype.rebase = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/merge_requests/" + mIid + "/rebase", options);
      };
      MergeRequests2.prototype.remove = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/merge_requests/" + mIid, options);
      };
      MergeRequests2.prototype.resetSpentTime = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/reset_spent_time", options);
      };
      MergeRequests2.prototype.resetTimeEstimate = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/reset_time_estimate", options);
      };
      MergeRequests2.prototype.show = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid, options);
      };
      MergeRequests2.prototype.subscribe = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/subscribe", options);
      };
      MergeRequests2.prototype.timeStats = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/time_stats", options);
      };
      MergeRequests2.prototype.version = function(projectId, mergerequestIid, versionId, options) {
        var _a = __read([projectId, mergerequestIid, versionId].map(encodeURIComponent), 3), pId = _a[0], mIid = _a[1], vId = _a[2];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/versions/" + vId, options);
      };
      MergeRequests2.prototype.versions = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/versions", options);
      };
      MergeRequests2.prototype.unsubscribe = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/merge_requests/" + mIid + "/unsubscribe", options);
      };
      return MergeRequests2;
    }(requesterUtils.BaseService);
    var MergeRequestApprovals = function(_super) {
      __extends(MergeRequestApprovals2, _super);
      function MergeRequestApprovals2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      MergeRequestApprovals2.prototype.addApprovalRule = function(projectId, name, approvalsRequired, _a) {
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var pId = encodeURIComponent(projectId);
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approval_rules";
        } else {
          url2 = "projects/" + pId + "/approval_rules";
        }
        return RequestHelper.post(this, url2, __assign({name, approvalsRequired}, options));
      };
      MergeRequestApprovals2.prototype.approvalRules = function(projectId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var pId = encodeURIComponent(projectId);
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approval_rules";
        } else {
          url2 = "projects/" + pId + "/approval_rules";
        }
        return RequestHelper.get(this, url2, options);
      };
      MergeRequestApprovals2.prototype.approvals = function(projectId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var pId = encodeURIComponent(projectId);
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approvals";
        } else {
          url2 = "projects/" + pId + "/approvals";
        }
        return RequestHelper.get(this, url2, options);
      };
      MergeRequestApprovals2.prototype.approvalState = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/merge_requests/" + mIid + "/approval_state", options);
      };
      MergeRequestApprovals2.prototype.approve = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/approve", options);
      };
      MergeRequestApprovals2.prototype.approvers = function(projectId, approverIds, approverGroupIds, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var pId = encodeURIComponent(projectId);
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approvers";
        } else {
          url2 = "projects/" + pId + "/approvers";
        }
        return RequestHelper.put(this, url2, __assign({approverIds, approverGroupIds}, options));
      };
      MergeRequestApprovals2.prototype.editApprovalRule = function(projectId, approvalRuleId, name, approvalsRequired, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var _b = __read([projectId, approvalRuleId].map(encodeURIComponent), 2), pId = _b[0], aId = _b[1];
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approval_rules/" + aId;
        } else {
          url2 = "projects/" + pId + "/approval_rules/" + aId;
        }
        return RequestHelper.put(this, url2, __assign({name, approvalsRequired}, options));
      };
      MergeRequestApprovals2.prototype.editApprovals = function(projectId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var pId = encodeURIComponent(projectId);
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approvals";
        } else {
          url2 = "projects/" + pId + "/approvals";
        }
        return RequestHelper.post(this, url2, options);
      };
      MergeRequestApprovals2.prototype.removeApprovalRule = function(projectId, approvalRuleId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var mergerequestIid = _a.mergerequestIid, options = __rest(_a, ["mergerequestIid"]);
        var _b = __read([projectId, approvalRuleId].map(encodeURIComponent), 2), pId = _b[0], aId = _b[1];
        var url2;
        if (mergerequestIid) {
          var mIid = encodeURIComponent(mergerequestIid);
          url2 = "projects/" + pId + "/merge_requests/" + mIid + "/approval_rules/" + aId;
        } else {
          url2 = "projects/" + pId + "/approval_rules/" + aId;
        }
        return RequestHelper.del(this, url2, options);
      };
      MergeRequestApprovals2.prototype.unapprove = function(projectId, mergerequestIid, options) {
        var _a = __read([projectId, mergerequestIid].map(encodeURIComponent), 2), pId = _a[0], mIid = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/merge_requests/" + mIid + "/unapprove", options);
      };
      return MergeRequestApprovals2;
    }(requesterUtils.BaseService);
    var MergeRequestAwardEmojis = function(_super) {
      __extends(MergeRequestAwardEmojis2, _super);
      function MergeRequestAwardEmojis2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "merge_requests", options) || this;
      }
      return MergeRequestAwardEmojis2;
    }(ResourceAwardEmojis);
    var MergeRequestDiscussions = function(_super) {
      __extends(MergeRequestDiscussions2, _super);
      function MergeRequestDiscussions2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", "merge_requests", options) || this;
      }
      return MergeRequestDiscussions2;
    }(ResourceDiscussions);
    var MergeRequestNotes = function(_super) {
      __extends(MergeRequestNotes2, _super);
      function MergeRequestNotes2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", "merge_requests", options) || this;
      }
      return MergeRequestNotes2;
    }(ResourceNotes);
    var Packages = function(_super) {
      __extends(Packages2, _super);
      function Packages2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Packages2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/packages", options);
      };
      Packages2.prototype.remove = function(projectId, packageId, options) {
        var _a = __read([projectId, packageId].map(encodeURIComponent), 2), pId = _a[0], pkId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/packages/" + pkId, options);
      };
      Packages2.prototype.show = function(projectId, packageId, options) {
        var _a = __read([projectId, packageId].map(encodeURIComponent), 2), pId = _a[0], pkId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/packages/" + pkId, options);
      };
      Packages2.prototype.showFiles = function(projectId, packageId, options) {
        var _a = __read([projectId, packageId].map(encodeURIComponent), 2), pId = _a[0], pkId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/packages/" + pkId + "/package_files", options);
      };
      return Packages2;
    }(requesterUtils.BaseService);
    var Pipelines = function(_super) {
      __extends(Pipelines2, _super);
      function Pipelines2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Pipelines2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/pipelines", options);
      };
      Pipelines2.prototype.create = function(projectId, ref, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/pipeline", __assign({ref}, options));
      };
      Pipelines2.prototype.delete = function(projectId, pipelineId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.del(this, "projects/" + pId + "/pipelines/" + pipelineId, options);
      };
      Pipelines2.prototype.show = function(projectId, pipelineId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/pipelines/" + pipelineId, options);
      };
      Pipelines2.prototype.retry = function(projectId, pipelineId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/pipelines/" + pipelineId + "/retry", options);
      };
      Pipelines2.prototype.cancel = function(projectId, pipelineId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/pipelines/" + pipelineId + "/cancel", options);
      };
      Pipelines2.prototype.allVariables = function(projectId, pipelineId, options) {
        var _a = __read([projectId, pipelineId].map(encodeURIComponent), 2), pId = _a[0], pipeId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/pipelines/" + pipeId + "/variables", options);
      };
      return Pipelines2;
    }(requesterUtils.BaseService);
    var PipelineSchedules = function(_super) {
      __extends(PipelineSchedules2, _super);
      function PipelineSchedules2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      PipelineSchedules2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/pipeline_schedules", options);
      };
      PipelineSchedules2.prototype.create = function(projectId, description, ref, cron, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/pipeline_schedules", __assign({
          description,
          ref,
          cron
        }, options));
      };
      PipelineSchedules2.prototype.edit = function(projectId, scheduleId, options) {
        var _a = __read([projectId, scheduleId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/pipeline_schedules/" + sId, options);
      };
      PipelineSchedules2.prototype.remove = function(projectId, scheduleId, options) {
        var _a = __read([projectId, scheduleId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/pipeline_schedules/" + sId, options);
      };
      PipelineSchedules2.prototype.show = function(projectId, scheduleId, options) {
        var _a = __read([projectId, scheduleId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/pipeline_schedules/" + sId, options);
      };
      PipelineSchedules2.prototype.takeOwnership = function(projectId, scheduleId, options) {
        var _a = __read([projectId, scheduleId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/pipeline_schedules/" + sId + "/take_ownership", options);
      };
      return PipelineSchedules2;
    }(requesterUtils.BaseService);
    var PipelineScheduleVariables = function(_super) {
      __extends(PipelineScheduleVariables2, _super);
      function PipelineScheduleVariables2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      PipelineScheduleVariables2.prototype.all = function(projectId, pipelineScheduleId, options) {
        var _a = __read([projectId, pipelineScheduleId].map(encodeURIComponent), 2), pId = _a[0], psId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables", options);
      };
      PipelineScheduleVariables2.prototype.create = function(projectId, pipelineScheduleId, options) {
        var _a = __read([projectId, pipelineScheduleId].map(encodeURIComponent), 2), pId = _a[0], psId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables", options);
      };
      PipelineScheduleVariables2.prototype.edit = function(projectId, pipelineScheduleId, keyId, options) {
        var _a = __read([projectId, pipelineScheduleId, keyId].map(encodeURIComponent), 3), pId = _a[0], psId = _a[1], kId = _a[2];
        return RequestHelper.put(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables/" + kId, options);
      };
      PipelineScheduleVariables2.prototype.show = function(projectId, pipelineScheduleId, keyId, options) {
        var _a = __read([projectId, pipelineScheduleId, keyId].map(encodeURIComponent), 3), pId = _a[0], psId = _a[1], kId = _a[2];
        return RequestHelper.get(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables/" + kId, options);
      };
      PipelineScheduleVariables2.prototype.remove = function(projectId, pipelineScheduleId, keyId, options) {
        var _a = __read([projectId, pipelineScheduleId, keyId].map(encodeURIComponent), 3), pId = _a[0], psId = _a[1], kId = _a[2];
        return RequestHelper.del(this, "projects/" + pId + "/pipeline_schedules/" + psId + "/variables/" + kId, options);
      };
      return PipelineScheduleVariables2;
    }(requesterUtils.BaseService);
    var defaultMetadata = {
      filename: Date.now().toString() + ".tar.gz",
      contentType: "application/octet-stream"
    };
    var ProjectImportExport = function(_super) {
      __extends(ProjectImportExport2, _super);
      function ProjectImportExport2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ProjectImportExport2.prototype.download = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/export/download", options);
      };
      ProjectImportExport2.prototype.exportStatus = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/export", options);
      };
      ProjectImportExport2.prototype.import = function(content, path, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var metadata = _a.metadata, options = __rest(_a, ["metadata"]);
        return RequestHelper.post(this, "projects/import", __assign(__assign({isForm: true}, options), {file: [content, __assign(__assign({}, defaultMetadata), metadata)], path}));
      };
      ProjectImportExport2.prototype.importStatus = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/import", options);
      };
      ProjectImportExport2.prototype.schedule = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/export", options);
      };
      return ProjectImportExport2;
    }(requesterUtils.BaseService);
    var Projects = function(_super) {
      __extends(Projects2, _super);
      function Projects2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Projects2.prototype.all = function(options) {
        return RequestHelper.get(this, "projects", options);
      };
      Projects2.prototype.archive = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/archive", options);
      };
      Projects2.prototype.create = function(_a) {
        var userId = _a.userId, options = __rest(_a, ["userId"]);
        var url2 = userId ? "projects/user/" + encodeURIComponent(userId) : "projects";
        return RequestHelper.post(this, url2, options);
      };
      Projects2.prototype.edit = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.put(this, "projects/" + pId, options);
      };
      Projects2.prototype.events = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/events", options);
      };
      Projects2.prototype.fork = function(projectId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var forkedFromId = _a.forkedFromId, options = __rest(_a, ["forkedFromId"]);
        var pId = encodeURIComponent(projectId);
        var url2 = "projects/" + pId + "/fork";
        if (forkedFromId)
          url2 += "/" + encodeURIComponent(forkedFromId);
        return RequestHelper.post(this, url2, options);
      };
      Projects2.prototype.forks = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/forks", options);
      };
      Projects2.prototype.languages = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/languages", options);
      };
      Projects2.prototype.mirrorPull = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/mirror/pull", options);
      };
      Projects2.prototype.remove = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.del(this, "projects/" + pId, options);
      };
      Projects2.prototype.removeFork = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.del(this, "projects/" + pId + "/fork", options);
      };
      Projects2.prototype.search = function(projectName, options) {
        return RequestHelper.get(this, "projects", __assign({search: projectName}, options));
      };
      Projects2.prototype.share = function(projectId, groupId, groupAccess, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/share", __assign({groupId, groupAccess}, options));
      };
      Projects2.prototype.show = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId, options);
      };
      Projects2.prototype.star = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/star", options);
      };
      Projects2.prototype.statuses = function(projectId, sha, state, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/statuses/" + sha, __assign({state}, options));
      };
      Projects2.prototype.transfer = function(projectId, namespaceId) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.put(this, "projects/" + pId + "/transfer", {namespace: namespaceId});
      };
      Projects2.prototype.unarchive = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/unarchive", options);
      };
      Projects2.prototype.unshare = function(projectId, groupId, options) {
        var _a = __read([projectId, groupId].map(encodeURIComponent), 2), pId = _a[0], gId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/share/" + gId, options);
      };
      Projects2.prototype.unstar = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/unstar", options);
      };
      Projects2.prototype.upload = function(projectId, content, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var metadata = _a.metadata, options = __rest(_a, ["metadata"]);
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/uploads", __assign({isForm: true, file: [content, __assign(__assign({}, defaultMetadata), metadata)]}, options));
      };
      return Projects2;
    }(requesterUtils.BaseService);
    var ProjectAccessRequests = function(_super) {
      __extends(ProjectAccessRequests2, _super);
      function ProjectAccessRequests2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectAccessRequests2;
    }(ResourceAccessRequests);
    var ProjectBadges = function(_super) {
      __extends(ProjectBadges2, _super);
      function ProjectBadges2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectBadges2;
    }(ResourceBadges);
    var ProjectCustomAttributes = function(_super) {
      __extends(ProjectCustomAttributes2, _super);
      function ProjectCustomAttributes2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectCustomAttributes2;
    }(ResourceCustomAttributes);
    var ProjectIssueBoards = function(_super) {
      __extends(ProjectIssueBoards2, _super);
      function ProjectIssueBoards2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectIssueBoards2;
    }(ResourceIssueBoards);
    var ProjectHooks = function(_super) {
      __extends(ProjectHooks2, _super);
      function ProjectHooks2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ProjectHooks2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/hooks", options);
      };
      ProjectHooks2.prototype.show = function(projectId, hookId, options) {
        var _a = __read([projectId, hookId].map(encodeURIComponent), 2), pId = _a[0], hId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/hooks/" + hId, options);
      };
      ProjectHooks2.prototype.add = function(projectId, url2, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/hooks", __assign({url: url2}, options));
      };
      ProjectHooks2.prototype.edit = function(projectId, hookId, url2, options) {
        var _a = __read([projectId, hookId].map(encodeURIComponent), 2), pId = _a[0], hId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/hooks/" + hId, __assign({url: url2}, options));
      };
      ProjectHooks2.prototype.remove = function(projectId, hookId, options) {
        var _a = __read([projectId, hookId].map(encodeURIComponent), 2), pId = _a[0], hId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/hooks/" + hId, options);
      };
      return ProjectHooks2;
    }(requesterUtils.BaseService);
    var ProjectMembers = function(_super) {
      __extends(ProjectMembers2, _super);
      function ProjectMembers2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectMembers2;
    }(ResourceMembers);
    var ProjectMilestones = function(_super) {
      __extends(ProjectMilestones2, _super);
      function ProjectMilestones2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectMilestones2;
    }(ResourceMilestones);
    var ProjectSnippets = function(_super) {
      __extends(ProjectSnippets2, _super);
      function ProjectSnippets2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ProjectSnippets2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/snippets", options);
      };
      ProjectSnippets2.prototype.content = function(projectId, snippetId, options) {
        var _a = __read([projectId, snippetId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/snippets/" + sId + "/raw", options);
      };
      ProjectSnippets2.prototype.create = function(projectId, title, fileName, code, visibility, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/snippets", __assign({
          title,
          fileName,
          code,
          visibility
        }, options));
      };
      ProjectSnippets2.prototype.edit = function(projectId, snippetId, options) {
        var _a = __read([projectId, snippetId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/snippets/" + sId, options);
      };
      ProjectSnippets2.prototype.remove = function(projectId, snippetId, options) {
        var _a = __read([projectId, snippetId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/snippets/" + sId, options);
      };
      ProjectSnippets2.prototype.show = function(projectId, snippetId, options) {
        var _a = __read([projectId, snippetId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/snippets/" + sId, options);
      };
      ProjectSnippets2.prototype.userAgentDetails = function(projectId, snippetId, options) {
        var _a = __read([projectId, snippetId].map(encodeURIComponent), 2), pId = _a[0], sId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/snippets/" + sId + "/user_agent_detail", options);
      };
      return ProjectSnippets2;
    }(requesterUtils.BaseService);
    var ProjectSnippetNotes = function(_super) {
      __extends(ProjectSnippetNotes2, _super);
      function ProjectSnippetNotes2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", "snippets", options) || this;
      }
      return ProjectSnippetNotes2;
    }(ResourceNotes);
    var ProjectSnippetDiscussions = function(_super) {
      __extends(ProjectSnippetDiscussions2, _super);
      function ProjectSnippetDiscussions2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", "snippets", options) || this;
      }
      return ProjectSnippetDiscussions2;
    }(ResourceDiscussions);
    var ProjectSnippetAwardEmojis = function(_super) {
      __extends(ProjectSnippetAwardEmojis2, _super);
      function ProjectSnippetAwardEmojis2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "issues", options) || this;
      }
      return ProjectSnippetAwardEmojis2;
    }(ResourceAwardEmojis);
    var ProtectedBranches = function(_super) {
      __extends(ProtectedBranches2, _super);
      function ProtectedBranches2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ProtectedBranches2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/protected_branches", options);
      };
      ProtectedBranches2.prototype.protect = function(projectId, branchName, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/protected_branches", __assign({name: branchName}, options));
      };
      ProtectedBranches2.prototype.show = function(projectId, branchName, options) {
        var _a = __read([projectId, branchName].map(encodeURIComponent), 2), pId = _a[0], bName = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/protected_branches/" + bName, options);
      };
      ProtectedBranches2.prototype.unprotect = function(projectId, branchName, options) {
        var _a = __read([projectId, branchName].map(encodeURIComponent), 2), pId = _a[0], bName = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/protected_branches/" + bName, options);
      };
      return ProtectedBranches2;
    }(requesterUtils.BaseService);
    var ProtectedTags = function(_super) {
      __extends(ProtectedTags2, _super);
      function ProtectedTags2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ProtectedTags2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/protected_tags", options);
      };
      ProtectedTags2.prototype.protect = function(projectId, tagName, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/protected_tags", __assign({name: tagName}, options));
      };
      ProtectedTags2.prototype.show = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tName = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/protected_tags/" + tName, options);
      };
      ProtectedTags2.prototype.unprotect = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tName = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/protected_tags/" + tName, options);
      };
      return ProtectedTags2;
    }(requesterUtils.BaseService);
    var ProjectVariables = function(_super) {
      __extends(ProjectVariables2, _super);
      function ProjectVariables2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectVariables2;
    }(ResourceVariables);
    var ProjectDeployTokens = function(_super) {
      __extends(ProjectDeployTokens2, _super);
      function ProjectDeployTokens2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "projects", options) || this;
      }
      return ProjectDeployTokens2;
    }(ResourceDeployTokens);
    var PushRules = function(_super) {
      __extends(PushRules2, _super);
      function PushRules2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      PushRules2.prototype.create = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/push_rule", options);
      };
      PushRules2.prototype.edit = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.put(this, "projects/" + pId + "/push_rule", options);
      };
      PushRules2.prototype.remove = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.del(this, "projects/" + pId + "/push_rule", options);
      };
      PushRules2.prototype.show = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/push_rule", options);
      };
      return PushRules2;
    }(requesterUtils.BaseService);
    var Releases = function(_super) {
      __extends(Releases2, _super);
      function Releases2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Releases2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/releases", options);
      };
      Releases2.prototype.create = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/releases", options);
      };
      Releases2.prototype.edit = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/releases/" + tId, options);
      };
      Releases2.prototype.remove = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/releases/" + tId, options);
      };
      Releases2.prototype.show = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/releases/" + tId, options);
      };
      return Releases2;
    }(requesterUtils.BaseService);
    var ReleaseLinks = function(_super) {
      __extends(ReleaseLinks2, _super);
      function ReleaseLinks2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ReleaseLinks2.prototype.all = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/releases/" + tId + "/assets/links", options);
      };
      ReleaseLinks2.prototype.create = function(projectId, tagName, name, url2, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/releases/" + tId + "/assets/links", __assign({
          name,
          url: url2
        }, options));
      };
      ReleaseLinks2.prototype.edit = function(projectId, tagName, linkId, options) {
        var _a = __read([projectId, tagName, linkId].map(encodeURIComponent), 3), pId = _a[0], tId = _a[1], lId = _a[2];
        return RequestHelper.put(this, "projects/" + pId + "/releases/" + tId + "/assets/links/" + lId, options);
      };
      ReleaseLinks2.prototype.remove = function(projectId, tagName, linkId, options) {
        var _a = __read([projectId, tagName, linkId].map(encodeURIComponent), 3), pId = _a[0], tId = _a[1], lId = _a[2];
        return RequestHelper.del(this, "projects/" + pId + "/releases/" + tId + "/assets/links/" + lId, options);
      };
      ReleaseLinks2.prototype.show = function(projectId, tagName, linkId, options) {
        var _a = __read([projectId, tagName, linkId].map(encodeURIComponent), 3), pId = _a[0], tId = _a[1], lId = _a[2];
        return RequestHelper.get(this, "projects/" + pId + "/releases/" + tId + "/assets/links/" + lId, options);
      };
      return ReleaseLinks2;
    }(requesterUtils.BaseService);
    var Repositories = function(_super) {
      __extends(Repositories2, _super);
      function Repositories2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Repositories2.prototype.compare = function(projectId, from, to, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/compare", __assign({
          from,
          to
        }, options));
      };
      Repositories2.prototype.contributors = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/contributors", options);
      };
      Repositories2.prototype.mergeBase = function(projectId, refs, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/merge_base", __assign({refs}, options));
      };
      Repositories2.prototype.showArchive = function(projectId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var _b = _a.fileType, fileType = _b === void 0 ? "tar.gz" : _b, options = __rest(_a, ["fileType"]);
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/archive." + fileType, options);
      };
      Repositories2.prototype.showBlob = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/blobs/" + sha, options);
      };
      Repositories2.prototype.showBlobRaw = function(projectId, sha, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/blobs/" + sha + "/raw", options);
      };
      Repositories2.prototype.tree = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/tree", options);
      };
      return Repositories2;
    }(requesterUtils.BaseService);
    var RepositoryFiles = function(_super) {
      __extends(RepositoryFiles2, _super);
      function RepositoryFiles2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      RepositoryFiles2.prototype.create = function(projectId, filePath, branch, content, commitMessage, options) {
        var _a = __read([projectId, filePath].map(encodeURIComponent), 2), pId = _a[0], path = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/repository/files/" + path, __assign({
          branch,
          content,
          commitMessage
        }, options));
      };
      RepositoryFiles2.prototype.edit = function(projectId, filePath, branch, content, commitMessage, options) {
        var _a = __read([projectId, filePath].map(encodeURIComponent), 2), pId = _a[0], path = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/repository/files/" + path, __assign({
          branch,
          content,
          commitMessage
        }, options));
      };
      RepositoryFiles2.prototype.remove = function(projectId, filePath, branch, commitMessage, options) {
        var _a = __read([projectId, filePath].map(encodeURIComponent), 2), pId = _a[0], path = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/repository/files/" + path, __assign({
          branch,
          commitMessage
        }, options));
      };
      RepositoryFiles2.prototype.show = function(projectId, filePath, ref, options) {
        var _a = __read([projectId, filePath].map(encodeURIComponent), 2), pId = _a[0], path = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/repository/files/" + path, __assign({ref}, options));
      };
      RepositoryFiles2.prototype.showBlame = function(projectId, filePath, options) {
        var _a = __read([projectId, filePath].map(encodeURIComponent), 2), pId = _a[0], path = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/repository/files/" + path + "/blame", options);
      };
      RepositoryFiles2.prototype.showRaw = function(projectId, filePath, ref, options) {
        var _a = __read([projectId, filePath].map(encodeURIComponent), 2), pId = _a[0], path = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/repository/files/" + path + "/raw", __assign({ref}, options));
      };
      return RepositoryFiles2;
    }(requesterUtils.BaseService);
    var Runners = function(_super) {
      __extends(Runners2, _super);
      function Runners2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Runners2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, options = __rest(_a, ["projectId"]);
        var url2 = projectId ? "projects/" + encodeURIComponent(projectId) + "/runners" : "runners/all";
        return RequestHelper.get(this, url2, options);
      };
      Runners2.prototype.allOwned = function(options) {
        return RequestHelper.get(this, "runners", options);
      };
      Runners2.prototype.edit = function(runnerId, options) {
        var rId = encodeURIComponent(runnerId);
        return RequestHelper.put(this, "runners/" + rId, options);
      };
      Runners2.prototype.enable = function(projectId, runnerId, options) {
        var _a = __read([projectId, runnerId].map(encodeURIComponent), 2), pId = _a[0], rId = _a[1];
        return RequestHelper.post(this, "projects/" + pId + "/runners", __assign({runnerId: rId}, options));
      };
      Runners2.prototype.disable = function(projectId, runnerId, options) {
        var _a = __read([projectId, runnerId].map(encodeURIComponent), 2), pId = _a[0], rId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/runners/" + rId, options);
      };
      Runners2.prototype.jobs = function(runnerId, options) {
        var rId = encodeURIComponent(runnerId);
        return RequestHelper.get(this, "runners/" + rId + "/jobs", options);
      };
      Runners2.prototype.remove = function(runnerId, options) {
        var rId = encodeURIComponent(runnerId);
        return RequestHelper.del(this, "runners/" + rId, options);
      };
      Runners2.prototype.show = function(runnerId, options) {
        var rId = encodeURIComponent(runnerId);
        return RequestHelper.get(this, "runners/" + rId, options);
      };
      return Runners2;
    }(requesterUtils.BaseService);
    var Services = function(_super) {
      __extends(Services2, _super);
      function Services2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Services2.prototype.edit = function(projectId, serviceName, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.put(this, "projects/" + pId + "/services/" + serviceName, options);
      };
      Services2.prototype.remove = function(projectId, serviceName, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.del(this, "projects/" + pId + "/services/" + serviceName, options);
      };
      Services2.prototype.show = function(projectId, serviceName, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/services/" + serviceName, options);
      };
      return Services2;
    }(requesterUtils.BaseService);
    var Tags = function(_super) {
      __extends(Tags2, _super);
      function Tags2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Tags2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/repository/tags", options);
      };
      Tags2.prototype.create = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/repository/tags", options);
      };
      Tags2.prototype.remove = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/repository/tags/" + tId, options);
      };
      Tags2.prototype.show = function(projectId, tagName, options) {
        var _a = __read([projectId, tagName].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/repository/tags/" + tId, options);
      };
      return Tags2;
    }(requesterUtils.BaseService);
    var Todos = function(_super) {
      __extends(Todos2, _super);
      function Todos2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Todos2.prototype.all = function(options) {
        return RequestHelper.get(this, "todos", options);
      };
      Todos2.prototype.create = function(projectId, resourceId, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var resourceName = _a.resourceName, options = __rest(_a, ["resourceName"]);
        if (resourceName === "issue") {
          return RequestHelper.post(this, "projects/" + projectId + "/issues/" + resourceId + "/todo", options);
        }
        return RequestHelper.post(this, "projects/" + projectId + "/merge_requests/" + resourceId + "/todo", options);
      };
      Todos2.prototype.done = function(_a) {
        var todoId = _a.todoId, options = __rest(_a, ["todoId"]);
        var url2 = "mark_as_done";
        if (todoId)
          url2 = todoId + "/" + url2;
        return RequestHelper.post(this, "todos/" + url2, options);
      };
      return Todos2;
    }(requesterUtils.BaseService);
    var Triggers = function(_super) {
      __extends(Triggers2, _super);
      function Triggers2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Triggers2.prototype.add = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/triggers", options);
      };
      Triggers2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/triggers", options);
      };
      Triggers2.prototype.edit = function(projectId, triggerId, options) {
        var _a = __read([projectId, triggerId].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/triggers/" + tId, options);
      };
      Triggers2.prototype.pipeline = function(projectId, ref, token, _a) {
        var _b = _a === void 0 ? {} : _a, variables = _b.variables;
        var pId = encodeURIComponent(projectId);
        var hapiVariables = {};
        if (variables) {
          Object.entries(variables).forEach(function(_a2) {
            var _b2 = __read(_a2, 2), k = _b2[0], v = _b2[1];
            hapiVariables["variables[" + k + "]"] = v;
          });
        }
        return RequestHelper.post(this, "projects/" + pId + "/trigger/pipeline", __assign({
          isForm: true,
          ref,
          token
        }, hapiVariables));
      };
      Triggers2.prototype.remove = function(projectId, triggerId, options) {
        var _a = __read([projectId, triggerId].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/triggers/" + tId, options);
      };
      Triggers2.prototype.show = function(projectId, triggerId, options) {
        var _a = __read([projectId, triggerId].map(encodeURIComponent), 2), pId = _a[0], tId = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/triggers/" + tId, options);
      };
      return Triggers2;
    }(requesterUtils.BaseService);
    var VulnerabilityFindings = function(_super) {
      __extends(VulnerabilityFindings2, _super);
      function VulnerabilityFindings2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      VulnerabilityFindings2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/vulnerability_findings", options);
      };
      return VulnerabilityFindings2;
    }(requesterUtils.BaseService);
    var ApplicationSettings = function(_super) {
      __extends(ApplicationSettings2, _super);
      function ApplicationSettings2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ApplicationSettings2.prototype.all = function(options) {
        return RequestHelper.get(this, "application/settings", options);
      };
      ApplicationSettings2.prototype.edit = function(options) {
        return RequestHelper.put(this, "application/settings", options);
      };
      return ApplicationSettings2;
    }(requesterUtils.BaseService);
    var BroadcastMessages = function(_super) {
      __extends(BroadcastMessages2, _super);
      function BroadcastMessages2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      BroadcastMessages2.prototype.all = function(options) {
        return RequestHelper.get(this, "broadcast_messages", options);
      };
      BroadcastMessages2.prototype.create = function(options) {
        return RequestHelper.post(this, "broadcast_messages", options);
      };
      BroadcastMessages2.prototype.edit = function(broadcastMessageId, options) {
        var bId = encodeURIComponent(broadcastMessageId);
        return RequestHelper.put(this, "broadcast_messages/" + bId, options);
      };
      BroadcastMessages2.prototype.remove = function(broadcastMessageId, options) {
        var bId = encodeURIComponent(broadcastMessageId);
        return RequestHelper.del(this, "broadcast_messages/" + bId, options);
      };
      BroadcastMessages2.prototype.show = function(broadcastMessageId, options) {
        var bId = encodeURIComponent(broadcastMessageId);
        return RequestHelper.get(this, "broadcast_messages/" + bId, options);
      };
      return BroadcastMessages2;
    }(requesterUtils.BaseService);
    var Events = function(_super) {
      __extends(Events2, _super);
      function Events2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Events2.prototype.all = function(options) {
        return RequestHelper.get(this, "events", options);
      };
      return Events2;
    }(requesterUtils.BaseService);
    var FeatureFlags = function(_super) {
      __extends(FeatureFlags2, _super);
      function FeatureFlags2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      FeatureFlags2.prototype.all = function(options) {
        return RequestHelper.get(this, "features", options);
      };
      FeatureFlags2.prototype.set = function(name, options) {
        var encodedName = encodeURIComponent(name);
        return RequestHelper.post(this, "features/" + encodedName, options);
      };
      return FeatureFlags2;
    }(requesterUtils.BaseService);
    var GeoNodes = function(_super) {
      __extends(GeoNodes2, _super);
      function GeoNodes2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      GeoNodes2.prototype.all = function(options) {
        return RequestHelper.get(this, "geo_nodes", options);
      };
      GeoNodes2.prototype.create = function(geonodeId, options) {
        var gId = encodeURIComponent(geonodeId);
        return RequestHelper.post(this, "geo_nodes/" + gId, options);
      };
      GeoNodes2.prototype.edit = function(geonodeId, options) {
        var gId = encodeURIComponent(geonodeId);
        return RequestHelper.put(this, "geo_nodes/" + gId, options);
      };
      GeoNodes2.prototype.failures = function(options) {
        return RequestHelper.post(this, "geo_nodes/current/failures", options);
      };
      GeoNodes2.prototype.repair = function(geonodeId, options) {
        var gId = encodeURIComponent(geonodeId);
        return RequestHelper.del(this, "geo_nodes/" + gId, options);
      };
      GeoNodes2.prototype.show = function(geonodeId, options) {
        var gId = encodeURIComponent(geonodeId);
        return RequestHelper.get(this, "geo_nodes/" + gId, options);
      };
      GeoNodes2.prototype.status = function(geonodeId, options) {
        var gId = encodeURIComponent(geonodeId);
        return RequestHelper.get(this, "geo_nodes/" + gId + "/status", options);
      };
      GeoNodes2.prototype.statuses = function(options) {
        return RequestHelper.get(this, "geo_nodes/statuses", options);
      };
      return GeoNodes2;
    }(requesterUtils.BaseService);
    var GitignoreTemplates = function(_super) {
      __extends(GitignoreTemplates2, _super);
      function GitignoreTemplates2(options) {
        return _super.call(this, "gitignores", options) || this;
      }
      return GitignoreTemplates2;
    }(ResourceTemplates);
    var GitLabCIYMLTemplates = function(_super) {
      __extends(GitLabCIYMLTemplates2, _super);
      function GitLabCIYMLTemplates2(options) {
        return _super.call(this, "gitlab_ci_ymls", options) || this;
      }
      return GitLabCIYMLTemplates2;
    }(ResourceTemplates);
    var Keys = function(_super) {
      __extends(Keys2, _super);
      function Keys2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Keys2.prototype.show = function(keyId, options) {
        var kId = encodeURIComponent(keyId);
        return RequestHelper.get(this, "keys/" + kId, options);
      };
      return Keys2;
    }(requesterUtils.BaseService);
    var License = function(_super) {
      __extends(License2, _super);
      function License2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      License2.prototype.add = function(license, options) {
        return RequestHelper.post(this, "license", __assign({license}, options));
      };
      License2.prototype.all = function(options) {
        return RequestHelper.get(this, "licenses", options);
      };
      License2.prototype.show = function(options) {
        return RequestHelper.get(this, "license", options);
      };
      License2.prototype.remove = function(licenceId, options) {
        var lId = encodeURIComponent(licenceId);
        return RequestHelper.del(this, "license/" + lId, options);
      };
      return License2;
    }(requesterUtils.BaseService);
    var LicenceTemplates = function(_super) {
      __extends(LicenceTemplates2, _super);
      function LicenceTemplates2(options) {
        if (options === void 0) {
          options = {};
        }
        return _super.call(this, "licences", options) || this;
      }
      return LicenceTemplates2;
    }(ResourceTemplates);
    var Lint = function(_super) {
      __extends(Lint2, _super);
      function Lint2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Lint2.prototype.lint = function(content, options) {
        return RequestHelper.post(this, "ci/lint", __assign({content}, options));
      };
      return Lint2;
    }(requesterUtils.BaseService);
    var Namespaces = function(_super) {
      __extends(Namespaces2, _super);
      function Namespaces2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Namespaces2.prototype.all = function(options) {
        return RequestHelper.get(this, "namespaces", options);
      };
      Namespaces2.prototype.show = function(namespaceId, options) {
        var nId = encodeURIComponent(namespaceId);
        return RequestHelper.get(this, "namespaces/" + nId, options);
      };
      return Namespaces2;
    }(requesterUtils.BaseService);
    function url(_a) {
      var projectId = _a.projectId, groupId = _a.groupId;
      var uri = "";
      if (projectId) {
        uri += "projects/" + encodeURIComponent(projectId) + "/";
      } else if (groupId) {
        uri += "groups/" + encodeURIComponent(groupId) + "/";
      }
      return uri + "notification_settings";
    }
    var NotificationSettings = function(_super) {
      __extends(NotificationSettings2, _super);
      function NotificationSettings2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NotificationSettings2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, groupId = _a.groupId, options = __rest(_a, ["projectId", "groupId"]);
        return RequestHelper.get(this, url({groupId, projectId}), options);
      };
      NotificationSettings2.prototype.edit = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, groupId = _a.groupId, options = __rest(_a, ["projectId", "groupId"]);
        return RequestHelper.put(this, url({groupId, projectId}), options);
      };
      return NotificationSettings2;
    }(requesterUtils.BaseService);
    var Markdown = function(_super) {
      __extends(Markdown2, _super);
      function Markdown2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Markdown2.prototype.render = function(text, options) {
        return RequestHelper.post(this, "markdown", __assign({text}, options));
      };
      return Markdown2;
    }(requesterUtils.BaseService);
    var PagesDomains = function(_super) {
      __extends(PagesDomains2, _super);
      function PagesDomains2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      PagesDomains2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, options = __rest(_a, ["projectId"]);
        var url2 = projectId ? "projects/" + encodeURIComponent(projectId) + "/" : "";
        return RequestHelper.get(this, url2 + "pages/domains", options);
      };
      PagesDomains2.prototype.create = function(projectId, domain, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/pages/domains", __assign({domain}, options));
      };
      PagesDomains2.prototype.edit = function(projectId, domain, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.put(this, "projects/" + pId + "/pages/domains/" + domain, options);
      };
      PagesDomains2.prototype.show = function(projectId, domain, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/pages/domains/" + domain, options);
      };
      PagesDomains2.prototype.remove = function(projectId, domain, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.del(this, "projects/" + pId + "/pages/domains/" + domain, options);
      };
      return PagesDomains2;
    }(requesterUtils.BaseService);
    var Search = function(_super) {
      __extends(Search2, _super);
      function Search2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Search2.prototype.all = function(scope, search, _a) {
        if (_a === void 0) {
          _a = {};
        }
        var projectId = _a.projectId, groupId = _a.groupId, options = __rest(_a, ["projectId", "groupId"]);
        var url2 = "";
        if (projectId) {
          url2 += "projects/" + encodeURIComponent(projectId) + "/";
        } else if (groupId) {
          url2 += "groups/" + encodeURIComponent(groupId) + "/";
        }
        return RequestHelper.get(this, url2 + "search", __assign({scope, search}, options));
      };
      return Search2;
    }(requesterUtils.BaseService);
    var SidekiqMetrics = function(_super) {
      __extends(SidekiqMetrics2, _super);
      function SidekiqMetrics2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SidekiqMetrics2.prototype.queueMetrics = function() {
        return RequestHelper.get(this, "sidekiq/queue_metrics");
      };
      SidekiqMetrics2.prototype.processMetrics = function() {
        return RequestHelper.get(this, "sidekiq/process_metrics");
      };
      SidekiqMetrics2.prototype.jobStats = function() {
        return RequestHelper.get(this, "sidekiq/job_stats");
      };
      SidekiqMetrics2.prototype.compoundMetrics = function() {
        return RequestHelper.get(this, "sidekiq/compound_metrics");
      };
      return SidekiqMetrics2;
    }(requesterUtils.BaseService);
    var Snippets = function(_super) {
      __extends(Snippets2, _super);
      function Snippets2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Snippets2.prototype.all = function(_a) {
        if (_a === void 0) {
          _a = {};
        }
        var p = _a.public, options = __rest(_a, ["public"]);
        var url2 = p ? "snippets/public" : "snippets";
        return RequestHelper.get(this, url2, options);
      };
      Snippets2.prototype.content = function(snippetId, options) {
        var sId = encodeURIComponent(snippetId);
        return RequestHelper.get(this, "snippets/" + sId + "/raw", options);
      };
      Snippets2.prototype.create = function(title, fileName, content, visibility, options) {
        return RequestHelper.post(this, "snippets", __assign({
          title,
          fileName,
          content,
          visibility
        }, options));
      };
      Snippets2.prototype.edit = function(snippetId, options) {
        var sId = encodeURIComponent(snippetId);
        return RequestHelper.put(this, "snippets/" + sId, options);
      };
      Snippets2.prototype.remove = function(snippetId, options) {
        var sId = encodeURIComponent(snippetId);
        return RequestHelper.del(this, "snippets/" + sId, options);
      };
      Snippets2.prototype.show = function(snippetId, options) {
        var sId = encodeURIComponent(snippetId);
        return RequestHelper.get(this, "snippets/" + sId, options);
      };
      Snippets2.prototype.userAgentDetails = function(snippetId, options) {
        var sId = encodeURIComponent(snippetId);
        return RequestHelper.get(this, "snippets/" + sId + "/user_agent_detail", options);
      };
      return Snippets2;
    }(requesterUtils.BaseService);
    var SystemHooks = function(_super) {
      __extends(SystemHooks2, _super);
      function SystemHooks2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SystemHooks2.prototype.add = function(url2, options) {
        return RequestHelper.post(this, "hooks", __assign({url: url2}, options));
      };
      SystemHooks2.prototype.all = function(options) {
        return RequestHelper.get(this, "hooks", options);
      };
      SystemHooks2.prototype.edit = function(hookId, url2, options) {
        var hId = encodeURIComponent(hookId);
        return RequestHelper.put(this, "hooks/" + hId, __assign({url: url2}, options));
      };
      SystemHooks2.prototype.remove = function(hookId, options) {
        var hId = encodeURIComponent(hookId);
        return RequestHelper.del(this, "hooks/" + hId, options);
      };
      return SystemHooks2;
    }(requesterUtils.BaseService);
    var Version = function(_super) {
      __extends(Version2, _super);
      function Version2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Version2.prototype.show = function(options) {
        return RequestHelper.get(this, "version", options);
      };
      return Version2;
    }(requesterUtils.BaseService);
    var Wikis = function(_super) {
      __extends(Wikis2, _super);
      function Wikis2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Wikis2.prototype.all = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.get(this, "projects/" + pId + "/wikis", options);
      };
      Wikis2.prototype.create = function(projectId, options) {
        var pId = encodeURIComponent(projectId);
        return RequestHelper.post(this, "projects/" + pId + "/wikis", options);
      };
      Wikis2.prototype.edit = function(projectId, slug, options) {
        var _a = __read([projectId, slug].map(encodeURIComponent), 2), pId = _a[0], s = _a[1];
        return RequestHelper.put(this, "projects/" + pId + "/wikis/" + s, options);
      };
      Wikis2.prototype.show = function(projectId, slug, options) {
        var _a = __read([projectId, slug].map(encodeURIComponent), 2), pId = _a[0], s = _a[1];
        return RequestHelper.get(this, "projects/" + pId + "/wikis/" + s, options);
      };
      Wikis2.prototype.remove = function(projectId, slug, options) {
        var _a = __read([projectId, slug].map(encodeURIComponent), 2), pId = _a[0], s = _a[1];
        return RequestHelper.del(this, "projects/" + pId + "/wikis/" + s, options);
      };
      return Wikis2;
    }(requesterUtils.BaseService);
    var APIServices = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      Groups,
      GroupAccessRequests,
      GroupBadges,
      GroupCustomAttributes,
      GroupIssueBoards,
      GroupMembers,
      GroupMilestones,
      GroupProjects,
      GroupRunners,
      GroupVariables,
      GroupLabels,
      GroupDeployTokens,
      Epics,
      EpicIssues,
      EpicNotes,
      EpicDiscussions,
      Users,
      UserCustomAttributes,
      UserEmails,
      UserImpersonationTokens,
      UserKeys,
      UserGPGKeys,
      Branches,
      Commits,
      CommitDiscussions,
      ContainerRegistry,
      Deployments,
      DeployKeys,
      Environments,
      FreezePeriods,
      Issues,
      IssuesStatistics,
      IssueNotes,
      IssueDiscussions,
      IssueAwardEmojis,
      Jobs,
      Labels,
      MergeRequests,
      MergeRequestApprovals,
      MergeRequestAwardEmojis,
      MergeRequestDiscussions,
      MergeRequestNotes,
      Packages,
      Pipelines,
      PipelineSchedules,
      PipelineScheduleVariables,
      Projects,
      ProjectAccessRequests,
      ProjectBadges,
      ProjectCustomAttributes,
      ProjectImportExport,
      ProjectIssueBoards,
      ProjectHooks,
      ProjectMembers,
      ProjectMilestones,
      ProjectSnippets,
      ProjectSnippetNotes,
      ProjectSnippetDiscussions,
      ProjectSnippetAwardEmojis,
      ProtectedBranches,
      ProtectedTags,
      ProjectVariables,
      ProjectDeployTokens,
      PushRules,
      Releases,
      ReleaseLinks,
      Repositories,
      RepositoryFiles,
      Runners,
      Services,
      Tags,
      Todos,
      Triggers,
      VulnerabilityFindings,
      ApplicationSettings,
      BroadcastMessages,
      Events,
      FeatureFlags,
      GeoNodes,
      GitignoreTemplates,
      GitLabCIYMLTemplates,
      Keys,
      License,
      LicenceTemplates,
      Lint,
      Namespaces,
      NotificationSettings,
      Markdown,
      PagesDomains,
      Search,
      SidekiqMetrics,
      Snippets,
      SystemHooks,
      Version,
      Wikis
    });
    function getAPIMap() {
      if (!'{"ApplicationSettings":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"edit","args":[]}],"Branches":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId","branchName","ref"]},{"name":"protect","args":["projectId","branchName"]},{"name":"remove","args":["projectId","branchName"]},{"name":"show","args":["projectId","branchName"]},{"name":"unprotect","args":["projectId","branchName"]}],"BroadcastMessages":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":[]},{"name":"edit","args":["broadcastMessageId"]},{"name":"remove","args":["broadcastMessageId"]},{"name":"show","args":["broadcastMessageId"]}],"CommitDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"Commits":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"cherryPick","args":["projectId","sha","branch"]},{"name":"comments","args":["projectId","sha"]},{"name":"create","args":["projectId"]},{"name":"createComment","args":["projectId","sha","note"]},{"name":"diff","args":["projectId","sha"]},{"name":"editStatus","args":["projectId","sha"]},{"name":"references","args":["projectId","sha"]},{"name":"revert","args":["projectId","sha"]},{"name":"show","args":["projectId","sha"]},{"name":"status","args":["projectId","sha"]},{"name":"mergeRequests","args":["projectId","sha"]},{"name":"signature","args":["projectId","sha"]}],"ContainerRegistry":[{"name":"constructor","args":["0","1"]},{"name":"repositories","args":["projectId"]},{"name":"tags","args":["projectId","repositoryId"]},{"name":"removeRepository","args":["projectId","repositoryId"]},{"name":"removeTag","args":["projectId","repositoryId","tagName"]},{"name":"removeTags","args":["projectId","repositoryId","nameRegexDelete"]},{"name":"showTag","args":["projectId","repositoryId","tagName"]}],"DeployKeys":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["projectId"]},{"name":"all","args":[]},{"name":"edit","args":["projectId","keyId"]},{"name":"enable","args":["projectId","keyId"]},{"name":"remove","args":["projectId","keyId"]},{"name":"show","args":["projectId","keyId"]}],"Deployments":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","deploymentId"]},{"name":"mergeRequests","args":["projectId","deploymentId"]}],"Environments":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","environmentId"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId","environmentId"]},{"name":"remove","args":["projectId","environmentId"]},{"name":"stop","args":["projectId","environmentId"]}],"EpicDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"EpicIssues":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId","epicId"]},{"name":"assign","args":["groupId","epicId","issueId"]},{"name":"edit","args":["groupId","epicId","issueId"]},{"name":"remove","args":["groupId","epicId","issueId"]}],"EpicNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"Epics":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId"]},{"name":"create","args":["groupId","title"]},{"name":"edit","args":["groupId","epicId"]},{"name":"remove","args":["groupId","epicId"]},{"name":"show","args":["groupId","epicId"]}],"Events":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]}],"FeatureFlags":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"set","args":["name"]}],"FreezePeriods":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","freezePeriodId"]},{"name":"create","args":["projectId","freezeStart","freezeEnd"]},{"name":"edit","args":["projectId","freezePeriodId"]},{"name":"delete","args":["projectId","freezePeriodId"]}],"GeoNodes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["geonodeId"]},{"name":"edit","args":["geonodeId"]},{"name":"failures","args":[]},{"name":"repair","args":["geonodeId"]},{"name":"show","args":["geonodeId"]},{"name":"status","args":["geonodeId"]},{"name":"statuses","args":[]}],"GitLabCIYMLTemplates":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["resourceId"]}],"GitignoreTemplates":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["resourceId"]}],"GroupAccessRequests":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"request","args":["resourceId"]},{"name":"approve","args":["resourceId","userId"]},{"name":"deny","args":["resourceId","userId"]}],"GroupBadges":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","badgeId"]},{"name":"preview","args":["resourceId","linkUrl","imageUrl"]},{"name":"remove","args":["resourceId","badgeId"]},{"name":"show","args":["resourceId","badgeId"]}],"GroupCustomAttributes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"set","args":["resourceId","customAttributeId","value"]},{"name":"remove","args":["resourceId","customAttributeId"]},{"name":"show","args":["resourceId","customAttributeId"]}],"GroupDeployTokens":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","tokenName","tokenScopes"]},{"name":"all","args":[]},{"name":"remove","args":["resourceId","tokenId"]}],"GroupIssueBoards":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","name"]},{"name":"createList","args":["resourceId","boardId","labelId"]},{"name":"edit","args":["resourceId","boardId"]},{"name":"editList","args":["resourceId","boardId","listId","position"]},{"name":"lists","args":["resourceId","boardId"]},{"name":"remove","args":["resourceId","boardId"]},{"name":"removeList","args":["resourceId","boardId","listId"]},{"name":"show","args":["resourceId","boardId"]},{"name":"showList","args":["resourceId","boardId","listId"]}],"GroupLabels":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","labelName","color"]},{"name":"edit","args":["resourceId","labelName"]},{"name":"remove","args":["resourceId","labelName"]},{"name":"subscribe","args":["resourceId","labelId"]},{"name":"unsubscribe","args":["resourceId","labelId"]}],"GroupMembers":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","userId","accessLevel"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","userId","accessLevel"]},{"name":"show","args":["resourceId","userId"]},{"name":"remove","args":["resourceId","userId"]}],"GroupMilestones":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","title"]},{"name":"edit","args":["resourceId","milestoneId"]},{"name":"issues","args":["resourceId","milestoneId"]},{"name":"mergeRequests","args":["resourceId","milestoneId"]},{"name":"show","args":["resourceId","milestoneId"]}],"GroupProjects":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId"]},{"name":"add","args":["groupId","projectId"]}],"GroupRunners":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId"]}],"GroupVariables":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId"]},{"name":"edit","args":["resourceId","keyId"]},{"name":"show","args":["resourceId","keyId"]},{"name":"remove","args":["resourceId","keyId"]}],"Groups":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["name","path"]},{"name":"createLDAPLink","args":["groupId","cn","groupAccess","provider"]},{"name":"edit","args":["groupId"]},{"name":"projects","args":["groupId"]},{"name":"remove","args":["groupId"]},{"name":"removeLDAPLink","args":["groupId","cn"]},{"name":"search","args":["nameOrPath"]},{"name":"show","args":["groupId"]},{"name":"subgroups","args":["groupId"]},{"name":"syncLDAP","args":["groupId"]}],"IssueAwardEmojis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","resourceId","noteId"]},{"name":"award","args":["projectId","resourceId","noteId","name"]},{"name":"remove","args":["projectId","resourceId","noteId","awardId"]},{"name":"show","args":["projectId","resourceId","noteId","awardId"]}],"IssueDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"IssueNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"Issues":[{"name":"constructor","args":["0","1"]},{"name":"addSpentTime","args":["projectId","issueIid","duration"]},{"name":"addTimeEstimate","args":["projectId","issueIid","duration"]},{"name":"all","args":[]},{"name":"create","args":["projectId"]},{"name":"closedBy","args":["projectId","issueIid"]},{"name":"edit","args":["projectId","issueIid"]},{"name":"link","args":["projectId","issueIid","targetProjectId","targetIssueIid"]},{"name":"links","args":["projectId","issueIid"]},{"name":"participants","args":["projectId","issueIid"]},{"name":"relatedMergeRequests","args":["projectId","issueIid"]},{"name":"removeLink","args":["projectId","issueIid","issueLinkId"]},{"name":"remove","args":["projectId","issueIid"]},{"name":"resetSpentTime","args":["projectId","issueIid"]},{"name":"resetTimeEstimate","args":["projectId","issueIid"]},{"name":"show","args":["projectId","issueIid"]},{"name":"subscribe","args":["projectId","issueIid"]},{"name":"timeStats","args":["projectId","issueIid"]},{"name":"unsubscribe","args":["projectId","issueIid"]}],"IssuesStatistics":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]}],"Jobs":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"cancel","args":["projectId","jobId"]},{"name":"downloadSingleArtifactFile","args":["projectId","jobId","artifactPath"]},{"name":"downloadSingleArtifactFileFromRef","args":["projectId","ref","artifactPath","jobName"]},{"name":"downloadLatestArtifactFile","args":["projectId","ref","jobName"]},{"name":"downloadTraceFile","args":["projectId","jobId"]},{"name":"erase","args":["projectId","jobId"]},{"name":"eraseArtifacts","args":["projectId","jobId"]},{"name":"keepArtifacts","args":["projectId","jobId"]},{"name":"play","args":["projectId","jobId"]},{"name":"retry","args":["projectId","jobId"]},{"name":"show","args":["projectId","jobId"]},{"name":"showPipelineJobs","args":["projectId","pipelineId"]}],"Keys":[{"name":"constructor","args":["0","1"]},{"name":"show","args":["keyId"]}],"Labels":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","labelName","color"]},{"name":"edit","args":["resourceId","labelName"]},{"name":"remove","args":["resourceId","labelName"]},{"name":"subscribe","args":["resourceId","labelId"]},{"name":"unsubscribe","args":["resourceId","labelId"]}],"LicenceTemplates":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["resourceId"]}],"License":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["license"]},{"name":"all","args":[]},{"name":"show","args":[]},{"name":"remove","args":["licenceId"]}],"Lint":[{"name":"constructor","args":["0","1"]},{"name":"lint","args":["content"]}],"Markdown":[{"name":"constructor","args":["0","1"]},{"name":"render","args":["text"]}],"MergeRequestApprovals":[{"name":"constructor","args":["0","1"]},{"name":"addApprovalRule","args":["projectId","name","approvalsRequired"]},{"name":"approvalRules","args":["projectId"]},{"name":"approvals","args":["projectId"]},{"name":"approvalState","args":["projectId","mergerequestIid"]},{"name":"approve","args":["projectId","mergerequestIid"]},{"name":"approvers","args":["projectId","approverIds","approverGroupIds"]},{"name":"editApprovalRule","args":["projectId","approvalRuleId","name","approvalsRequired"]},{"name":"editApprovals","args":["projectId"]},{"name":"removeApprovalRule","args":["projectId","approvalRuleId"]},{"name":"unapprove","args":["projectId","mergerequestIid"]}],"MergeRequestAwardEmojis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","resourceId","noteId"]},{"name":"award","args":["projectId","resourceId","noteId","name"]},{"name":"remove","args":["projectId","resourceId","noteId","awardId"]},{"name":"show","args":["projectId","resourceId","noteId","awardId"]}],"MergeRequestDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"MergeRequestNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"MergeRequests":[{"name":"constructor","args":["0","1"]},{"name":"accept","args":["projectId","mergerequestIid"]},{"name":"addSpentTime","args":["projectId","mergerequestIid","duration"]},{"name":"addTimeEstimate","args":["projectId","mergerequestIid","duration"]},{"name":"all","args":[]},{"name":"cancelOnPipelineSucess","args":["projectId","mergerequestIid"]},{"name":"changes","args":["projectId","mergerequestIid"]},{"name":"closesIssues","args":["projectId","mergerequestIid"]},{"name":"commits","args":["projectId","mergerequestIid"]},{"name":"create","args":["projectId","sourceBranch","targetBranch","title"]},{"name":"edit","args":["projectId","mergerequestIid"]},{"name":"participants","args":["projectId","mergerequestIid"]},{"name":"pipelines","args":["projectId","mergerequestIid"]},{"name":"rebase","args":["projectId","mergerequestIid"]},{"name":"remove","args":["projectId","mergerequestIid"]},{"name":"resetSpentTime","args":["projectId","mergerequestIid"]},{"name":"resetTimeEstimate","args":["projectId","mergerequestIid"]},{"name":"show","args":["projectId","mergerequestIid"]},{"name":"subscribe","args":["projectId","mergerequestIid"]},{"name":"timeStats","args":["projectId","mergerequestIid"]},{"name":"version","args":["projectId","mergerequestIid","versionId"]},{"name":"versions","args":["projectId","mergerequestIid"]},{"name":"unsubscribe","args":["projectId","mergerequestIid"]}],"Namespaces":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["namespaceId"]}],"NotificationSettings":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"edit","args":[]}],"Packages":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"remove","args":["projectId","packageId"]},{"name":"show","args":["projectId","packageId"]},{"name":"showFiles","args":["projectId","packageId"]}],"PagesDomains":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["projectId","domain"]},{"name":"edit","args":["projectId","domain"]},{"name":"show","args":["projectId","domain"]},{"name":"remove","args":["projectId","domain"]}],"PipelineScheduleVariables":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","pipelineScheduleId"]},{"name":"create","args":["projectId","pipelineScheduleId"]},{"name":"edit","args":["projectId","pipelineScheduleId","keyId"]},{"name":"show","args":["projectId","pipelineScheduleId","keyId"]},{"name":"remove","args":["projectId","pipelineScheduleId","keyId"]}],"PipelineSchedules":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId","description","ref","cron"]},{"name":"edit","args":["projectId","scheduleId"]},{"name":"remove","args":["projectId","scheduleId"]},{"name":"show","args":["projectId","scheduleId"]},{"name":"takeOwnership","args":["projectId","scheduleId"]}],"Pipelines":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId","ref"]},{"name":"delete","args":["projectId","pipelineId"]},{"name":"show","args":["projectId","pipelineId"]},{"name":"retry","args":["projectId","pipelineId"]},{"name":"cancel","args":["projectId","pipelineId"]},{"name":"allVariables","args":["projectId","pipelineId"]}],"ProjectAccessRequests":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"request","args":["resourceId"]},{"name":"approve","args":["resourceId","userId"]},{"name":"deny","args":["resourceId","userId"]}],"ProjectBadges":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","badgeId"]},{"name":"preview","args":["resourceId","linkUrl","imageUrl"]},{"name":"remove","args":["resourceId","badgeId"]},{"name":"show","args":["resourceId","badgeId"]}],"ProjectCustomAttributes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"set","args":["resourceId","customAttributeId","value"]},{"name":"remove","args":["resourceId","customAttributeId"]},{"name":"show","args":["resourceId","customAttributeId"]}],"ProjectDeployTokens":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","tokenName","tokenScopes"]},{"name":"all","args":[]},{"name":"remove","args":["resourceId","tokenId"]}],"ProjectHooks":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","hookId"]},{"name":"add","args":["projectId","url"]},{"name":"edit","args":["projectId","hookId","url"]},{"name":"remove","args":["projectId","hookId"]}],"ProjectImportExport":[{"name":"constructor","args":["0","1"]},{"name":"download","args":["projectId"]},{"name":"exportStatus","args":["projectId"]},{"name":"import","args":["content","path"]},{"name":"importStatus","args":["projectId"]},{"name":"schedule","args":["projectId"]}],"ProjectIssueBoards":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","name"]},{"name":"createList","args":["resourceId","boardId","labelId"]},{"name":"edit","args":["resourceId","boardId"]},{"name":"editList","args":["resourceId","boardId","listId","position"]},{"name":"lists","args":["resourceId","boardId"]},{"name":"remove","args":["resourceId","boardId"]},{"name":"removeList","args":["resourceId","boardId","listId"]},{"name":"show","args":["resourceId","boardId"]},{"name":"showList","args":["resourceId","boardId","listId"]}],"ProjectMembers":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","userId","accessLevel"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","userId","accessLevel"]},{"name":"show","args":["resourceId","userId"]},{"name":"remove","args":["resourceId","userId"]}],"ProjectMilestones":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","title"]},{"name":"edit","args":["resourceId","milestoneId"]},{"name":"issues","args":["resourceId","milestoneId"]},{"name":"mergeRequests","args":["resourceId","milestoneId"]},{"name":"show","args":["resourceId","milestoneId"]}],"ProjectSnippetAwardEmojis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","resourceId","noteId"]},{"name":"award","args":["projectId","resourceId","noteId","name"]},{"name":"remove","args":["projectId","resourceId","noteId","awardId"]},{"name":"show","args":["projectId","resourceId","noteId","awardId"]}],"ProjectSnippetDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"ProjectSnippetNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"ProjectSnippets":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"content","args":["projectId","snippetId"]},{"name":"create","args":["projectId","title","fileName","code","visibility"]},{"name":"edit","args":["projectId","snippetId"]},{"name":"remove","args":["projectId","snippetId"]},{"name":"show","args":["projectId","snippetId"]},{"name":"userAgentDetails","args":["projectId","snippetId"]}],"ProjectVariables":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId"]},{"name":"edit","args":["resourceId","keyId"]},{"name":"show","args":["resourceId","keyId"]},{"name":"remove","args":["resourceId","keyId"]}],"Projects":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"archive","args":["projectId"]},{"name":"create","args":[]},{"name":"edit","args":["projectId"]},{"name":"events","args":["projectId"]},{"name":"fork","args":["projectId"]},{"name":"forks","args":["projectId"]},{"name":"languages","args":["projectId"]},{"name":"mirrorPull","args":["projectId"]},{"name":"remove","args":["projectId"]},{"name":"removeFork","args":["projectId"]},{"name":"search","args":["projectName"]},{"name":"share","args":["projectId","groupId","groupAccess"]},{"name":"show","args":["projectId"]},{"name":"star","args":["projectId"]},{"name":"statuses","args":["projectId","sha","state"]},{"name":"transfer","args":["projectId","namespaceId"]},{"name":"unarchive","args":["projectId"]},{"name":"unshare","args":["projectId","groupId"]},{"name":"unstar","args":["projectId"]},{"name":"upload","args":["projectId","content"]}],"ProtectedBranches":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"protect","args":["projectId","branchName"]},{"name":"show","args":["projectId","branchName"]},{"name":"unprotect","args":["projectId","branchName"]}],"ProtectedTags":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"protect","args":["projectId","tagName"]},{"name":"show","args":["projectId","tagName"]},{"name":"unprotect","args":["projectId","tagName"]}],"PushRules":[{"name":"constructor","args":["0","1"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId"]},{"name":"remove","args":["projectId"]},{"name":"show","args":["projectId"]}],"ReleaseLinks":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","tagName"]},{"name":"create","args":["projectId","tagName","name","url"]},{"name":"edit","args":["projectId","tagName","linkId"]},{"name":"remove","args":["projectId","tagName","linkId"]},{"name":"show","args":["projectId","tagName","linkId"]}],"Releases":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId","tagName"]},{"name":"remove","args":["projectId","tagName"]},{"name":"show","args":["projectId","tagName"]}],"Repositories":[{"name":"constructor","args":["0","1"]},{"name":"compare","args":["projectId","from","to"]},{"name":"contributors","args":["projectId"]},{"name":"mergeBase","args":["projectId","refs"]},{"name":"showArchive","args":["projectId"]},{"name":"showBlob","args":["projectId","sha"]},{"name":"showBlobRaw","args":["projectId","sha"]},{"name":"tree","args":["projectId"]}],"RepositoryFiles":[{"name":"constructor","args":["0","1"]},{"name":"create","args":["projectId","filePath","branch","content","commitMessage"]},{"name":"edit","args":["projectId","filePath","branch","content","commitMessage"]},{"name":"remove","args":["projectId","filePath","branch","commitMessage"]},{"name":"show","args":["projectId","filePath","ref"]},{"name":"showBlame","args":["projectId","filePath"]},{"name":"showRaw","args":["projectId","filePath","ref"]}],"Runners":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"allOwned","args":[]},{"name":"edit","args":["runnerId"]},{"name":"enable","args":["projectId","runnerId"]},{"name":"disable","args":["projectId","runnerId"]},{"name":"jobs","args":["runnerId"]},{"name":"remove","args":["runnerId"]},{"name":"show","args":["runnerId"]}],"Search":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["scope","search"]}],"Services":[{"name":"constructor","args":["0","1"]},{"name":"edit","args":["projectId","serviceName"]},{"name":"remove","args":["projectId","serviceName"]},{"name":"show","args":["projectId","serviceName"]}],"SidekiqMetrics":[{"name":"constructor","args":["0","1"]},{"name":"queueMetrics","args":[]},{"name":"processMetrics","args":[]},{"name":"jobStats","args":[]},{"name":"compoundMetrics","args":[]}],"Snippets":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"content","args":["snippetId"]},{"name":"create","args":["title","fileName","content","visibility"]},{"name":"edit","args":["snippetId"]},{"name":"remove","args":["snippetId"]},{"name":"show","args":["snippetId"]},{"name":"userAgentDetails","args":["snippetId"]}],"SystemHooks":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["url"]},{"name":"all","args":[]},{"name":"edit","args":["hookId","url"]},{"name":"remove","args":["hookId"]}],"Tags":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId"]},{"name":"remove","args":["projectId","tagName"]},{"name":"show","args":["projectId","tagName"]}],"Todos":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["projectId","resourceId"]},{"name":"done","args":[]}],"Triggers":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["projectId"]},{"name":"all","args":["projectId"]},{"name":"edit","args":["projectId","triggerId"]},{"name":"pipeline","args":["projectId","ref","token",{}]},{"name":"remove","args":["projectId","triggerId"]},{"name":"show","args":["projectId","triggerId"]}],"UserCustomAttributes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"set","args":["resourceId","customAttributeId","value"]},{"name":"remove","args":["resourceId","customAttributeId"]},{"name":"show","args":["resourceId","customAttributeId"]}],"UserEmails":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"add","args":["email"]},{"name":"show","args":["emailId"]},{"name":"remove","args":["emailId"]}],"UserGPGKeys":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"add","args":["key"]},{"name":"show","args":["keyId"]},{"name":"remove","args":["keyId"]}],"UserImpersonationTokens":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["userId"]},{"name":"add","args":["userId","name","scopes","expiresAt"]},{"name":"show","args":["userId","tokenId"]},{"name":"revoke","args":["userId","tokenId"]}],"UserKeys":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["title","key"]},{"name":"show","args":["keyId"]},{"name":"remove","args":["keyId"]}],"Users":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"activities","args":[]},{"name":"projects","args":["userId"]},{"name":"block","args":["userId"]},{"name":"create","args":[]},{"name":"current","args":[]},{"name":"edit","args":["userId"]},{"name":"events","args":["userId"]},{"name":"search","args":["emailOrUsername"]},{"name":"show","args":["userId"]},{"name":"remove","args":["userId"]},{"name":"unblock","args":["userId"]}],"Version":[{"name":"constructor","args":["0","1"]},{"name":"show","args":[]}],"VulnerabilityFindings":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]}],"Wikis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId","slug"]},{"name":"show","args":["projectId","slug"]},{"name":"remove","args":["projectId","slug"]}]}'.includes("{")) {
        throw new Error("This function is only available in the distributed code");
      }
      return JSON.parse('{"ApplicationSettings":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"edit","args":[]}],"Branches":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId","branchName","ref"]},{"name":"protect","args":["projectId","branchName"]},{"name":"remove","args":["projectId","branchName"]},{"name":"show","args":["projectId","branchName"]},{"name":"unprotect","args":["projectId","branchName"]}],"BroadcastMessages":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":[]},{"name":"edit","args":["broadcastMessageId"]},{"name":"remove","args":["broadcastMessageId"]},{"name":"show","args":["broadcastMessageId"]}],"CommitDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"Commits":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"cherryPick","args":["projectId","sha","branch"]},{"name":"comments","args":["projectId","sha"]},{"name":"create","args":["projectId"]},{"name":"createComment","args":["projectId","sha","note"]},{"name":"diff","args":["projectId","sha"]},{"name":"editStatus","args":["projectId","sha"]},{"name":"references","args":["projectId","sha"]},{"name":"revert","args":["projectId","sha"]},{"name":"show","args":["projectId","sha"]},{"name":"status","args":["projectId","sha"]},{"name":"mergeRequests","args":["projectId","sha"]},{"name":"signature","args":["projectId","sha"]}],"ContainerRegistry":[{"name":"constructor","args":["0","1"]},{"name":"repositories","args":["projectId"]},{"name":"tags","args":["projectId","repositoryId"]},{"name":"removeRepository","args":["projectId","repositoryId"]},{"name":"removeTag","args":["projectId","repositoryId","tagName"]},{"name":"removeTags","args":["projectId","repositoryId","nameRegexDelete"]},{"name":"showTag","args":["projectId","repositoryId","tagName"]}],"DeployKeys":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["projectId"]},{"name":"all","args":[]},{"name":"edit","args":["projectId","keyId"]},{"name":"enable","args":["projectId","keyId"]},{"name":"remove","args":["projectId","keyId"]},{"name":"show","args":["projectId","keyId"]}],"Deployments":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","deploymentId"]},{"name":"mergeRequests","args":["projectId","deploymentId"]}],"Environments":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","environmentId"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId","environmentId"]},{"name":"remove","args":["projectId","environmentId"]},{"name":"stop","args":["projectId","environmentId"]}],"EpicDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"EpicIssues":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId","epicId"]},{"name":"assign","args":["groupId","epicId","issueId"]},{"name":"edit","args":["groupId","epicId","issueId"]},{"name":"remove","args":["groupId","epicId","issueId"]}],"EpicNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"Epics":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId"]},{"name":"create","args":["groupId","title"]},{"name":"edit","args":["groupId","epicId"]},{"name":"remove","args":["groupId","epicId"]},{"name":"show","args":["groupId","epicId"]}],"Events":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]}],"FeatureFlags":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"set","args":["name"]}],"FreezePeriods":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","freezePeriodId"]},{"name":"create","args":["projectId","freezeStart","freezeEnd"]},{"name":"edit","args":["projectId","freezePeriodId"]},{"name":"delete","args":["projectId","freezePeriodId"]}],"GeoNodes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["geonodeId"]},{"name":"edit","args":["geonodeId"]},{"name":"failures","args":[]},{"name":"repair","args":["geonodeId"]},{"name":"show","args":["geonodeId"]},{"name":"status","args":["geonodeId"]},{"name":"statuses","args":[]}],"GitLabCIYMLTemplates":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["resourceId"]}],"GitignoreTemplates":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["resourceId"]}],"GroupAccessRequests":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"request","args":["resourceId"]},{"name":"approve","args":["resourceId","userId"]},{"name":"deny","args":["resourceId","userId"]}],"GroupBadges":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","badgeId"]},{"name":"preview","args":["resourceId","linkUrl","imageUrl"]},{"name":"remove","args":["resourceId","badgeId"]},{"name":"show","args":["resourceId","badgeId"]}],"GroupCustomAttributes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"set","args":["resourceId","customAttributeId","value"]},{"name":"remove","args":["resourceId","customAttributeId"]},{"name":"show","args":["resourceId","customAttributeId"]}],"GroupDeployTokens":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","tokenName","tokenScopes"]},{"name":"all","args":[]},{"name":"remove","args":["resourceId","tokenId"]}],"GroupIssueBoards":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","name"]},{"name":"createList","args":["resourceId","boardId","labelId"]},{"name":"edit","args":["resourceId","boardId"]},{"name":"editList","args":["resourceId","boardId","listId","position"]},{"name":"lists","args":["resourceId","boardId"]},{"name":"remove","args":["resourceId","boardId"]},{"name":"removeList","args":["resourceId","boardId","listId"]},{"name":"show","args":["resourceId","boardId"]},{"name":"showList","args":["resourceId","boardId","listId"]}],"GroupLabels":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","labelName","color"]},{"name":"edit","args":["resourceId","labelName"]},{"name":"remove","args":["resourceId","labelName"]},{"name":"subscribe","args":["resourceId","labelId"]},{"name":"unsubscribe","args":["resourceId","labelId"]}],"GroupMembers":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","userId","accessLevel"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","userId","accessLevel"]},{"name":"show","args":["resourceId","userId"]},{"name":"remove","args":["resourceId","userId"]}],"GroupMilestones":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","title"]},{"name":"edit","args":["resourceId","milestoneId"]},{"name":"issues","args":["resourceId","milestoneId"]},{"name":"mergeRequests","args":["resourceId","milestoneId"]},{"name":"show","args":["resourceId","milestoneId"]}],"GroupProjects":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId"]},{"name":"add","args":["groupId","projectId"]}],"GroupRunners":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["groupId"]}],"GroupVariables":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId"]},{"name":"edit","args":["resourceId","keyId"]},{"name":"show","args":["resourceId","keyId"]},{"name":"remove","args":["resourceId","keyId"]}],"Groups":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["name","path"]},{"name":"createLDAPLink","args":["groupId","cn","groupAccess","provider"]},{"name":"edit","args":["groupId"]},{"name":"projects","args":["groupId"]},{"name":"remove","args":["groupId"]},{"name":"removeLDAPLink","args":["groupId","cn"]},{"name":"search","args":["nameOrPath"]},{"name":"show","args":["groupId"]},{"name":"subgroups","args":["groupId"]},{"name":"syncLDAP","args":["groupId"]}],"IssueAwardEmojis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","resourceId","noteId"]},{"name":"award","args":["projectId","resourceId","noteId","name"]},{"name":"remove","args":["projectId","resourceId","noteId","awardId"]},{"name":"show","args":["projectId","resourceId","noteId","awardId"]}],"IssueDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"IssueNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"Issues":[{"name":"constructor","args":["0","1"]},{"name":"addSpentTime","args":["projectId","issueIid","duration"]},{"name":"addTimeEstimate","args":["projectId","issueIid","duration"]},{"name":"all","args":[]},{"name":"create","args":["projectId"]},{"name":"closedBy","args":["projectId","issueIid"]},{"name":"edit","args":["projectId","issueIid"]},{"name":"link","args":["projectId","issueIid","targetProjectId","targetIssueIid"]},{"name":"links","args":["projectId","issueIid"]},{"name":"participants","args":["projectId","issueIid"]},{"name":"relatedMergeRequests","args":["projectId","issueIid"]},{"name":"removeLink","args":["projectId","issueIid","issueLinkId"]},{"name":"remove","args":["projectId","issueIid"]},{"name":"resetSpentTime","args":["projectId","issueIid"]},{"name":"resetTimeEstimate","args":["projectId","issueIid"]},{"name":"show","args":["projectId","issueIid"]},{"name":"subscribe","args":["projectId","issueIid"]},{"name":"timeStats","args":["projectId","issueIid"]},{"name":"unsubscribe","args":["projectId","issueIid"]}],"IssuesStatistics":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]}],"Jobs":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"cancel","args":["projectId","jobId"]},{"name":"downloadSingleArtifactFile","args":["projectId","jobId","artifactPath"]},{"name":"downloadSingleArtifactFileFromRef","args":["projectId","ref","artifactPath","jobName"]},{"name":"downloadLatestArtifactFile","args":["projectId","ref","jobName"]},{"name":"downloadTraceFile","args":["projectId","jobId"]},{"name":"erase","args":["projectId","jobId"]},{"name":"eraseArtifacts","args":["projectId","jobId"]},{"name":"keepArtifacts","args":["projectId","jobId"]},{"name":"play","args":["projectId","jobId"]},{"name":"retry","args":["projectId","jobId"]},{"name":"show","args":["projectId","jobId"]},{"name":"showPipelineJobs","args":["projectId","pipelineId"]}],"Keys":[{"name":"constructor","args":["0","1"]},{"name":"show","args":["keyId"]}],"Labels":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","labelName","color"]},{"name":"edit","args":["resourceId","labelName"]},{"name":"remove","args":["resourceId","labelName"]},{"name":"subscribe","args":["resourceId","labelId"]},{"name":"unsubscribe","args":["resourceId","labelId"]}],"LicenceTemplates":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["resourceId"]}],"License":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["license"]},{"name":"all","args":[]},{"name":"show","args":[]},{"name":"remove","args":["licenceId"]}],"Lint":[{"name":"constructor","args":["0","1"]},{"name":"lint","args":["content"]}],"Markdown":[{"name":"constructor","args":["0","1"]},{"name":"render","args":["text"]}],"MergeRequestApprovals":[{"name":"constructor","args":["0","1"]},{"name":"addApprovalRule","args":["projectId","name","approvalsRequired"]},{"name":"approvalRules","args":["projectId"]},{"name":"approvals","args":["projectId"]},{"name":"approvalState","args":["projectId","mergerequestIid"]},{"name":"approve","args":["projectId","mergerequestIid"]},{"name":"approvers","args":["projectId","approverIds","approverGroupIds"]},{"name":"editApprovalRule","args":["projectId","approvalRuleId","name","approvalsRequired"]},{"name":"editApprovals","args":["projectId"]},{"name":"removeApprovalRule","args":["projectId","approvalRuleId"]},{"name":"unapprove","args":["projectId","mergerequestIid"]}],"MergeRequestAwardEmojis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","resourceId","noteId"]},{"name":"award","args":["projectId","resourceId","noteId","name"]},{"name":"remove","args":["projectId","resourceId","noteId","awardId"]},{"name":"show","args":["projectId","resourceId","noteId","awardId"]}],"MergeRequestDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"MergeRequestNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"MergeRequests":[{"name":"constructor","args":["0","1"]},{"name":"accept","args":["projectId","mergerequestIid"]},{"name":"addSpentTime","args":["projectId","mergerequestIid","duration"]},{"name":"addTimeEstimate","args":["projectId","mergerequestIid","duration"]},{"name":"all","args":[]},{"name":"cancelOnPipelineSucess","args":["projectId","mergerequestIid"]},{"name":"changes","args":["projectId","mergerequestIid"]},{"name":"closesIssues","args":["projectId","mergerequestIid"]},{"name":"commits","args":["projectId","mergerequestIid"]},{"name":"create","args":["projectId","sourceBranch","targetBranch","title"]},{"name":"edit","args":["projectId","mergerequestIid"]},{"name":"participants","args":["projectId","mergerequestIid"]},{"name":"pipelines","args":["projectId","mergerequestIid"]},{"name":"rebase","args":["projectId","mergerequestIid"]},{"name":"remove","args":["projectId","mergerequestIid"]},{"name":"resetSpentTime","args":["projectId","mergerequestIid"]},{"name":"resetTimeEstimate","args":["projectId","mergerequestIid"]},{"name":"show","args":["projectId","mergerequestIid"]},{"name":"subscribe","args":["projectId","mergerequestIid"]},{"name":"timeStats","args":["projectId","mergerequestIid"]},{"name":"version","args":["projectId","mergerequestIid","versionId"]},{"name":"versions","args":["projectId","mergerequestIid"]},{"name":"unsubscribe","args":["projectId","mergerequestIid"]}],"Namespaces":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"show","args":["namespaceId"]}],"NotificationSettings":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"edit","args":[]}],"Packages":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"remove","args":["projectId","packageId"]},{"name":"show","args":["projectId","packageId"]},{"name":"showFiles","args":["projectId","packageId"]}],"PagesDomains":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["projectId","domain"]},{"name":"edit","args":["projectId","domain"]},{"name":"show","args":["projectId","domain"]},{"name":"remove","args":["projectId","domain"]}],"PipelineScheduleVariables":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","pipelineScheduleId"]},{"name":"create","args":["projectId","pipelineScheduleId"]},{"name":"edit","args":["projectId","pipelineScheduleId","keyId"]},{"name":"show","args":["projectId","pipelineScheduleId","keyId"]},{"name":"remove","args":["projectId","pipelineScheduleId","keyId"]}],"PipelineSchedules":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId","description","ref","cron"]},{"name":"edit","args":["projectId","scheduleId"]},{"name":"remove","args":["projectId","scheduleId"]},{"name":"show","args":["projectId","scheduleId"]},{"name":"takeOwnership","args":["projectId","scheduleId"]}],"Pipelines":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId","ref"]},{"name":"delete","args":["projectId","pipelineId"]},{"name":"show","args":["projectId","pipelineId"]},{"name":"retry","args":["projectId","pipelineId"]},{"name":"cancel","args":["projectId","pipelineId"]},{"name":"allVariables","args":["projectId","pipelineId"]}],"ProjectAccessRequests":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"request","args":["resourceId"]},{"name":"approve","args":["resourceId","userId"]},{"name":"deny","args":["resourceId","userId"]}],"ProjectBadges":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","badgeId"]},{"name":"preview","args":["resourceId","linkUrl","imageUrl"]},{"name":"remove","args":["resourceId","badgeId"]},{"name":"show","args":["resourceId","badgeId"]}],"ProjectCustomAttributes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"set","args":["resourceId","customAttributeId","value"]},{"name":"remove","args":["resourceId","customAttributeId"]},{"name":"show","args":["resourceId","customAttributeId"]}],"ProjectDeployTokens":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","tokenName","tokenScopes"]},{"name":"all","args":[]},{"name":"remove","args":["resourceId","tokenId"]}],"ProjectHooks":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"show","args":["projectId","hookId"]},{"name":"add","args":["projectId","url"]},{"name":"edit","args":["projectId","hookId","url"]},{"name":"remove","args":["projectId","hookId"]}],"ProjectImportExport":[{"name":"constructor","args":["0","1"]},{"name":"download","args":["projectId"]},{"name":"exportStatus","args":["projectId"]},{"name":"import","args":["content","path"]},{"name":"importStatus","args":["projectId"]},{"name":"schedule","args":["projectId"]}],"ProjectIssueBoards":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","name"]},{"name":"createList","args":["resourceId","boardId","labelId"]},{"name":"edit","args":["resourceId","boardId"]},{"name":"editList","args":["resourceId","boardId","listId","position"]},{"name":"lists","args":["resourceId","boardId"]},{"name":"remove","args":["resourceId","boardId"]},{"name":"removeList","args":["resourceId","boardId","listId"]},{"name":"show","args":["resourceId","boardId"]},{"name":"showList","args":["resourceId","boardId","listId"]}],"ProjectMembers":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["resourceId","userId","accessLevel"]},{"name":"all","args":["resourceId"]},{"name":"edit","args":["resourceId","userId","accessLevel"]},{"name":"show","args":["resourceId","userId"]},{"name":"remove","args":["resourceId","userId"]}],"ProjectMilestones":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId","title"]},{"name":"edit","args":["resourceId","milestoneId"]},{"name":"issues","args":["resourceId","milestoneId"]},{"name":"mergeRequests","args":["resourceId","milestoneId"]},{"name":"show","args":["resourceId","milestoneId"]}],"ProjectSnippetAwardEmojis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","resourceId","noteId"]},{"name":"award","args":["projectId","resourceId","noteId","name"]},{"name":"remove","args":["projectId","resourceId","noteId","awardId"]},{"name":"show","args":["projectId","resourceId","noteId","awardId"]}],"ProjectSnippetDiscussions":[{"name":"constructor","args":["0","1"]},{"name":"addNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","content"]},{"name":"editNote","args":["resourceId","resource2Id","discussionId","noteId","content"]},{"name":"removeNote","args":["resourceId","resource2Id","discussionId","noteId"]},{"name":"show","args":["resourceId","resource2Id","discussionId"]}],"ProjectSnippetNotes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId","resource2Id"]},{"name":"create","args":["resourceId","resource2Id","body"]},{"name":"edit","args":["resourceId","resource2Id","noteId","body"]},{"name":"remove","args":["resourceId","resource2Id","noteId"]},{"name":"show","args":["resourceId","resource2Id","noteId"]}],"ProjectSnippets":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"content","args":["projectId","snippetId"]},{"name":"create","args":["projectId","title","fileName","code","visibility"]},{"name":"edit","args":["projectId","snippetId"]},{"name":"remove","args":["projectId","snippetId"]},{"name":"show","args":["projectId","snippetId"]},{"name":"userAgentDetails","args":["projectId","snippetId"]}],"ProjectVariables":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"create","args":["resourceId"]},{"name":"edit","args":["resourceId","keyId"]},{"name":"show","args":["resourceId","keyId"]},{"name":"remove","args":["resourceId","keyId"]}],"Projects":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"archive","args":["projectId"]},{"name":"create","args":[]},{"name":"edit","args":["projectId"]},{"name":"events","args":["projectId"]},{"name":"fork","args":["projectId"]},{"name":"forks","args":["projectId"]},{"name":"languages","args":["projectId"]},{"name":"mirrorPull","args":["projectId"]},{"name":"remove","args":["projectId"]},{"name":"removeFork","args":["projectId"]},{"name":"search","args":["projectName"]},{"name":"share","args":["projectId","groupId","groupAccess"]},{"name":"show","args":["projectId"]},{"name":"star","args":["projectId"]},{"name":"statuses","args":["projectId","sha","state"]},{"name":"transfer","args":["projectId","namespaceId"]},{"name":"unarchive","args":["projectId"]},{"name":"unshare","args":["projectId","groupId"]},{"name":"unstar","args":["projectId"]},{"name":"upload","args":["projectId","content"]}],"ProtectedBranches":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"protect","args":["projectId","branchName"]},{"name":"show","args":["projectId","branchName"]},{"name":"unprotect","args":["projectId","branchName"]}],"ProtectedTags":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"protect","args":["projectId","tagName"]},{"name":"show","args":["projectId","tagName"]},{"name":"unprotect","args":["projectId","tagName"]}],"PushRules":[{"name":"constructor","args":["0","1"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId"]},{"name":"remove","args":["projectId"]},{"name":"show","args":["projectId"]}],"ReleaseLinks":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId","tagName"]},{"name":"create","args":["projectId","tagName","name","url"]},{"name":"edit","args":["projectId","tagName","linkId"]},{"name":"remove","args":["projectId","tagName","linkId"]},{"name":"show","args":["projectId","tagName","linkId"]}],"Releases":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId","tagName"]},{"name":"remove","args":["projectId","tagName"]},{"name":"show","args":["projectId","tagName"]}],"Repositories":[{"name":"constructor","args":["0","1"]},{"name":"compare","args":["projectId","from","to"]},{"name":"contributors","args":["projectId"]},{"name":"mergeBase","args":["projectId","refs"]},{"name":"showArchive","args":["projectId"]},{"name":"showBlob","args":["projectId","sha"]},{"name":"showBlobRaw","args":["projectId","sha"]},{"name":"tree","args":["projectId"]}],"RepositoryFiles":[{"name":"constructor","args":["0","1"]},{"name":"create","args":["projectId","filePath","branch","content","commitMessage"]},{"name":"edit","args":["projectId","filePath","branch","content","commitMessage"]},{"name":"remove","args":["projectId","filePath","branch","commitMessage"]},{"name":"show","args":["projectId","filePath","ref"]},{"name":"showBlame","args":["projectId","filePath"]},{"name":"showRaw","args":["projectId","filePath","ref"]}],"Runners":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"allOwned","args":[]},{"name":"edit","args":["runnerId"]},{"name":"enable","args":["projectId","runnerId"]},{"name":"disable","args":["projectId","runnerId"]},{"name":"jobs","args":["runnerId"]},{"name":"remove","args":["runnerId"]},{"name":"show","args":["runnerId"]}],"Search":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["scope","search"]}],"Services":[{"name":"constructor","args":["0","1"]},{"name":"edit","args":["projectId","serviceName"]},{"name":"remove","args":["projectId","serviceName"]},{"name":"show","args":["projectId","serviceName"]}],"SidekiqMetrics":[{"name":"constructor","args":["0","1"]},{"name":"queueMetrics","args":[]},{"name":"processMetrics","args":[]},{"name":"jobStats","args":[]},{"name":"compoundMetrics","args":[]}],"Snippets":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"content","args":["snippetId"]},{"name":"create","args":["title","fileName","content","visibility"]},{"name":"edit","args":["snippetId"]},{"name":"remove","args":["snippetId"]},{"name":"show","args":["snippetId"]},{"name":"userAgentDetails","args":["snippetId"]}],"SystemHooks":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["url"]},{"name":"all","args":[]},{"name":"edit","args":["hookId","url"]},{"name":"remove","args":["hookId"]}],"Tags":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId"]},{"name":"remove","args":["projectId","tagName"]},{"name":"show","args":["projectId","tagName"]}],"Todos":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["projectId","resourceId"]},{"name":"done","args":[]}],"Triggers":[{"name":"constructor","args":["0","1"]},{"name":"add","args":["projectId"]},{"name":"all","args":["projectId"]},{"name":"edit","args":["projectId","triggerId"]},{"name":"pipeline","args":["projectId","ref","token",{}]},{"name":"remove","args":["projectId","triggerId"]},{"name":"show","args":["projectId","triggerId"]}],"UserCustomAttributes":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["resourceId"]},{"name":"set","args":["resourceId","customAttributeId","value"]},{"name":"remove","args":["resourceId","customAttributeId"]},{"name":"show","args":["resourceId","customAttributeId"]}],"UserEmails":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"add","args":["email"]},{"name":"show","args":["emailId"]},{"name":"remove","args":["emailId"]}],"UserGPGKeys":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"add","args":["key"]},{"name":"show","args":["keyId"]},{"name":"remove","args":["keyId"]}],"UserImpersonationTokens":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["userId"]},{"name":"add","args":["userId","name","scopes","expiresAt"]},{"name":"show","args":["userId","tokenId"]},{"name":"revoke","args":["userId","tokenId"]}],"UserKeys":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"create","args":["title","key"]},{"name":"show","args":["keyId"]},{"name":"remove","args":["keyId"]}],"Users":[{"name":"constructor","args":["0","1"]},{"name":"all","args":[]},{"name":"activities","args":[]},{"name":"projects","args":["userId"]},{"name":"block","args":["userId"]},{"name":"create","args":[]},{"name":"current","args":[]},{"name":"edit","args":["userId"]},{"name":"events","args":["userId"]},{"name":"search","args":["emailOrUsername"]},{"name":"show","args":["userId"]},{"name":"remove","args":["userId"]},{"name":"unblock","args":["userId"]}],"Version":[{"name":"constructor","args":["0","1"]},{"name":"show","args":[]}],"VulnerabilityFindings":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]}],"Wikis":[{"name":"constructor","args":["0","1"]},{"name":"all","args":["projectId"]},{"name":"create","args":["projectId"]},{"name":"edit","args":["projectId","slug"]},{"name":"show","args":["projectId","slug"]},{"name":"remove","args":["projectId","slug"]}]}');
    }
    var GroupsBundle = bundler({
      Groups,
      GroupAccessRequests,
      GroupBadges,
      GroupCustomAttributes,
      GroupIssueBoards,
      GroupMembers,
      GroupMilestones,
      GroupProjects,
      GroupRunners,
      GroupVariables,
      GroupLabels,
      GroupDeployTokens,
      Epics,
      EpicIssues,
      EpicNotes,
      EpicDiscussions
    });
    var UsersBundle = bundler({
      Users,
      UserCustomAttributes,
      UserEmails,
      UserImpersonationTokens,
      UserKeys,
      UserGPGKeys
    });
    var ProjectsBundle = bundler({
      Branches,
      Commits,
      CommitDiscussions,
      ContainerRegistry,
      DeployKeys,
      Deployments,
      Environments,
      FreezePeriods,
      Issues,
      IssuesStatistics,
      IssueAwardEmojis,
      IssueNotes,
      IssueDiscussions,
      Jobs,
      Labels,
      MergeRequests,
      MergeRequestApprovals,
      MergeRequestAwardEmojis,
      MergeRequestDiscussions,
      MergeRequestNotes,
      Packages,
      Pipelines,
      PipelineSchedules,
      PipelineScheduleVariables,
      Projects,
      ProjectAccessRequests,
      ProjectBadges,
      ProjectCustomAttributes,
      ProjectImportExport,
      ProjectIssueBoards,
      ProjectHooks,
      ProjectMembers,
      ProjectMilestones,
      ProjectSnippets,
      ProjectSnippetNotes,
      ProjectSnippetDiscussions,
      ProjectSnippetAwardEmojis,
      ProtectedBranches,
      ProtectedTags,
      ProjectVariables,
      ProjectDeployTokens,
      PushRules,
      Releases,
      ReleaseLinks,
      Repositories,
      RepositoryFiles,
      Runners,
      Services,
      Tags,
      Todos,
      Triggers,
      VulnerabilityFindings
    });
    var Gitlab2 = bundler(APIServices);
    exports2.ApplicationSettings = ApplicationSettings;
    exports2.Branches = Branches;
    exports2.BroadcastMessages = BroadcastMessages;
    exports2.CommitDiscussions = CommitDiscussions;
    exports2.Commits = Commits;
    exports2.ContainerRegistry = ContainerRegistry;
    exports2.DeployKeys = DeployKeys;
    exports2.Deployments = Deployments;
    exports2.Environments = Environments;
    exports2.EpicDiscussions = EpicDiscussions;
    exports2.EpicIssues = EpicIssues;
    exports2.EpicNotes = EpicNotes;
    exports2.Epics = Epics;
    exports2.Events = Events;
    exports2.FeatureFlags = FeatureFlags;
    exports2.FreezePeriods = FreezePeriods;
    exports2.GeoNodes = GeoNodes;
    exports2.GitLabCIYMLTemplates = GitLabCIYMLTemplates;
    exports2.GitignoreTemplates = GitignoreTemplates;
    exports2.Gitlab = Gitlab2;
    exports2.GroupAccessRequests = GroupAccessRequests;
    exports2.GroupBadges = GroupBadges;
    exports2.GroupCustomAttributes = GroupCustomAttributes;
    exports2.GroupDeployTokens = GroupDeployTokens;
    exports2.GroupIssueBoards = GroupIssueBoards;
    exports2.GroupLabels = GroupLabels;
    exports2.GroupMembers = GroupMembers;
    exports2.GroupMilestones = GroupMilestones;
    exports2.GroupProjects = GroupProjects;
    exports2.GroupRunners = GroupRunners;
    exports2.GroupVariables = GroupVariables;
    exports2.Groups = Groups;
    exports2.GroupsBundle = GroupsBundle;
    exports2.IssueAwardEmojis = IssueAwardEmojis;
    exports2.IssueDiscussions = IssueDiscussions;
    exports2.IssueNotes = IssueNotes;
    exports2.Issues = Issues;
    exports2.IssuesStatistics = IssuesStatistics;
    exports2.Jobs = Jobs;
    exports2.Keys = Keys;
    exports2.Labels = Labels;
    exports2.LicenceTemplates = LicenceTemplates;
    exports2.License = License;
    exports2.Lint = Lint;
    exports2.Markdown = Markdown;
    exports2.MergeRequestApprovals = MergeRequestApprovals;
    exports2.MergeRequestAwardEmojis = MergeRequestAwardEmojis;
    exports2.MergeRequestDiscussions = MergeRequestDiscussions;
    exports2.MergeRequestNotes = MergeRequestNotes;
    exports2.MergeRequests = MergeRequests;
    exports2.Namespaces = Namespaces;
    exports2.NotificationSettings = NotificationSettings;
    exports2.Packages = Packages;
    exports2.PagesDomains = PagesDomains;
    exports2.PipelineScheduleVariables = PipelineScheduleVariables;
    exports2.PipelineSchedules = PipelineSchedules;
    exports2.Pipelines = Pipelines;
    exports2.ProjectAccessRequests = ProjectAccessRequests;
    exports2.ProjectBadges = ProjectBadges;
    exports2.ProjectCustomAttributes = ProjectCustomAttributes;
    exports2.ProjectDeployTokens = ProjectDeployTokens;
    exports2.ProjectHooks = ProjectHooks;
    exports2.ProjectImportExport = ProjectImportExport;
    exports2.ProjectIssueBoards = ProjectIssueBoards;
    exports2.ProjectMembers = ProjectMembers;
    exports2.ProjectMilestones = ProjectMilestones;
    exports2.ProjectSnippetAwardEmojis = ProjectSnippetAwardEmojis;
    exports2.ProjectSnippetDiscussions = ProjectSnippetDiscussions;
    exports2.ProjectSnippetNotes = ProjectSnippetNotes;
    exports2.ProjectSnippets = ProjectSnippets;
    exports2.ProjectVariables = ProjectVariables;
    exports2.Projects = Projects;
    exports2.ProjectsBundle = ProjectsBundle;
    exports2.ProtectedBranches = ProtectedBranches;
    exports2.ProtectedTags = ProtectedTags;
    exports2.PushRules = PushRules;
    exports2.ReleaseLinks = ReleaseLinks;
    exports2.Releases = Releases;
    exports2.Repositories = Repositories;
    exports2.RepositoryFiles = RepositoryFiles;
    exports2.Runners = Runners;
    exports2.Search = Search;
    exports2.Services = Services;
    exports2.SidekiqMetrics = SidekiqMetrics;
    exports2.Snippets = Snippets;
    exports2.SystemHooks = SystemHooks;
    exports2.Tags = Tags;
    exports2.Todos = Todos;
    exports2.Triggers = Triggers;
    exports2.UserCustomAttributes = UserCustomAttributes;
    exports2.UserEmails = UserEmails;
    exports2.UserGPGKeys = UserGPGKeys;
    exports2.UserImpersonationTokens = UserImpersonationTokens;
    exports2.UserKeys = UserKeys;
    exports2.Users = Users;
    exports2.UsersBundle = UsersBundle;
    exports2.Version = Version;
    exports2.VulnerabilityFindings = VulnerabilityFindings;
    exports2.Wikis = Wikis;
    exports2.getAPIMap = getAPIMap;
  }
});

// node_modules/.pnpm/@sindresorhus+is@4.0.1/node_modules/@sindresorhus/is/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/.pnpm/@sindresorhus+is@4.0.1/node_modules/@sindresorhus/is/dist/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var typedArrayTypeNames = [
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Uint16Array",
      "Int32Array",
      "Uint32Array",
      "Float32Array",
      "Float64Array",
      "BigInt64Array",
      "BigUint64Array"
    ];
    function isTypedArrayName(name) {
      return typedArrayTypeNames.includes(name);
    }
    var objectTypeNames = [
      "Function",
      "Generator",
      "AsyncGenerator",
      "GeneratorFunction",
      "AsyncGeneratorFunction",
      "AsyncFunction",
      "Observable",
      "Array",
      "Buffer",
      "Object",
      "RegExp",
      "Date",
      "Error",
      "Map",
      "Set",
      "WeakMap",
      "WeakSet",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "DataView",
      "Promise",
      "URL",
      "HTMLElement",
      ...typedArrayTypeNames
    ];
    function isObjectTypeName(name) {
      return objectTypeNames.includes(name);
    }
    var primitiveTypeNames = [
      "null",
      "undefined",
      "string",
      "number",
      "bigint",
      "boolean",
      "symbol"
    ];
    function isPrimitiveTypeName(name) {
      return primitiveTypeNames.includes(name);
    }
    function isOfType(type) {
      return (value) => typeof value === type;
    }
    var {toString} = Object.prototype;
    var getObjectType = (value) => {
      const objectTypeName = toString.call(value).slice(8, -1);
      if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
        return "HTMLElement";
      }
      if (isObjectTypeName(objectTypeName)) {
        return objectTypeName;
      }
      return void 0;
    };
    var isObjectOfType = (type) => (value) => getObjectType(value) === type;
    function is(value) {
      if (value === null) {
        return "null";
      }
      switch (typeof value) {
        case "undefined":
          return "undefined";
        case "string":
          return "string";
        case "number":
          return "number";
        case "boolean":
          return "boolean";
        case "function":
          return "Function";
        case "bigint":
          return "bigint";
        case "symbol":
          return "symbol";
        default:
      }
      if (is.observable(value)) {
        return "Observable";
      }
      if (is.array(value)) {
        return "Array";
      }
      if (is.buffer(value)) {
        return "Buffer";
      }
      const tagType = getObjectType(value);
      if (tagType) {
        return tagType;
      }
      if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError("Please don't use object wrappers for primitive types");
      }
      return "Object";
    }
    is.undefined = isOfType("undefined");
    is.string = isOfType("string");
    var isNumberType = isOfType("number");
    is.number = (value) => isNumberType(value) && !is.nan(value);
    is.bigint = isOfType("bigint");
    is.function_ = isOfType("function");
    is.null_ = (value) => value === null;
    is.class_ = (value) => is.function_(value) && value.toString().startsWith("class ");
    is.boolean = (value) => value === true || value === false;
    is.symbol = isOfType("symbol");
    is.numericString = (value) => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
    is.array = (value, assertion) => {
      if (!Array.isArray(value)) {
        return false;
      }
      if (!is.function_(assertion)) {
        return true;
      }
      return value.every(assertion);
    };
    is.buffer = (value) => {
      var _a, _b, _c, _d;
      return (_d = (_c = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.isBuffer) === null || _c === void 0 ? void 0 : _c.call(_b, value)) !== null && _d !== void 0 ? _d : false;
    };
    is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
    is.object = (value) => !is.null_(value) && (typeof value === "object" || is.function_(value));
    is.iterable = (value) => {
      var _a;
      return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]);
    };
    is.asyncIterable = (value) => {
      var _a;
      return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.asyncIterator]);
    };
    is.generator = (value) => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
    is.asyncGenerator = (value) => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
    is.nativePromise = (value) => isObjectOfType("Promise")(value);
    var hasPromiseAPI = (value) => {
      var _a, _b;
      return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a.then) && is.function_((_b = value) === null || _b === void 0 ? void 0 : _b.catch);
    };
    is.promise = (value) => is.nativePromise(value) || hasPromiseAPI(value);
    is.generatorFunction = isObjectOfType("GeneratorFunction");
    is.asyncGeneratorFunction = (value) => getObjectType(value) === "AsyncGeneratorFunction";
    is.asyncFunction = (value) => getObjectType(value) === "AsyncFunction";
    is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty("prototype");
    is.regExp = isObjectOfType("RegExp");
    is.date = isObjectOfType("Date");
    is.error = isObjectOfType("Error");
    is.map = (value) => isObjectOfType("Map")(value);
    is.set = (value) => isObjectOfType("Set")(value);
    is.weakMap = (value) => isObjectOfType("WeakMap")(value);
    is.weakSet = (value) => isObjectOfType("WeakSet")(value);
    is.int8Array = isObjectOfType("Int8Array");
    is.uint8Array = isObjectOfType("Uint8Array");
    is.uint8ClampedArray = isObjectOfType("Uint8ClampedArray");
    is.int16Array = isObjectOfType("Int16Array");
    is.uint16Array = isObjectOfType("Uint16Array");
    is.int32Array = isObjectOfType("Int32Array");
    is.uint32Array = isObjectOfType("Uint32Array");
    is.float32Array = isObjectOfType("Float32Array");
    is.float64Array = isObjectOfType("Float64Array");
    is.bigInt64Array = isObjectOfType("BigInt64Array");
    is.bigUint64Array = isObjectOfType("BigUint64Array");
    is.arrayBuffer = isObjectOfType("ArrayBuffer");
    is.sharedArrayBuffer = isObjectOfType("SharedArrayBuffer");
    is.dataView = isObjectOfType("DataView");
    is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;
    is.urlInstance = (value) => isObjectOfType("URL")(value);
    is.urlString = (value) => {
      if (!is.string(value)) {
        return false;
      }
      try {
        new URL(value);
        return true;
      } catch (_a) {
        return false;
      }
    };
    is.truthy = (value) => Boolean(value);
    is.falsy = (value) => !value;
    is.nan = (value) => Number.isNaN(value);
    is.primitive = (value) => is.null_(value) || isPrimitiveTypeName(typeof value);
    is.integer = (value) => Number.isInteger(value);
    is.safeInteger = (value) => Number.isSafeInteger(value);
    is.plainObject = (value) => {
      if (toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.getPrototypeOf({});
    };
    is.typedArray = (value) => isTypedArrayName(getObjectType(value));
    var isValidLength = (value) => is.safeInteger(value) && value >= 0;
    is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
    is.inRange = (value, range) => {
      if (is.number(range)) {
        return value >= Math.min(0, range) && value <= Math.max(range, 0);
      }
      if (is.array(range) && range.length === 2) {
        return value >= Math.min(...range) && value <= Math.max(...range);
      }
      throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
    };
    var NODE_TYPE_ELEMENT = 1;
    var DOM_PROPERTIES_TO_CHECK = [
      "innerHTML",
      "ownerDocument",
      "style",
      "attributes",
      "nodeValue"
    ];
    is.domElement = (value) => {
      return is.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is.string(value.nodeName) && !is.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every((property) => property in value);
    };
    is.observable = (value) => {
      var _a, _b, _c, _d;
      if (!value) {
        return false;
      }
      if (value === ((_b = (_a = value)[Symbol.observable]) === null || _b === void 0 ? void 0 : _b.call(_a))) {
        return true;
      }
      if (value === ((_d = (_c = value)["@@observable"]) === null || _d === void 0 ? void 0 : _d.call(_c))) {
        return true;
      }
      return false;
    };
    is.nodeStream = (value) => is.object(value) && is.function_(value.pipe) && !is.observable(value);
    is.infinite = (value) => value === Infinity || value === -Infinity;
    var isAbsoluteMod2 = (remainder) => (value) => is.integer(value) && Math.abs(value % 2) === remainder;
    is.evenInteger = isAbsoluteMod2(0);
    is.oddInteger = isAbsoluteMod2(1);
    is.emptyArray = (value) => is.array(value) && value.length === 0;
    is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
    is.emptyString = (value) => is.string(value) && value.length === 0;
    is.nonEmptyString = (value) => is.string(value) && value.length > 0;
    var isWhiteSpaceString = (value) => is.string(value) && !/\S/.test(value);
    is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
    is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
    is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
    is.emptySet = (value) => is.set(value) && value.size === 0;
    is.nonEmptySet = (value) => is.set(value) && value.size > 0;
    is.emptyMap = (value) => is.map(value) && value.size === 0;
    is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
    var predicateOnArray = (method, predicate, values) => {
      if (!is.function_(predicate)) {
        throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
      }
      if (values.length === 0) {
        throw new TypeError("Invalid number of values");
      }
      return method.call(values, predicate);
    };
    is.any = (predicate, ...values) => {
      const predicates = is.array(predicate) ? predicate : [predicate];
      return predicates.some((singlePredicate) => predicateOnArray(Array.prototype.some, singlePredicate, values));
    };
    is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
    var assertType = (condition, description, value, options = {}) => {
      if (!condition) {
        const {multipleValues} = options;
        const valuesMessage = multipleValues ? `received values of types ${[
          ...new Set(value.map((singleValue) => `\`${is(singleValue)}\``))
        ].join(", ")}` : `received value of type \`${is(value)}\``;
        throw new TypeError(`Expected value which is \`${description}\`, ${valuesMessage}.`);
      }
    };
    exports2.assert = {
      undefined: (value) => assertType(is.undefined(value), "undefined", value),
      string: (value) => assertType(is.string(value), "string", value),
      number: (value) => assertType(is.number(value), "number", value),
      bigint: (value) => assertType(is.bigint(value), "bigint", value),
      function_: (value) => assertType(is.function_(value), "Function", value),
      null_: (value) => assertType(is.null_(value), "null", value),
      class_: (value) => assertType(is.class_(value), "Class", value),
      boolean: (value) => assertType(is.boolean(value), "boolean", value),
      symbol: (value) => assertType(is.symbol(value), "symbol", value),
      numericString: (value) => assertType(is.numericString(value), "string with a number", value),
      array: (value, assertion) => {
        const assert = assertType;
        assert(is.array(value), "Array", value);
        if (assertion) {
          value.forEach(assertion);
        }
      },
      buffer: (value) => assertType(is.buffer(value), "Buffer", value),
      nullOrUndefined: (value) => assertType(is.nullOrUndefined(value), "null or undefined", value),
      object: (value) => assertType(is.object(value), "Object", value),
      iterable: (value) => assertType(is.iterable(value), "Iterable", value),
      asyncIterable: (value) => assertType(is.asyncIterable(value), "AsyncIterable", value),
      generator: (value) => assertType(is.generator(value), "Generator", value),
      asyncGenerator: (value) => assertType(is.asyncGenerator(value), "AsyncGenerator", value),
      nativePromise: (value) => assertType(is.nativePromise(value), "native Promise", value),
      promise: (value) => assertType(is.promise(value), "Promise", value),
      generatorFunction: (value) => assertType(is.generatorFunction(value), "GeneratorFunction", value),
      asyncGeneratorFunction: (value) => assertType(is.asyncGeneratorFunction(value), "AsyncGeneratorFunction", value),
      asyncFunction: (value) => assertType(is.asyncFunction(value), "AsyncFunction", value),
      boundFunction: (value) => assertType(is.boundFunction(value), "Function", value),
      regExp: (value) => assertType(is.regExp(value), "RegExp", value),
      date: (value) => assertType(is.date(value), "Date", value),
      error: (value) => assertType(is.error(value), "Error", value),
      map: (value) => assertType(is.map(value), "Map", value),
      set: (value) => assertType(is.set(value), "Set", value),
      weakMap: (value) => assertType(is.weakMap(value), "WeakMap", value),
      weakSet: (value) => assertType(is.weakSet(value), "WeakSet", value),
      int8Array: (value) => assertType(is.int8Array(value), "Int8Array", value),
      uint8Array: (value) => assertType(is.uint8Array(value), "Uint8Array", value),
      uint8ClampedArray: (value) => assertType(is.uint8ClampedArray(value), "Uint8ClampedArray", value),
      int16Array: (value) => assertType(is.int16Array(value), "Int16Array", value),
      uint16Array: (value) => assertType(is.uint16Array(value), "Uint16Array", value),
      int32Array: (value) => assertType(is.int32Array(value), "Int32Array", value),
      uint32Array: (value) => assertType(is.uint32Array(value), "Uint32Array", value),
      float32Array: (value) => assertType(is.float32Array(value), "Float32Array", value),
      float64Array: (value) => assertType(is.float64Array(value), "Float64Array", value),
      bigInt64Array: (value) => assertType(is.bigInt64Array(value), "BigInt64Array", value),
      bigUint64Array: (value) => assertType(is.bigUint64Array(value), "BigUint64Array", value),
      arrayBuffer: (value) => assertType(is.arrayBuffer(value), "ArrayBuffer", value),
      sharedArrayBuffer: (value) => assertType(is.sharedArrayBuffer(value), "SharedArrayBuffer", value),
      dataView: (value) => assertType(is.dataView(value), "DataView", value),
      urlInstance: (value) => assertType(is.urlInstance(value), "URL", value),
      urlString: (value) => assertType(is.urlString(value), "string with a URL", value),
      truthy: (value) => assertType(is.truthy(value), "truthy", value),
      falsy: (value) => assertType(is.falsy(value), "falsy", value),
      nan: (value) => assertType(is.nan(value), "NaN", value),
      primitive: (value) => assertType(is.primitive(value), "primitive", value),
      integer: (value) => assertType(is.integer(value), "integer", value),
      safeInteger: (value) => assertType(is.safeInteger(value), "integer", value),
      plainObject: (value) => assertType(is.plainObject(value), "plain object", value),
      typedArray: (value) => assertType(is.typedArray(value), "TypedArray", value),
      arrayLike: (value) => assertType(is.arrayLike(value), "array-like", value),
      domElement: (value) => assertType(is.domElement(value), "HTMLElement", value),
      observable: (value) => assertType(is.observable(value), "Observable", value),
      nodeStream: (value) => assertType(is.nodeStream(value), "Node.js Stream", value),
      infinite: (value) => assertType(is.infinite(value), "infinite number", value),
      emptyArray: (value) => assertType(is.emptyArray(value), "empty array", value),
      nonEmptyArray: (value) => assertType(is.nonEmptyArray(value), "non-empty array", value),
      emptyString: (value) => assertType(is.emptyString(value), "empty string", value),
      nonEmptyString: (value) => assertType(is.nonEmptyString(value), "non-empty string", value),
      emptyStringOrWhitespace: (value) => assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace", value),
      emptyObject: (value) => assertType(is.emptyObject(value), "empty object", value),
      nonEmptyObject: (value) => assertType(is.nonEmptyObject(value), "non-empty object", value),
      emptySet: (value) => assertType(is.emptySet(value), "empty set", value),
      nonEmptySet: (value) => assertType(is.nonEmptySet(value), "non-empty set", value),
      emptyMap: (value) => assertType(is.emptyMap(value), "empty map", value),
      nonEmptyMap: (value) => assertType(is.nonEmptyMap(value), "non-empty map", value),
      evenInteger: (value) => assertType(is.evenInteger(value), "even integer", value),
      oddInteger: (value) => assertType(is.oddInteger(value), "odd integer", value),
      directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), "T", instance),
      inRange: (value, range) => assertType(is.inRange(value, range), "in range", value),
      any: (predicate, ...values) => {
        return assertType(is.any(predicate, ...values), "predicate returns truthy for any value", values, {multipleValues: true});
      },
      all: (predicate, ...values) => assertType(is.all(predicate, ...values), "predicate returns truthy for all values", values, {multipleValues: true})
    };
    Object.defineProperties(is, {
      class: {
        value: is.class_
      },
      function: {
        value: is.function_
      },
      null: {
        value: is.null_
      }
    });
    Object.defineProperties(exports2.assert, {
      class: {
        value: exports2.assert.class_
      },
      function: {
        value: exports2.assert.function_
      },
      null: {
        value: exports2.assert.null_
      }
    });
    exports2.default = is;
    module2.exports = is;
    module2.exports.default = is;
    module2.exports.assert = exports2.assert;
  }
});

// node_modules/.pnpm/p-cancelable@2.1.1/node_modules/p-cancelable/index.js
var require_p_cancelable = __commonJS({
  "node_modules/.pnpm/p-cancelable@2.1.1/node_modules/p-cancelable/index.js"(exports2, module2) {
    "use strict";
    var CancelError = class extends Error {
      constructor(reason) {
        super(reason || "Promise was canceled");
        this.name = "CancelError";
      }
      get isCanceled() {
        return true;
      }
    };
    var PCancelable = class {
      static fn(userFn) {
        return (...arguments_) => {
          return new PCancelable((resolve, reject, onCancel) => {
            arguments_.push(onCancel);
            userFn(...arguments_).then(resolve, reject);
          });
        };
      }
      constructor(executor) {
        this._cancelHandlers = [];
        this._isPending = true;
        this._isCanceled = false;
        this._rejectOnCancel = true;
        this._promise = new Promise((resolve, reject) => {
          this._reject = reject;
          const onResolve = (value) => {
            if (!this._isCanceled || !onCancel.shouldReject) {
              this._isPending = false;
              resolve(value);
            }
          };
          const onReject = (error) => {
            this._isPending = false;
            reject(error);
          };
          const onCancel = (handler) => {
            if (!this._isPending) {
              throw new Error("The `onCancel` handler was attached after the promise settled.");
            }
            this._cancelHandlers.push(handler);
          };
          Object.defineProperties(onCancel, {
            shouldReject: {
              get: () => this._rejectOnCancel,
              set: (boolean) => {
                this._rejectOnCancel = boolean;
              }
            }
          });
          return executor(onResolve, onReject, onCancel);
        });
      }
      then(onFulfilled, onRejected) {
        return this._promise.then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this._promise.catch(onRejected);
      }
      finally(onFinally) {
        return this._promise.finally(onFinally);
      }
      cancel(reason) {
        if (!this._isPending || this._isCanceled) {
          return;
        }
        this._isCanceled = true;
        if (this._cancelHandlers.length > 0) {
          try {
            for (const handler of this._cancelHandlers) {
              handler();
            }
          } catch (error) {
            this._reject(error);
            return;
          }
        }
        if (this._rejectOnCancel) {
          this._reject(new CancelError(reason));
        }
      }
      get isCanceled() {
        return this._isCanceled;
      }
    };
    Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);
    module2.exports = PCancelable;
    module2.exports.CancelError = CancelError;
  }
});

// node_modules/.pnpm/defer-to-connect@2.0.1/node_modules/defer-to-connect/dist/source/index.js
var require_source = __commonJS({
  "node_modules/.pnpm/defer-to-connect@2.0.1/node_modules/defer-to-connect/dist/source/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    function isTLSSocket(socket) {
      return socket.encrypted;
    }
    var deferToConnect = (socket, fn) => {
      let listeners;
      if (typeof fn === "function") {
        const connect = fn;
        listeners = {connect};
      } else {
        listeners = fn;
      }
      const hasConnectListener = typeof listeners.connect === "function";
      const hasSecureConnectListener = typeof listeners.secureConnect === "function";
      const hasCloseListener = typeof listeners.close === "function";
      const onConnect = () => {
        if (hasConnectListener) {
          listeners.connect();
        }
        if (isTLSSocket(socket) && hasSecureConnectListener) {
          if (socket.authorized) {
            listeners.secureConnect();
          } else if (!socket.authorizationError) {
            socket.once("secureConnect", listeners.secureConnect);
          }
        }
        if (hasCloseListener) {
          socket.once("close", listeners.close);
        }
      };
      if (socket.writable && !socket.connecting) {
        onConnect();
      } else if (socket.connecting) {
        socket.once("connect", onConnect);
      } else if (socket.destroyed && hasCloseListener) {
        listeners.close(socket._hadError);
      }
    };
    exports2.default = deferToConnect;
    module2.exports = deferToConnect;
    module2.exports.default = deferToConnect;
  }
});

// node_modules/.pnpm/@szmarczak+http-timer@4.0.5/node_modules/@szmarczak/http-timer/dist/source/index.js
var require_source2 = __commonJS({
  "node_modules/.pnpm/@szmarczak+http-timer@4.0.5/node_modules/@szmarczak/http-timer/dist/source/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var defer_to_connect_1 = require_source();
    var nodejsMajorVersion = Number(process.versions.node.split(".")[0]);
    var timer = (request) => {
      const timings = {
        start: Date.now(),
        socket: void 0,
        lookup: void 0,
        connect: void 0,
        secureConnect: void 0,
        upload: void 0,
        response: void 0,
        end: void 0,
        error: void 0,
        abort: void 0,
        phases: {
          wait: void 0,
          dns: void 0,
          tcp: void 0,
          tls: void 0,
          request: void 0,
          firstByte: void 0,
          download: void 0,
          total: void 0
        }
      };
      request.timings = timings;
      const handleError = (origin) => {
        const emit = origin.emit.bind(origin);
        origin.emit = (event, ...args) => {
          if (event === "error") {
            timings.error = Date.now();
            timings.phases.total = timings.error - timings.start;
            origin.emit = emit;
          }
          return emit(event, ...args);
        };
      };
      handleError(request);
      request.prependOnceListener("abort", () => {
        timings.abort = Date.now();
        if (!timings.response || nodejsMajorVersion >= 13) {
          timings.phases.total = Date.now() - timings.start;
        }
      });
      const onSocket = (socket) => {
        timings.socket = Date.now();
        timings.phases.wait = timings.socket - timings.start;
        const lookupListener = () => {
          timings.lookup = Date.now();
          timings.phases.dns = timings.lookup - timings.socket;
        };
        socket.prependOnceListener("lookup", lookupListener);
        defer_to_connect_1.default(socket, {
          connect: () => {
            timings.connect = Date.now();
            if (timings.lookup === void 0) {
              socket.removeListener("lookup", lookupListener);
              timings.lookup = timings.connect;
              timings.phases.dns = timings.lookup - timings.socket;
            }
            timings.phases.tcp = timings.connect - timings.lookup;
          },
          secureConnect: () => {
            timings.secureConnect = Date.now();
            timings.phases.tls = timings.secureConnect - timings.connect;
          }
        });
      };
      if (request.socket) {
        onSocket(request.socket);
      } else {
        request.prependOnceListener("socket", onSocket);
      }
      const onUpload = () => {
        var _a;
        timings.upload = Date.now();
        timings.phases.request = timings.upload - (_a = timings.secureConnect, _a !== null && _a !== void 0 ? _a : timings.connect);
      };
      const writableFinished = () => {
        if (typeof request.writableFinished === "boolean") {
          return request.writableFinished;
        }
        return request.finished && request.outputSize === 0 && (!request.socket || request.socket.writableLength === 0);
      };
      if (writableFinished()) {
        onUpload();
      } else {
        request.prependOnceListener("finish", onUpload);
      }
      request.prependOnceListener("response", (response) => {
        timings.response = Date.now();
        timings.phases.firstByte = timings.response - timings.upload;
        response.timings = timings;
        handleError(response);
        response.prependOnceListener("end", () => {
          timings.end = Date.now();
          timings.phases.download = timings.end - timings.response;
          timings.phases.total = timings.end - timings.start;
        });
      });
      return timings;
    };
    exports2.default = timer;
    module2.exports = timer;
    module2.exports.default = timer;
  }
});

// node_modules/.pnpm/cacheable-lookup@5.0.4/node_modules/cacheable-lookup/source/index.js
var require_source3 = __commonJS({
  "node_modules/.pnpm/cacheable-lookup@5.0.4/node_modules/cacheable-lookup/source/index.js"(exports2, module2) {
    "use strict";
    var {
      V4MAPPED,
      ADDRCONFIG,
      ALL,
      promises: {
        Resolver: AsyncResolver
      },
      lookup: dnsLookup
    } = require("dns");
    var {promisify} = require("util");
    var os = require("os");
    var kCacheableLookupCreateConnection = Symbol("cacheableLookupCreateConnection");
    var kCacheableLookupInstance = Symbol("cacheableLookupInstance");
    var kExpires = Symbol("expires");
    var supportsALL = typeof ALL === "number";
    var verifyAgent = (agent) => {
      if (!(agent && typeof agent.createConnection === "function")) {
        throw new Error("Expected an Agent instance as the first argument");
      }
    };
    var map4to6 = (entries) => {
      for (const entry of entries) {
        if (entry.family === 6) {
          continue;
        }
        entry.address = `::ffff:${entry.address}`;
        entry.family = 6;
      }
    };
    var getIfaceInfo = () => {
      let has4 = false;
      let has6 = false;
      for (const device of Object.values(os.networkInterfaces())) {
        for (const iface of device) {
          if (iface.internal) {
            continue;
          }
          if (iface.family === "IPv6") {
            has6 = true;
          } else {
            has4 = true;
          }
          if (has4 && has6) {
            return {has4, has6};
          }
        }
      }
      return {has4, has6};
    };
    var isIterable = (map) => {
      return Symbol.iterator in map;
    };
    var ttl = {ttl: true};
    var all = {all: true};
    var CacheableLookup = class {
      constructor({
        cache = new Map(),
        maxTtl = Infinity,
        fallbackDuration = 3600,
        errorTtl = 0.15,
        resolver = new AsyncResolver(),
        lookup = dnsLookup
      } = {}) {
        this.maxTtl = maxTtl;
        this.errorTtl = errorTtl;
        this._cache = cache;
        this._resolver = resolver;
        this._dnsLookup = promisify(lookup);
        if (this._resolver instanceof AsyncResolver) {
          this._resolve4 = this._resolver.resolve4.bind(this._resolver);
          this._resolve6 = this._resolver.resolve6.bind(this._resolver);
        } else {
          this._resolve4 = promisify(this._resolver.resolve4.bind(this._resolver));
          this._resolve6 = promisify(this._resolver.resolve6.bind(this._resolver));
        }
        this._iface = getIfaceInfo();
        this._pending = {};
        this._nextRemovalTime = false;
        this._hostnamesToFallback = new Set();
        if (fallbackDuration < 1) {
          this._fallback = false;
        } else {
          this._fallback = true;
          const interval = setInterval(() => {
            this._hostnamesToFallback.clear();
          }, fallbackDuration * 1e3);
          if (interval.unref) {
            interval.unref();
          }
        }
        this.lookup = this.lookup.bind(this);
        this.lookupAsync = this.lookupAsync.bind(this);
      }
      set servers(servers) {
        this.clear();
        this._resolver.setServers(servers);
      }
      get servers() {
        return this._resolver.getServers();
      }
      lookup(hostname, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        } else if (typeof options === "number") {
          options = {
            family: options
          };
        }
        if (!callback) {
          throw new Error("Callback must be a function.");
        }
        this.lookupAsync(hostname, options).then((result) => {
          if (options.all) {
            callback(null, result);
          } else {
            callback(null, result.address, result.family, result.expires, result.ttl);
          }
        }, callback);
      }
      async lookupAsync(hostname, options = {}) {
        if (typeof options === "number") {
          options = {
            family: options
          };
        }
        let cached = await this.query(hostname);
        if (options.family === 6) {
          const filtered = cached.filter((entry) => entry.family === 6);
          if (options.hints & V4MAPPED) {
            if (supportsALL && options.hints & ALL || filtered.length === 0) {
              map4to6(cached);
            } else {
              cached = filtered;
            }
          } else {
            cached = filtered;
          }
        } else if (options.family === 4) {
          cached = cached.filter((entry) => entry.family === 4);
        }
        if (options.hints & ADDRCONFIG) {
          const {_iface} = this;
          cached = cached.filter((entry) => entry.family === 6 ? _iface.has6 : _iface.has4);
        }
        if (cached.length === 0) {
          const error = new Error(`cacheableLookup ENOTFOUND ${hostname}`);
          error.code = "ENOTFOUND";
          error.hostname = hostname;
          throw error;
        }
        if (options.all) {
          return cached;
        }
        return cached[0];
      }
      async query(hostname) {
        let cached = await this._cache.get(hostname);
        if (!cached) {
          const pending = this._pending[hostname];
          if (pending) {
            cached = await pending;
          } else {
            const newPromise = this.queryAndCache(hostname);
            this._pending[hostname] = newPromise;
            try {
              cached = await newPromise;
            } finally {
              delete this._pending[hostname];
            }
          }
        }
        cached = cached.map((entry) => {
          return __objSpread({}, entry);
        });
        return cached;
      }
      async _resolve(hostname) {
        const wrap = async (promise) => {
          try {
            return await promise;
          } catch (error) {
            if (error.code === "ENODATA" || error.code === "ENOTFOUND") {
              return [];
            }
            throw error;
          }
        };
        const [A, AAAA] = await Promise.all([
          this._resolve4(hostname, ttl),
          this._resolve6(hostname, ttl)
        ].map((promise) => wrap(promise)));
        let aTtl = 0;
        let aaaaTtl = 0;
        let cacheTtl = 0;
        const now = Date.now();
        for (const entry of A) {
          entry.family = 4;
          entry.expires = now + entry.ttl * 1e3;
          aTtl = Math.max(aTtl, entry.ttl);
        }
        for (const entry of AAAA) {
          entry.family = 6;
          entry.expires = now + entry.ttl * 1e3;
          aaaaTtl = Math.max(aaaaTtl, entry.ttl);
        }
        if (A.length > 0) {
          if (AAAA.length > 0) {
            cacheTtl = Math.min(aTtl, aaaaTtl);
          } else {
            cacheTtl = aTtl;
          }
        } else {
          cacheTtl = aaaaTtl;
        }
        return {
          entries: [
            ...A,
            ...AAAA
          ],
          cacheTtl
        };
      }
      async _lookup(hostname) {
        try {
          const entries = await this._dnsLookup(hostname, {
            all: true
          });
          return {
            entries,
            cacheTtl: 0
          };
        } catch (_) {
          return {
            entries: [],
            cacheTtl: 0
          };
        }
      }
      async _set(hostname, data, cacheTtl) {
        if (this.maxTtl > 0 && cacheTtl > 0) {
          cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1e3;
          data[kExpires] = Date.now() + cacheTtl;
          try {
            await this._cache.set(hostname, data, cacheTtl);
          } catch (error) {
            this.lookupAsync = async () => {
              const cacheError = new Error("Cache Error. Please recreate the CacheableLookup instance.");
              cacheError.cause = error;
              throw cacheError;
            };
          }
          if (isIterable(this._cache)) {
            this._tick(cacheTtl);
          }
        }
      }
      async queryAndCache(hostname) {
        if (this._hostnamesToFallback.has(hostname)) {
          return this._dnsLookup(hostname, all);
        }
        let query = await this._resolve(hostname);
        if (query.entries.length === 0 && this._fallback) {
          query = await this._lookup(hostname);
          if (query.entries.length !== 0) {
            this._hostnamesToFallback.add(hostname);
          }
        }
        const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
        await this._set(hostname, query.entries, cacheTtl);
        return query.entries;
      }
      _tick(ms) {
        const nextRemovalTime = this._nextRemovalTime;
        if (!nextRemovalTime || ms < nextRemovalTime) {
          clearTimeout(this._removalTimeout);
          this._nextRemovalTime = ms;
          this._removalTimeout = setTimeout(() => {
            this._nextRemovalTime = false;
            let nextExpiry = Infinity;
            const now = Date.now();
            for (const [hostname, entries] of this._cache) {
              const expires = entries[kExpires];
              if (now >= expires) {
                this._cache.delete(hostname);
              } else if (expires < nextExpiry) {
                nextExpiry = expires;
              }
            }
            if (nextExpiry !== Infinity) {
              this._tick(nextExpiry - now);
            }
          }, ms);
          if (this._removalTimeout.unref) {
            this._removalTimeout.unref();
          }
        }
      }
      install(agent) {
        verifyAgent(agent);
        if (kCacheableLookupCreateConnection in agent) {
          throw new Error("CacheableLookup has been already installed");
        }
        agent[kCacheableLookupCreateConnection] = agent.createConnection;
        agent[kCacheableLookupInstance] = this;
        agent.createConnection = (options, callback) => {
          if (!("lookup" in options)) {
            options.lookup = this.lookup;
          }
          return agent[kCacheableLookupCreateConnection](options, callback);
        };
      }
      uninstall(agent) {
        verifyAgent(agent);
        if (agent[kCacheableLookupCreateConnection]) {
          if (agent[kCacheableLookupInstance] !== this) {
            throw new Error("The agent is not owned by this CacheableLookup instance");
          }
          agent.createConnection = agent[kCacheableLookupCreateConnection];
          delete agent[kCacheableLookupCreateConnection];
          delete agent[kCacheableLookupInstance];
        }
      }
      updateInterfaceInfo() {
        const {_iface} = this;
        this._iface = getIfaceInfo();
        if (_iface.has4 && !this._iface.has4 || _iface.has6 && !this._iface.has6) {
          this._cache.clear();
        }
      }
      clear(hostname) {
        if (hostname) {
          this._cache.delete(hostname);
          return;
        }
        this._cache.clear();
      }
    };
    module2.exports = CacheableLookup;
    module2.exports.default = CacheableLookup;
  }
});

// node_modules/.pnpm/normalize-url@4.5.0/node_modules/normalize-url/index.js
var require_normalize_url = __commonJS({
  "node_modules/.pnpm/normalize-url@4.5.0/node_modules/normalize-url/index.js"(exports2, module2) {
    "use strict";
    var URLParser = typeof URL === "undefined" ? require("url").URL : URL;
    var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
    var DATA_URL_DEFAULT_CHARSET = "us-ascii";
    var testParameter = (name, filters) => {
      return filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
    };
    var normalizeDataURL = (urlString, {stripHash}) => {
      const parts = urlString.match(/^data:(.*?),(.*?)(?:#(.*))?$/);
      if (!parts) {
        throw new Error(`Invalid URL: ${urlString}`);
      }
      const mediaType = parts[1].split(";");
      const body = parts[2];
      const hash = stripHash ? "" : parts[3];
      let base64 = false;
      if (mediaType[mediaType.length - 1] === "base64") {
        mediaType.pop();
        base64 = true;
      }
      const mimeType = (mediaType.shift() || "").toLowerCase();
      const attributes = mediaType.map((attribute) => {
        let [key, value = ""] = attribute.split("=").map((string) => string.trim());
        if (key === "charset") {
          value = value.toLowerCase();
          if (value === DATA_URL_DEFAULT_CHARSET) {
            return "";
          }
        }
        return `${key}${value ? `=${value}` : ""}`;
      }).filter(Boolean);
      const normalizedMediaType = [
        ...attributes
      ];
      if (base64) {
        normalizedMediaType.push("base64");
      }
      if (normalizedMediaType.length !== 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
        normalizedMediaType.unshift(mimeType);
      }
      return `data:${normalizedMediaType.join(";")},${base64 ? body.trim() : body}${hash ? `#${hash}` : ""}`;
    };
    var normalizeUrl = (urlString, options) => {
      options = __objSpread({
        defaultProtocol: "http:",
        normalizeProtocol: true,
        forceHttp: false,
        forceHttps: false,
        stripAuthentication: true,
        stripHash: false,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i],
        removeTrailingSlash: true,
        removeDirectoryIndex: false,
        sortQueryParameters: true
      }, options);
      if (Reflect.has(options, "normalizeHttps")) {
        throw new Error("options.normalizeHttps is renamed to options.forceHttp");
      }
      if (Reflect.has(options, "normalizeHttp")) {
        throw new Error("options.normalizeHttp is renamed to options.forceHttps");
      }
      if (Reflect.has(options, "stripFragment")) {
        throw new Error("options.stripFragment is renamed to options.stripHash");
      }
      urlString = urlString.trim();
      if (/^data:/i.test(urlString)) {
        return normalizeDataURL(urlString, options);
      }
      const hasRelativeProtocol = urlString.startsWith("//");
      const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
      if (!isRelativeUrl) {
        urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
      }
      const urlObj = new URLParser(urlString);
      if (options.forceHttp && options.forceHttps) {
        throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
      }
      if (options.forceHttp && urlObj.protocol === "https:") {
        urlObj.protocol = "http:";
      }
      if (options.forceHttps && urlObj.protocol === "http:") {
        urlObj.protocol = "https:";
      }
      if (options.stripAuthentication) {
        urlObj.username = "";
        urlObj.password = "";
      }
      if (options.stripHash) {
        urlObj.hash = "";
      }
      if (urlObj.pathname) {
        urlObj.pathname = urlObj.pathname.replace(/((?!:).|^)\/{2,}/g, (_, p1) => {
          if (/^(?!\/)/g.test(p1)) {
            return `${p1}/`;
          }
          return "/";
        });
      }
      if (urlObj.pathname) {
        urlObj.pathname = decodeURI(urlObj.pathname);
      }
      if (options.removeDirectoryIndex === true) {
        options.removeDirectoryIndex = [/^index\.[a-z]+$/];
      }
      if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
        let pathComponents = urlObj.pathname.split("/");
        const lastComponent = pathComponents[pathComponents.length - 1];
        if (testParameter(lastComponent, options.removeDirectoryIndex)) {
          pathComponents = pathComponents.slice(0, pathComponents.length - 1);
          urlObj.pathname = pathComponents.slice(1).join("/") + "/";
        }
      }
      if (urlObj.hostname) {
        urlObj.hostname = urlObj.hostname.replace(/\.$/, "");
        if (options.stripWWW && /^www\.([a-z\-\d]{2,63})\.([a-z.]{2,5})$/.test(urlObj.hostname)) {
          urlObj.hostname = urlObj.hostname.replace(/^www\./, "");
        }
      }
      if (Array.isArray(options.removeQueryParameters)) {
        for (const key of [...urlObj.searchParams.keys()]) {
          if (testParameter(key, options.removeQueryParameters)) {
            urlObj.searchParams.delete(key);
          }
        }
      }
      if (options.sortQueryParameters) {
        urlObj.searchParams.sort();
      }
      if (options.removeTrailingSlash) {
        urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
      }
      urlString = urlObj.toString();
      if ((options.removeTrailingSlash || urlObj.pathname === "/") && urlObj.hash === "") {
        urlString = urlString.replace(/\/$/, "");
      }
      if (hasRelativeProtocol && !options.normalizeProtocol) {
        urlString = urlString.replace(/^http:\/\//, "//");
      }
      if (options.stripProtocol) {
        urlString = urlString.replace(/^(?:https?:)?\/\//, "");
      }
      return urlString;
    };
    module2.exports = normalizeUrl;
    module2.exports.default = normalizeUrl;
  }
});

// node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/.pnpm/once@1.4.0/node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/.pnpm/once@1.4.0/node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/.pnpm/end-of-stream@1.4.4/node_modules/end-of-stream/index.js
var require_end_of_stream = __commonJS({
  "node_modules/.pnpm/end-of-stream@1.4.4/node_modules/end-of-stream/index.js"(exports2, module2) {
    var once = require_once();
    var noop = function() {
    };
    var isRequest = function(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    };
    var isChildProcess = function(stream) {
      return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
    };
    var eos = function(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once(callback || noop);
      var ws = stream._writableState;
      var rs = stream._readableState;
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var cancelled = false;
      var onlegacyfinish = function() {
        if (!stream.writable)
          onfinish();
      };
      var onfinish = function() {
        writable = false;
        if (!readable)
          callback.call(stream);
      };
      var onend = function() {
        readable = false;
        if (!writable)
          callback.call(stream);
      };
      var onexit = function(exitCode) {
        callback.call(stream, exitCode ? new Error("exited with error code: " + exitCode) : null);
      };
      var onerror = function(err) {
        callback.call(stream, err);
      };
      var onclose = function() {
        process.nextTick(onclosenexttick);
      };
      var onclosenexttick = function() {
        if (cancelled)
          return;
        if (readable && !(rs && (rs.ended && !rs.destroyed)))
          return callback.call(stream, new Error("premature close"));
        if (writable && !(ws && (ws.ended && !ws.destroyed)))
          return callback.call(stream, new Error("premature close"));
      };
      var onrequest = function() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !ws) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      if (isChildProcess(stream))
        stream.on("exit", onexit);
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        cancelled = true;
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("exit", onexit);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    };
    module2.exports = eos;
  }
});

// node_modules/.pnpm/pump@3.0.0/node_modules/pump/index.js
var require_pump = __commonJS({
  "node_modules/.pnpm/pump@3.0.0/node_modules/pump/index.js"(exports2, module2) {
    var once = require_once();
    var eos = require_end_of_stream();
    var fs = require("fs");
    var noop = function() {
    };
    var ancient = /^v?\.0/.test(process.version);
    var isFn = function(fn) {
      return typeof fn === "function";
    };
    var isFS = function(stream) {
      if (!ancient)
        return false;
      if (!fs)
        return false;
      return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close);
    };
    var isRequest = function(stream) {
      return stream.setHeader && isFn(stream.abort);
    };
    var destroyer = function(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      eos(stream, {readable: reading, writable: writing}, function(err) {
        if (err)
          return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed)
          return;
        if (destroyed)
          return;
        destroyed = true;
        if (isFS(stream))
          return stream.close(noop);
        if (isRequest(stream))
          return stream.abort();
        if (isFn(stream.destroy))
          return stream.destroy();
        callback(err || new Error("stream was destroyed"));
      };
    };
    var call = function(fn) {
      fn();
    };
    var pipe = function(from, to) {
      return from.pipe(to);
    };
    var pump = function() {
      var streams = Array.prototype.slice.call(arguments);
      var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop;
      if (Array.isArray(streams[0]))
        streams = streams[0];
      if (streams.length < 2)
        throw new Error("pump requires two streams per minimum");
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error)
            error = err;
          if (err)
            destroys.forEach(call);
          if (reading)
            return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    };
    module2.exports = pump;
  }
});

// node_modules/.pnpm/get-stream@5.2.0/node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/.pnpm/get-stream@5.2.0/node_modules/get-stream/buffer-stream.js"(exports2, module2) {
    "use strict";
    var {PassThrough: PassThroughStream} = require("stream");
    module2.exports = (options) => {
      options = __objSpread({}, options);
      const {array} = options;
      let {encoding} = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({objectMode});
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// node_modules/.pnpm/get-stream@5.2.0/node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/.pnpm/get-stream@5.2.0/node_modules/get-stream/index.js"(exports2, module2) {
    "use strict";
    var {constants: BufferConstants} = require("buffer");
    var pump = require_pump();
    var bufferStream = require_buffer_stream();
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream(inputStream, options) {
      if (!inputStream) {
        return Promise.reject(new Error("Expected a stream"));
      }
      options = __objSpread({
        maxBuffer: Infinity
      }, options);
      const {maxBuffer} = options;
      let stream;
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream.getBufferedValue();
          }
          reject(error);
        };
        stream = pump(inputStream, bufferStream(options), (error) => {
          if (error) {
            rejectPromise(error);
            return;
          }
          resolve();
        });
        stream.on("data", () => {
          if (stream.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream.getBufferedValue();
    }
    module2.exports = getStream;
    module2.exports.default = getStream;
    module2.exports.buffer = (stream, options) => getStream(stream, __objSpread(__objSpread({}, options), {encoding: "buffer"}));
    module2.exports.array = (stream, options) => getStream(stream, __objSpread(__objSpread({}, options), {array: true}));
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/.pnpm/http-cache-semantics@4.1.0/node_modules/http-cache-semantics/index.js
var require_http_cache_semantics = __commonJS({
  "node_modules/.pnpm/http-cache-semantics@4.1.0/node_modules/http-cache-semantics/index.js"(exports2, module2) {
    "use strict";
    var statusCodeCacheableByDefault = new Set([
      200,
      203,
      204,
      206,
      300,
      301,
      404,
      405,
      410,
      414,
      501
    ]);
    var understoodStatuses = new Set([
      200,
      203,
      204,
      300,
      301,
      302,
      303,
      307,
      308,
      404,
      405,
      410,
      414,
      501
    ]);
    var errorStatusCodes = new Set([
      500,
      502,
      503,
      504
    ]);
    var hopByHopHeaders = {
      date: true,
      connection: true,
      "keep-alive": true,
      "proxy-authenticate": true,
      "proxy-authorization": true,
      te: true,
      trailer: true,
      "transfer-encoding": true,
      upgrade: true
    };
    var excludedFromRevalidationUpdate = {
      "content-length": true,
      "content-encoding": true,
      "transfer-encoding": true,
      "content-range": true
    };
    function toNumberOrZero(s) {
      const n = parseInt(s, 10);
      return isFinite(n) ? n : 0;
    }
    function isErrorResponse(response) {
      if (!response) {
        return true;
      }
      return errorStatusCodes.has(response.status);
    }
    function parseCacheControl(header) {
      const cc = {};
      if (!header)
        return cc;
      const parts = header.trim().split(/\s*,\s*/);
      for (const part of parts) {
        const [k, v] = part.split(/\s*=\s*/, 2);
        cc[k] = v === void 0 ? true : v.replace(/^"|"$/g, "");
      }
      return cc;
    }
    function formatCacheControl(cc) {
      let parts = [];
      for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + "=" + v);
      }
      if (!parts.length) {
        return void 0;
      }
      return parts.join(", ");
    }
    module2.exports = class CachePolicy {
      constructor(req, res, {
        shared,
        cacheHeuristic,
        immutableMinTimeToLive,
        ignoreCargoCult,
        _fromObject
      } = {}) {
        if (_fromObject) {
          this._fromObject(_fromObject);
          return;
        }
        if (!res || !res.headers) {
          throw Error("Response headers missing");
        }
        this._assertRequestHasHeaders(req);
        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._cacheHeuristic = cacheHeuristic !== void 0 ? cacheHeuristic : 0.1;
        this._immutableMinTtl = immutableMinTimeToLive !== void 0 ? immutableMinTimeToLive : 24 * 3600 * 1e3;
        this._status = "status" in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers["cache-control"]);
        this._method = "method" in req ? req.method : "GET";
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null;
        this._reqcc = parseCacheControl(req.headers["cache-control"]);
        if (ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
          delete this._rescc["pre-check"];
          delete this._rescc["post-check"];
          delete this._rescc["no-cache"];
          delete this._rescc["no-store"];
          delete this._rescc["must-revalidate"];
          this._resHeaders = Object.assign({}, this._resHeaders, {
            "cache-control": formatCacheControl(this._rescc)
          });
          delete this._resHeaders.expires;
          delete this._resHeaders.pragma;
        }
        if (res.headers["cache-control"] == null && /no-cache/.test(res.headers.pragma)) {
          this._rescc["no-cache"] = true;
        }
      }
      now() {
        return Date.now();
      }
      storable() {
        return !!(!this._reqcc["no-store"] && (this._method === "GET" || this._method === "HEAD" || this._method === "POST" && this._hasExplicitExpiration()) && understoodStatuses.has(this._status) && !this._rescc["no-store"] && (!this._isShared || !this._rescc.private) && (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && (this._resHeaders.expires || this._rescc["max-age"] || this._isShared && this._rescc["s-maxage"] || this._rescc.public || statusCodeCacheableByDefault.has(this._status)));
      }
      _hasExplicitExpiration() {
        return this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires;
      }
      _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
          throw Error("Request headers missing");
        }
      }
      satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);
        const requestCC = parseCacheControl(req.headers["cache-control"]);
        if (requestCC["no-cache"] || /no-cache/.test(req.headers.pragma)) {
          return false;
        }
        if (requestCC["max-age"] && this.age() > requestCC["max-age"]) {
          return false;
        }
        if (requestCC["min-fresh"] && this.timeToLive() < 1e3 * requestCC["min-fresh"]) {
          return false;
        }
        if (this.stale()) {
          const allowsStale = requestCC["max-stale"] && !this._rescc["must-revalidate"] && (requestCC["max-stale"] === true || requestCC["max-stale"] > this.age() - this.maxAge());
          if (!allowsStale) {
            return false;
          }
        }
        return this._requestMatches(req, false);
      }
      _requestMatches(req, allowHeadMethod) {
        return (!this._url || this._url === req.url) && this._host === req.headers.host && (!req.method || this._method === req.method || allowHeadMethod && req.method === "HEAD") && this._varyMatches(req);
      }
      _allowsStoringAuthenticated() {
        return this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"];
      }
      _varyMatches(req) {
        if (!this._resHeaders.vary) {
          return true;
        }
        if (this._resHeaders.vary === "*") {
          return false;
        }
        const fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
        for (const name of fields) {
          if (req.headers[name] !== this._reqHeaders[name])
            return false;
        }
        return true;
      }
      _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
          if (hopByHopHeaders[name])
            continue;
          headers[name] = inHeaders[name];
        }
        if (inHeaders.connection) {
          const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
          for (const name of tokens) {
            delete headers[name];
          }
        }
        if (headers.warning) {
          const warnings = headers.warning.split(/,/).filter((warning) => {
            return !/^\s*1[0-9][0-9]/.test(warning);
          });
          if (!warnings.length) {
            delete headers.warning;
          } else {
            headers.warning = warnings.join(",").trim();
          }
        }
        return headers;
      }
      responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();
        if (age > 3600 * 24 && !this._hasExplicitExpiration() && this.maxAge() > 3600 * 24) {
          headers.warning = (headers.warning ? `${headers.warning}, ` : "") + '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
      }
      date() {
        const serverDate = Date.parse(this._resHeaders.date);
        if (isFinite(serverDate)) {
          return serverDate;
        }
        return this._responseTime;
      }
      age() {
        let age = this._ageValue();
        const residentTime = (this.now() - this._responseTime) / 1e3;
        return age + residentTime;
      }
      _ageValue() {
        return toNumberOrZero(this._resHeaders.age);
      }
      maxAge() {
        if (!this.storable() || this._rescc["no-cache"]) {
          return 0;
        }
        if (this._isShared && (this._resHeaders["set-cookie"] && !this._rescc.public && !this._rescc.immutable)) {
          return 0;
        }
        if (this._resHeaders.vary === "*") {
          return 0;
        }
        if (this._isShared) {
          if (this._rescc["proxy-revalidate"]) {
            return 0;
          }
          if (this._rescc["s-maxage"]) {
            return toNumberOrZero(this._rescc["s-maxage"]);
          }
        }
        if (this._rescc["max-age"]) {
          return toNumberOrZero(this._rescc["max-age"]);
        }
        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;
        const serverDate = this.date();
        if (this._resHeaders.expires) {
          const expires = Date.parse(this._resHeaders.expires);
          if (Number.isNaN(expires) || expires < serverDate) {
            return 0;
          }
          return Math.max(defaultMinTtl, (expires - serverDate) / 1e3);
        }
        if (this._resHeaders["last-modified"]) {
          const lastModified = Date.parse(this._resHeaders["last-modified"]);
          if (isFinite(lastModified) && serverDate > lastModified) {
            return Math.max(defaultMinTtl, (serverDate - lastModified) / 1e3 * this._cacheHeuristic);
          }
        }
        return defaultMinTtl;
      }
      timeToLive() {
        const age = this.maxAge() - this.age();
        const staleIfErrorAge = age + toNumberOrZero(this._rescc["stale-if-error"]);
        const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc["stale-while-revalidate"]);
        return Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1e3;
      }
      stale() {
        return this.maxAge() <= this.age();
      }
      _useStaleIfError() {
        return this.maxAge() + toNumberOrZero(this._rescc["stale-if-error"]) > this.age();
      }
      useStaleWhileRevalidate() {
        return this.maxAge() + toNumberOrZero(this._rescc["stale-while-revalidate"]) > this.age();
      }
      static fromObject(obj) {
        return new this(void 0, void 0, {_fromObject: obj});
      }
      _fromObject(obj) {
        if (this._responseTime)
          throw Error("Reinitialized");
        if (!obj || obj.v !== 1)
          throw Error("Invalid serialization");
        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl = obj.imm !== void 0 ? obj.imm : 24 * 3600 * 1e3;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
      }
      toObject() {
        return {
          v: 1,
          t: this._responseTime,
          sh: this._isShared,
          ch: this._cacheHeuristic,
          imm: this._immutableMinTtl,
          st: this._status,
          resh: this._resHeaders,
          rescc: this._rescc,
          m: this._method,
          u: this._url,
          h: this._host,
          a: this._noAuthorization,
          reqh: this._reqHeaders,
          reqcc: this._reqcc
        };
      }
      revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);
        delete headers["if-range"];
        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
          delete headers["if-none-match"];
          delete headers["if-modified-since"];
          return headers;
        }
        if (this._resHeaders.etag) {
          headers["if-none-match"] = headers["if-none-match"] ? `${headers["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.etag;
        }
        const forbidsWeakValidators = headers["accept-ranges"] || headers["if-match"] || headers["if-unmodified-since"] || this._method && this._method != "GET";
        if (forbidsWeakValidators) {
          delete headers["if-modified-since"];
          if (headers["if-none-match"]) {
            const etags = headers["if-none-match"].split(/,/).filter((etag) => {
              return !/^\s*W\//.test(etag);
            });
            if (!etags.length) {
              delete headers["if-none-match"];
            } else {
              headers["if-none-match"] = etags.join(",").trim();
            }
          }
        } else if (this._resHeaders["last-modified"] && !headers["if-modified-since"]) {
          headers["if-modified-since"] = this._resHeaders["last-modified"];
        }
        return headers;
      }
      revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if (this._useStaleIfError() && isErrorResponse(response)) {
          return {
            modified: false,
            matches: false,
            policy: this
          };
        }
        if (!response || !response.headers) {
          throw Error("Response headers missing");
        }
        let matches = false;
        if (response.status !== void 0 && response.status != 304) {
          matches = false;
        } else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) {
          matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
          matches = this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag.replace(/^\s*W\//, "");
        } else if (this._resHeaders["last-modified"]) {
          matches = this._resHeaders["last-modified"] === response.headers["last-modified"];
        } else {
          if (!this._resHeaders.etag && !this._resHeaders["last-modified"] && !response.headers.etag && !response.headers["last-modified"]) {
            matches = true;
          }
        }
        if (!matches) {
          return {
            policy: new this.constructor(request, response),
            modified: response.status != 304,
            matches: false
          };
        }
        const headers = {};
        for (const k in this._resHeaders) {
          headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
        }
        const newResponse = Object.assign({}, response, {
          status: this._status,
          method: this._method,
          headers
        });
        return {
          policy: new this.constructor(request, newResponse, {
            shared: this._isShared,
            cacheHeuristic: this._cacheHeuristic,
            immutableMinTimeToLive: this._immutableMinTtl
          }),
          modified: false,
          matches: true
        };
      }
    };
  }
});

// node_modules/.pnpm/lowercase-keys@2.0.0/node_modules/lowercase-keys/index.js
var require_lowercase_keys = __commonJS({
  "node_modules/.pnpm/lowercase-keys@2.0.0/node_modules/lowercase-keys/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (object) => {
      const result = {};
      for (const [key, value] of Object.entries(object)) {
        result[key.toLowerCase()] = value;
      }
      return result;
    };
  }
});

// node_modules/.pnpm/responselike@2.0.0/node_modules/responselike/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/responselike@2.0.0/node_modules/responselike/src/index.js"(exports2, module2) {
    "use strict";
    var Readable = require("stream").Readable;
    var lowercaseKeys = require_lowercase_keys();
    var Response = class extends Readable {
      constructor(statusCode, headers, body, url) {
        if (typeof statusCode !== "number") {
          throw new TypeError("Argument `statusCode` should be a number");
        }
        if (typeof headers !== "object") {
          throw new TypeError("Argument `headers` should be an object");
        }
        if (!(body instanceof Buffer)) {
          throw new TypeError("Argument `body` should be a buffer");
        }
        if (typeof url !== "string") {
          throw new TypeError("Argument `url` should be a string");
        }
        super();
        this.statusCode = statusCode;
        this.headers = lowercaseKeys(headers);
        this.body = body;
        this.url = url;
      }
      _read() {
        this.push(this.body);
        this.push(null);
      }
    };
    module2.exports = Response;
  }
});

// node_modules/.pnpm/mimic-response@1.0.1/node_modules/mimic-response/index.js
var require_mimic_response = __commonJS({
  "node_modules/.pnpm/mimic-response@1.0.1/node_modules/mimic-response/index.js"(exports2, module2) {
    "use strict";
    var knownProps = [
      "destroy",
      "setTimeout",
      "socket",
      "headers",
      "trailers",
      "rawHeaders",
      "statusCode",
      "httpVersion",
      "httpVersionMinor",
      "httpVersionMajor",
      "rawTrailers",
      "statusMessage"
    ];
    module2.exports = (fromStream, toStream) => {
      const fromProps = new Set(Object.keys(fromStream).concat(knownProps));
      for (const prop of fromProps) {
        if (prop in toStream) {
          continue;
        }
        toStream[prop] = typeof fromStream[prop] === "function" ? fromStream[prop].bind(fromStream) : fromStream[prop];
      }
    };
  }
});

// node_modules/.pnpm/clone-response@1.0.2/node_modules/clone-response/src/index.js
var require_src2 = __commonJS({
  "node_modules/.pnpm/clone-response@1.0.2/node_modules/clone-response/src/index.js"(exports2, module2) {
    "use strict";
    var PassThrough = require("stream").PassThrough;
    var mimicResponse = require_mimic_response();
    var cloneResponse = (response) => {
      if (!(response && response.pipe)) {
        throw new TypeError("Parameter `response` must be a response stream.");
      }
      const clone = new PassThrough();
      mimicResponse(response, clone);
      return response.pipe(clone);
    };
    module2.exports = cloneResponse;
  }
});

// node_modules/.pnpm/json-buffer@3.0.1/node_modules/json-buffer/index.js
var require_json_buffer = __commonJS({
  "node_modules/.pnpm/json-buffer@3.0.1/node_modules/json-buffer/index.js"(exports2) {
    exports2.stringify = function stringify(o) {
      if (typeof o == "undefined")
        return o;
      if (o && Buffer.isBuffer(o))
        return JSON.stringify(":base64:" + o.toString("base64"));
      if (o && o.toJSON)
        o = o.toJSON();
      if (o && typeof o === "object") {
        var s = "";
        var array = Array.isArray(o);
        s = array ? "[" : "{";
        var first = true;
        for (var k in o) {
          var ignore = typeof o[k] == "function" || !array && typeof o[k] === "undefined";
          if (Object.hasOwnProperty.call(o, k) && !ignore) {
            if (!first)
              s += ",";
            first = false;
            if (array) {
              if (o[k] == void 0)
                s += "null";
              else
                s += stringify(o[k]);
            } else if (o[k] !== void 0) {
              s += stringify(k) + ":" + stringify(o[k]);
            }
          }
        }
        s += array ? "]" : "}";
        return s;
      } else if (typeof o === "string") {
        return JSON.stringify(/^:/.test(o) ? ":" + o : o);
      } else if (typeof o === "undefined") {
        return "null";
      } else
        return JSON.stringify(o);
    };
    exports2.parse = function(s) {
      return JSON.parse(s, function(key, value) {
        if (typeof value === "string") {
          if (/^:base64:/.test(value))
            return Buffer.from(value.substring(8), "base64");
          else
            return /^:/.test(value) ? value.substring(1) : value;
        }
        return value;
      });
    };
  }
});

// node_modules/.pnpm/keyv@4.0.3/node_modules/keyv/src/index.js
var require_src3 = __commonJS({
  "node_modules/.pnpm/keyv@4.0.3/node_modules/keyv/src/index.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var JSONB = require_json_buffer();
    var loadStore = (opts) => {
      const adapters = {
        redis: "@keyv/redis",
        mongodb: "@keyv/mongo",
        mongo: "@keyv/mongo",
        sqlite: "@keyv/sqlite",
        postgresql: "@keyv/postgres",
        postgres: "@keyv/postgres",
        mysql: "@keyv/mysql"
      };
      if (opts.adapter || opts.uri) {
        const adapter = opts.adapter || /^[^:]*/.exec(opts.uri)[0];
        return new (require(adapters[adapter]))(opts);
      }
      return new Map();
    };
    var Keyv = class extends EventEmitter {
      constructor(uri, opts) {
        super();
        this.opts = Object.assign({
          namespace: "keyv",
          serialize: JSONB.stringify,
          deserialize: JSONB.parse
        }, typeof uri === "string" ? {uri} : uri, opts);
        if (!this.opts.store) {
          const adapterOpts = Object.assign({}, this.opts);
          this.opts.store = loadStore(adapterOpts);
        }
        if (typeof this.opts.store.on === "function") {
          this.opts.store.on("error", (err) => this.emit("error", err));
        }
        this.opts.store.namespace = this.opts.namespace;
      }
      _getKeyPrefix(key) {
        return `${this.opts.namespace}:${key}`;
      }
      get(key, opts) {
        const keyPrefixed = this._getKeyPrefix(key);
        const {store} = this.opts;
        return Promise.resolve().then(() => store.get(keyPrefixed)).then((data) => {
          return typeof data === "string" ? this.opts.deserialize(data) : data;
        }).then((data) => {
          if (data === void 0) {
            return void 0;
          }
          if (typeof data.expires === "number" && Date.now() > data.expires) {
            this.delete(key);
            return void 0;
          }
          return opts && opts.raw ? data : data.value;
        });
      }
      set(key, value, ttl) {
        const keyPrefixed = this._getKeyPrefix(key);
        if (typeof ttl === "undefined") {
          ttl = this.opts.ttl;
        }
        if (ttl === 0) {
          ttl = void 0;
        }
        const {store} = this.opts;
        return Promise.resolve().then(() => {
          const expires = typeof ttl === "number" ? Date.now() + ttl : null;
          value = {value, expires};
          return this.opts.serialize(value);
        }).then((value2) => store.set(keyPrefixed, value2, ttl)).then(() => true);
      }
      delete(key) {
        const keyPrefixed = this._getKeyPrefix(key);
        const {store} = this.opts;
        return Promise.resolve().then(() => store.delete(keyPrefixed));
      }
      clear() {
        const {store} = this.opts;
        return Promise.resolve().then(() => store.clear());
      }
    };
    module2.exports = Keyv;
  }
});

// node_modules/.pnpm/cacheable-request@7.0.1/node_modules/cacheable-request/src/index.js
var require_src4 = __commonJS({
  "node_modules/.pnpm/cacheable-request@7.0.1/node_modules/cacheable-request/src/index.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var urlLib = require("url");
    var normalizeUrl = require_normalize_url();
    var getStream = require_get_stream();
    var CachePolicy = require_http_cache_semantics();
    var Response = require_src();
    var lowercaseKeys = require_lowercase_keys();
    var cloneResponse = require_src2();
    var Keyv = require_src3();
    var CacheableRequest = class {
      constructor(request, cacheAdapter) {
        if (typeof request !== "function") {
          throw new TypeError("Parameter `request` must be a function");
        }
        this.cache = new Keyv({
          uri: typeof cacheAdapter === "string" && cacheAdapter,
          store: typeof cacheAdapter !== "string" && cacheAdapter,
          namespace: "cacheable-request"
        });
        return this.createCacheableRequest(request);
      }
      createCacheableRequest(request) {
        return (opts, cb) => {
          let url;
          if (typeof opts === "string") {
            url = normalizeUrlObject(urlLib.parse(opts));
            opts = {};
          } else if (opts instanceof urlLib.URL) {
            url = normalizeUrlObject(urlLib.parse(opts.toString()));
            opts = {};
          } else {
            const [pathname, ...searchParts] = (opts.path || "").split("?");
            const search = searchParts.length > 0 ? `?${searchParts.join("?")}` : "";
            url = normalizeUrlObject(__objSpread(__objSpread({}, opts), {pathname, search}));
          }
          opts = __objSpread(__objSpread({
            headers: {},
            method: "GET",
            cache: true,
            strictTtl: false,
            automaticFailover: false
          }, opts), urlObjectToRequestOptions(url));
          opts.headers = lowercaseKeys(opts.headers);
          const ee = new EventEmitter();
          const normalizedUrlString = normalizeUrl(urlLib.format(url), {
            stripWWW: false,
            removeTrailingSlash: false,
            stripAuthentication: false
          });
          const key = `${opts.method}:${normalizedUrlString}`;
          let revalidate = false;
          let madeRequest = false;
          const makeRequest = (opts2) => {
            madeRequest = true;
            let requestErrored = false;
            let requestErrorCallback;
            const requestErrorPromise = new Promise((resolve) => {
              requestErrorCallback = () => {
                if (!requestErrored) {
                  requestErrored = true;
                  resolve();
                }
              };
            });
            const handler = (response) => {
              if (revalidate && !opts2.forceRefresh) {
                response.status = response.statusCode;
                const revalidatedPolicy = CachePolicy.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts2, response);
                if (!revalidatedPolicy.modified) {
                  const headers = revalidatedPolicy.policy.responseHeaders();
                  response = new Response(revalidate.statusCode, headers, revalidate.body, revalidate.url);
                  response.cachePolicy = revalidatedPolicy.policy;
                  response.fromCache = true;
                }
              }
              if (!response.fromCache) {
                response.cachePolicy = new CachePolicy(opts2, response, opts2);
                response.fromCache = false;
              }
              let clonedResponse;
              if (opts2.cache && response.cachePolicy.storable()) {
                clonedResponse = cloneResponse(response);
                (async () => {
                  try {
                    const bodyPromise = getStream.buffer(response);
                    await Promise.race([
                      requestErrorPromise,
                      new Promise((resolve) => response.once("end", resolve))
                    ]);
                    if (requestErrored) {
                      return;
                    }
                    const body = await bodyPromise;
                    const value = {
                      cachePolicy: response.cachePolicy.toObject(),
                      url: response.url,
                      statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
                      body
                    };
                    let ttl = opts2.strictTtl ? response.cachePolicy.timeToLive() : void 0;
                    if (opts2.maxTtl) {
                      ttl = ttl ? Math.min(ttl, opts2.maxTtl) : opts2.maxTtl;
                    }
                    await this.cache.set(key, value, ttl);
                  } catch (error) {
                    ee.emit("error", new CacheableRequest.CacheError(error));
                  }
                })();
              } else if (opts2.cache && revalidate) {
                (async () => {
                  try {
                    await this.cache.delete(key);
                  } catch (error) {
                    ee.emit("error", new CacheableRequest.CacheError(error));
                  }
                })();
              }
              ee.emit("response", clonedResponse || response);
              if (typeof cb === "function") {
                cb(clonedResponse || response);
              }
            };
            try {
              const req = request(opts2, handler);
              req.once("error", requestErrorCallback);
              req.once("abort", requestErrorCallback);
              ee.emit("request", req);
            } catch (error) {
              ee.emit("error", new CacheableRequest.RequestError(error));
            }
          };
          (async () => {
            const get = async (opts2) => {
              await Promise.resolve();
              const cacheEntry = opts2.cache ? await this.cache.get(key) : void 0;
              if (typeof cacheEntry === "undefined") {
                return makeRequest(opts2);
              }
              const policy = CachePolicy.fromObject(cacheEntry.cachePolicy);
              if (policy.satisfiesWithoutRevalidation(opts2) && !opts2.forceRefresh) {
                const headers = policy.responseHeaders();
                const response = new Response(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
                response.cachePolicy = policy;
                response.fromCache = true;
                ee.emit("response", response);
                if (typeof cb === "function") {
                  cb(response);
                }
              } else {
                revalidate = cacheEntry;
                opts2.headers = policy.revalidationHeaders(opts2);
                makeRequest(opts2);
              }
            };
            const errorHandler = (error) => ee.emit("error", new CacheableRequest.CacheError(error));
            this.cache.once("error", errorHandler);
            ee.on("response", () => this.cache.removeListener("error", errorHandler));
            try {
              await get(opts);
            } catch (error) {
              if (opts.automaticFailover && !madeRequest) {
                makeRequest(opts);
              }
              ee.emit("error", new CacheableRequest.CacheError(error));
            }
          })();
          return ee;
        };
      }
    };
    function urlObjectToRequestOptions(url) {
      const options = __objSpread({}, url);
      options.path = `${url.pathname || "/"}${url.search || ""}`;
      delete options.pathname;
      delete options.search;
      return options;
    }
    function normalizeUrlObject(url) {
      return {
        protocol: url.protocol,
        auth: url.auth,
        hostname: url.hostname || url.host || "localhost",
        port: url.port,
        pathname: url.pathname,
        search: url.search
      };
    }
    CacheableRequest.RequestError = class extends Error {
      constructor(error) {
        super(error.message);
        this.name = "RequestError";
        Object.assign(this, error);
      }
    };
    CacheableRequest.CacheError = class extends Error {
      constructor(error) {
        super(error.message);
        this.name = "CacheError";
        Object.assign(this, error);
      }
    };
    module2.exports = CacheableRequest;
  }
});

// node_modules/.pnpm/mimic-response@3.1.0/node_modules/mimic-response/index.js
var require_mimic_response2 = __commonJS({
  "node_modules/.pnpm/mimic-response@3.1.0/node_modules/mimic-response/index.js"(exports2, module2) {
    "use strict";
    var knownProperties = [
      "aborted",
      "complete",
      "headers",
      "httpVersion",
      "httpVersionMinor",
      "httpVersionMajor",
      "method",
      "rawHeaders",
      "rawTrailers",
      "setTimeout",
      "socket",
      "statusCode",
      "statusMessage",
      "trailers",
      "url"
    ];
    module2.exports = (fromStream, toStream) => {
      if (toStream._readableState.autoDestroy) {
        throw new Error("The second stream must have the `autoDestroy` option set to `false`");
      }
      const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));
      const properties = {};
      for (const property of fromProperties) {
        if (property in toStream) {
          continue;
        }
        properties[property] = {
          get() {
            const value = fromStream[property];
            const isFunction = typeof value === "function";
            return isFunction ? value.bind(fromStream) : value;
          },
          set(value) {
            fromStream[property] = value;
          },
          enumerable: true,
          configurable: false
        };
      }
      Object.defineProperties(toStream, properties);
      fromStream.once("aborted", () => {
        toStream.destroy();
        toStream.emit("aborted");
      });
      fromStream.once("close", () => {
        if (fromStream.complete) {
          if (toStream.readable) {
            toStream.once("end", () => {
              toStream.emit("close");
            });
          } else {
            toStream.emit("close");
          }
        } else {
          toStream.emit("close");
        }
      });
      return toStream;
    };
  }
});

// node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js
var require_decompress_response = __commonJS({
  "node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js"(exports2, module2) {
    "use strict";
    var {Transform, PassThrough} = require("stream");
    var zlib = require("zlib");
    var mimicResponse = require_mimic_response2();
    module2.exports = (response) => {
      const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
      if (!["gzip", "deflate", "br"].includes(contentEncoding)) {
        return response;
      }
      const isBrotli = contentEncoding === "br";
      if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
        response.destroy(new Error("Brotli is not supported on Node.js < 12"));
        return response;
      }
      let isEmpty = true;
      const checker = new Transform({
        transform(data, _encoding, callback) {
          isEmpty = false;
          callback(null, data);
        },
        flush(callback) {
          callback();
        }
      });
      const finalStream = new PassThrough({
        autoDestroy: false,
        destroy(error, callback) {
          response.destroy();
          callback(error);
        }
      });
      const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
      decompressStream.once("error", (error) => {
        if (isEmpty && !response.readable) {
          finalStream.end();
          return;
        }
        finalStream.destroy(error);
      });
      mimicResponse(response, finalStream);
      response.pipe(checker).pipe(decompressStream).pipe(finalStream);
      return finalStream;
    };
  }
});

// node_modules/.pnpm/quick-lru@5.1.1/node_modules/quick-lru/index.js
var require_quick_lru = __commonJS({
  "node_modules/.pnpm/quick-lru@5.1.1/node_modules/quick-lru/index.js"(exports2, module2) {
    "use strict";
    var QuickLRU = class {
      constructor(options = {}) {
        if (!(options.maxSize && options.maxSize > 0)) {
          throw new TypeError("`maxSize` must be a number greater than 0");
        }
        this.maxSize = options.maxSize;
        this.onEviction = options.onEviction;
        this.cache = new Map();
        this.oldCache = new Map();
        this._size = 0;
      }
      _set(key, value) {
        this.cache.set(key, value);
        this._size++;
        if (this._size >= this.maxSize) {
          this._size = 0;
          if (typeof this.onEviction === "function") {
            for (const [key2, value2] of this.oldCache.entries()) {
              this.onEviction(key2, value2);
            }
          }
          this.oldCache = this.cache;
          this.cache = new Map();
        }
      }
      get(key) {
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
          const value = this.oldCache.get(key);
          this.oldCache.delete(key);
          this._set(key, value);
          return value;
        }
      }
      set(key, value) {
        if (this.cache.has(key)) {
          this.cache.set(key, value);
        } else {
          this._set(key, value);
        }
        return this;
      }
      has(key) {
        return this.cache.has(key) || this.oldCache.has(key);
      }
      peek(key) {
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
          return this.oldCache.get(key);
        }
      }
      delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
          this._size--;
        }
        return this.oldCache.delete(key) || deleted;
      }
      clear() {
        this.cache.clear();
        this.oldCache.clear();
        this._size = 0;
      }
      *keys() {
        for (const [key] of this) {
          yield key;
        }
      }
      *values() {
        for (const [, value] of this) {
          yield value;
        }
      }
      *[Symbol.iterator]() {
        for (const item of this.cache) {
          yield item;
        }
        for (const item of this.oldCache) {
          const [key] = item;
          if (!this.cache.has(key)) {
            yield item;
          }
        }
      }
      get size() {
        let oldCacheSize = 0;
        for (const key of this.oldCache.keys()) {
          if (!this.cache.has(key)) {
            oldCacheSize++;
          }
        }
        return Math.min(this._size + oldCacheSize, this.maxSize);
      }
    };
    module2.exports = QuickLRU;
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/agent.js
var require_agent = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/agent.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var tls = require("tls");
    var http2 = require("http2");
    var QuickLRU = require_quick_lru();
    var kCurrentStreamsCount = Symbol("currentStreamsCount");
    var kRequest = Symbol("request");
    var kOriginSet = Symbol("cachedOriginSet");
    var kGracefullyClosing = Symbol("gracefullyClosing");
    var nameKeys = [
      "maxDeflateDynamicTableSize",
      "maxSessionMemory",
      "maxHeaderListPairs",
      "maxOutstandingPings",
      "maxReservedRemoteStreams",
      "maxSendHeaderBlockLength",
      "paddingStrategy",
      "localAddress",
      "path",
      "rejectUnauthorized",
      "minDHSize",
      "ca",
      "cert",
      "clientCertEngine",
      "ciphers",
      "key",
      "pfx",
      "servername",
      "minVersion",
      "maxVersion",
      "secureProtocol",
      "crl",
      "honorCipherOrder",
      "ecdhCurve",
      "dhparam",
      "secureOptions",
      "sessionIdContext"
    ];
    var getSortedIndex = (array, value, compare) => {
      let low = 0;
      let high = array.length;
      while (low < high) {
        const mid = low + high >>> 1;
        if (compare(array[mid], value)) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return low;
    };
    var compareSessions = (a, b) => {
      return a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
    };
    var closeCoveredSessions = (where, session) => {
      for (const coveredSession of where) {
        if (coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams) {
          gracefullyClose(coveredSession);
        }
      }
    };
    var closeSessionIfCovered = (where, coveredSession) => {
      for (const session of where) {
        if (coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams) {
          gracefullyClose(coveredSession);
        }
      }
    };
    var getSessions = ({agent, isFree}) => {
      const result = {};
      for (const normalizedOptions in agent.sessions) {
        const sessions = agent.sessions[normalizedOptions];
        const filtered = sessions.filter((session) => {
          const result2 = session[Agent.kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;
          return isFree ? result2 : !result2;
        });
        if (filtered.length !== 0) {
          result[normalizedOptions] = filtered;
        }
      }
      return result;
    };
    var gracefullyClose = (session) => {
      session[kGracefullyClosing] = true;
      if (session[kCurrentStreamsCount] === 0) {
        session.close();
      }
    };
    var Agent = class extends EventEmitter {
      constructor({timeout = 6e4, maxSessions = Infinity, maxFreeSessions = 10, maxCachedTlsSessions = 100} = {}) {
        super();
        this.sessions = {};
        this.queue = {};
        this.timeout = timeout;
        this.maxSessions = maxSessions;
        this.maxFreeSessions = maxFreeSessions;
        this._freeSessionsCount = 0;
        this._sessionsCount = 0;
        this.settings = {
          enablePush: false
        };
        this.tlsSessionCache = new QuickLRU({maxSize: maxCachedTlsSessions});
      }
      static normalizeOrigin(url, servername) {
        if (typeof url === "string") {
          url = new URL(url);
        }
        if (servername && url.hostname !== servername) {
          url.hostname = servername;
        }
        return url.origin;
      }
      normalizeOptions(options) {
        let normalized = "";
        if (options) {
          for (const key of nameKeys) {
            if (options[key]) {
              normalized += `:${options[key]}`;
            }
          }
        }
        return normalized;
      }
      _tryToCreateNewSession(normalizedOptions, normalizedOrigin) {
        if (!(normalizedOptions in this.queue) || !(normalizedOrigin in this.queue[normalizedOptions])) {
          return;
        }
        const item = this.queue[normalizedOptions][normalizedOrigin];
        if (this._sessionsCount < this.maxSessions && !item.completed) {
          item.completed = true;
          item();
        }
      }
      getSession(origin, options, listeners) {
        return new Promise((resolve, reject) => {
          if (Array.isArray(listeners)) {
            listeners = [...listeners];
            resolve();
          } else {
            listeners = [{resolve, reject}];
          }
          const normalizedOptions = this.normalizeOptions(options);
          const normalizedOrigin = Agent.normalizeOrigin(origin, options && options.servername);
          if (normalizedOrigin === void 0) {
            for (const {reject: reject2} of listeners) {
              reject2(new TypeError("The `origin` argument needs to be a string or an URL object"));
            }
            return;
          }
          if (normalizedOptions in this.sessions) {
            const sessions = this.sessions[normalizedOptions];
            let maxConcurrentStreams = -1;
            let currentStreamsCount = -1;
            let optimalSession;
            for (const session of sessions) {
              const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;
              if (sessionMaxConcurrentStreams < maxConcurrentStreams) {
                break;
              }
              if (session[kOriginSet].includes(normalizedOrigin)) {
                const sessionCurrentStreamsCount = session[kCurrentStreamsCount];
                if (sessionCurrentStreamsCount >= sessionMaxConcurrentStreams || session[kGracefullyClosing] || session.destroyed) {
                  continue;
                }
                if (!optimalSession) {
                  maxConcurrentStreams = sessionMaxConcurrentStreams;
                }
                if (sessionCurrentStreamsCount > currentStreamsCount) {
                  optimalSession = session;
                  currentStreamsCount = sessionCurrentStreamsCount;
                }
              }
            }
            if (optimalSession) {
              if (listeners.length !== 1) {
                for (const {reject: reject2} of listeners) {
                  const error = new Error(`Expected the length of listeners to be 1, got ${listeners.length}.
Please report this to https://github.com/szmarczak/http2-wrapper/`);
                  reject2(error);
                }
                return;
              }
              listeners[0].resolve(optimalSession);
              return;
            }
          }
          if (normalizedOptions in this.queue) {
            if (normalizedOrigin in this.queue[normalizedOptions]) {
              this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);
              this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
              return;
            }
          } else {
            this.queue[normalizedOptions] = {};
          }
          const removeFromQueue = () => {
            if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
              delete this.queue[normalizedOptions][normalizedOrigin];
              if (Object.keys(this.queue[normalizedOptions]).length === 0) {
                delete this.queue[normalizedOptions];
              }
            }
          };
          const entry = () => {
            const name = `${normalizedOrigin}:${normalizedOptions}`;
            let receivedSettings = false;
            try {
              const session = http2.connect(origin, __objSpread({
                createConnection: this.createConnection,
                settings: this.settings,
                session: this.tlsSessionCache.get(name)
              }, options));
              session[kCurrentStreamsCount] = 0;
              session[kGracefullyClosing] = false;
              const isFree = () => session[kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;
              let wasFree = true;
              session.socket.once("session", (tlsSession) => {
                this.tlsSessionCache.set(name, tlsSession);
              });
              session.once("error", (error) => {
                for (const {reject: reject2} of listeners) {
                  reject2(error);
                }
                this.tlsSessionCache.delete(name);
              });
              session.setTimeout(this.timeout, () => {
                session.destroy();
              });
              session.once("close", () => {
                if (receivedSettings) {
                  if (wasFree) {
                    this._freeSessionsCount--;
                  }
                  this._sessionsCount--;
                  const where = this.sessions[normalizedOptions];
                  where.splice(where.indexOf(session), 1);
                  if (where.length === 0) {
                    delete this.sessions[normalizedOptions];
                  }
                } else {
                  const error = new Error("Session closed without receiving a SETTINGS frame");
                  error.code = "HTTP2WRAPPER_NOSETTINGS";
                  for (const {reject: reject2} of listeners) {
                    reject2(error);
                  }
                  removeFromQueue();
                }
                this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
              });
              const processListeners = () => {
                if (!(normalizedOptions in this.queue) || !isFree()) {
                  return;
                }
                for (const origin2 of session[kOriginSet]) {
                  if (origin2 in this.queue[normalizedOptions]) {
                    const {listeners: listeners2} = this.queue[normalizedOptions][origin2];
                    while (listeners2.length !== 0 && isFree()) {
                      listeners2.shift().resolve(session);
                    }
                    const where = this.queue[normalizedOptions];
                    if (where[origin2].listeners.length === 0) {
                      delete where[origin2];
                      if (Object.keys(where).length === 0) {
                        delete this.queue[normalizedOptions];
                        break;
                      }
                    }
                    if (!isFree()) {
                      break;
                    }
                  }
                }
              };
              session.on("origin", () => {
                session[kOriginSet] = session.originSet;
                if (!isFree()) {
                  return;
                }
                processListeners();
                closeCoveredSessions(this.sessions[normalizedOptions], session);
              });
              session.once("remoteSettings", () => {
                session.ref();
                session.unref();
                this._sessionsCount++;
                if (entry.destroyed) {
                  const error = new Error("Agent has been destroyed");
                  for (const listener of listeners) {
                    listener.reject(error);
                  }
                  session.destroy();
                  return;
                }
                session[kOriginSet] = session.originSet;
                {
                  const where = this.sessions;
                  if (normalizedOptions in where) {
                    const sessions = where[normalizedOptions];
                    sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
                  } else {
                    where[normalizedOptions] = [session];
                  }
                }
                this._freeSessionsCount += 1;
                receivedSettings = true;
                this.emit("session", session);
                processListeners();
                removeFromQueue();
                if (session[kCurrentStreamsCount] === 0 && this._freeSessionsCount > this.maxFreeSessions) {
                  session.close();
                }
                if (listeners.length !== 0) {
                  this.getSession(normalizedOrigin, options, listeners);
                  listeners.length = 0;
                }
                session.on("remoteSettings", () => {
                  processListeners();
                  closeCoveredSessions(this.sessions[normalizedOptions], session);
                });
              });
              session[kRequest] = session.request;
              session.request = (headers, streamOptions) => {
                if (session[kGracefullyClosing]) {
                  throw new Error("The session is gracefully closing. No new streams are allowed.");
                }
                const stream = session[kRequest](headers, streamOptions);
                session.ref();
                ++session[kCurrentStreamsCount];
                if (session[kCurrentStreamsCount] === session.remoteSettings.maxConcurrentStreams) {
                  this._freeSessionsCount--;
                }
                stream.once("close", () => {
                  wasFree = isFree();
                  --session[kCurrentStreamsCount];
                  if (!session.destroyed && !session.closed) {
                    closeSessionIfCovered(this.sessions[normalizedOptions], session);
                    if (isFree() && !session.closed) {
                      if (!wasFree) {
                        this._freeSessionsCount++;
                        wasFree = true;
                      }
                      const isEmpty = session[kCurrentStreamsCount] === 0;
                      if (isEmpty) {
                        session.unref();
                      }
                      if (isEmpty && (this._freeSessionsCount > this.maxFreeSessions || session[kGracefullyClosing])) {
                        session.close();
                      } else {
                        closeCoveredSessions(this.sessions[normalizedOptions], session);
                        processListeners();
                      }
                    }
                  }
                });
                return stream;
              };
            } catch (error) {
              for (const listener of listeners) {
                listener.reject(error);
              }
              removeFromQueue();
            }
          };
          entry.listeners = listeners;
          entry.completed = false;
          entry.destroyed = false;
          this.queue[normalizedOptions][normalizedOrigin] = entry;
          this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
        });
      }
      request(origin, options, headers, streamOptions) {
        return new Promise((resolve, reject) => {
          this.getSession(origin, options, [{
            reject,
            resolve: (session) => {
              try {
                resolve(session.request(headers, streamOptions));
              } catch (error) {
                reject(error);
              }
            }
          }]);
        });
      }
      createConnection(origin, options) {
        return Agent.connect(origin, options);
      }
      static connect(origin, options) {
        options.ALPNProtocols = ["h2"];
        const port = origin.port || 443;
        const host = origin.hostname || origin.host;
        if (typeof options.servername === "undefined") {
          options.servername = host;
        }
        return tls.connect(port, host, options);
      }
      closeFreeSessions() {
        for (const sessions of Object.values(this.sessions)) {
          for (const session of sessions) {
            if (session[kCurrentStreamsCount] === 0) {
              session.close();
            }
          }
        }
      }
      destroy(reason) {
        for (const sessions of Object.values(this.sessions)) {
          for (const session of sessions) {
            session.destroy(reason);
          }
        }
        for (const entriesOfAuthority of Object.values(this.queue)) {
          for (const entry of Object.values(entriesOfAuthority)) {
            entry.destroyed = true;
          }
        }
        this.queue = {};
      }
      get freeSessions() {
        return getSessions({agent: this, isFree: true});
      }
      get busySessions() {
        return getSessions({agent: this, isFree: false});
      }
    };
    Agent.kCurrentStreamsCount = kCurrentStreamsCount;
    Agent.kGracefullyClosing = kGracefullyClosing;
    module2.exports = {
      Agent,
      globalAgent: new Agent()
    };
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/incoming-message.js
var require_incoming_message = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/incoming-message.js"(exports2, module2) {
    "use strict";
    var {Readable} = require("stream");
    var IncomingMessage = class extends Readable {
      constructor(socket, highWaterMark) {
        super({
          highWaterMark,
          autoDestroy: false
        });
        this.statusCode = null;
        this.statusMessage = "";
        this.httpVersion = "2.0";
        this.httpVersionMajor = 2;
        this.httpVersionMinor = 0;
        this.headers = {};
        this.trailers = {};
        this.req = null;
        this.aborted = false;
        this.complete = false;
        this.upgrade = null;
        this.rawHeaders = [];
        this.rawTrailers = [];
        this.socket = socket;
        this.connection = socket;
        this._dumped = false;
      }
      _destroy(error) {
        this.req._request.destroy(error);
      }
      setTimeout(ms, callback) {
        this.req.setTimeout(ms, callback);
        return this;
      }
      _dump() {
        if (!this._dumped) {
          this._dumped = true;
          this.removeAllListeners("data");
          this.resume();
        }
      }
      _read() {
        if (this.req) {
          this.req._request.resume();
        }
      }
    };
    module2.exports = IncomingMessage;
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/url-to-options.js
var require_url_to_options = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/url-to-options.js"(exports2, module2) {
    "use strict";
    module2.exports = (url) => {
      const options = {
        protocol: url.protocol,
        hostname: typeof url.hostname === "string" && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
        host: url.host,
        hash: url.hash,
        search: url.search,
        pathname: url.pathname,
        href: url.href,
        path: `${url.pathname || ""}${url.search || ""}`
      };
      if (typeof url.port === "string" && url.port.length !== 0) {
        options.port = Number(url.port);
      }
      if (url.username || url.password) {
        options.auth = `${url.username || ""}:${url.password || ""}`;
      }
      return options;
    };
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/proxy-events.js
var require_proxy_events = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/proxy-events.js"(exports2, module2) {
    "use strict";
    module2.exports = (from, to, events) => {
      for (const event of events) {
        from.on(event, (...args) => to.emit(event, ...args));
      }
    };
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js
var require_is_request_pseudo_header = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js"(exports2, module2) {
    "use strict";
    module2.exports = (header) => {
      switch (header) {
        case ":method":
        case ":scheme":
        case ":authority":
        case ":path":
          return true;
        default:
          return false;
      }
    };
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/errors.js"(exports2, module2) {
    "use strict";
    var makeError = (Base, key, getMessage) => {
      module2.exports[key] = class NodeError extends Base {
        constructor(...args) {
          super(typeof getMessage === "string" ? getMessage : getMessage(args));
          this.name = `${super.name} [${key}]`;
          this.code = key;
        }
      };
    };
    makeError(TypeError, "ERR_INVALID_ARG_TYPE", (args) => {
      const type = args[0].includes(".") ? "property" : "argument";
      let valid = args[1];
      const isManyTypes = Array.isArray(valid);
      if (isManyTypes) {
        valid = `${valid.slice(0, -1).join(", ")} or ${valid.slice(-1)}`;
      }
      return `The "${args[0]}" ${type} must be ${isManyTypes ? "one of" : "of"} type ${valid}. Received ${typeof args[2]}`;
    });
    makeError(TypeError, "ERR_INVALID_PROTOCOL", (args) => {
      return `Protocol "${args[0]}" not supported. Expected "${args[1]}"`;
    });
    makeError(Error, "ERR_HTTP_HEADERS_SENT", (args) => {
      return `Cannot ${args[0]} headers after they are sent to the client`;
    });
    makeError(TypeError, "ERR_INVALID_HTTP_TOKEN", (args) => {
      return `${args[0]} must be a valid HTTP token [${args[1]}]`;
    });
    makeError(TypeError, "ERR_HTTP_INVALID_HEADER_VALUE", (args) => {
      return `Invalid value "${args[0]} for header "${args[1]}"`;
    });
    makeError(TypeError, "ERR_INVALID_CHAR", (args) => {
      return `Invalid character in ${args[0]} [${args[1]}]`;
    });
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/client-request.js
var require_client_request = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/client-request.js"(exports2, module2) {
    "use strict";
    var http2 = require("http2");
    var {Writable} = require("stream");
    var {Agent, globalAgent} = require_agent();
    var IncomingMessage = require_incoming_message();
    var urlToOptions = require_url_to_options();
    var proxyEvents = require_proxy_events();
    var isRequestPseudoHeader = require_is_request_pseudo_header();
    var {
      ERR_INVALID_ARG_TYPE,
      ERR_INVALID_PROTOCOL,
      ERR_HTTP_HEADERS_SENT,
      ERR_INVALID_HTTP_TOKEN,
      ERR_HTTP_INVALID_HEADER_VALUE,
      ERR_INVALID_CHAR
    } = require_errors();
    var {
      HTTP2_HEADER_STATUS,
      HTTP2_HEADER_METHOD,
      HTTP2_HEADER_PATH,
      HTTP2_METHOD_CONNECT
    } = http2.constants;
    var kHeaders = Symbol("headers");
    var kOrigin = Symbol("origin");
    var kSession = Symbol("session");
    var kOptions = Symbol("options");
    var kFlushedHeaders = Symbol("flushedHeaders");
    var kJobs = Symbol("jobs");
    var isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
    var isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;
    var ClientRequest = class extends Writable {
      constructor(input, options, callback) {
        super({
          autoDestroy: false
        });
        const hasInput = typeof input === "string" || input instanceof URL;
        if (hasInput) {
          input = urlToOptions(input instanceof URL ? input : new URL(input));
        }
        if (typeof options === "function" || options === void 0) {
          callback = options;
          options = hasInput ? input : __objSpread({}, input);
        } else {
          options = __objSpread(__objSpread({}, input), options);
        }
        if (options.h2session) {
          this[kSession] = options.h2session;
        } else if (options.agent === false) {
          this.agent = new Agent({maxFreeSessions: 0});
        } else if (typeof options.agent === "undefined" || options.agent === null) {
          if (typeof options.createConnection === "function") {
            this.agent = new Agent({maxFreeSessions: 0});
            this.agent.createConnection = options.createConnection;
          } else {
            this.agent = globalAgent;
          }
        } else if (typeof options.agent.request === "function") {
          this.agent = options.agent;
        } else {
          throw new ERR_INVALID_ARG_TYPE("options.agent", ["Agent-like Object", "undefined", "false"], options.agent);
        }
        if (options.protocol && options.protocol !== "https:") {
          throw new ERR_INVALID_PROTOCOL(options.protocol, "https:");
        }
        const port = options.port || options.defaultPort || this.agent && this.agent.defaultPort || 443;
        const host = options.hostname || options.host || "localhost";
        delete options.hostname;
        delete options.host;
        delete options.port;
        const {timeout} = options;
        options.timeout = void 0;
        this[kHeaders] = Object.create(null);
        this[kJobs] = [];
        this.socket = null;
        this.connection = null;
        this.method = options.method || "GET";
        this.path = options.path;
        this.res = null;
        this.aborted = false;
        this.reusedSocket = false;
        if (options.headers) {
          for (const [header, value] of Object.entries(options.headers)) {
            this.setHeader(header, value);
          }
        }
        if (options.auth && !("authorization" in this[kHeaders])) {
          this[kHeaders].authorization = "Basic " + Buffer.from(options.auth).toString("base64");
        }
        options.session = options.tlsSession;
        options.path = options.socketPath;
        this[kOptions] = options;
        if (port === 443) {
          this[kOrigin] = `https://${host}`;
          if (!(":authority" in this[kHeaders])) {
            this[kHeaders][":authority"] = host;
          }
        } else {
          this[kOrigin] = `https://${host}:${port}`;
          if (!(":authority" in this[kHeaders])) {
            this[kHeaders][":authority"] = `${host}:${port}`;
          }
        }
        if (timeout) {
          this.setTimeout(timeout);
        }
        if (callback) {
          this.once("response", callback);
        }
        this[kFlushedHeaders] = false;
      }
      get method() {
        return this[kHeaders][HTTP2_HEADER_METHOD];
      }
      set method(value) {
        if (value) {
          this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
        }
      }
      get path() {
        return this[kHeaders][HTTP2_HEADER_PATH];
      }
      set path(value) {
        if (value) {
          this[kHeaders][HTTP2_HEADER_PATH] = value;
        }
      }
      get _mustNotHaveABody() {
        return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
      }
      _write(chunk, encoding, callback) {
        if (this._mustNotHaveABody) {
          callback(new Error("The GET, HEAD and DELETE methods must NOT have a body"));
          return;
        }
        this.flushHeaders();
        const callWrite = () => this._request.write(chunk, encoding, callback);
        if (this._request) {
          callWrite();
        } else {
          this[kJobs].push(callWrite);
        }
      }
      _final(callback) {
        if (this.destroyed) {
          return;
        }
        this.flushHeaders();
        const callEnd = () => {
          if (this._mustNotHaveABody) {
            callback();
            return;
          }
          this._request.end(callback);
        };
        if (this._request) {
          callEnd();
        } else {
          this[kJobs].push(callEnd);
        }
      }
      abort() {
        if (this.res && this.res.complete) {
          return;
        }
        if (!this.aborted) {
          process.nextTick(() => this.emit("abort"));
        }
        this.aborted = true;
        this.destroy();
      }
      _destroy(error, callback) {
        if (this.res) {
          this.res._dump();
        }
        if (this._request) {
          this._request.destroy();
        }
        callback(error);
      }
      async flushHeaders() {
        if (this[kFlushedHeaders] || this.destroyed) {
          return;
        }
        this[kFlushedHeaders] = true;
        const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;
        const onStream = (stream) => {
          this._request = stream;
          if (this.destroyed) {
            stream.destroy();
            return;
          }
          if (!isConnectMethod) {
            proxyEvents(stream, this, ["timeout", "continue", "close", "error"]);
          }
          const waitForEnd = (fn) => {
            return (...args) => {
              if (!this.writable && !this.destroyed) {
                fn(...args);
              } else {
                this.once("finish", () => {
                  fn(...args);
                });
              }
            };
          };
          stream.once("response", waitForEnd((headers, flags, rawHeaders) => {
            const response = new IncomingMessage(this.socket, stream.readableHighWaterMark);
            this.res = response;
            response.req = this;
            response.statusCode = headers[HTTP2_HEADER_STATUS];
            response.headers = headers;
            response.rawHeaders = rawHeaders;
            response.once("end", () => {
              if (this.aborted) {
                response.aborted = true;
                response.emit("aborted");
              } else {
                response.complete = true;
                response.socket = null;
                response.connection = null;
              }
            });
            if (isConnectMethod) {
              response.upgrade = true;
              if (this.emit("connect", response, stream, Buffer.alloc(0))) {
                this.emit("close");
              } else {
                stream.destroy();
              }
            } else {
              stream.on("data", (chunk) => {
                if (!response._dumped && !response.push(chunk)) {
                  stream.pause();
                }
              });
              stream.once("end", () => {
                response.push(null);
              });
              if (!this.emit("response", response)) {
                response._dump();
              }
            }
          }));
          stream.once("headers", waitForEnd((headers) => this.emit("information", {statusCode: headers[HTTP2_HEADER_STATUS]})));
          stream.once("trailers", waitForEnd((trailers, flags, rawTrailers) => {
            const {res} = this;
            res.trailers = trailers;
            res.rawTrailers = rawTrailers;
          }));
          const {socket} = stream.session;
          this.socket = socket;
          this.connection = socket;
          for (const job of this[kJobs]) {
            job();
          }
          this.emit("socket", this.socket);
        };
        if (this[kSession]) {
          try {
            onStream(this[kSession].request(this[kHeaders]));
          } catch (error) {
            this.emit("error", error);
          }
        } else {
          this.reusedSocket = true;
          try {
            onStream(await this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]));
          } catch (error) {
            this.emit("error", error);
          }
        }
      }
      getHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        return this[kHeaders][name.toLowerCase()];
      }
      get headersSent() {
        return this[kFlushedHeaders];
      }
      removeHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        if (this.headersSent) {
          throw new ERR_HTTP_HEADERS_SENT("remove");
        }
        delete this[kHeaders][name.toLowerCase()];
      }
      setHeader(name, value) {
        if (this.headersSent) {
          throw new ERR_HTTP_HEADERS_SENT("set");
        }
        if (typeof name !== "string" || !isValidHttpToken.test(name) && !isRequestPseudoHeader(name)) {
          throw new ERR_INVALID_HTTP_TOKEN("Header name", name);
        }
        if (typeof value === "undefined") {
          throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
        }
        if (isInvalidHeaderValue.test(value)) {
          throw new ERR_INVALID_CHAR("header content", name);
        }
        this[kHeaders][name.toLowerCase()] = value;
      }
      setNoDelay() {
      }
      setSocketKeepAlive() {
      }
      setTimeout(ms, callback) {
        const applyTimeout = () => this._request.setTimeout(ms, callback);
        if (this._request) {
          applyTimeout();
        } else {
          this[kJobs].push(applyTimeout);
        }
        return this;
      }
      get maxHeadersCount() {
        if (!this.destroyed && this._request) {
          return this._request.session.localSettings.maxHeaderListSize;
        }
        return void 0;
      }
      set maxHeadersCount(_value) {
      }
    };
    module2.exports = ClientRequest;
  }
});

// node_modules/.pnpm/resolve-alpn@1.1.2/node_modules/resolve-alpn/index.js
var require_resolve_alpn = __commonJS({
  "node_modules/.pnpm/resolve-alpn@1.1.2/node_modules/resolve-alpn/index.js"(exports2, module2) {
    "use strict";
    var tls = require("tls");
    module2.exports = (options = {}) => new Promise((resolve, reject) => {
      let timeout = false;
      const callback = async () => {
        socket.off("timeout", onTimeout);
        socket.off("error", reject);
        if (options.resolveSocket) {
          resolve({alpnProtocol: socket.alpnProtocol, socket, timeout});
          if (timeout) {
            await Promise.resolve();
            socket.emit("timeout");
          }
        } else {
          socket.destroy();
          resolve({alpnProtocol: socket.alpnProtocol, timeout});
        }
      };
      const onTimeout = async () => {
        timeout = true;
        callback();
      };
      const socket = tls.connect(options, callback);
      socket.on("error", reject);
      socket.once("timeout", onTimeout);
    });
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/calculate-server-name.js
var require_calculate_server_name = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/utils/calculate-server-name.js"(exports2, module2) {
    "use strict";
    var net = require("net");
    module2.exports = (options) => {
      let servername = options.host;
      const hostHeader = options.headers && options.headers.host;
      if (hostHeader) {
        if (hostHeader.startsWith("[")) {
          const index = hostHeader.indexOf("]");
          if (index === -1) {
            servername = hostHeader;
          } else {
            servername = hostHeader.slice(1, -1);
          }
        } else {
          servername = hostHeader.split(":", 1)[0];
        }
      }
      if (net.isIP(servername)) {
        return "";
      }
      return servername;
    };
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/auto.js
var require_auto = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/auto.js"(exports2, module2) {
    "use strict";
    var http = require("http");
    var https = require("https");
    var resolveALPN = require_resolve_alpn();
    var QuickLRU = require_quick_lru();
    var Http2ClientRequest = require_client_request();
    var calculateServerName = require_calculate_server_name();
    var urlToOptions = require_url_to_options();
    var cache = new QuickLRU({maxSize: 100});
    var queue = new Map();
    var installSocket = (agent, socket, options) => {
      socket._httpMessage = {shouldKeepAlive: true};
      const onFree = () => {
        agent.emit("free", socket, options);
      };
      socket.on("free", onFree);
      const onClose = () => {
        agent.removeSocket(socket, options);
      };
      socket.on("close", onClose);
      const onRemove = () => {
        agent.removeSocket(socket, options);
        socket.off("close", onClose);
        socket.off("free", onFree);
        socket.off("agentRemove", onRemove);
      };
      socket.on("agentRemove", onRemove);
      agent.emit("free", socket, options);
    };
    var resolveProtocol = async (options) => {
      const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;
      if (!cache.has(name)) {
        if (queue.has(name)) {
          const result = await queue.get(name);
          return result.alpnProtocol;
        }
        const {path, agent} = options;
        options.path = options.socketPath;
        const resultPromise = resolveALPN(options);
        queue.set(name, resultPromise);
        try {
          const {socket, alpnProtocol} = await resultPromise;
          cache.set(name, alpnProtocol);
          options.path = path;
          if (alpnProtocol === "h2") {
            socket.destroy();
          } else {
            const {globalAgent} = https;
            const defaultCreateConnection = https.Agent.prototype.createConnection;
            if (agent) {
              if (agent.createConnection === defaultCreateConnection) {
                installSocket(agent, socket, options);
              } else {
                socket.destroy();
              }
            } else if (globalAgent.createConnection === defaultCreateConnection) {
              installSocket(globalAgent, socket, options);
            } else {
              socket.destroy();
            }
          }
          queue.delete(name);
          return alpnProtocol;
        } catch (error) {
          queue.delete(name);
          throw error;
        }
      }
      return cache.get(name);
    };
    module2.exports = async (input, options, callback) => {
      if (typeof input === "string" || input instanceof URL) {
        input = urlToOptions(new URL(input));
      }
      if (typeof options === "function") {
        callback = options;
        options = void 0;
      }
      options = __objSpread(__objSpread(__objSpread({
        ALPNProtocols: ["h2", "http/1.1"]
      }, input), options), {
        resolveSocket: true
      });
      if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) {
        throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
      }
      options.protocol = options.protocol || "https:";
      const isHttps = options.protocol === "https:";
      options.host = options.hostname || options.host || "localhost";
      options.session = options.tlsSession;
      options.servername = options.servername || calculateServerName(options);
      options.port = options.port || (isHttps ? 443 : 80);
      options._defaultAgent = isHttps ? https.globalAgent : http.globalAgent;
      const agents = options.agent;
      if (agents) {
        if (agents.addRequest) {
          throw new Error("The `options.agent` object can contain only `http`, `https` or `http2` properties");
        }
        options.agent = agents[isHttps ? "https" : "http"];
      }
      if (isHttps) {
        const protocol = await resolveProtocol(options);
        if (protocol === "h2") {
          if (agents) {
            options.agent = agents.http2;
          }
          return new Http2ClientRequest(options, callback);
        }
      }
      return http.request(options, callback);
    };
    module2.exports.protocolCache = cache;
  }
});

// node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/index.js
var require_source4 = __commonJS({
  "node_modules/.pnpm/http2-wrapper@1.0.3/node_modules/http2-wrapper/source/index.js"(exports2, module2) {
    "use strict";
    var http2 = require("http2");
    var agent = require_agent();
    var ClientRequest = require_client_request();
    var IncomingMessage = require_incoming_message();
    var auto = require_auto();
    var request = (url, options, callback) => {
      return new ClientRequest(url, options, callback);
    };
    var get = (url, options, callback) => {
      const req = new ClientRequest(url, options, callback);
      req.end();
      return req;
    };
    module2.exports = __objSpread(__objSpread(__objSpread(__objSpread({}, http2), {
      ClientRequest,
      IncomingMessage
    }), agent), {
      request,
      get,
      auto
    });
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/is-form-data.js
var require_is_form_data = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/is-form-data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var is_1 = require_dist3();
    exports2.default = (body) => is_1.default.nodeStream(body) && is_1.default.function_(body.getBoundary);
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/get-body-size.js
var require_get_body_size = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/get-body-size.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var fs_1 = require("fs");
    var util_1 = require("util");
    var is_1 = require_dist3();
    var is_form_data_1 = require_is_form_data();
    var statAsync = util_1.promisify(fs_1.stat);
    exports2.default = async (body, headers) => {
      if (headers && "content-length" in headers) {
        return Number(headers["content-length"]);
      }
      if (!body) {
        return 0;
      }
      if (is_1.default.string(body)) {
        return Buffer.byteLength(body);
      }
      if (is_1.default.buffer(body)) {
        return body.length;
      }
      if (is_form_data_1.default(body)) {
        return util_1.promisify(body.getLength.bind(body))();
      }
      if (body instanceof fs_1.ReadStream) {
        const {size} = await statAsync(body.path);
        if (size === 0) {
          return void 0;
        }
        return size;
      }
      return void 0;
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/proxy-events.js
var require_proxy_events2 = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/proxy-events.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    function default_1(from, to, events) {
      const fns = {};
      for (const event of events) {
        fns[event] = (...args) => {
          to.emit(event, ...args);
        };
        from.on(event, fns[event]);
      }
      return () => {
        for (const event of events) {
          from.off(event, fns[event]);
        }
      };
    }
    exports2.default = default_1;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/unhandle.js
var require_unhandle = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/unhandle.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.default = () => {
      const handlers = [];
      return {
        once(origin, event, fn) {
          origin.once(event, fn);
          handlers.push({origin, event, fn});
        },
        unhandleAll() {
          for (const handler of handlers) {
            const {origin, event, fn} = handler;
            origin.removeListener(event, fn);
          }
          handlers.length = 0;
        }
      };
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/timed-out.js
var require_timed_out = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/timed-out.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.TimeoutError = void 0;
    var net = require("net");
    var unhandle_1 = require_unhandle();
    var reentry = Symbol("reentry");
    var noop = () => {
    };
    var TimeoutError = class extends Error {
      constructor(threshold, event) {
        super(`Timeout awaiting '${event}' for ${threshold}ms`);
        this.event = event;
        this.name = "TimeoutError";
        this.code = "ETIMEDOUT";
      }
    };
    exports2.TimeoutError = TimeoutError;
    exports2.default = (request, delays, options) => {
      if (reentry in request) {
        return noop;
      }
      request[reentry] = true;
      const cancelers = [];
      const {once, unhandleAll} = unhandle_1.default();
      const addTimeout = (delay, callback, event) => {
        var _a;
        const timeout = setTimeout(callback, delay, delay, event);
        (_a = timeout.unref) === null || _a === void 0 ? void 0 : _a.call(timeout);
        const cancel = () => {
          clearTimeout(timeout);
        };
        cancelers.push(cancel);
        return cancel;
      };
      const {host, hostname} = options;
      const timeoutHandler = (delay, event) => {
        request.destroy(new TimeoutError(delay, event));
      };
      const cancelTimeouts = () => {
        for (const cancel of cancelers) {
          cancel();
        }
        unhandleAll();
      };
      request.once("error", (error) => {
        cancelTimeouts();
        if (request.listenerCount("error") === 0) {
          throw error;
        }
      });
      request.once("close", cancelTimeouts);
      once(request, "response", (response) => {
        once(response, "end", cancelTimeouts);
      });
      if (typeof delays.request !== "undefined") {
        addTimeout(delays.request, timeoutHandler, "request");
      }
      if (typeof delays.socket !== "undefined") {
        const socketTimeoutHandler = () => {
          timeoutHandler(delays.socket, "socket");
        };
        request.setTimeout(delays.socket, socketTimeoutHandler);
        cancelers.push(() => {
          request.removeListener("timeout", socketTimeoutHandler);
        });
      }
      once(request, "socket", (socket) => {
        var _a;
        const {socketPath} = request;
        if (socket.connecting) {
          const hasPath = Boolean(socketPath !== null && socketPath !== void 0 ? socketPath : net.isIP((_a = hostname !== null && hostname !== void 0 ? hostname : host) !== null && _a !== void 0 ? _a : "") !== 0);
          if (typeof delays.lookup !== "undefined" && !hasPath && typeof socket.address().address === "undefined") {
            const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, "lookup");
            once(socket, "lookup", cancelTimeout);
          }
          if (typeof delays.connect !== "undefined") {
            const timeConnect = () => addTimeout(delays.connect, timeoutHandler, "connect");
            if (hasPath) {
              once(socket, "connect", timeConnect());
            } else {
              once(socket, "lookup", (error) => {
                if (error === null) {
                  once(socket, "connect", timeConnect());
                }
              });
            }
          }
          if (typeof delays.secureConnect !== "undefined" && options.protocol === "https:") {
            once(socket, "connect", () => {
              const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, "secureConnect");
              once(socket, "secureConnect", cancelTimeout);
            });
          }
        }
        if (typeof delays.send !== "undefined") {
          const timeRequest = () => addTimeout(delays.send, timeoutHandler, "send");
          if (socket.connecting) {
            once(socket, "connect", () => {
              once(request, "upload-complete", timeRequest());
            });
          } else {
            once(request, "upload-complete", timeRequest());
          }
        }
      });
      if (typeof delays.response !== "undefined") {
        once(request, "upload-complete", () => {
          const cancelTimeout = addTimeout(delays.response, timeoutHandler, "response");
          once(request, "response", cancelTimeout);
        });
      }
      return cancelTimeouts;
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/url-to-options.js
var require_url_to_options2 = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/url-to-options.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var is_1 = require_dist3();
    exports2.default = (url) => {
      url = url;
      const options = {
        protocol: url.protocol,
        hostname: is_1.default.string(url.hostname) && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
        host: url.host,
        hash: url.hash,
        search: url.search,
        pathname: url.pathname,
        href: url.href,
        path: `${url.pathname || ""}${url.search || ""}`
      };
      if (is_1.default.string(url.port) && url.port.length > 0) {
        options.port = Number(url.port);
      }
      if (url.username || url.password) {
        options.auth = `${url.username || ""}:${url.password || ""}`;
      }
      return options;
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/options-to-url.js
var require_options_to_url = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/options-to-url.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var url_1 = require("url");
    var keys = [
      "protocol",
      "host",
      "hostname",
      "port",
      "pathname",
      "search"
    ];
    exports2.default = (origin, options) => {
      var _a, _b;
      if (options.path) {
        if (options.pathname) {
          throw new TypeError("Parameters `path` and `pathname` are mutually exclusive.");
        }
        if (options.search) {
          throw new TypeError("Parameters `path` and `search` are mutually exclusive.");
        }
        if (options.searchParams) {
          throw new TypeError("Parameters `path` and `searchParams` are mutually exclusive.");
        }
      }
      if (options.search && options.searchParams) {
        throw new TypeError("Parameters `search` and `searchParams` are mutually exclusive.");
      }
      if (!origin) {
        if (!options.protocol) {
          throw new TypeError("No URL protocol specified");
        }
        origin = `${options.protocol}//${(_b = (_a = options.hostname) !== null && _a !== void 0 ? _a : options.host) !== null && _b !== void 0 ? _b : ""}`;
      }
      const url = new url_1.URL(origin);
      if (options.path) {
        const searchIndex = options.path.indexOf("?");
        if (searchIndex === -1) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.slice(0, searchIndex);
          options.search = options.path.slice(searchIndex + 1);
        }
        delete options.path;
      }
      for (const key of keys) {
        if (options[key]) {
          url[key] = options[key].toString();
        }
      }
      return url;
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/weakable-map.js
var require_weakable_map = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/weakable-map.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var WeakableMap = class {
      constructor() {
        this.weakMap = new WeakMap();
        this.map = new Map();
      }
      set(key, value) {
        if (typeof key === "object") {
          this.weakMap.set(key, value);
        } else {
          this.map.set(key, value);
        }
      }
      get(key) {
        if (typeof key === "object") {
          return this.weakMap.get(key);
        }
        return this.map.get(key);
      }
      has(key) {
        if (typeof key === "object") {
          return this.weakMap.has(key);
        }
        return this.map.has(key);
      }
    };
    exports2.default = WeakableMap;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/get-buffer.js
var require_get_buffer = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/get-buffer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var getBuffer = async (stream) => {
      const chunks = [];
      let length = 0;
      for await (const chunk of stream) {
        chunks.push(chunk);
        length += Buffer.byteLength(chunk);
      }
      if (Buffer.isBuffer(chunks[0])) {
        return Buffer.concat(chunks, length);
      }
      return Buffer.from(chunks.join(""));
    };
    exports2.default = getBuffer;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/dns-ip-version.js
var require_dns_ip_version = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/dns-ip-version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.dnsLookupIpVersionToFamily = exports2.isDnsLookupIpVersion = void 0;
    var conversionTable = {
      auto: 0,
      ipv4: 4,
      ipv6: 6
    };
    exports2.isDnsLookupIpVersion = (value) => {
      return value in conversionTable;
    };
    exports2.dnsLookupIpVersionToFamily = (dnsLookupIpVersion) => {
      if (exports2.isDnsLookupIpVersion(dnsLookupIpVersion)) {
        return conversionTable[dnsLookupIpVersion];
      }
      throw new Error("Invalid DNS lookup IP version");
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/is-response-ok.js
var require_is_response_ok = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/utils/is-response-ok.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.isResponseOk = void 0;
    exports2.isResponseOk = (response) => {
      const {statusCode} = response;
      const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
      return statusCode >= 200 && statusCode <= limitStatusCode || statusCode === 304;
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/utils/deprecation-warning.js
var require_deprecation_warning = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/utils/deprecation-warning.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var alreadyWarned = new Set();
    exports2.default = (message) => {
      if (alreadyWarned.has(message)) {
        return;
      }
      alreadyWarned.add(message);
      process.emitWarning(`Got: ${message}`, {
        type: "DeprecationWarning"
      });
    };
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/normalize-arguments.js
var require_normalize_arguments = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/normalize-arguments.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var is_1 = require_dist3();
    var normalizeArguments = (options, defaults) => {
      if (is_1.default.null_(options.encoding)) {
        throw new TypeError("To get a Buffer, set `options.responseType` to `buffer` instead");
      }
      is_1.assert.any([is_1.default.string, is_1.default.undefined], options.encoding);
      is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.resolveBodyOnly);
      is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.methodRewriting);
      is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.isStream);
      is_1.assert.any([is_1.default.string, is_1.default.undefined], options.responseType);
      if (options.responseType === void 0) {
        options.responseType = "text";
      }
      const {retry} = options;
      if (defaults) {
        options.retry = __objSpread({}, defaults.retry);
      } else {
        options.retry = {
          calculateDelay: (retryObject) => retryObject.computedValue,
          limit: 0,
          methods: [],
          statusCodes: [],
          errorCodes: [],
          maxRetryAfter: void 0
        };
      }
      if (is_1.default.object(retry)) {
        options.retry = __objSpread(__objSpread({}, options.retry), retry);
        options.retry.methods = [...new Set(options.retry.methods.map((method) => method.toUpperCase()))];
        options.retry.statusCodes = [...new Set(options.retry.statusCodes)];
        options.retry.errorCodes = [...new Set(options.retry.errorCodes)];
      } else if (is_1.default.number(retry)) {
        options.retry.limit = retry;
      }
      if (is_1.default.undefined(options.retry.maxRetryAfter)) {
        options.retry.maxRetryAfter = Math.min(...[options.timeout.request, options.timeout.connect].filter(is_1.default.number));
      }
      if (is_1.default.object(options.pagination)) {
        if (defaults) {
          options.pagination = __objSpread(__objSpread({}, defaults.pagination), options.pagination);
        }
        const {pagination} = options;
        if (!is_1.default.function_(pagination.transform)) {
          throw new Error("`options.pagination.transform` must be implemented");
        }
        if (!is_1.default.function_(pagination.shouldContinue)) {
          throw new Error("`options.pagination.shouldContinue` must be implemented");
        }
        if (!is_1.default.function_(pagination.filter)) {
          throw new TypeError("`options.pagination.filter` must be implemented");
        }
        if (!is_1.default.function_(pagination.paginate)) {
          throw new Error("`options.pagination.paginate` must be implemented");
        }
      }
      if (options.responseType === "json" && options.headers.accept === void 0) {
        options.headers.accept = "application/json";
      }
      return options;
    };
    exports2.default = normalizeArguments;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/calculate-retry-delay.js
var require_calculate_retry_delay = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/calculate-retry-delay.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.retryAfterStatusCodes = void 0;
    exports2.retryAfterStatusCodes = new Set([413, 429, 503]);
    var calculateRetryDelay = ({attemptCount, retryOptions, error, retryAfter}) => {
      if (attemptCount > retryOptions.limit) {
        return 0;
      }
      const hasMethod = retryOptions.methods.includes(error.options.method);
      const hasErrorCode = retryOptions.errorCodes.includes(error.code);
      const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
      if (!hasMethod || !hasErrorCode && !hasStatusCode) {
        return 0;
      }
      if (error.response) {
        if (retryAfter) {
          if (retryOptions.maxRetryAfter === void 0 || retryAfter > retryOptions.maxRetryAfter) {
            return 0;
          }
          return retryAfter;
        }
        if (error.response.statusCode === 413) {
          return 0;
        }
      }
      const noise = Math.random() * 100;
      return 2 ** (attemptCount - 1) * 1e3 + noise;
    };
    exports2.default = calculateRetryDelay;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/index.js
var require_core = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/core/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.UnsupportedProtocolError = exports2.ReadError = exports2.TimeoutError = exports2.UploadError = exports2.CacheError = exports2.HTTPError = exports2.MaxRedirectsError = exports2.RequestError = exports2.setNonEnumerableProperties = exports2.knownHookEvents = exports2.withoutBody = exports2.kIsNormalizedAlready = void 0;
    var util_1 = require("util");
    var stream_1 = require("stream");
    var fs_1 = require("fs");
    var url_1 = require("url");
    var http = require("http");
    var http_1 = require("http");
    var https = require("https");
    var http_timer_1 = require_source2();
    var cacheable_lookup_1 = require_source3();
    var CacheableRequest = require_src4();
    var decompressResponse = require_decompress_response();
    var http2wrapper = require_source4();
    var lowercaseKeys = require_lowercase_keys();
    var is_1 = require_dist3();
    var get_body_size_1 = require_get_body_size();
    var is_form_data_1 = require_is_form_data();
    var proxy_events_1 = require_proxy_events2();
    var timed_out_1 = require_timed_out();
    var url_to_options_1 = require_url_to_options2();
    var options_to_url_1 = require_options_to_url();
    var weakable_map_1 = require_weakable_map();
    var get_buffer_1 = require_get_buffer();
    var dns_ip_version_1 = require_dns_ip_version();
    var is_response_ok_1 = require_is_response_ok();
    var deprecation_warning_1 = require_deprecation_warning();
    var normalize_arguments_1 = require_normalize_arguments();
    var calculate_retry_delay_1 = require_calculate_retry_delay();
    var globalDnsCache;
    var kRequest = Symbol("request");
    var kResponse = Symbol("response");
    var kResponseSize = Symbol("responseSize");
    var kDownloadedSize = Symbol("downloadedSize");
    var kBodySize = Symbol("bodySize");
    var kUploadedSize = Symbol("uploadedSize");
    var kServerResponsesPiped = Symbol("serverResponsesPiped");
    var kUnproxyEvents = Symbol("unproxyEvents");
    var kIsFromCache = Symbol("isFromCache");
    var kCancelTimeouts = Symbol("cancelTimeouts");
    var kStartedReading = Symbol("startedReading");
    var kStopReading = Symbol("stopReading");
    var kTriggerRead = Symbol("triggerRead");
    var kBody = Symbol("body");
    var kJobs = Symbol("jobs");
    var kOriginalResponse = Symbol("originalResponse");
    var kRetryTimeout = Symbol("retryTimeout");
    exports2.kIsNormalizedAlready = Symbol("isNormalizedAlready");
    var supportsBrotli = is_1.default.string(process.versions.brotli);
    exports2.withoutBody = new Set(["GET", "HEAD"]);
    exports2.knownHookEvents = [
      "init",
      "beforeRequest",
      "beforeRedirect",
      "beforeError",
      "beforeRetry",
      "afterResponse"
    ];
    function validateSearchParameters(searchParameters) {
      for (const key in searchParameters) {
        const value = searchParameters[key];
        if (!is_1.default.string(value) && !is_1.default.number(value) && !is_1.default.boolean(value) && !is_1.default.null_(value) && !is_1.default.undefined(value)) {
          throw new TypeError(`The \`searchParams\` value '${String(value)}' must be a string, number, boolean or null`);
        }
      }
    }
    function isClientRequest(clientRequest) {
      return is_1.default.object(clientRequest) && !("statusCode" in clientRequest);
    }
    var cacheableStore = new weakable_map_1.default();
    var waitForOpenFile = async (file) => new Promise((resolve, reject) => {
      const onError = (error) => {
        reject(error);
      };
      if (!file.pending) {
        resolve();
      }
      file.once("error", onError);
      file.once("ready", () => {
        file.off("error", onError);
        resolve();
      });
    });
    var redirectCodes = new Set([300, 301, 302, 303, 304, 307, 308]);
    var nonEnumerableProperties = [
      "context",
      "body",
      "json",
      "form"
    ];
    exports2.setNonEnumerableProperties = (sources, to) => {
      const properties = {};
      for (const source of sources) {
        if (!source) {
          continue;
        }
        for (const name of nonEnumerableProperties) {
          if (!(name in source)) {
            continue;
          }
          properties[name] = {
            writable: true,
            configurable: true,
            enumerable: false,
            value: source[name]
          };
        }
      }
      Object.defineProperties(to, properties);
    };
    var RequestError = class extends Error {
      constructor(message, error, self) {
        var _a;
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = "RequestError";
        this.code = error.code;
        if (self instanceof Request) {
          Object.defineProperty(this, "request", {
            enumerable: false,
            value: self
          });
          Object.defineProperty(this, "response", {
            enumerable: false,
            value: self[kResponse]
          });
          Object.defineProperty(this, "options", {
            enumerable: false,
            value: self.options
          });
        } else {
          Object.defineProperty(this, "options", {
            enumerable: false,
            value: self
          });
        }
        this.timings = (_a = this.request) === null || _a === void 0 ? void 0 : _a.timings;
        if (is_1.default.string(error.stack) && is_1.default.string(this.stack)) {
          const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
          const thisStackTrace = this.stack.slice(indexOfMessage).split("\n").reverse();
          const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split("\n").reverse();
          while (errorStackTrace.length !== 0 && errorStackTrace[0] === thisStackTrace[0]) {
            thisStackTrace.shift();
          }
          this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join("\n")}${errorStackTrace.reverse().join("\n")}`;
        }
      }
    };
    exports2.RequestError = RequestError;
    var MaxRedirectsError = class extends RequestError {
      constructor(request) {
        super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
        this.name = "MaxRedirectsError";
      }
    };
    exports2.MaxRedirectsError = MaxRedirectsError;
    var HTTPError = class extends RequestError {
      constructor(response) {
        super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
        this.name = "HTTPError";
      }
    };
    exports2.HTTPError = HTTPError;
    var CacheError = class extends RequestError {
      constructor(error, request) {
        super(error.message, error, request);
        this.name = "CacheError";
      }
    };
    exports2.CacheError = CacheError;
    var UploadError = class extends RequestError {
      constructor(error, request) {
        super(error.message, error, request);
        this.name = "UploadError";
      }
    };
    exports2.UploadError = UploadError;
    var TimeoutError = class extends RequestError {
      constructor(error, timings, request) {
        super(error.message, error, request);
        this.name = "TimeoutError";
        this.event = error.event;
        this.timings = timings;
      }
    };
    exports2.TimeoutError = TimeoutError;
    var ReadError = class extends RequestError {
      constructor(error, request) {
        super(error.message, error, request);
        this.name = "ReadError";
      }
    };
    exports2.ReadError = ReadError;
    var UnsupportedProtocolError = class extends RequestError {
      constructor(options) {
        super(`Unsupported protocol "${options.url.protocol}"`, {}, options);
        this.name = "UnsupportedProtocolError";
      }
    };
    exports2.UnsupportedProtocolError = UnsupportedProtocolError;
    var proxiedRequestEvents = [
      "socket",
      "connect",
      "continue",
      "information",
      "upgrade",
      "timeout"
    ];
    var Request = class extends stream_1.Duplex {
      constructor(url, options = {}, defaults) {
        super({
          autoDestroy: false,
          highWaterMark: 0
        });
        this[kDownloadedSize] = 0;
        this[kUploadedSize] = 0;
        this.requestInitialized = false;
        this[kServerResponsesPiped] = new Set();
        this.redirects = [];
        this[kStopReading] = false;
        this[kTriggerRead] = false;
        this[kJobs] = [];
        this.retryCount = 0;
        this._progressCallbacks = [];
        const unlockWrite = () => this._unlockWrite();
        const lockWrite = () => this._lockWrite();
        this.on("pipe", (source) => {
          source.prependListener("data", unlockWrite);
          source.on("data", lockWrite);
          source.prependListener("end", unlockWrite);
          source.on("end", lockWrite);
        });
        this.on("unpipe", (source) => {
          source.off("data", unlockWrite);
          source.off("data", lockWrite);
          source.off("end", unlockWrite);
          source.off("end", lockWrite);
        });
        this.on("pipe", (source) => {
          if (source instanceof http_1.IncomingMessage) {
            this.options.headers = __objSpread(__objSpread({}, source.headers), this.options.headers);
          }
        });
        const {json, body, form} = options;
        if (json || body || form) {
          this._lockWrite();
        }
        if (exports2.kIsNormalizedAlready in options) {
          this.options = options;
        } else {
          try {
            this.options = this.constructor.normalizeArguments(url, options, defaults);
          } catch (error) {
            if (is_1.default.nodeStream(options.body)) {
              options.body.destroy();
            }
            this.destroy(error);
            return;
          }
        }
        (async () => {
          var _a;
          try {
            if (this.options.body instanceof fs_1.ReadStream) {
              await waitForOpenFile(this.options.body);
            }
            const {url: normalizedURL} = this.options;
            if (!normalizedURL) {
              throw new TypeError("Missing `url` property");
            }
            this.requestUrl = normalizedURL.toString();
            decodeURI(this.requestUrl);
            await this._finalizeBody();
            await this._makeRequest();
            if (this.destroyed) {
              (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroy();
              return;
            }
            for (const job of this[kJobs]) {
              job();
            }
            this[kJobs].length = 0;
            this.requestInitialized = true;
          } catch (error) {
            if (error instanceof RequestError) {
              this._beforeError(error);
              return;
            }
            if (!this.destroyed) {
              this.destroy(error);
            }
          }
        })();
      }
      static normalizeArguments(url, options, defaults) {
        var _a, _b, _c, _d, _e;
        const rawOptions = options;
        if (is_1.default.object(url) && !is_1.default.urlInstance(url)) {
          options = __objSpread(__objSpread(__objSpread({}, defaults), url), options);
        } else {
          if (url && options && options.url !== void 0) {
            throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
          }
          options = __objSpread(__objSpread({}, defaults), options);
          if (url !== void 0) {
            options.url = url;
          }
          if (is_1.default.urlInstance(options.url)) {
            options.url = new url_1.URL(options.url.toString());
          }
        }
        if (options.cache === false) {
          options.cache = void 0;
        }
        if (options.dnsCache === false) {
          options.dnsCache = void 0;
        }
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.method);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.headers);
        is_1.assert.any([is_1.default.string, is_1.default.urlInstance, is_1.default.undefined], options.prefixUrl);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cookieJar);
        is_1.assert.any([is_1.default.object, is_1.default.string, is_1.default.undefined], options.searchParams);
        is_1.assert.any([is_1.default.object, is_1.default.string, is_1.default.undefined], options.cache);
        is_1.assert.any([is_1.default.object, is_1.default.number, is_1.default.undefined], options.timeout);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.context);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.hooks);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.decompress);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.ignoreInvalidCookies);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.followRedirect);
        is_1.assert.any([is_1.default.number, is_1.default.undefined], options.maxRedirects);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.throwHttpErrors);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.http2);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.allowGetBody);
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.localAddress);
        is_1.assert.any([dns_ip_version_1.isDnsLookupIpVersion, is_1.default.undefined], options.dnsLookupIpVersion);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.https);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.rejectUnauthorized);
        if (options.https) {
          is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.https.rejectUnauthorized);
          is_1.assert.any([is_1.default.function_, is_1.default.undefined], options.https.checkServerIdentity);
          is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.certificateAuthority);
          is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.key);
          is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.certificate);
          is_1.assert.any([is_1.default.string, is_1.default.undefined], options.https.passphrase);
          is_1.assert.any([is_1.default.string, is_1.default.buffer, is_1.default.array, is_1.default.undefined], options.https.pfx);
        }
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cacheOptions);
        if (is_1.default.string(options.method)) {
          options.method = options.method.toUpperCase();
        } else {
          options.method = "GET";
        }
        if (options.headers === (defaults === null || defaults === void 0 ? void 0 : defaults.headers)) {
          options.headers = __objSpread({}, options.headers);
        } else {
          options.headers = lowercaseKeys(__objSpread(__objSpread({}, defaults === null || defaults === void 0 ? void 0 : defaults.headers), options.headers));
        }
        if ("slashes" in options) {
          throw new TypeError("The legacy `url.Url` has been deprecated. Use `URL` instead.");
        }
        if ("auth" in options) {
          throw new TypeError("Parameter `auth` is deprecated. Use `username` / `password` instead.");
        }
        if ("searchParams" in options) {
          if (options.searchParams && options.searchParams !== (defaults === null || defaults === void 0 ? void 0 : defaults.searchParams)) {
            let searchParameters;
            if (is_1.default.string(options.searchParams) || options.searchParams instanceof url_1.URLSearchParams) {
              searchParameters = new url_1.URLSearchParams(options.searchParams);
            } else {
              validateSearchParameters(options.searchParams);
              searchParameters = new url_1.URLSearchParams();
              for (const key in options.searchParams) {
                const value = options.searchParams[key];
                if (value === null) {
                  searchParameters.append(key, "");
                } else if (value !== void 0) {
                  searchParameters.append(key, value);
                }
              }
            }
            (_a = defaults === null || defaults === void 0 ? void 0 : defaults.searchParams) === null || _a === void 0 ? void 0 : _a.forEach((value, key) => {
              if (!searchParameters.has(key)) {
                searchParameters.append(key, value);
              }
            });
            options.searchParams = searchParameters;
          }
        }
        options.username = (_b = options.username) !== null && _b !== void 0 ? _b : "";
        options.password = (_c = options.password) !== null && _c !== void 0 ? _c : "";
        if (is_1.default.undefined(options.prefixUrl)) {
          options.prefixUrl = (_d = defaults === null || defaults === void 0 ? void 0 : defaults.prefixUrl) !== null && _d !== void 0 ? _d : "";
        } else {
          options.prefixUrl = options.prefixUrl.toString();
          if (options.prefixUrl !== "" && !options.prefixUrl.endsWith("/")) {
            options.prefixUrl += "/";
          }
        }
        if (is_1.default.string(options.url)) {
          if (options.url.startsWith("/")) {
            throw new Error("`input` must not start with a slash when using `prefixUrl`");
          }
          options.url = options_to_url_1.default(options.prefixUrl + options.url, options);
        } else if (is_1.default.undefined(options.url) && options.prefixUrl !== "" || options.protocol) {
          options.url = options_to_url_1.default(options.prefixUrl, options);
        }
        if (options.url) {
          if ("port" in options) {
            delete options.port;
          }
          let {prefixUrl} = options;
          Object.defineProperty(options, "prefixUrl", {
            set: (value) => {
              const url2 = options.url;
              if (!url2.href.startsWith(value)) {
                throw new Error(`Cannot change \`prefixUrl\` from ${prefixUrl} to ${value}: ${url2.href}`);
              }
              options.url = new url_1.URL(value + url2.href.slice(prefixUrl.length));
              prefixUrl = value;
            },
            get: () => prefixUrl
          });
          let {protocol} = options.url;
          if (protocol === "unix:") {
            protocol = "http:";
            options.url = new url_1.URL(`http://unix${options.url.pathname}${options.url.search}`);
          }
          if (options.searchParams) {
            options.url.search = options.searchParams.toString();
          }
          if (protocol !== "http:" && protocol !== "https:") {
            throw new UnsupportedProtocolError(options);
          }
          if (options.username === "") {
            options.username = options.url.username;
          } else {
            options.url.username = options.username;
          }
          if (options.password === "") {
            options.password = options.url.password;
          } else {
            options.url.password = options.password;
          }
        }
        const {cookieJar} = options;
        if (cookieJar) {
          let {setCookie, getCookieString} = cookieJar;
          is_1.assert.function_(setCookie);
          is_1.assert.function_(getCookieString);
          if (setCookie.length === 4 && getCookieString.length === 0) {
            setCookie = util_1.promisify(setCookie.bind(options.cookieJar));
            getCookieString = util_1.promisify(getCookieString.bind(options.cookieJar));
            options.cookieJar = {
              setCookie,
              getCookieString
            };
          }
        }
        const {cache} = options;
        if (cache) {
          if (!cacheableStore.has(cache)) {
            cacheableStore.set(cache, new CacheableRequest((requestOptions, handler) => {
              const result = requestOptions[kRequest](requestOptions, handler);
              if (is_1.default.promise(result)) {
                result.once = (event, handler2) => {
                  if (event === "error") {
                    result.catch(handler2);
                  } else if (event === "abort") {
                    (async () => {
                      try {
                        const request = await result;
                        request.once("abort", handler2);
                      } catch (_a2) {
                      }
                    })();
                  } else {
                    throw new Error(`Unknown HTTP2 promise event: ${event}`);
                  }
                  return result;
                };
              }
              return result;
            }, cache));
          }
        }
        options.cacheOptions = __objSpread({}, options.cacheOptions);
        if (options.dnsCache === true) {
          if (!globalDnsCache) {
            globalDnsCache = new cacheable_lookup_1.default();
          }
          options.dnsCache = globalDnsCache;
        } else if (!is_1.default.undefined(options.dnsCache) && !options.dnsCache.lookup) {
          throw new TypeError(`Parameter \`dnsCache\` must be a CacheableLookup instance or a boolean, got ${is_1.default(options.dnsCache)}`);
        }
        if (is_1.default.number(options.timeout)) {
          options.timeout = {request: options.timeout};
        } else if (defaults && options.timeout !== defaults.timeout) {
          options.timeout = __objSpread(__objSpread({}, defaults.timeout), options.timeout);
        } else {
          options.timeout = __objSpread({}, options.timeout);
        }
        if (!options.context) {
          options.context = {};
        }
        const areHooksDefault = options.hooks === (defaults === null || defaults === void 0 ? void 0 : defaults.hooks);
        options.hooks = __objSpread({}, options.hooks);
        for (const event of exports2.knownHookEvents) {
          if (event in options.hooks) {
            if (is_1.default.array(options.hooks[event])) {
              options.hooks[event] = [...options.hooks[event]];
            } else {
              throw new TypeError(`Parameter \`${event}\` must be an Array, got ${is_1.default(options.hooks[event])}`);
            }
          } else {
            options.hooks[event] = [];
          }
        }
        if (defaults && !areHooksDefault) {
          for (const event of exports2.knownHookEvents) {
            const defaultHooks = defaults.hooks[event];
            if (defaultHooks.length > 0) {
              options.hooks[event] = [
                ...defaults.hooks[event],
                ...options.hooks[event]
              ];
            }
          }
        }
        if ("family" in options) {
          deprecation_warning_1.default('"options.family" was never documented, please use "options.dnsLookupIpVersion"');
        }
        if (defaults === null || defaults === void 0 ? void 0 : defaults.https) {
          options.https = __objSpread(__objSpread({}, defaults.https), options.https);
        }
        if ("rejectUnauthorized" in options) {
          deprecation_warning_1.default('"options.rejectUnauthorized" is now deprecated, please use "options.https.rejectUnauthorized"');
        }
        if ("checkServerIdentity" in options) {
          deprecation_warning_1.default('"options.checkServerIdentity" was never documented, please use "options.https.checkServerIdentity"');
        }
        if ("ca" in options) {
          deprecation_warning_1.default('"options.ca" was never documented, please use "options.https.certificateAuthority"');
        }
        if ("key" in options) {
          deprecation_warning_1.default('"options.key" was never documented, please use "options.https.key"');
        }
        if ("cert" in options) {
          deprecation_warning_1.default('"options.cert" was never documented, please use "options.https.certificate"');
        }
        if ("passphrase" in options) {
          deprecation_warning_1.default('"options.passphrase" was never documented, please use "options.https.passphrase"');
        }
        if ("pfx" in options) {
          deprecation_warning_1.default('"options.pfx" was never documented, please use "options.https.pfx"');
        }
        if ("followRedirects" in options) {
          throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
        }
        if (options.agent) {
          for (const key in options.agent) {
            if (key !== "http" && key !== "https" && key !== "http2") {
              throw new TypeError(`Expected the \`options.agent\` properties to be \`http\`, \`https\` or \`http2\`, got \`${key}\``);
            }
          }
        }
        options.maxRedirects = (_e = options.maxRedirects) !== null && _e !== void 0 ? _e : 0;
        exports2.setNonEnumerableProperties([defaults, rawOptions], options);
        return normalize_arguments_1.default(options, defaults);
      }
      _lockWrite() {
        const onLockedWrite = () => {
          throw new TypeError("The payload has been already provided");
        };
        this.write = onLockedWrite;
        this.end = onLockedWrite;
      }
      _unlockWrite() {
        this.write = super.write;
        this.end = super.end;
      }
      async _finalizeBody() {
        const {options} = this;
        const {headers} = options;
        const isForm = !is_1.default.undefined(options.form);
        const isJSON = !is_1.default.undefined(options.json);
        const isBody = !is_1.default.undefined(options.body);
        const hasPayload = isForm || isJSON || isBody;
        const cannotHaveBody = exports2.withoutBody.has(options.method) && !(options.method === "GET" && options.allowGetBody);
        this._cannotHaveBody = cannotHaveBody;
        if (hasPayload) {
          if (cannotHaveBody) {
            throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
          }
          if ([isBody, isForm, isJSON].filter((isTrue) => isTrue).length > 1) {
            throw new TypeError("The `body`, `json` and `form` options are mutually exclusive");
          }
          if (isBody && !(options.body instanceof stream_1.Readable) && !is_1.default.string(options.body) && !is_1.default.buffer(options.body) && !is_form_data_1.default(options.body)) {
            throw new TypeError("The `body` option must be a stream.Readable, string or Buffer");
          }
          if (isForm && !is_1.default.object(options.form)) {
            throw new TypeError("The `form` option must be an Object");
          }
          {
            const noContentType = !is_1.default.string(headers["content-type"]);
            if (isBody) {
              if (is_form_data_1.default(options.body) && noContentType) {
                headers["content-type"] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
              }
              this[kBody] = options.body;
            } else if (isForm) {
              if (noContentType) {
                headers["content-type"] = "application/x-www-form-urlencoded";
              }
              this[kBody] = new url_1.URLSearchParams(options.form).toString();
            } else {
              if (noContentType) {
                headers["content-type"] = "application/json";
              }
              this[kBody] = options.stringifyJson(options.json);
            }
            const uploadBodySize = await get_body_size_1.default(this[kBody], options.headers);
            if (is_1.default.undefined(headers["content-length"]) && is_1.default.undefined(headers["transfer-encoding"])) {
              if (!cannotHaveBody && !is_1.default.undefined(uploadBodySize)) {
                headers["content-length"] = String(uploadBodySize);
              }
            }
          }
        } else if (cannotHaveBody) {
          this._lockWrite();
        } else {
          this._unlockWrite();
        }
        this[kBodySize] = Number(headers["content-length"]) || void 0;
      }
      async _onResponseBase(response) {
        const {options} = this;
        const {url} = options;
        this[kOriginalResponse] = response;
        if (options.decompress) {
          response = decompressResponse(response);
        }
        const statusCode = response.statusCode;
        const typedResponse = response;
        typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : http.STATUS_CODES[statusCode];
        typedResponse.url = options.url.toString();
        typedResponse.requestUrl = this.requestUrl;
        typedResponse.redirectUrls = this.redirects;
        typedResponse.request = this;
        typedResponse.isFromCache = response.fromCache || false;
        typedResponse.ip = this.ip;
        typedResponse.retryCount = this.retryCount;
        this[kIsFromCache] = typedResponse.isFromCache;
        this[kResponseSize] = Number(response.headers["content-length"]) || void 0;
        this[kResponse] = response;
        response.once("end", () => {
          this[kResponseSize] = this[kDownloadedSize];
          this.emit("downloadProgress", this.downloadProgress);
        });
        response.once("error", (error) => {
          response.destroy();
          this._beforeError(new ReadError(error, this));
        });
        response.once("aborted", () => {
          this._beforeError(new ReadError({
            name: "Error",
            message: "The server aborted pending request",
            code: "ECONNRESET"
          }, this));
        });
        this.emit("downloadProgress", this.downloadProgress);
        const rawCookies = response.headers["set-cookie"];
        if (is_1.default.object(options.cookieJar) && rawCookies) {
          let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
          if (options.ignoreInvalidCookies) {
            promises = promises.map(async (p) => p.catch(() => {
            }));
          }
          try {
            await Promise.all(promises);
          } catch (error) {
            this._beforeError(error);
            return;
          }
        }
        if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
          response.resume();
          if (this[kRequest]) {
            this[kCancelTimeouts]();
            delete this[kRequest];
            this[kUnproxyEvents]();
          }
          const shouldBeGet = statusCode === 303 && options.method !== "GET" && options.method !== "HEAD";
          if (shouldBeGet || !options.methodRewriting) {
            options.method = "GET";
            if ("body" in options) {
              delete options.body;
            }
            if ("json" in options) {
              delete options.json;
            }
            if ("form" in options) {
              delete options.form;
            }
            this[kBody] = void 0;
            delete options.headers["content-length"];
          }
          if (this.redirects.length >= options.maxRedirects) {
            this._beforeError(new MaxRedirectsError(this));
            return;
          }
          try {
            const redirectBuffer = Buffer.from(response.headers.location, "binary").toString();
            const redirectUrl = new url_1.URL(redirectBuffer, url);
            const redirectString = redirectUrl.toString();
            decodeURI(redirectString);
            if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
              if ("host" in options.headers) {
                delete options.headers.host;
              }
              if ("cookie" in options.headers) {
                delete options.headers.cookie;
              }
              if ("authorization" in options.headers) {
                delete options.headers.authorization;
              }
              if (options.username || options.password) {
                options.username = "";
                options.password = "";
              }
            } else {
              redirectUrl.username = options.username;
              redirectUrl.password = options.password;
            }
            this.redirects.push(redirectString);
            options.url = redirectUrl;
            for (const hook of options.hooks.beforeRedirect) {
              await hook(options, typedResponse);
            }
            this.emit("redirect", typedResponse, options);
            await this._makeRequest();
          } catch (error) {
            this._beforeError(error);
            return;
          }
          return;
        }
        if (options.isStream && options.throwHttpErrors && !is_response_ok_1.isResponseOk(typedResponse)) {
          this._beforeError(new HTTPError(typedResponse));
          return;
        }
        response.on("readable", () => {
          if (this[kTriggerRead]) {
            this._read();
          }
        });
        this.on("resume", () => {
          response.resume();
        });
        this.on("pause", () => {
          response.pause();
        });
        response.once("end", () => {
          this.push(null);
        });
        this.emit("response", response);
        for (const destination of this[kServerResponsesPiped]) {
          if (destination.headersSent) {
            continue;
          }
          for (const key in response.headers) {
            const isAllowed = options.decompress ? key !== "content-encoding" : true;
            const value = response.headers[key];
            if (isAllowed) {
              destination.setHeader(key, value);
            }
          }
          destination.statusCode = statusCode;
        }
      }
      async _onResponse(response) {
        try {
          await this._onResponseBase(response);
        } catch (error) {
          this._beforeError(error);
        }
      }
      _onRequest(request) {
        const {options} = this;
        const {timeout, url} = options;
        http_timer_1.default(request);
        this[kCancelTimeouts] = timed_out_1.default(request, timeout, url);
        const responseEventName = options.cache ? "cacheableResponse" : "response";
        request.once(responseEventName, (response) => {
          void this._onResponse(response);
        });
        request.once("error", (error) => {
          var _a;
          request.destroy();
          (_a = request.res) === null || _a === void 0 ? void 0 : _a.removeAllListeners("end");
          error = error instanceof timed_out_1.TimeoutError ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
          this._beforeError(error);
        });
        this[kUnproxyEvents] = proxy_events_1.default(request, this, proxiedRequestEvents);
        this[kRequest] = request;
        this.emit("uploadProgress", this.uploadProgress);
        const body = this[kBody];
        const currentRequest = this.redirects.length === 0 ? this : request;
        if (is_1.default.nodeStream(body)) {
          body.pipe(currentRequest);
          body.once("error", (error) => {
            this._beforeError(new UploadError(error, this));
          });
        } else {
          this._unlockWrite();
          if (!is_1.default.undefined(body)) {
            this._writeRequest(body, void 0, () => {
            });
            currentRequest.end();
            this._lockWrite();
          } else if (this._cannotHaveBody || this._noPipe) {
            currentRequest.end();
            this._lockWrite();
          }
        }
        this.emit("request", request);
      }
      async _createCacheableRequest(url, options) {
        return new Promise((resolve, reject) => {
          Object.assign(options, url_to_options_1.default(url));
          delete options.url;
          let request;
          const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
            response._readableState.autoDestroy = false;
            if (request) {
              (await request).emit("cacheableResponse", response);
            }
            resolve(response);
          });
          options.url = url;
          cacheRequest.once("error", reject);
          cacheRequest.once("request", async (requestOrPromise) => {
            request = requestOrPromise;
            resolve(request);
          });
        });
      }
      async _makeRequest() {
        var _a, _b, _c, _d, _e;
        const {options} = this;
        const {headers} = options;
        for (const key in headers) {
          if (is_1.default.undefined(headers[key])) {
            delete headers[key];
          } else if (is_1.default.null_(headers[key])) {
            throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
          }
        }
        if (options.decompress && is_1.default.undefined(headers["accept-encoding"])) {
          headers["accept-encoding"] = supportsBrotli ? "gzip, deflate, br" : "gzip, deflate";
        }
        if (options.cookieJar) {
          const cookieString = await options.cookieJar.getCookieString(options.url.toString());
          if (is_1.default.nonEmptyString(cookieString)) {
            options.headers.cookie = cookieString;
          }
        }
        for (const hook of options.hooks.beforeRequest) {
          const result = await hook(options);
          if (!is_1.default.undefined(result)) {
            options.request = () => result;
            break;
          }
        }
        if (options.body && this[kBody] !== options.body) {
          this[kBody] = options.body;
        }
        const {agent, request, timeout, url} = options;
        if (options.dnsCache && !("lookup" in options)) {
          options.lookup = options.dnsCache.lookup;
        }
        if (url.hostname === "unix") {
          const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
          if (matches === null || matches === void 0 ? void 0 : matches.groups) {
            const {socketPath, path} = matches.groups;
            Object.assign(options, {
              socketPath,
              path,
              host: ""
            });
          }
        }
        const isHttps = url.protocol === "https:";
        let fallbackFn;
        if (options.http2) {
          fallbackFn = http2wrapper.auto;
        } else {
          fallbackFn = isHttps ? https.request : http.request;
        }
        const realFn = (_a = options.request) !== null && _a !== void 0 ? _a : fallbackFn;
        const fn = options.cache ? this._createCacheableRequest : realFn;
        if (agent && !options.http2) {
          options.agent = agent[isHttps ? "https" : "http"];
        }
        options[kRequest] = realFn;
        delete options.request;
        delete options.timeout;
        const requestOptions = options;
        requestOptions.shared = (_b = options.cacheOptions) === null || _b === void 0 ? void 0 : _b.shared;
        requestOptions.cacheHeuristic = (_c = options.cacheOptions) === null || _c === void 0 ? void 0 : _c.cacheHeuristic;
        requestOptions.immutableMinTimeToLive = (_d = options.cacheOptions) === null || _d === void 0 ? void 0 : _d.immutableMinTimeToLive;
        requestOptions.ignoreCargoCult = (_e = options.cacheOptions) === null || _e === void 0 ? void 0 : _e.ignoreCargoCult;
        if (options.dnsLookupIpVersion !== void 0) {
          try {
            requestOptions.family = dns_ip_version_1.dnsLookupIpVersionToFamily(options.dnsLookupIpVersion);
          } catch (_f) {
            throw new Error("Invalid `dnsLookupIpVersion` option value");
          }
        }
        if (options.https) {
          if ("rejectUnauthorized" in options.https) {
            requestOptions.rejectUnauthorized = options.https.rejectUnauthorized;
          }
          if (options.https.checkServerIdentity) {
            requestOptions.checkServerIdentity = options.https.checkServerIdentity;
          }
          if (options.https.certificateAuthority) {
            requestOptions.ca = options.https.certificateAuthority;
          }
          if (options.https.certificate) {
            requestOptions.cert = options.https.certificate;
          }
          if (options.https.key) {
            requestOptions.key = options.https.key;
          }
          if (options.https.passphrase) {
            requestOptions.passphrase = options.https.passphrase;
          }
          if (options.https.pfx) {
            requestOptions.pfx = options.https.pfx;
          }
        }
        try {
          let requestOrResponse = await fn(url, requestOptions);
          if (is_1.default.undefined(requestOrResponse)) {
            requestOrResponse = fallbackFn(url, requestOptions);
          }
          options.request = request;
          options.timeout = timeout;
          options.agent = agent;
          if (options.https) {
            if ("rejectUnauthorized" in options.https) {
              delete requestOptions.rejectUnauthorized;
            }
            if (options.https.checkServerIdentity) {
              delete requestOptions.checkServerIdentity;
            }
            if (options.https.certificateAuthority) {
              delete requestOptions.ca;
            }
            if (options.https.certificate) {
              delete requestOptions.cert;
            }
            if (options.https.key) {
              delete requestOptions.key;
            }
            if (options.https.passphrase) {
              delete requestOptions.passphrase;
            }
            if (options.https.pfx) {
              delete requestOptions.pfx;
            }
          }
          if (isClientRequest(requestOrResponse)) {
            this._onRequest(requestOrResponse);
          } else if (this.writable) {
            this.once("finish", () => {
              void this._onResponse(requestOrResponse);
            });
            this._unlockWrite();
            this.end();
            this._lockWrite();
          } else {
            void this._onResponse(requestOrResponse);
          }
        } catch (error) {
          if (error instanceof CacheableRequest.CacheError) {
            throw new CacheError(error, this);
          }
          throw new RequestError(error.message, error, this);
        }
      }
      async _error(error) {
        try {
          for (const hook of this.options.hooks.beforeError) {
            error = await hook(error);
          }
        } catch (error_) {
          error = new RequestError(error_.message, error_, this);
        }
        this.destroy(error);
      }
      _beforeError(error) {
        if (this[kStopReading]) {
          return;
        }
        const {options} = this;
        const retryCount = this.retryCount + 1;
        this[kStopReading] = true;
        if (!(error instanceof RequestError)) {
          error = new RequestError(error.message, error, this);
        }
        const typedError = error;
        const {response} = typedError;
        void (async () => {
          if (response && !response.body) {
            response.setEncoding(this._readableState.encoding);
            try {
              response.rawBody = await get_buffer_1.default(response);
              response.body = response.rawBody.toString();
            } catch (_a) {
            }
          }
          if (this.listenerCount("retry") !== 0) {
            let backoff;
            try {
              let retryAfter;
              if (response && "retry-after" in response.headers) {
                retryAfter = Number(response.headers["retry-after"]);
                if (Number.isNaN(retryAfter)) {
                  retryAfter = Date.parse(response.headers["retry-after"]) - Date.now();
                  if (retryAfter <= 0) {
                    retryAfter = 1;
                  }
                } else {
                  retryAfter *= 1e3;
                }
              }
              backoff = await options.retry.calculateDelay({
                attemptCount: retryCount,
                retryOptions: options.retry,
                error: typedError,
                retryAfter,
                computedValue: calculate_retry_delay_1.default({
                  attemptCount: retryCount,
                  retryOptions: options.retry,
                  error: typedError,
                  retryAfter,
                  computedValue: 0
                })
              });
            } catch (error_) {
              void this._error(new RequestError(error_.message, error_, this));
              return;
            }
            if (backoff) {
              const retry = async () => {
                try {
                  for (const hook of this.options.hooks.beforeRetry) {
                    await hook(this.options, typedError, retryCount);
                  }
                } catch (error_) {
                  void this._error(new RequestError(error_.message, error, this));
                  return;
                }
                if (this.destroyed) {
                  return;
                }
                this.destroy();
                this.emit("retry", retryCount, error);
              };
              this[kRetryTimeout] = setTimeout(retry, backoff);
              return;
            }
          }
          void this._error(typedError);
        })();
      }
      _read() {
        this[kTriggerRead] = true;
        const response = this[kResponse];
        if (response && !this[kStopReading]) {
          if (response.readableLength) {
            this[kTriggerRead] = false;
          }
          let data;
          while ((data = response.read()) !== null) {
            this[kDownloadedSize] += data.length;
            this[kStartedReading] = true;
            const progress = this.downloadProgress;
            if (progress.percent < 1) {
              this.emit("downloadProgress", progress);
            }
            this.push(data);
          }
        }
      }
      _write(chunk, encoding, callback) {
        const write = () => {
          this._writeRequest(chunk, encoding, callback);
        };
        if (this.requestInitialized) {
          write();
        } else {
          this[kJobs].push(write);
        }
      }
      _writeRequest(chunk, encoding, callback) {
        if (this[kRequest].destroyed) {
          return;
        }
        this._progressCallbacks.push(() => {
          this[kUploadedSize] += Buffer.byteLength(chunk, encoding);
          const progress = this.uploadProgress;
          if (progress.percent < 1) {
            this.emit("uploadProgress", progress);
          }
        });
        this[kRequest].write(chunk, encoding, (error) => {
          if (!error && this._progressCallbacks.length > 0) {
            this._progressCallbacks.shift()();
          }
          callback(error);
        });
      }
      _final(callback) {
        const endRequest = () => {
          while (this._progressCallbacks.length !== 0) {
            this._progressCallbacks.shift()();
          }
          if (!(kRequest in this)) {
            callback();
            return;
          }
          if (this[kRequest].destroyed) {
            callback();
            return;
          }
          this[kRequest].end((error) => {
            if (!error) {
              this[kBodySize] = this[kUploadedSize];
              this.emit("uploadProgress", this.uploadProgress);
              this[kRequest].emit("upload-complete");
            }
            callback(error);
          });
        };
        if (this.requestInitialized) {
          endRequest();
        } else {
          this[kJobs].push(endRequest);
        }
      }
      _destroy(error, callback) {
        var _a;
        this[kStopReading] = true;
        clearTimeout(this[kRetryTimeout]);
        if (kRequest in this) {
          this[kCancelTimeouts]();
          if (!((_a = this[kResponse]) === null || _a === void 0 ? void 0 : _a.complete)) {
            this[kRequest].destroy();
          }
        }
        if (error !== null && !is_1.default.undefined(error) && !(error instanceof RequestError)) {
          error = new RequestError(error.message, error, this);
        }
        callback(error);
      }
      get _isAboutToError() {
        return this[kStopReading];
      }
      get ip() {
        var _a;
        return (_a = this.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress;
      }
      get aborted() {
        var _a, _b, _c;
        return ((_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroyed) !== null && _b !== void 0 ? _b : this.destroyed) && !((_c = this[kOriginalResponse]) === null || _c === void 0 ? void 0 : _c.complete);
      }
      get socket() {
        var _a, _b;
        return (_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.socket) !== null && _b !== void 0 ? _b : void 0;
      }
      get downloadProgress() {
        let percent;
        if (this[kResponseSize]) {
          percent = this[kDownloadedSize] / this[kResponseSize];
        } else if (this[kResponseSize] === this[kDownloadedSize]) {
          percent = 1;
        } else {
          percent = 0;
        }
        return {
          percent,
          transferred: this[kDownloadedSize],
          total: this[kResponseSize]
        };
      }
      get uploadProgress() {
        let percent;
        if (this[kBodySize]) {
          percent = this[kUploadedSize] / this[kBodySize];
        } else if (this[kBodySize] === this[kUploadedSize]) {
          percent = 1;
        } else {
          percent = 0;
        }
        return {
          percent,
          transferred: this[kUploadedSize],
          total: this[kBodySize]
        };
      }
      get timings() {
        var _a;
        return (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.timings;
      }
      get isFromCache() {
        return this[kIsFromCache];
      }
      pipe(destination, options) {
        if (this[kStartedReading]) {
          throw new Error("Failed to pipe. The response has been emitted already.");
        }
        if (destination instanceof http_1.ServerResponse) {
          this[kServerResponsesPiped].add(destination);
        }
        return super.pipe(destination, options);
      }
      unpipe(destination) {
        if (destination instanceof http_1.ServerResponse) {
          this[kServerResponsesPiped].delete(destination);
        }
        super.unpipe(destination);
        return this;
      }
    };
    exports2.default = Request;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/types.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.CancelError = exports2.ParseError = void 0;
    var core_1 = require_core();
    var ParseError = class extends core_1.RequestError {
      constructor(error, response) {
        const {options} = response.request;
        super(`${error.message} in "${options.url.toString()}"`, error, response.request);
        this.name = "ParseError";
      }
    };
    exports2.ParseError = ParseError;
    var CancelError = class extends core_1.RequestError {
      constructor(request) {
        super("Promise was canceled", {}, request);
        this.name = "CancelError";
      }
      get isCanceled() {
        return true;
      }
    };
    exports2.CancelError = CancelError;
    __exportStar(require_core(), exports2);
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/parse-body.js
var require_parse_body = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/parse-body.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var types_1 = require_types();
    var parseBody = (response, responseType, parseJson, encoding) => {
      const {rawBody} = response;
      try {
        if (responseType === "text") {
          return rawBody.toString(encoding);
        }
        if (responseType === "json") {
          return rawBody.length === 0 ? "" : parseJson(rawBody.toString());
        }
        if (responseType === "buffer") {
          return rawBody;
        }
        throw new types_1.ParseError({
          message: `Unknown body type '${responseType}'`,
          name: "Error"
        }, response);
      } catch (error) {
        throw new types_1.ParseError(error, response);
      }
    };
    exports2.default = parseBody;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/index.js
var require_as_promise = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", {value: true});
    var events_1 = require("events");
    var is_1 = require_dist3();
    var PCancelable = require_p_cancelable();
    var types_1 = require_types();
    var parse_body_1 = require_parse_body();
    var core_1 = require_core();
    var proxy_events_1 = require_proxy_events2();
    var get_buffer_1 = require_get_buffer();
    var is_response_ok_1 = require_is_response_ok();
    var proxiedRequestEvents = [
      "request",
      "response",
      "redirect",
      "uploadProgress",
      "downloadProgress"
    ];
    function asPromise(normalizedOptions) {
      let globalRequest;
      let globalResponse;
      const emitter = new events_1.EventEmitter();
      const promise = new PCancelable((resolve, reject, onCancel) => {
        const makeRequest = (retryCount) => {
          const request = new core_1.default(void 0, normalizedOptions);
          request.retryCount = retryCount;
          request._noPipe = true;
          onCancel(() => request.destroy());
          onCancel.shouldReject = false;
          onCancel(() => reject(new types_1.CancelError(request)));
          globalRequest = request;
          request.once("response", async (response) => {
            var _a;
            response.retryCount = retryCount;
            if (response.request.aborted) {
              return;
            }
            let rawBody;
            try {
              rawBody = await get_buffer_1.default(request);
              response.rawBody = rawBody;
            } catch (_b) {
              return;
            }
            if (request._isAboutToError) {
              return;
            }
            const contentEncoding = ((_a = response.headers["content-encoding"]) !== null && _a !== void 0 ? _a : "").toLowerCase();
            const isCompressed = ["gzip", "deflate", "br"].includes(contentEncoding);
            const {options} = request;
            if (isCompressed && !options.decompress) {
              response.body = rawBody;
            } else {
              try {
                response.body = parse_body_1.default(response, options.responseType, options.parseJson, options.encoding);
              } catch (error) {
                response.body = rawBody.toString();
                if (is_response_ok_1.isResponseOk(response)) {
                  request._beforeError(error);
                  return;
                }
              }
            }
            try {
              for (const [index, hook] of options.hooks.afterResponse.entries()) {
                response = await hook(response, async (updatedOptions) => {
                  const typedOptions = core_1.default.normalizeArguments(void 0, __objSpread(__objSpread({}, updatedOptions), {
                    retry: {
                      calculateDelay: () => 0
                    },
                    throwHttpErrors: false,
                    resolveBodyOnly: false
                  }), options);
                  typedOptions.hooks.afterResponse = typedOptions.hooks.afterResponse.slice(0, index);
                  for (const hook2 of typedOptions.hooks.beforeRetry) {
                    await hook2(typedOptions);
                  }
                  const promise2 = asPromise(typedOptions);
                  onCancel(() => {
                    promise2.catch(() => {
                    });
                    promise2.cancel();
                  });
                  return promise2;
                });
              }
            } catch (error) {
              request._beforeError(new types_1.RequestError(error.message, error, request));
              return;
            }
            if (!is_response_ok_1.isResponseOk(response)) {
              request._beforeError(new types_1.HTTPError(response));
              return;
            }
            globalResponse = response;
            resolve(request.options.resolveBodyOnly ? response.body : response);
          });
          const onError = (error) => {
            if (promise.isCanceled) {
              return;
            }
            const {options} = request;
            if (error instanceof types_1.HTTPError && !options.throwHttpErrors) {
              const {response} = error;
              resolve(request.options.resolveBodyOnly ? response.body : response);
              return;
            }
            reject(error);
          };
          request.once("error", onError);
          const previousBody = request.options.body;
          request.once("retry", (newRetryCount, error) => {
            var _a, _b;
            if (previousBody === ((_a = error.request) === null || _a === void 0 ? void 0 : _a.options.body) && is_1.default.nodeStream((_b = error.request) === null || _b === void 0 ? void 0 : _b.options.body)) {
              onError(error);
              return;
            }
            makeRequest(newRetryCount);
          });
          proxy_events_1.default(request, emitter, proxiedRequestEvents);
        };
        makeRequest(0);
      });
      promise.on = (event, fn) => {
        emitter.on(event, fn);
        return promise;
      };
      const shortcut = (responseType) => {
        const newPromise = (async () => {
          await promise;
          const {options} = globalResponse.request;
          return parse_body_1.default(globalResponse, responseType, options.parseJson, options.encoding);
        })();
        Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
        return newPromise;
      };
      promise.json = () => {
        const {headers} = globalRequest.options;
        if (!globalRequest.writableFinished && headers.accept === void 0) {
          headers.accept = "application/json";
        }
        return shortcut("json");
      };
      promise.buffer = () => shortcut("buffer");
      promise.text = () => shortcut("text");
      return promise;
    }
    exports2.default = asPromise;
    __exportStar(require_types(), exports2);
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/create-rejection.js
var require_create_rejection = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/as-promise/create-rejection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var types_1 = require_types();
    function createRejection(error, ...beforeErrorGroups) {
      const promise = (async () => {
        if (error instanceof types_1.RequestError) {
          try {
            for (const hooks of beforeErrorGroups) {
              if (hooks) {
                for (const hook of hooks) {
                  error = await hook(error);
                }
              }
            }
          } catch (error_) {
            error = error_;
          }
        }
        throw error;
      })();
      const returnPromise = () => promise;
      promise.json = returnPromise;
      promise.text = returnPromise;
      promise.buffer = returnPromise;
      promise.on = returnPromise;
      return promise;
    }
    exports2.default = createRejection;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/utils/deep-freeze.js
var require_deep_freeze = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/utils/deep-freeze.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var is_1 = require_dist3();
    function deepFreeze(object) {
      for (const value of Object.values(object)) {
        if (is_1.default.plainObject(value) || is_1.default.array(value)) {
          deepFreeze(value);
        }
      }
      return Object.freeze(object);
    }
    exports2.default = deepFreeze;
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/types.js
var require_types2 = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/create.js
var require_create = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/create.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.defaultHandler = void 0;
    var is_1 = require_dist3();
    var as_promise_1 = require_as_promise();
    var create_rejection_1 = require_create_rejection();
    var core_1 = require_core();
    var deep_freeze_1 = require_deep_freeze();
    var errors = {
      RequestError: as_promise_1.RequestError,
      CacheError: as_promise_1.CacheError,
      ReadError: as_promise_1.ReadError,
      HTTPError: as_promise_1.HTTPError,
      MaxRedirectsError: as_promise_1.MaxRedirectsError,
      TimeoutError: as_promise_1.TimeoutError,
      ParseError: as_promise_1.ParseError,
      CancelError: as_promise_1.CancelError,
      UnsupportedProtocolError: as_promise_1.UnsupportedProtocolError,
      UploadError: as_promise_1.UploadError
    };
    var delay = async (ms) => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    var {normalizeArguments} = core_1.default;
    var mergeOptions = (...sources) => {
      let mergedOptions;
      for (const source of sources) {
        mergedOptions = normalizeArguments(void 0, source, mergedOptions);
      }
      return mergedOptions;
    };
    var getPromiseOrStream = (options) => options.isStream ? new core_1.default(void 0, options) : as_promise_1.default(options);
    var isGotInstance = (value) => "defaults" in value && "options" in value.defaults;
    var aliases = [
      "get",
      "post",
      "put",
      "patch",
      "head",
      "delete"
    ];
    exports2.defaultHandler = (options, next) => next(options);
    var callInitHooks = (hooks, options) => {
      if (hooks) {
        for (const hook of hooks) {
          hook(options);
        }
      }
    };
    var create = (defaults) => {
      defaults._rawHandlers = defaults.handlers;
      defaults.handlers = defaults.handlers.map((fn) => (options, next) => {
        let root;
        const result = fn(options, (newOptions) => {
          root = next(newOptions);
          return root;
        });
        if (result !== root && !options.isStream && root) {
          const typedResult = result;
          const {then: promiseThen, catch: promiseCatch, finally: promiseFianlly} = typedResult;
          Object.setPrototypeOf(typedResult, Object.getPrototypeOf(root));
          Object.defineProperties(typedResult, Object.getOwnPropertyDescriptors(root));
          typedResult.then = promiseThen;
          typedResult.catch = promiseCatch;
          typedResult.finally = promiseFianlly;
        }
        return result;
      });
      const got = (url, options = {}, _defaults) => {
        var _a, _b;
        let iteration = 0;
        const iterateHandlers = (newOptions) => {
          return defaults.handlers[iteration++](newOptions, iteration === defaults.handlers.length ? getPromiseOrStream : iterateHandlers);
        };
        if (is_1.default.plainObject(url)) {
          const mergedOptions = __objSpread(__objSpread({}, url), options);
          core_1.setNonEnumerableProperties([url, options], mergedOptions);
          options = mergedOptions;
          url = void 0;
        }
        try {
          let initHookError;
          try {
            callInitHooks(defaults.options.hooks.init, options);
            callInitHooks((_a = options.hooks) === null || _a === void 0 ? void 0 : _a.init, options);
          } catch (error) {
            initHookError = error;
          }
          const normalizedOptions = normalizeArguments(url, options, _defaults !== null && _defaults !== void 0 ? _defaults : defaults.options);
          normalizedOptions[core_1.kIsNormalizedAlready] = true;
          if (initHookError) {
            throw new as_promise_1.RequestError(initHookError.message, initHookError, normalizedOptions);
          }
          return iterateHandlers(normalizedOptions);
        } catch (error) {
          if (options.isStream) {
            throw error;
          } else {
            return create_rejection_1.default(error, defaults.options.hooks.beforeError, (_b = options.hooks) === null || _b === void 0 ? void 0 : _b.beforeError);
          }
        }
      };
      got.extend = (...instancesOrOptions) => {
        const optionsArray = [defaults.options];
        let handlers = [...defaults._rawHandlers];
        let isMutableDefaults;
        for (const value of instancesOrOptions) {
          if (isGotInstance(value)) {
            optionsArray.push(value.defaults.options);
            handlers.push(...value.defaults._rawHandlers);
            isMutableDefaults = value.defaults.mutableDefaults;
          } else {
            optionsArray.push(value);
            if ("handlers" in value) {
              handlers.push(...value.handlers);
            }
            isMutableDefaults = value.mutableDefaults;
          }
        }
        handlers = handlers.filter((handler) => handler !== exports2.defaultHandler);
        if (handlers.length === 0) {
          handlers.push(exports2.defaultHandler);
        }
        return create({
          options: mergeOptions(...optionsArray),
          handlers,
          mutableDefaults: Boolean(isMutableDefaults)
        });
      };
      const paginateEach = async function* (url, options) {
        let normalizedOptions = normalizeArguments(url, options, defaults.options);
        normalizedOptions.resolveBodyOnly = false;
        const pagination = normalizedOptions.pagination;
        if (!is_1.default.object(pagination)) {
          throw new TypeError("`options.pagination` must be implemented");
        }
        const all = [];
        let {countLimit} = pagination;
        let numberOfRequests = 0;
        while (numberOfRequests < pagination.requestLimit) {
          if (numberOfRequests !== 0) {
            await delay(pagination.backoff);
          }
          const result = await got(void 0, void 0, normalizedOptions);
          const parsed = await pagination.transform(result);
          const current = [];
          for (const item of parsed) {
            if (pagination.filter(item, all, current)) {
              if (!pagination.shouldContinue(item, all, current)) {
                return;
              }
              yield item;
              if (pagination.stackAllItems) {
                all.push(item);
              }
              current.push(item);
              if (--countLimit <= 0) {
                return;
              }
            }
          }
          const optionsToMerge = pagination.paginate(result, all, current);
          if (optionsToMerge === false) {
            return;
          }
          if (optionsToMerge === result.request.options) {
            normalizedOptions = result.request.options;
          } else if (optionsToMerge !== void 0) {
            normalizedOptions = normalizeArguments(void 0, optionsToMerge, normalizedOptions);
          }
          numberOfRequests++;
        }
      };
      got.paginate = paginateEach;
      got.paginate.all = async (url, options) => {
        const results = [];
        for await (const item of paginateEach(url, options)) {
          results.push(item);
        }
        return results;
      };
      got.paginate.each = paginateEach;
      got.stream = (url, options) => got(url, __objSpread(__objSpread({}, options), {isStream: true}));
      for (const method of aliases) {
        got[method] = (url, options) => got(url, __objSpread(__objSpread({}, options), {method}));
        got.stream[method] = (url, options) => {
          return got(url, __objSpread(__objSpread({}, options), {method, isStream: true}));
        };
      }
      Object.assign(got, errors);
      Object.defineProperty(got, "defaults", {
        value: defaults.mutableDefaults ? defaults : deep_freeze_1.default(defaults),
        writable: defaults.mutableDefaults,
        configurable: defaults.mutableDefaults,
        enumerable: true
      });
      got.mergeOptions = mergeOptions;
      return got;
    };
    exports2.default = create;
    __exportStar(require_types2(), exports2);
  }
});

// node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/index.js
var require_source5 = __commonJS({
  "node_modules/.pnpm/got@11.8.2/node_modules/got/dist/source/index.js"(exports2, module2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, {enumerable: true, get: function() {
        return m[k];
      }});
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", {value: true});
    var url_1 = require("url");
    var create_1 = require_create();
    var defaults = {
      options: {
        method: "GET",
        retry: {
          limit: 2,
          methods: [
            "GET",
            "PUT",
            "HEAD",
            "DELETE",
            "OPTIONS",
            "TRACE"
          ],
          statusCodes: [
            408,
            413,
            429,
            500,
            502,
            503,
            504,
            521,
            522,
            524
          ],
          errorCodes: [
            "ETIMEDOUT",
            "ECONNRESET",
            "EADDRINUSE",
            "ECONNREFUSED",
            "EPIPE",
            "ENOTFOUND",
            "ENETUNREACH",
            "EAI_AGAIN"
          ],
          maxRetryAfter: void 0,
          calculateDelay: ({computedValue}) => computedValue
        },
        timeout: {},
        headers: {
          "user-agent": "got (https://github.com/sindresorhus/got)"
        },
        hooks: {
          init: [],
          beforeRequest: [],
          beforeRedirect: [],
          beforeRetry: [],
          beforeError: [],
          afterResponse: []
        },
        cache: void 0,
        dnsCache: void 0,
        decompress: true,
        throwHttpErrors: true,
        followRedirect: true,
        isStream: false,
        responseType: "text",
        resolveBodyOnly: false,
        maxRedirects: 10,
        prefixUrl: "",
        methodRewriting: true,
        ignoreInvalidCookies: false,
        context: {},
        http2: false,
        allowGetBody: false,
        https: void 0,
        pagination: {
          transform: (response) => {
            if (response.request.options.responseType === "json") {
              return response.body;
            }
            return JSON.parse(response.body);
          },
          paginate: (response) => {
            if (!Reflect.has(response.headers, "link")) {
              return false;
            }
            const items = response.headers.link.split(",");
            let next;
            for (const item of items) {
              const parsed = item.split(";");
              if (parsed[1].includes("next")) {
                next = parsed[0].trimStart().trim();
                next = next.slice(1, -1);
                break;
              }
            }
            if (next) {
              const options = {
                url: new url_1.URL(next)
              };
              return options;
            }
            return false;
          },
          filter: () => true,
          shouldContinue: () => true,
          countLimit: Infinity,
          backoff: 0,
          requestLimit: 1e4,
          stackAllItems: true
        },
        parseJson: (text) => JSON.parse(text),
        stringifyJson: (object) => JSON.stringify(object),
        cacheOptions: {}
      },
      handlers: [create_1.defaultHandler],
      mutableDefaults: false
    };
    var got = create_1.default(defaults);
    exports2.default = got;
    module2.exports = got;
    module2.exports.default = got;
    module2.exports.__esModule = true;
    __exportStar(require_create(), exports2);
    __exportStar(require_as_promise(), exports2);
  }
});

// node_modules/.pnpm/@gitbeaker+node@28.4.1/node_modules/@gitbeaker/node/dist/index.js
var require_dist4 = __commonJS({
  "node_modules/.pnpm/@gitbeaker+node@28.4.1/node_modules/@gitbeaker/node/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var Gitbeaker = require_dist2();
    var requesterUtils = require_dist();
    var Got = require_source5();
    var xcase = require_es5();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : {"default": e};
    }
    function _interopNamespace(e) {
      if (e && e.__esModule)
        return e;
      var n = Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var Gitbeaker__namespace = /* @__PURE__ */ _interopNamespace(Gitbeaker);
    var Got__default = /* @__PURE__ */ _interopDefaultLegacy(Got);
    function __rest(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    }
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = {label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: []}, f, y, t, g;
      return g = {next: verb(0), "throw": verb(1), "return": verb(2)}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return {value: op[1], done: false};
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return {value: op[0] ? op[1] : void 0, done: true};
      }
    }
    function defaultOptionsHandler(serviceOptions, _a) {
      var _b = _a === void 0 ? {} : _a, body = _b.body, query = _b.query, sudo = _b.sudo, method = _b.method;
      var options = requesterUtils.defaultOptionsHandler(serviceOptions, {body, query, sudo, method});
      if (typeof body === "object" && body.constructor.name !== "FormData") {
        options.json = xcase.decamelizeKeys(body);
        delete options.body;
      }
      if (serviceOptions.url.includes("https") && serviceOptions.rejectUnauthorized != null && serviceOptions.rejectUnauthorized === false) {
        options.https = {
          rejectUnauthorized: serviceOptions.rejectUnauthorized
        };
      }
      return options;
    }
    function processBody(_a) {
      var rawBody = _a.rawBody, headers = _a.headers;
      var contentType = (headers["content-type"] || "").split(";")[0].trim();
      if (contentType === "application/json") {
        return rawBody.length === 0 ? {} : JSON.parse(rawBody.toString());
      }
      if (contentType.startsWith("text/")) {
        return rawBody.toString();
      }
      return Buffer.from(rawBody);
    }
    function handler(endpoint, options) {
      return __awaiter(this, void 0, void 0, function() {
        var retryCodes, maxRetries, response, i, waitTime, e_1, output, statusCode, headers, body;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              retryCodes = [429, 502];
              maxRetries = 10;
              i = 0;
              _a.label = 1;
            case 1:
              if (!(i < maxRetries))
                return [3, 9];
              waitTime = Math.pow(2, i) * 0.1;
              _a.label = 2;
            case 2:
              _a.trys.push([2, 4, , 8]);
              if (options.method === "stream") {
                options.method = "get";
                options.isStream = true;
                return [2, Got__default["default"](endpoint, options)];
              }
              return [4, Got__default["default"](endpoint, options)];
            case 3:
              response = _a.sent();
              return [3, 9];
            case 4:
              e_1 = _a.sent();
              if (!e_1.response)
                return [3, 7];
              if (!retryCodes.includes(e_1.response.statusCode))
                return [3, 6];
              return [4, requesterUtils.wait(waitTime)];
            case 5:
              _a.sent();
              return [3, 8];
            case 6:
              if (typeof e_1.response.body === "string" && e_1.response.body.length > 0) {
                try {
                  output = JSON.parse(e_1.response.body);
                  e_1.description = output.error || output.message;
                } catch (err) {
                  e_1.description = e_1.response.body;
                }
              }
              _a.label = 7;
            case 7:
              throw e_1;
            case 8:
              i += 1;
              return [3, 1];
            case 9:
              statusCode = response.statusCode, headers = response.headers;
              body = processBody(response);
              return [2, {body, headers, status: statusCode}];
          }
        });
      });
    }
    var requesterFn = requesterUtils.createRequesterFn(defaultOptionsHandler, handler);
    var services = __rest(Gitbeaker__namespace, ["getAPIMap"]);
    var APIServices = requesterUtils.modifyServices(services, {requesterFn});
    var Groups = APIServices.Groups;
    var GroupAccessRequests = APIServices.GroupAccessRequests;
    var GroupBadges = APIServices.GroupBadges;
    var GroupCustomAttributes = APIServices.GroupCustomAttributes;
    var GroupIssueBoards = APIServices.GroupIssueBoards;
    var GroupMembers = APIServices.GroupMembers;
    var GroupMilestones = APIServices.GroupMilestones;
    var GroupProjects = APIServices.GroupProjects;
    var GroupRunners = APIServices.GroupRunners;
    var GroupVariables = APIServices.GroupVariables;
    var GroupLabels = APIServices.GroupLabels;
    var Epics = APIServices.Epics;
    var EpicIssues = APIServices.EpicIssues;
    var EpicNotes = APIServices.EpicNotes;
    var EpicDiscussions = APIServices.EpicDiscussions;
    var Users = APIServices.Users;
    var UserCustomAttributes = APIServices.UserCustomAttributes;
    var UserEmails = APIServices.UserEmails;
    var UserImpersonationTokens = APIServices.UserImpersonationTokens;
    var UserKeys = APIServices.UserKeys;
    var UserGPGKeys = APIServices.UserGPGKeys;
    var Branches = APIServices.Branches;
    var Commits = APIServices.Commits;
    var CommitDiscussions = APIServices.CommitDiscussions;
    var ContainerRegistry = APIServices.ContainerRegistry;
    var Deployments = APIServices.Deployments;
    var DeployKeys = APIServices.DeployKeys;
    var Environments = APIServices.Environments;
    var FreezePeriods = APIServices.FreezePeriods;
    var Issues = APIServices.Issues;
    var IssuesStatistics = APIServices.IssuesStatistics;
    var IssueNotes = APIServices.IssueNotes;
    var IssueDiscussions = APIServices.IssueDiscussions;
    var IssueAwardEmojis = APIServices.IssueAwardEmojis;
    var Jobs = APIServices.Jobs;
    var Labels = APIServices.Labels;
    var MergeRequests = APIServices.MergeRequests;
    var MergeRequestApprovals = APIServices.MergeRequestApprovals;
    var MergeRequestAwardEmojis = APIServices.MergeRequestAwardEmojis;
    var MergeRequestDiscussions = APIServices.MergeRequestDiscussions;
    var MergeRequestNotes = APIServices.MergeRequestNotes;
    var Packages = APIServices.Packages;
    var Pipelines = APIServices.Pipelines;
    var PipelineSchedules = APIServices.PipelineSchedules;
    var PipelineScheduleVariables = APIServices.PipelineScheduleVariables;
    var Projects = APIServices.Projects;
    var ProjectAccessRequests = APIServices.ProjectAccessRequests;
    var ProjectBadges = APIServices.ProjectBadges;
    var ProjectCustomAttributes = APIServices.ProjectCustomAttributes;
    var ProjectImportExport = APIServices.ProjectImportExport;
    var ProjectIssueBoards = APIServices.ProjectIssueBoards;
    var ProjectHooks = APIServices.ProjectHooks;
    var ProjectMembers = APIServices.ProjectMembers;
    var ProjectMilestones = APIServices.ProjectMilestones;
    var ProjectSnippets = APIServices.ProjectSnippets;
    var ProjectSnippetNotes = APIServices.ProjectSnippetNotes;
    var ProjectSnippetDiscussions = APIServices.ProjectSnippetDiscussions;
    var ProjectSnippetAwardEmojis = APIServices.ProjectSnippetAwardEmojis;
    var ProtectedBranches = APIServices.ProtectedBranches;
    var ProtectedTags = APIServices.ProtectedTags;
    var ProjectVariables = APIServices.ProjectVariables;
    var PushRules = APIServices.PushRules;
    var Releases = APIServices.Releases;
    var ReleaseLinks = APIServices.ReleaseLinks;
    var Repositories = APIServices.Repositories;
    var RepositoryFiles = APIServices.RepositoryFiles;
    var Runners = APIServices.Runners;
    var Services = APIServices.Services;
    var Tags = APIServices.Tags;
    var Todos = APIServices.Todos;
    var Triggers = APIServices.Triggers;
    var VulnerabilityFindings = APIServices.VulnerabilityFindings;
    var ApplicationSettings = APIServices.ApplicationSettings;
    var BroadcastMessages = APIServices.BroadcastMessages;
    var Events = APIServices.Events;
    var FeatureFlags = APIServices.FeatureFlags;
    var GeoNodes = APIServices.GeoNodes;
    var GitignoreTemplates = APIServices.GitignoreTemplates;
    var GitLabCIYMLTemplates = APIServices.GitLabCIYMLTemplates;
    var Keys = APIServices.Keys;
    var License = APIServices.License;
    var LicenceTemplates = APIServices.LicenceTemplates;
    var Lint = APIServices.Lint;
    var Namespaces = APIServices.Namespaces;
    var NotificationSettings = APIServices.NotificationSettings;
    var Markdown = APIServices.Markdown;
    var PagesDomains = APIServices.PagesDomains;
    var Search = APIServices.Search;
    var SidekiqMetrics = APIServices.SidekiqMetrics;
    var Snippets = APIServices.Snippets;
    var SystemHooks = APIServices.SystemHooks;
    var Version = APIServices.Version;
    var Wikis = APIServices.Wikis;
    var GroupsBundle = APIServices.GroupsBundle;
    var UsersBundle = APIServices.UsersBundle;
    var ProjectsBundle = APIServices.ProjectsBundle;
    var Gitlab2 = APIServices.Gitlab;
    exports2.ApplicationSettings = ApplicationSettings;
    exports2.Branches = Branches;
    exports2.BroadcastMessages = BroadcastMessages;
    exports2.CommitDiscussions = CommitDiscussions;
    exports2.Commits = Commits;
    exports2.ContainerRegistry = ContainerRegistry;
    exports2.DeployKeys = DeployKeys;
    exports2.Deployments = Deployments;
    exports2.Environments = Environments;
    exports2.EpicDiscussions = EpicDiscussions;
    exports2.EpicIssues = EpicIssues;
    exports2.EpicNotes = EpicNotes;
    exports2.Epics = Epics;
    exports2.Events = Events;
    exports2.FeatureFlags = FeatureFlags;
    exports2.FreezePeriods = FreezePeriods;
    exports2.GeoNodes = GeoNodes;
    exports2.GitLabCIYMLTemplates = GitLabCIYMLTemplates;
    exports2.GitignoreTemplates = GitignoreTemplates;
    exports2.Gitlab = Gitlab2;
    exports2.GroupAccessRequests = GroupAccessRequests;
    exports2.GroupBadges = GroupBadges;
    exports2.GroupCustomAttributes = GroupCustomAttributes;
    exports2.GroupIssueBoards = GroupIssueBoards;
    exports2.GroupLabels = GroupLabels;
    exports2.GroupMembers = GroupMembers;
    exports2.GroupMilestones = GroupMilestones;
    exports2.GroupProjects = GroupProjects;
    exports2.GroupRunners = GroupRunners;
    exports2.GroupVariables = GroupVariables;
    exports2.Groups = Groups;
    exports2.GroupsBundle = GroupsBundle;
    exports2.IssueAwardEmojis = IssueAwardEmojis;
    exports2.IssueDiscussions = IssueDiscussions;
    exports2.IssueNotes = IssueNotes;
    exports2.Issues = Issues;
    exports2.IssuesStatistics = IssuesStatistics;
    exports2.Jobs = Jobs;
    exports2.Keys = Keys;
    exports2.Labels = Labels;
    exports2.LicenceTemplates = LicenceTemplates;
    exports2.License = License;
    exports2.Lint = Lint;
    exports2.Markdown = Markdown;
    exports2.MergeRequestApprovals = MergeRequestApprovals;
    exports2.MergeRequestAwardEmojis = MergeRequestAwardEmojis;
    exports2.MergeRequestDiscussions = MergeRequestDiscussions;
    exports2.MergeRequestNotes = MergeRequestNotes;
    exports2.MergeRequests = MergeRequests;
    exports2.Namespaces = Namespaces;
    exports2.NotificationSettings = NotificationSettings;
    exports2.Packages = Packages;
    exports2.PagesDomains = PagesDomains;
    exports2.PipelineScheduleVariables = PipelineScheduleVariables;
    exports2.PipelineSchedules = PipelineSchedules;
    exports2.Pipelines = Pipelines;
    exports2.ProjectAccessRequests = ProjectAccessRequests;
    exports2.ProjectBadges = ProjectBadges;
    exports2.ProjectCustomAttributes = ProjectCustomAttributes;
    exports2.ProjectHooks = ProjectHooks;
    exports2.ProjectImportExport = ProjectImportExport;
    exports2.ProjectIssueBoards = ProjectIssueBoards;
    exports2.ProjectMembers = ProjectMembers;
    exports2.ProjectMilestones = ProjectMilestones;
    exports2.ProjectSnippetAwardEmojis = ProjectSnippetAwardEmojis;
    exports2.ProjectSnippetDiscussions = ProjectSnippetDiscussions;
    exports2.ProjectSnippetNotes = ProjectSnippetNotes;
    exports2.ProjectSnippets = ProjectSnippets;
    exports2.ProjectVariables = ProjectVariables;
    exports2.Projects = Projects;
    exports2.ProjectsBundle = ProjectsBundle;
    exports2.ProtectedBranches = ProtectedBranches;
    exports2.ProtectedTags = ProtectedTags;
    exports2.PushRules = PushRules;
    exports2.ReleaseLinks = ReleaseLinks;
    exports2.Releases = Releases;
    exports2.Repositories = Repositories;
    exports2.RepositoryFiles = RepositoryFiles;
    exports2.Runners = Runners;
    exports2.Search = Search;
    exports2.Services = Services;
    exports2.SidekiqMetrics = SidekiqMetrics;
    exports2.Snippets = Snippets;
    exports2.SystemHooks = SystemHooks;
    exports2.Tags = Tags;
    exports2.Todos = Todos;
    exports2.Triggers = Triggers;
    exports2.UserCustomAttributes = UserCustomAttributes;
    exports2.UserEmails = UserEmails;
    exports2.UserGPGKeys = UserGPGKeys;
    exports2.UserImpersonationTokens = UserImpersonationTokens;
    exports2.UserKeys = UserKeys;
    exports2.Users = Users;
    exports2.UsersBundle = UsersBundle;
    exports2.Version = Version;
    exports2.VulnerabilityFindings = VulnerabilityFindings;
    exports2.Wikis = Wikis;
  }
});

// src/index.ts
var import_dotenv = __toModule(require_main());

// src/api.ts
var import_node = __toModule(require_dist4());
var api = (host, token) => new import_node.Gitlab({
  host,
  token
});
var api_default = api;

// src/plugins/auto-merge.ts
var auto_merge_default = definePlugin(async ({api: api3, project}) => {
  let mrs = await api3.MergeRequests.all({projectId: project.id, labels: ["\u{1F440} Ready for Review"], state: "opened"});
  if (!Array.isArray(mrs)) {
    mrs = [mrs];
  }
  for (const mr of mrs) {
    const mrIid = mr.iid;
    const pipelines = await api3.MergeRequests.pipelines(project.id, mrIid);
    const approvals = await api3.MergeRequestApprovals.approvals(project.id, {mergerequestIid: mrIid});
    const checks = {
      reviewers: mr.reviewers.length,
      approvals: approvals.approved_by.length,
      has_conflicts: mr.has_conflicts,
      unresolved_discussions: !mr.blocking_discussions_resolved,
      last_pipeline_status: pipelines[0].status
    };
    if (checks.approvals >= 1 && checks.has_conflicts === false && checks.unresolved_discussions === false && checks.last_pipeline_status === "success") {
      console.log("merge", ":::", mr.title);
      await api3.MergeRequests.accept(project.id, mrIid, {squash: true});
    }
  }
});

// src/plugins/index.ts
var plugins_default = [auto_merge_default];
function definePlugin(plugin) {
  return plugin;
}

// src/index.ts
import_dotenv.default.config();
var {GITLAB_URL, GITLAB_TOKEN, ENABLED_PROJECTS} = process.env;
var api2 = api_default(GITLAB_URL, GITLAB_TOKEN);
async function loop() {
  const projects = await api2.Projects.all();
  const enabledProjects = projects.filter((p) => ENABLED_PROJECTS.split(",").includes(`${p.namespace.path}/${p.path}`));
  for (const project of enabledProjects) {
    console.log(":::", project.name, "-", "running ...");
    for (const plugin of plugins_default) {
      try {
        await plugin({api: api2, project});
      } catch (error) {
        console.error(":::", project.name, "Error", error);
      }
    }
  }
}
function start() {
  console.log(`Lassie is waking up "${GITLAB_URL}" ...`);
  setInterval(() => {
    loop();
  }, 1e3 * 30);
  loop();
  console.log("Lassie is now watching for jobs!");
}
start();
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
