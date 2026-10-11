# Rain Radar

A lightweight clone of the MeteoSwiss precipitation radar, optimized for paragliding. These are the terms the docs and code use for its domain.

## Precipitation data

**Precipitation animation**:
The time series of radar pictures MeteoSwiss publishes for one version: past measurements followed by forecasts.
_Avoid_: Radar loop, movie

**Version**:
The identifier of one published precipitation animation, a timestamp of the form `YYYYMMDD_HHMM`.
_Avoid_: Run, release

**Picture**:
One time step of the precipitation animation, either a measurement or a forecast.
_Avoid_: Frame, image, slide

**Measurement**:
A picture observed by the radar network.
_Avoid_: Observation, actual

**Forecast**:
A picture predicted for a time after the latest measurement.
_Avoid_: Prediction, nowcast

**Latest measurement**:
The most recent measurement in a precipitation animation; the display opens on it.
_Avoid_: Now, current picture

**Legend**:
The mapping from precipitation intensity ranges to colours that MeteoSwiss ships with each animation.
_Avoid_: Colour scale, key

## Geography

**Radar domain**:
The area the MeteoSwiss radar composite covers; outside it there is no precipitation data.
_Avoid_: Radar coverage, extent

**LV95**:
The Swiss national coordinate reference system the radar domain is defined in.
_Avoid_: CH1903+, Swiss grid

**Canton**:
One of the 26 Swiss federal states.
_Avoid_: State, province

**NUTS region**:
One of the seven NUTS-2 statistical regions Eurostat defines for Switzerland.
_Avoid_: Greater region, Grossregion

**Model region**:
A grouping of cantons into larger regions.
_Avoid_: Zone, area

## Display

**Paragliding mode**:
A stripped-down view for pilots in the field: map controls hidden, the animation limited to about two hours around the latest measurement and played at a fixed speed.
_Avoid_: Pilot mode, simple mode, mobile mode
