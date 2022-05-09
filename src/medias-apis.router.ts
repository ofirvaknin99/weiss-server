import axios, { AxiosResponse } from "axios";
import { Request, Response, Router } from "express";
import { fullImdbUrl } from "./config";
import { fullMediaDetails, listOfMedias, media } from "./types";

export class ExternalApiRouter {
    public static createRouter(): Router {
        let router: Router = Router();

        router.use((req, res, next) => {
            console.log(`medias route called - ${req.path}`);
            next();
        });

        router.get('/singleMedia/:mediaId', ExternalApiRouter.getMediaDetails)
        router.get('/mediaList/:mediaName', ExternalApiRouter.getMedias)

        return router;
    }

    private static async getMediaDetails(req: Request, res: Response) {
        axios.get<fullMediaDetails>(`${fullImdbUrl}&i=${req.params.mediaId}&plot=full`)
            .then((mediaResponse) => {
                res.send(mediaResponse.data);
            }).catch((err) => {
                console.log(err);
            })
    }

    private static async getMedias(req: Request, res: Response) {
        const mediaResponse = await axios.get<listOfMedias>(`${fullImdbUrl}&s=${req.params.mediaName}`);
        const { Search, totalResults, Response } = mediaResponse.data;
        if (Response != 'True') {
            res.send([])
            return
        }
        if (totalResults <= 10) {
            res.send(Search)
            return
        }
        const allMedias = await ExternalApiRouter.handleMediaRequests(totalResults, req.params.mediaName, Search);
        res.send(allMedias);
    }

    private static async handleMediaRequests(totalresults: number, mediaToSearch: string, medias: media[]) {
        const allMediasReq: Promise<AxiosResponse<listOfMedias>>[] =
            ExternalApiRouter.createGetAllmediasReq(totalresults, mediaToSearch);
        const restOfMedias = await Promise.all(allMediasReq);
        const allMediasToSend = [...medias, ...restOfMedias.flat().map((mediaList) => mediaList.data.Search)]
        return (allMediasToSend.flat())
    }

    private static createGetAllmediasReq(totalResults: number, mediaName: string): Promise<AxiosResponse<listOfMedias>>[] {
        let listOfRequests: Promise<AxiosResponse<listOfMedias>>[] = [];
        let pageNum;

        for (pageNum = 2; pageNum <= totalResults % 10 + 2; pageNum++) {
            listOfRequests.push(axios.get(`${fullImdbUrl}&s=${mediaName}&page=${pageNum}`));
        }
        return listOfRequests;
    }
}