"""
Swiss Cantons GeoJSON Creator

This module processes Swiss canton geographic data from a source GeoJSON file and creates
a new GeoJSON file with standardized canton information. It includes functionality to
handle both Polygon and MultiPolygon geometries and matches canton data with their
official identifiers.

The module uses the following main dependencies:
- fiona: For reading and writing GeoJSON files
- shapely: For geometry processing and conversion
"""

import fiona
from shapely.geometry import shape, mapping

# Swiss cantons with their IDs
canton_data = [
    {"id": "ZH", "name": "Zürich"},
    {"id": "BE", "name": "Bern"},
    {"id": "LU", "name": "Luzern"},
    {"id": "UR", "name": "Uri"},
    {"id": "SZ", "name": "Schwyz"},
    {"id": "OW", "name": "Obwalden"},
    {"id": "NW", "name": "Nidwalden"},
    {"id": "GL", "name": "Glarus"},
    {"id": "ZG", "name": "Zug"},
    {"id": "FR", "name": "Fribourg"},
    {"id": "SO", "name": "Solothurn"},
    {"id": "BS", "name": "Basel-Stadt"},
    {"id": "BL", "name": "Basel-Landschaft"},
    {"id": "SH", "name": "Schaffhausen"},
    {"id": "AR", "name": "Appenzell Ausserrhoden"},
    {"id": "AI", "name": "Appenzell Innerrhoden"},
    {"id": "SG", "name": "St. Gallen"},
    {"id": "GR", "name": "Graubünden"},
    {"id": "AG", "name": "Aargau"},
    {"id": "TG", "name": "Thurgau"},
    {"id": "TI", "name": "Ticino"},
    {"id": "VD", "name": "Vaud"},
    {"id": "VS", "name": "Valais"},
    {"id": "NE", "name": "Neuchâtel"},
    {"id": "GE", "name": "Genève"},
    {"id": "JU", "name": "Jura"}
]


def to_shapely(data):
    """Convert GeoJSON geometry to Shapely geometry object.
    
    Args:
        data (dict): GeoJSON feature containing geometry data
        
    Returns:
        shapely.geometry: Shapely geometry object
    """
    return shape(data["geometry"])


def to_fiona(data):
    """Convert Shapely geometry to GeoJSON format.
    
    Args:
        data (shapely.geometry): Shapely geometry object
        
    Returns:
        dict: GeoJSON geometry representation
    """
    return mapping(data)


def ensure_multipolygon(geom):
    """Convert geometry to MultiPolygon if it isn't already.
    
    Args:
        geom (shapely.geometry): Input geometry (Polygon or MultiPolygon)
        
    Returns:
        shapely.geometry.MultiPolygon: Guaranteed MultiPolygon geometry
    """
    from shapely.geometry import MultiPolygon, Polygon

    if isinstance(geom, Polygon):
        return MultiPolygon([geom])
    return geom


def get_canton_geometry_by_id(canton_id, src):
    """Extract geometry for a canton by its ID.

    Args:
        canton_id (str): The ID of the canton (e.g. 'ZH' for Zürich)
        src (fiona.Collection): The GeoJSON source data collection

    Returns:
        shapely.geometry: The canton geometry or None if not found
    """
    for feat in src:
        # Check if the canton ID matches in the feature properties
        if feat["properties"].get("id") == canton_id:
            return to_shapely(feat)
    return None


def write_cantons_file(input_fp="cantons.geojson", output_fp="swiss_cantons.geojson"):
    """Create a standardized GeoJSON file containing Swiss canton geometries.
    
    Reads canton geometries from a source GeoJSON file and writes them to a new file
    with standardized properties and MultiPolygon geometries.
    
    Args:
        input_fp (str): Path to input GeoJSON file containing canton geometries
        output_fp (str): Path where the output GeoJSON file will be written
        
    Note:
        The output file will contain MultiPolygon geometries with standardized
        properties including canton name and ID for each feature.
    """
    meta = {
        "crs": {"no_defs": True, "ellps": "WGS84", "datum": "WGS84", "proj": "longlat"},
        "driver": "GeoJSON",
        "schema": {
            "geometry": "MultiPolygon",
            "properties": {"name": "str", "id": "str"},
        },
    }

    with fiona.Env():
        with fiona.open(input_fp) as src:
            with fiona.open(output_fp, "w", **meta) as sink:
                for canton in canton_data:
                    geom = get_canton_geometry_by_id(canton["id"], src)
                    if geom:
                        sink.write(
                            {
                                "geometry": to_fiona(ensure_multipolygon(geom)),
                                "properties": canton,
                            }
                        )


if __name__ == "__main__":
    write_cantons_file()
