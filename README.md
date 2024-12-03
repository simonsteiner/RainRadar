# Rain Radar

<https://www.meteoschweiz.admin.ch/service-und-publikationen/applikationen/niederschlag.html>
Export HAR...

```sh
brew install jq
cat www.meteoschweiz.admin.ch.har | jq '.log.entries[].request.url' -r | grep '.json' > meteosuisse-urls.log
python3.13 -m venv venv
source venv/bin/activate.fish
```

<https://github.com/Alex313031/Resources-Saver>

## Debug on android

- <https://developer.chrome.com/docs/devtools/remote-debugging>
- <chrome://inspect/#devices>

```
brew install android-platform-tools
adb devices
adb -s RZCW313YW0L reverse tcp:3300 tcp:3300


qlmanage -t -s 48 -o . rain-radar-favicon.svg
```