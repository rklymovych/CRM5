import './assets/css/sdk.css';

// Third-party modules
import 'reflect-metadata';
import {Container} from 'inversify';

// Internal modules
import TYPES from './constant/types';
import {Config} from './config';
import {Player} from './Player';

// Internal services
import {EventsService} from './shared/events.service';
import {BowserService} from './shared/bowser-service';
import {ParticipantService} from "./shared/participant.service";

const container = new Container();

export class Bootstrap {

    /**
     * Data members
     */
    public playerJS: Player;

    /**
     * @function constructor
     * @param {string} htmlContainerID
     */
    constructor(
        htmlContainerID: string
    ) {
        Config.html_container = htmlContainerID;

        // Loading services (injection by InversifyJS)

        container.bind<EventsService>(TYPES.EventsService).to(EventsService).inSingletonScope();
        container.bind<BowserService>(TYPES.BowserService).to(BowserService);
        container.bind<ParticipantService>(TYPES.ParticipantService).to(ParticipantService).inSingletonScope();
        container.bind<Player>(TYPES.Player).to(Player);

        this.playerJS = container.get<Player>(TYPES.Player);
    }

    /**
     * @function _updateSDKPointerCoordinate
     * @description
     * @public
     * @return {Player}
     */
    public getPlayerJS(): Player {
        return this.playerJS;
    }

}

export {container};
