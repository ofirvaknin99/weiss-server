import cors from 'cors';
import express from 'express';
import { basename } from 'path';
import { ExternalApiRouter } from './medias-apis.router';

const currFileName = basename(__filename).split('.')[0];
export class BaseApp {

    app = express();
    PORT = 3000;

    async bootstrap() {
        await this.createHttpServer();
        await this.registerApi();
    }

    private async createHttpServer() {
        this.app.listen(this.PORT, () => {
            console.log(`app started listen on port ${this.PORT}`);
        });
    }
    
    private async registerApi() {
        console.log(`registering Api ${currFileName}`);
        this.app.use(cors());
        this.app.use('/media', ExternalApiRouter.createRouter());
    }
}