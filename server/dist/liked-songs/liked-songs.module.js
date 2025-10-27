"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikedSongsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const liked_song_entity_1 = require("./liked-song.entity");
const liked_songs_service_1 = require("./liked-songs.service");
const liked_songs_controller_1 = require("./liked-songs.controller");
let LikedSongsModule = class LikedSongsModule {
};
exports.LikedSongsModule = LikedSongsModule;
exports.LikedSongsModule = LikedSongsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([liked_song_entity_1.LikedSong])],
        controllers: [liked_songs_controller_1.LikedSongsController],
        providers: [liked_songs_service_1.LikedSongsService],
        exports: [liked_songs_service_1.LikedSongsService],
    })
], LikedSongsModule);
//# sourceMappingURL=liked-songs.module.js.map