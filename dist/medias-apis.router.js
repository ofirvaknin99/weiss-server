"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApiRouter = void 0;
var axios_1 = __importDefault(require("axios"));
var express_1 = require("express");
var config_1 = require("./config");
var ExternalApiRouter = /** @class */ (function () {
    function ExternalApiRouter() {
    }
    ExternalApiRouter.createRouter = function () {
        var router = (0, express_1.Router)();
        router.use(function (req, res, next) {
            console.log("medias route called - ".concat(req.path));
            next();
        });
        router.get('/singleMedia/:mediaId', ExternalApiRouter.getMediaDetails);
        router.get('/mediaList/:mediaName', ExternalApiRouter.getMedias);
        return router;
    };
    ExternalApiRouter.getMediaDetails = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                axios_1.default.get("".concat(config_1.fullImdbUrl, "&i=").concat(req.params.mediaId, "&plot=full"))
                    .then(function (mediaResponse) {
                    res.send(mediaResponse.data);
                }).catch(function (err) {
                    console.log(err);
                });
                return [2 /*return*/];
            });
        });
    };
    ExternalApiRouter.getMedias = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaResponse, _a, Search, totalResults, Response, allMedias;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("".concat(config_1.fullImdbUrl, "&s=").concat(req.params.mediaName))];
                    case 1:
                        mediaResponse = _b.sent();
                        _a = mediaResponse.data, Search = _a.Search, totalResults = _a.totalResults, Response = _a.Response;
                        if (Response != 'True') {
                            res.send([]);
                            return [2 /*return*/];
                        }
                        if (totalResults <= 10) {
                            res.send(Search);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ExternalApiRouter.handleMediaRequests(totalResults, req.params.mediaName, Search)];
                    case 2:
                        allMedias = _b.sent();
                        console.log(allMedias);
                        return [2 /*return*/];
                }
            });
        });
    };
    ExternalApiRouter.handleMediaRequests = function (totalresults, mediaToSearch, medias) {
        return __awaiter(this, void 0, void 0, function () {
            var allMediasReq, restOfMedias, allMediasToSend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allMediasReq = ExternalApiRouter.createGetAllmediasReq(totalresults, mediaToSearch);
                        return [4 /*yield*/, Promise.all(allMediasReq)];
                    case 1:
                        restOfMedias = _a.sent();
                        allMediasToSend = __spreadArray(__spreadArray([], medias, true), restOfMedias.flat().map(function (mediaList) { return mediaList.data.Search; }), true);
                        return [2 /*return*/, (allMediasToSend.flat())];
                }
            });
        });
    };
    ExternalApiRouter.createGetAllmediasReq = function (totalResults, mediaName) {
        var listOfRequests = [];
        var pageNum;
        for (pageNum = 2; pageNum <= totalResults % 10 + 2; pageNum++) {
            listOfRequests.push(axios_1.default.get("".concat(config_1.fullImdbUrl, "&s=").concat(mediaName, "&page=").concat(pageNum)));
        }
        return listOfRequests;
    };
    return ExternalApiRouter;
}());
exports.ExternalApiRouter = ExternalApiRouter;
