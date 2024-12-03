"""
Creates GeoJSON file of Swiss NUTS-2 regions by merging canton geometries.

This script takes canton-level GeoJSON data and combines them into larger NUTS-2 statistical regions
according to the official Swiss territorial classification (Nomenclature des unités territoriales statistiques).
It reads from 'cantons.geojson' and outputs 'nuts_regions.geojson'.

Reference:
    https://de.wikipedia.org/wiki/NUTS:CH
"""

import fiona
from shapely.geometry import shape, mapping
from shapely.ops import unary_union


canton_mapping = {
    # Genferseeregion
    "Vaud": "CH01",
    "Valais/Wallis": "CH01",
    "Genève": "CH01",
    # Espace Mittelland
    "Bern/Berne": "CH02",
    "Fribourg/Freiburg": "CH02",
    "Solothurn": "CH02",
    "Neuchâtel": "CH02",
    "Jura": "CH02",
    # Grossregion Nordwestschweiz
    "Basel-Stadt": "CH03",
    "Basel-Landschaft": "CH03",
    "Aargau": "CH03",
    # Zürich
    "Zürich": "CH04",
    # Ostschweiz
    "Glarus": "CH05",
    "Schaffhausen": "CH05",
    "Appenzell Ausserrhoden": "CH05",
    "Appenzell Innerrhoden": "CH05",
    "St. Gallen": "CH05",
    "Graubünden/Grigioni/Grischun": "CH05",
    "Thurgau": "CH05",
    # Zentralschweiz
    "Luzern": "CH06",
    "Uri": "CH06",
    "Schwyz": "CH06",
    "Obwalden": "CH06",
    "Nidwalden": "CH06",
    "Zug": "CH06",
    # Tessin
    "Ticino/Tessin": "CH07",
}

# Swiss regions NUTS-2 level (Nomenclature des unités territoriales statistiques)
# https://de.wikipedia.org/wiki/NUTS:CH
results = [
    {"id": "CH01", "name": "Genferseeregion"},
    {"id": "CH02", "name": "Espace Mittelland"},
    {"id": "CH03", "name": "Grossregion Nordwestschweiz"},
    {"id": "CH04", "name": "Zürich"},
    {"id": "CH05", "name": "Ostschweiz"},
    {"id": "CH06", "name": "Zentralschweiz"},
    {"id": "CH07", "name": "Tessin"},
]


def to_shapely(data):
    """Convert Fiona geometry to Shapely geometry object.

    Args:
        data (dict): Fiona feature dictionary containing geometry

    Returns:
        shapely.geometry: Shapely geometry object
    """
    return shape(data["geometry"])


def to_fiona(data):
    """Convert Shapely geometry to Fiona-compatible format.

    Args:
        data (shapely.geometry): Shapely geometry object

    Returns:
        dict: GeoJSON-compatible geometry dictionary
    """
    return mapping(data)


def union(target, fp):
    """Merge all canton geometries belonging to a specific NUTS region.

    Takes a NUTS region identifier and the path to a GeoJSON file containing canton geometries,
    then merges all cantons that belong to the specified NUTS region into a single geometry.
    Uses buffer(0) to fix potential geometry issues during the merge process.

    Args:
        target (str): NUTS region identifier (e.g., 'CH01')
        fp (str): Path to the input GeoJSON file containing canton geometries

    Returns:
        shapely.geometry: Merged geometry for the NUTS region
    """
    shapes = []
    with fiona.Env():
        with fiona.open(fp) as src:
            for feat in src:
                if canton_mapping[feat["properties"]["name"]] == target:
                    # Buffer(0) is used to fix any potential geometry issues
                    shapes.append(to_shapely(feat).buffer(0))
    return unary_union(shapes)


def ensure_multipolygon(geom):
    """Convert geometry to MultiPolygon if it isn't already.

    Args:
        geom (shapely.geometry): Input geometry (Polygon or MultiPolygon)

    Returns:
        shapely.geometry.MultiPolygon: Geometry as MultiPolygon
    """
    from shapely.geometry import MultiPolygon, Polygon

    if isinstance(geom, Polygon):
        return MultiPolygon([geom])
    return geom


def write_nuts_regions_file(input_fp="cantons.geojson", output_fp="swiss_nuts_regions.geojson"):
    """Write merged NUTS regions to a GeoJSON file.

    Creates a new GeoJSON file containing Swiss NUTS-2 regions by merging canton geometries
    from the input file according to the canton_mapping dictionary. The output file will
    contain MultiPolygon geometries for each NUTS region with associated properties.

    Args:
        input_fp (str): Path to input GeoJSON file containing canton geometries.
            Defaults to "cantons.geojson".
        output_fp (str): Path where the output GeoJSON file will be written.
            Defaults to "nuts_regions.geojson".
    """
    meta = {
        "crs": {"no_defs": True, "ellps": "WGS84", "datum": "WGS84", "proj": "longlat"},
        "driver": "GeoJSON",
        "schema": {
            "geometry": "MultiPolygon",
            "properties": {
                "name": "str", 
                "id": "str",
                "center_lon": "float",
                "center_lat": "float"
            },
        },
    }
    with fiona.Env():
        with fiona.open(output_fp, "w", **meta) as dst:
            for result in results:
                geom = ensure_multipolygon(union(result["id"], input_fp))
                centroid = geom.centroid
                properties = {
                    **result,
                    "center_lon": centroid.x,
                    "center_lat": centroid.y
                }
                print(f"centroid of {result['id']}: {centroid.x}, {centroid.y}")
                dst.write({
                    "geometry": to_fiona(geom), 
                    "properties": properties
                })


# Execute the conversion when run as a script
if __name__ == "__main__":
    write_nuts_regions_file()
