"""Refresh the attributed OSM campus snapshot used by the QUbe concept map."""
import json
import pathlib
import urllib.parse
import urllib.request

root = pathlib.Path(__file__).resolve().parents[1]
query = '''[out:json][timeout:40];(
way[building](25.363,51.477,25.387,51.504);
way[highway](25.363,51.477,25.387,51.504);
way[landuse](25.363,51.477,25.387,51.504);
way[leisure](25.363,51.477,25.387,51.504);
nwr[name][amenity=university](25.363,51.477,25.387,51.504);
nwr[railway=station](25.363,51.477,25.387,51.504);
);out geom;'''
request = urllib.request.Request(
    'https://overpass-api.de/api/interpreter',
    data=urllib.parse.urlencode({'data': query}).encode(),
    headers={'User-Agent': 'QUbe-Concept-Prototype/1.0 (campus visualization; OSM attribution included)'},
)
with urllib.request.urlopen(request, timeout=55) as response:
    data = json.load(response)
pathlib.Path('/tmp/qube-campus-osm.json').write_text(json.dumps(data))
features = []
for item in data['elements']:
    tags = item.get('tags', {})
    coords = [[point['lon'], point['lat']] for point in item.get('geometry', [])]
    if len(coords) < 2:
        continue
    closed = coords[0] == coords[-1] and len(coords) >= 4
    kind = 'building' if 'building' in tags else 'road' if 'highway' in tags else 'land'
    if kind == 'building' and not closed:
        continue
    levels = tags.get('building:levels', '2')
    try:
        height = float(tags.get('height', '').replace(' m', '')) if tags.get('height') else float(levels) * 3.3
    except ValueError:
        height = 6.6
    features.append({
        'type': 'Feature', 'id': item['id'],
        'properties': {
            'osmId': item['id'], 'name': tags.get('name:en', tags.get('name', '')),
            'ref': tags.get('ref', ''), 'kind': kind,
            'subtype': tags.get('highway', tags.get('landuse', tags.get('leisure', ''))),
            'height': round(min(max(height, 3), 50), 1),
        },
        'geometry': {'type': 'Polygon' if closed and kind != 'road' else 'LineString', 'coordinates': [coords] if closed and kind != 'road' else coords},
    })
out = root / 'public' / 'campus'
out.mkdir(parents=True, exist_ok=True)
(out / 'qatar-university.geojson').write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')))
print(f'Saved {len(features)} mapped campus features.')
for feature in features:
    p = feature['properties']
    if p['name'] or p['ref']:
        points = feature['geometry']['coordinates'][0] if feature['geometry']['type'] == 'Polygon' else feature['geometry']['coordinates']
        center = [round(sum(c[i] for c in points)/len(points), 6) for i in [0, 1]]
        print(p['osmId'], p['ref'], p['name'], center)
