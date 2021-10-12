import config from '../config';
import Service from './service';

class DbApiService extends Service {
  constructor() {
    super();
    this.baseUrl = config.DBAPI_BASE_URL!;
  }
}

export default DbApiService;
