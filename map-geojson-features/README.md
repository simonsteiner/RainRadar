# Map GeoJSON Features

This folder contains utilities and scripts for geographic data used in the Rain Radar application.

## Python Environment for GeoJSON Testing

This is a development environment for experimenting with different GeoJSON map features. The scripts process and generate various geographic data representations of Switzerland that can be used in the Rain Radar application.

### Available Scripts

- `create_swiss_cantons.py` - Creates a standardized GeoJSON file of all Swiss cantons with official identifiers
- `create_swiss_model_regions.py` - Combines cantons into larger model regions
- `create_swiss_nuts_regions.py` - Creates NUTS-2 statistical regions according to Eurostat classification (Reference: <https://de.wikipedia.org/wiki/NUTS:CH>)

### Python Env Setup

Requirements:

- Python 3.13+
- [VS Code Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)

Create and activate virtual environment:

```sh
# mac
python3.13 -m venv venv
source venv/bin/activate.fish
# win
python -m venv venv
.\venv\Scripts\Activate.ps1
# install dependencies
pip install fiona shapely
```

## Source/inspiration for cantons

[GitHub Gist: cmutel/cantons.geojson](https://gist.github.com/cmutel/a2e0f2e48278deeedf19846c39cee4da/c7469bb06f1e83c3e4f3c81b87f127f787685db0)
