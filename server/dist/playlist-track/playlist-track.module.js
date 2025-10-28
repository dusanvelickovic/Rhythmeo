"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistTrackModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const playlist_track_controller_1 = require("./playlist-track.controller");
const playlist_track_service_1 = require("./playlist-track.service");
const playlist_track_entity_1 = require("./playlist-track.entity");
let PlaylistTrackModule = class PlaylistTrackModule {
};
exports.PlaylistTrackModule = PlaylistTrackModule;
exports.PlaylistTrackModule = PlaylistTrackModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([playlist_track_entity_1.PlaylistTrack])],
        controllers: [playlist_track_controller_1.PlaylistTrackController],
        providers: [playlist_track_service_1.PlaylistTrackService],
        exports: [playlist_track_service_1.PlaylistTrackService],
    })
], PlaylistTrackModule);
//# sourceMappingURL=playlist-track.module.js.map