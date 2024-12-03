# source: https://gist.github.com/cmutel/a2e0f2e48278deeedf19846c39cee4da/c7469bb06f1e83c3e4f3c81b87f127f787685db0

import fiona
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

fp = "cantons.geojson"

canton_mapping = {
    "Zürich": "Zürich",
    "Bern/Berne": "Bern",
    "Luzern": "Ost",
    "Uri": "Ost",
    "Schwyz": "Ost",
    "Obwalden": "Ost",
    "Nidwalden": "Ost",
    "Glarus": "Ost",
    "Zug": "Ost",
    "Fribourg/Freiburg": "Jura",
    "Solothurn": "Basel",
    "Basel-Stadt": "Basel",
    "Basel-Landschaft": "Basel",
    "Schaffhausen": "Ost",
    "Appenzell Ausserrhoden": "Ost",
    "Appenzell Innerrhoden": "Ost",
    "St. Gallen": "Ost",
    "Graubünden/Grigioni/Grischun": "Ost",  # Updated trilingual name
    "Aargau": "Basel",
    "Thurgau": "Ost",
    "Ticino/Tessin": "South",  # Added bilingual name
    "Vaud": "Jura",  # Changed from South to Jura
    "Valais/Wallis": "South",
    "Neuchâtel": "Jura",
    "Genève": "Jura",
    "Jura": "Jura",
}

results = [
    {"id": 1, "name": "Zürich"},
    {"id": 2, "name": "Bern"},
    {"id": 3, "name": "Ost"},
    {"id": 4, "name": "Basel"},
    {"id": 5, "name": "South"},
    {"id": 6, "name": "Jura"},
]


def to_shapely(data):
    return shape(data["geometry"])


def to_fiona(data):
    return mapping(data)


def union(target):
    shapes = []
    with fiona.drivers():
        with fiona.open(fp) as src:
            for feat in src:
                if canton_mapping[feat["properties"]["name"]] == target:
                    shapes.append(to_shapely(feat).buffer(0))
    return unary_union(shapes)


def ensure_multipolygon(geom):
    """Convert geometry to MultiPolygon if it isn't already"""
    from shapely.geometry import MultiPolygon, Polygon

    if isinstance(geom, Polygon):
        return MultiPolygon([geom])
    return geom


def to_file(fp="swiss_model_regions.geojson"):
    meta = {
        "crs": {"no_defs": True, "ellps": "WGS84", "datum": "WGS84", "proj": "longlat"},
        "driver": "GeoJSON",
        "schema": {
            "geometry": "MultiPolygon",
            "properties": {"name": "str", "id": "int"},
        },
    }
    with fiona.drivers():
        with fiona.open(fp, "w", **meta) as sink:
            for dct in results:
                geom = ensure_multipolygon(union(dct["name"]))
                sink.write({"geometry": to_fiona(geom), "properties": dct})


to_file()
