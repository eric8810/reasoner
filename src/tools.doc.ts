export const weatherDoc = () => `
# Weather API Documentation

Get weather information for a specific city

## Endpoint
\`GET http://t.weather.sojson.com/api/weather/city/{cityId}\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cityId | string | Yes | City ID code (can be found in city.json) |

## Rate Limits
- Requests per minute: 300
- Cooldown period: 3600 seconds if limit exceeded
- Minimum interval: 3 seconds between requests

## Response

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| time | string | System update time |
| date | string | Current date (YYYYMMDD format) |
| message | string | Response message |
| status | number | 200 for success, other for failure |

### City Info
| Field | Type | Description |
|-------|------|-------------|
| city | string | City name |
| cityId | string | City ID |
| parent | string | Parent region (usually province) |
| updateTime | string | Weather update time |

### Weather Data
| Field | Type | Description |
|-------|------|-------------|
| shidu | string | Humidity |
| pm25 | number | PM2.5 level |
| pm10 | number | PM10 level |
| quality | string | Air quality description |
| wendu | string | Temperature |
| ganmao | string | Cold/flu risk level |
| yesterday | WeatherDetail | Previous day's weather |
| forecast | WeatherDetail[] | 5-day forecast (today + 4 days) |

## Error Codes
| Code | Description |
|------|-------------|
| 403 | Invalid or missing city ID |

## Notes
- Data updates every 8 hours via CDN cache
- Implementation of local caching is recommended
- Service may be rate-limited or IP-blocked for excessive usage
`;
