# Analyzing the MeteoSwiss Data Source

How the MeteoSwiss precipitation map was reverse-engineered to find the endpoints the server proxies. Repeat this when MeteoSwiss changes its API.

1. Network analysis
   - Visit the [MeteoSwiss Precipitation Map](https://www.meteoswiss.admin.ch/services-and-publications/applications/precipitation.html)
   - Open Browser Developer Tools (F12)
   - Navigate to the Network tab and interact with the precipitation map
   - Export a HAR file for detailed analysis

2. Extract API endpoints

   ```sh
   brew install jq
   jq -r '.log.entries[].request.url' www.meteoswiss.admin.ch.har | grep '.json' > meteoswiss-urls.log
   ```

3. Additional resources
   - The [Resources Saver](https://github.com/Alex313031/Resources-Saver) browser extension downloads static assets for analyzing the application structure.

The endpoints currently in use are defined in `app/server/config.ts`.
