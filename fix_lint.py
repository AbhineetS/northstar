import re

def fix(file, patterns):
    with open(file, 'r') as f:
        content = f.read()
    for p in patterns:
        if len(p) == 2:
            content = re.sub(p[0], p[1], content)
        else:
            content = re.sub(p[0], p[1], content, flags=p[2])
    with open(file, 'w') as f:
        f.write(content)

fix("frontend/src/app/ops/incidents/page.tsx", [(r"AlertTriangle, User,\s*", "")])
fix("frontend/src/app/ops/page.tsx", [(r"fadeIn,\s*", ""), (r": any\)", r": unknown)")])
fix("frontend/src/app/ops/sustainability/page.tsx", [(r"const currentPhase = useDemoStore\(state => state\.currentPhase\);\n\s*", "")])
fix("frontend/src/components/layouts/FanShell.tsx", [(r"crowdHeatmapLayer,\s*", ""), (r"Source, Layer,\s*", ""), (r"const \[mapLoaded, setMapLoaded\] = useState\(false\);", "const [mapLoaded] = useState(false);")])
fix("frontend/src/components/map/MapContainer.tsx", [(r"import \{ Source, Layer \} from \"react-map-gl/mapbox\";\n", "")])
fix("frontend/src/components/ops/DigitalTwin.tsx", [(r"\}\);", "});\nDigitalTwin.displayName = \"DigitalTwin\";")])
fix("frontend/src/components/ui/AIPanel.tsx", [(r"spring,\s*", "")])
fix("frontend/src/components/ui/DemoPanel.tsx", [(r"AnimatePresence,\s*", "")])
fix("frontend/src/store/useTelemetryStore.ts", [(r"const INITIAL_INCIDENTS: Incident\[\] = \[.*?\];\n\n", "", re.DOTALL), (r"\(state\)", "()")])
