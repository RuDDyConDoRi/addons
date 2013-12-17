Export CSV to KML ADDON
===============

This addon allows users to 
authors: @rucondori

For the addon config should look like this:
```
    {
        "id": "export_csvtokml",
        "name": "ExportCSVtoKML",
        "title": {
            "en": "Export CSV to KML",
            "es": "Exportar CSV a KML",
            "fr": "Export CSV au format KML"
        },
        "description": {
            "en": "Tool to export CSV file to KML.",
            "es": "Herramienta para exportar archivo CSV a KML.",
            "fr": "Outil pour exporter un fichier CSV au format KML."
        }
    }
    
```
For a :

```
    {
        "id": "export_csvtokml",
        "name": "ExportCSVtoKML",
        "title": {
            "en": "export csv to kml",
            "es": "exportar csv a kml",
            "fr": "export csv to kml"
        },
        "description": {
            "en": "Tool to export CSV file to KML.",
            "es": "Herramienta para exportar archivo CSV a KML.",
            "fr": "Outil pour exporter un fichier CSV au format KML."
        }
    }
```

Default options for this addon are specified in the manifest.json file:

    "default_options": {
        "mode": "static",
        "baseLayerConfig": {
            "layer": "addon_export_csvtokml",
            "format": "image/jpeg",
            "buffer": 8
        }
    }

