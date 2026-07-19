import os

UI_DIR = "src/components/ui"
TEST_DIR = os.path.join(UI_DIR, "__tests__")

os.makedirs(TEST_DIR, exist_ok=True)

for filename in os.listdir(UI_DIR):
    if filename.endswith(".tsx") and not filename.startswith("__"):
        component_name = filename[:-4]
        test_file = os.path.join(TEST_DIR, f"{component_name}.test.tsx")
        
        if not os.path.exists(test_file):
            content = f"""import React from 'react';
import {{ render, screen }} from '@testing-library/react';
import {{ describe, it, expect }} from 'vitest';
import {{ {component_name} }} from '../{component_name}';

describe('{component_name}', () => {{
  it('renders without crashing', () => {{
    const {{ container }} = render(<{component_name} />);
    expect(container).toBeInTheDocument();
  }});
}});
"""
            with open(test_file, "w") as f:
                f.write(content)
            print(f"Generated test for {component_name}")

print("Done generating UI tests!")
