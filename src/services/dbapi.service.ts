import config from '../config';
import Service from './service';

/* Connects base service with our specific environment's backend URL */
class DbApiService extends Service {
  constructor() {
    super();
    this.baseUrl = config.DBAPI_BASE_URL!;
  }
}

export default DbApiService;
