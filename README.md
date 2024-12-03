# Rain Radar

<https://www.meteoschweiz.admin.ch/service-und-publikationen/applikationen/niederschlag.html>
Export HAR...

```sh
brew install jq
cat www.meteoschweiz.admin.ch.har | jq '.log.entries[].request.url' -r | grep '.json' > meteosuisse-urls.log
```

<https://github.com/Alex313031/Resources-Saver>
