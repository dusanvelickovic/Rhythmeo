"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikedTracksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const liked_track_entity_1 = require("./liked-track.entity");
const liked_tracks_service_1 = require("./liked-tracks.service");
const liked_tracks_controller_1 = require("./liked-tracks.controller");
const users_module_1 = require("../users/users.module");
let LikedTracksModule = class LikedTracksModule {
};
exports.LikedTracksModule = LikedTracksModule;
exports.LikedTracksModule = LikedTracksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([liked_track_entity_1.LikedTrack]), users_module_1.UsersModule],
        controllers: [liked_tracks_controller_1.LikedTracksController],
        providers: [liked_tracks_service_1.LikedTracksService],
        exports: [liked_tracks_service_1.LikedTracksService],
    })
], LikedTracksModule);
//# sourceMappingURL=liked-tracks.module.js.map